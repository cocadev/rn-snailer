import React, {useReducer, createContext} from 'react';

const DEFAULT_ORDER = {
  move_order: [],
  order: [],
  move_image: [],
  pickup: [],
  dropoff: [],
  stoplocation: [],
  contact: {
    name: undefined,
    phone_number: undefined,
  },
};

export const MoveOrderContext = createContext();

export const MoveOrderContextProvider = (props) => {
  const [moveOrder, dispatchMoveOrder] = useReducer(reducer, DEFAULT_ORDER);

  return (
    <MoveOrderContext.Provider value={{moveOrder, dispatchMoveOrder}}>
      {props.children}
    </MoveOrderContext.Provider>
  );
};

export const SET_LISTING = 'SET_LISTING';
export const CLEAR_LISTING = 'CLEAR_LISTING';
export const CLEAR_ADDRESS_LISTING = 'CLEAR_ADDRESS_LISTING';

function reducer(state, action) {
  let s;
  let newArr;
  let object;
  const edited = false;
  switch (action.type) {
    case 'SET_LISTING':
      return {...state, order: [...state.order, action.payload]};
    case 'ADD_IMAGE':
      return {
        ...state,
        move_image: [...state.move_image, ...action.payload],
      };
    case 'DELETE_IMAGE':
      return {
        ...state,
        move_image: [...state.move_image].filter((x) => {
          return x !== action.payload;
        }),
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        order: [...state.order].filter((x) => {
          return x !== action.payload;
        }),
      };
    case 'CHANGE_PICKUP_ADDRESS':
      return {
        ...state,
        pickup: [action.payload],
      };
    case 'ADD_STOPLOCATION_ADDRESS':
      newArr = state.stoplocation;
      newArr[action.changeIndex] = {
        ...action.payload,
      };

      return {
        ...state,
        stoplocation: newArr,
      };
    case 'EDIT_STOPLOCATION_ADDRESS':
      newArr = state.stoplocation;
      newArr[action.changeIndex] = {
        ...action.payload,
      };

      return {
        ...state,
        stoplocation: newArr,
      };
    case 'REMOVE_STOPLOCATION_ADDRESS':
      newArr = state.stoplocation;
      newArr.splice(action.payload, 1);
      return {
        ...state,
        stoplocation: newArr,
      };
    case 'CHANGE_DROPOFF_ADDRESS':
      return {
        ...state,
        dropoff: [action.payload],
      };
    case 'CHANGE_CONTACT_INFO':
      return {
        ...state,
        contact: action.payload,
      };
    case 'ADD_MOVE_ORDER':
      return {
        ...state,
        move_order: action.payload,
      };
    case 'CLEAR_DETAILS':
      return {
        ...DEFAULT_ORDER,
        move_order: state.move_order,
        dropoff: [],
        stoplocation: [],
      };
    case 'CLEAR_LISTING':
      return {
        ...DEFAULT_ORDER,
        pickup: [],
        dropoff: [],
        stoplocation: [],
      };
    case 'CLEAR_ADDRESS_LISTING':
      return {
        ...state,
        pickup: [],
        dropoff: [],
        stoplocation: [],
      };
    default:
      throw new Error();
  }
}
