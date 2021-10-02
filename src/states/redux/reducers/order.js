import * as ActionTypes from 'states/redux/ActionTypes';

const latest_order_default_state = {
  order_id: '',
  status: '',
  rider_first_name: '',
  rider_last_name: '',
  rider_mobile: '',
  amount: {
    base_amount: 0,
    rider_fee: 0,
    tax_amount: 0,
    subtotal: 0,
    small_order_fee_charge: 0,
    total: 0,
  },
  location: {coordinates: [101.675095, 3.1186517]},
};

const INITIAL_STATE = {
  latest_order: latest_order_default_state,
  order: [],
};

export const Order = (state = INITIAL_STATE, action) => {
  let s = null;
  let ongoingOrder = null;
  let newArr = null;
  try {
    switch (action.type) {
      case ActionTypes.UPDATE_ORDER_STATUS:
        // console.log('Order Reducer -> UPDATE_ORDER_STATUS:', action.payload);

        ongoingOrder = state.order.findIndex((ele) => {
          return ele._id === action.payload.order_id;
        });

        if (ongoingOrder < 0) throw new Error('Order not in redux');

        s = {
          ...state.latest_order,
          status: action.payload.status,
        };

        newArr = [...state.order];
        newArr.splice(ongoingOrder, 1, s);

        return {
          latest_order: s,
          order: newArr,
        };

      case ActionTypes.UPDATE_ORDER_RIDER_INFO:
        // console.log(
        //   'Order Reducer -> UPDATE_ORDER_RIDER_INFO:',
        //   action.payload,
        // );

        ongoingOrder = state.order.find((ele) => {
          return ele.order_id === action.payload.order_id;
        });

        if (ongoingOrder < 0) throw new Error('Order not in redux');

        s = {
          ...state.latest_order,
          status: action.payload.status,
          rider_first_name: action.payload.rider.first_name,
          rider_last_name: action.payload.rider.last_name,
          rider_mobile: action.payload.rider.mobile,
        };

        newArr = [...state.order];
        newArr.splice(ongoingOrder, 1, s);

        return {
          latest_order: s,
          order: newArr,
        };

      case ActionTypes.UPDATE_ORDER_RIDER_LOCATION:
        // console.log(
        //   'Order Reducer -> UPDATE_ORDER_RIDER_LOCATION:',
        //   action.payload,
        // );

        ongoingOrder = state.order.find((ele) => {
          return ele.order_id === action.payload.order_id;
        });

        if (ongoingOrder < 0) throw new Error('Order not in redux');

        s = {
          ...state.latest_order,
          order_id: action.payload.order_id,
          location: {
            ...state.latest_order.location,
            coordinates: [action.payload.longitude, action.payload.latitude],
          },
        };

        newArr = [...state.order];
        newArr.splice(ongoingOrder, 1, s);

        return {
          latest_order: {...s},
          order: newArr,
        };

      case ActionTypes.SAVE_ORDER_TO_REDUX:
        // console.log('Order Reducer -> SAVE_ORDER_TO_REDUX', action.payload);
        s = {
          latest_order: {...action.payload},
          order: [...state.order, action.payload],
        };
        return s;

      case ActionTypes.SAVE_ALL_ORDERS_TO_REDUX:
        s = {
          ...state,
          order: [...action.payload],
        };
        return s;

      case ActionTypes.SELECT_ORDER_TO_VIEW:
        const select = state.order.find((ele) => {
          return ele.order_id === action.payload;
        });

        s = {
          ...state,
          latest_order: select ? {...select} : latest_order_default_state,
        };
        return s;

      case ActionTypes.CLEAR_LATEST_ORDER:
        return {
          ...state,
          latest_order: latest_order_default_state,
        };
      default:
        return state;
    }
  } catch (err) {
    console.log('Error in order reducer -> ', err);
  }
};
