import React, {useReducer, createContext} from 'react';

const DEFAULT_ORDER = {
  parcel_order: [],
  order: [],
  parcel_image: [],
  pickup: [],
  dropoff: [],
  contact: {
    name: undefined,
    phone_number: undefined,
  },
  dimension: {
    weight: '0.0',
    height: '0.0',
    width: '0.0',
    length: '0.0',
  },
  itemName: undefined,
  sender: {
    name: '',
    contact: '',
    full_address: '',
    unit_no: '',
    block: '',
    level: '',
    postcode: '0',
    location: {
      type: undefined,
      coordinates: [],
    },
  },
  receiver: {
    name: '',
    contact: '',
    full_address: '',
    email: '',
    postcode: '0',
  },
  type: 'Parcel',
  courierId: undefined,
  remark: undefined,
  promoCode: '',
  total: 0.0,
  time: undefined,
};

export const ParcelOrderContext = createContext();

export const ParcelOrderContextProvider = (props) => {
  const [parcelOrder, dispatchParcelOrder] = useReducer(reducer, DEFAULT_ORDER);

  return (
    <ParcelOrderContext.Provider value={{parcelOrder, dispatchParcelOrder}}>
      {props.children}
    </ParcelOrderContext.Provider>
  );
};

export const SET_LISTING = 'SET_LISTING';
export const CLEAR_LISTING = 'CLEAR_LISTING';

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
        parcel_image: [...state.parcel_image, ...action.payload],
      };
    case 'DELETE_IMAGE':
      return {
        ...state,
        parcel_image: [...state.parcel_image].filter((x) => {
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
    case 'SET_TYPE_COURIER':
      return {
        ...state,
        type: action.payload.type,
        courierId: action.payload.courier,
        remark: action.payload.remark,
        dimension: {
          ...state.dimension,
          weight: parseFloat(action.payload.weight) * 1000,
        }
      };
    case 'SET_STATE':
      return {
        ...state,
        deliveryState: action.payload,
      };
    case 'SET_DIMENSION':
      return {
        ...state,
        dimension: {
          weight: action.payload.weight,
          height: action.payload.height,
          width: action.payload.width,
          length: action.payload.length,
        },
      };
    case 'SET_SENDER':
      return {
        ...state,
        sender: action.payload.sender,
        itemName: action.payload.itemName,
      };
    case 'ADDRESS_UNDER_EDIT':
      return {
        ...state,
        sender: {
          ...state.sender,
          full_address: action.payload.address.full_address,
          unit_no: action.payload.address.unit_no,
          level: action.payload.address.level,
          block: action.payload.address.block,
          postcode: action.payload.address.postcode,
          location: action.payload.address.location,
        }
      };
    case 'SET_RECEIVER':
      return {
        ...state,
        receiver: action.payload.receiver,
      };
    case 'SET_TOTAL':
      return {
        ...state,
        total: action.payload.amount.total,
      };
    case 'CLEAR_ALL':
      return {
        ...state,
        deliveryState: undefined,
        dimension: {
          weight: '0.0',
          height: '0.0',
          width: '0.0',
          length: '0.0',
        },
        itemName: undefined,
        sender: {
          name: '',
          contact: '',
          full_address: '',
          unit_no: '',
          block: '',
          level: '',
          postcode: '0',
          location: {
            type: undefined,
            coordinates: [],
          },
        },
        receiver: {
          name: '',
          contact: '',
          address: '',
          email: '',
          postcode: '0',
          state: '',
        },
        type: 'Parcel',
        courierId: undefined,
        remark: undefined,
        promoCode: '',
        total: 10.0,
        time: undefined,
      };
    default:
      throw new Error();
  }
}