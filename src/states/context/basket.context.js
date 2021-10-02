import React, {useReducer, createContext} from 'react';

const DEFAULT_BASKET = {
  store_id: null,
  branch_id: null,
  order: [], // stores the orders of user
  orderedItem: [], // stores the original product ordered by user
  preview: {
    // stores the complete order details to be viewed in basket
    quantity: 0,
    unit_price: 0.0,
    variations: [],
    amount: {
      base_amount: 0.0,
      rider_fee: 0.0,
      subtotal: 0.0,
      small_order_fee_charge: 0.0,
      tax_amount: 0.0,
      discount: 0.0,
      total: 0.0,
    },
  },
};

export const BasketContext = createContext();

export const BasketContextProvider = (props) => {
  const [basket, dispatchBasket] = useReducer(reducer, DEFAULT_BASKET);

  return (
    <BasketContext.Provider value={{basket, dispatchBasket}}>
      {props.children}
    </BasketContext.Provider>
  );
};

export const SET_LISTING = 'SET_LISTING';
export const CLEAR_LISTING = 'CLEAR_LISTING';

function reducer(state, action) {
  let s;
  let newOrderArr = null;
  let newOrderedItemArr = null;

  const findItemIndex = (currentOrder) => {
    let index = state.order.findIndex((item) => {
      if (item._id !== currentOrder._id) {
        return false;
      }

      if (action.payload.type === 'food') {
        // check the choice title of variations
        for (let i = 0; i < item.variations.length; i++) {
          if (
            item._id !== currentOrder._id ||
            item.variations[i].choice_title !==
              currentOrder.variations[i].choice_title
          ) {
            return false;
          }

          // check the variation of each choices
          for (let j = 0; j < item.variations[i].choices.length; j++) {
            const variationIndex = currentOrder.variations[i].choices.indexOf(
              item.variations[i].choices[j],
            );

            if (variationIndex < 0) {
              return false;
            }
          }
        }
      } else {
        if (
          item._id !== currentOrder._id ||
          item.variations[0].variation_name !==
            currentOrder.variations[0].variation_name
        ) {
          return false;
        }
      }

      return true;
    });

    return index;
  };

  switch (action.type) {
    case 'SET_LISTING':
      // find the index of similar order in the basket
      const sameItemIndex = findItemIndex(action.payload.order);

      let updateItemQuantity = null;
      const newOrder = [...state.order];

      // if there are same order in the basket, create a new object with the updated quantity
      if (sameItemIndex >= 0) {
        updateItemQuantity = {
          ...state.order[sameItemIndex],
          quantity:
            state.order[sameItemIndex].quantity + action.payload.order.quantity,
        };
        newOrder.splice(sameItemIndex, 1, updateItemQuantity);
      }

      s = updateItemQuantity
        ? {
            ...state,
            store_id: action.payload.store_id,
            branch_id: action.payload.order.branch_id,
            order: [...newOrder],
          }
        : {
            ...state,
            store_id: action.payload.store_id,
            branch_id: action.payload.order.branch_id,
            order: [...state.order, action.payload.order],
            orderedItem: [...state.orderedItem, action.payload.item],
          };
      return s;

    case 'SET_PREVIEW':
      return {
        ...state,
        preview: action.payload,
      };

    case 'EDIT_ITEM':
      newOrderArr = [...state.order];
      const updatedOrder = {
        ...state.order[action.payload.index],
        quantity: action.payload.basket.quantity,
        base_price: action.payload.basket.base_price,
        unit_price: action.payload.basket.unit_price,
        variations: [...action.payload.basket.variations],
      };

      newOrderArr.splice(action.payload.index, 1, updatedOrder);

      s = {
        ...state,
        order: [...newOrderArr],
      };

      return s;

    case 'DELETE_ITEM':
      newOrderArr = [...state.order];
      newOrderedItemArr = [...state.orderedItem];
      newOrderArr.splice(action.payload, 1);
      newOrderedItemArr.splice(action.payload, 1);

      s = {
        ...state,
        order: newOrderArr,
        orderedItem: newOrderedItemArr,
      };

      return s;

    case 'CLEAR_BASKET':
      s = {
        ...state,
        order: [],
        orderedItem: [],
      };

      return s;

    case 'SET_VOUCHER_FAILED':
      s = {
        ...state,
        preview: {
          ...state.preview,
          amount: {
            ...state.preview.amount,
            discount: 0,
            total: state.preview.amount.total + state.preview.amount.discount,
          },
        },
      };

      return s;

    case 'CLEAR_LISTING':
      return DEFAULT_BASKET;
    default:
      throw new Error();
  }
}
