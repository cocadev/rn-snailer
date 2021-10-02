import React, {useReducer, createContext} from 'react';

const DEFAULT_ADDRESS = {
  home: null,
  office: null,
  addresses: [],
  selected_address: {
    _id: '',
    is_home: false,
    is_office: false,
    address: {
      full_address: '',
      unit_no: '',
      block: '',
      level: '',
      postcode: '',
      location: {
        type: 'Point',
        coordinates: [-122.4324, 37.78825],
      },
    },
    contact: {
      name: '',
      mobile: '',
    },
  },
  address_under_edit: null,
};

export const AddressContext = createContext();

export const AddressContextProvider = (props) => {
  const [address, dispatchAddress] = useReducer(reducer, DEFAULT_ADDRESS);

  return (
    <AddressContext.Provider value={{address, dispatchAddress}}>
      {props.children}
    </AddressContext.Provider>
  );
};

export const SET_LISTING = 'SET_LISTING';
export const CLEAR_LISTING = 'CLEAR_LISTING';

function reducer(state, action) {
  const {type, payload} = action;
  let s;
  let index = 0;
  let newAddr = null;

  switch (type) {
    case 'SET_LISTING':
      return {
        ...state,
        addresses: payload.filter((addr) => {
          return !addr.is_home && !addr.is_office;
        }),
        home: payload.find((addr) => {
          return addr.is_home === true;
        }),
        office: payload.find((addr) => {
          return addr.is_office === true;
        }),
      };
    case 'ADD_ADDRESS':
      s = {
        ...state,
      };

      if (payload.is_home) {
        // if home is set
        if (state.home) {
          newAddr = {
            ...state.home,
            is_home: false,
          };
          s.addresses.push(newAddr);
        }
        s.home = payload;
      } else if (payload.is_office) {
        // if office is set
        if (state.office) {
          newAddr = {
            ...state.office,
            is_office: false,
          };
          s.addresses.push(newAddr);
        }
        s.office = payload;
      } else {
        s.addresses.push(payload);
      }

      return s;
    case 'ADDRESS_CHANGE':
      return {
        ...state,
        addresses: [...action.payload],
      };
    case 'SET_HOME':
      return {
        ...state,
        home: payload,
      };
    case 'SET_OFFICE':
      return {
        ...state,
        office: payload,
      };
    case 'SET_ITEM':
      return {
        ...state,
        selected_address: {...action.payload},
      };
    case 'EDIT_ADDRESS':
      s = {
        ...state,
      };

      index = state.addresses.findIndex((addr) => {
        return addr._id == payload._id;
      });

      // update home address
      if (state?.home?._id === payload._id && payload.is_home) {
        s.home = payload;
      }
      // update office address
      else if (state?.office?._id === payload._id && payload.is_office) {
        s.office = payload;
      }
      // set address as new home and add old home address into 'others'
      else if (payload.is_home) {
        if (index >= 0) {
          s.addresses.splice(index, 1);
        }

        // if home address is set
        if (state.home) {
          newAddr = {
            ...state.home,
            is_home: false,
          };
          s.addresses.push(newAddr);
        }
        s.home = payload;
      }
      // set address as new office and add old office address into 'others'
      else if (payload.is_office) {
        if (index >= 0) {
          s.addresses.splice(index, 1);
        }

        // if office address is set
        if (state.office) {
          newAddr = {
            ...state.office,
            is_office: false,
          };
          s.addresses.push(newAddr);
        }
        s.office = payload;
      }
      // update address of 'others'
      else if (index >= 0) {
        s.addresses.splice(index, 1, payload);
      }

      return s;
    case 'EDIT_HOME':
      s = {
        ...state,
      };

      // if setting address as office
      if (payload.is_office) {
        if (state.office) {
          newAddr = {
            ...state.office,
            is_office: false,
          };
          s.addresses.push(newAddr);
        }
        s.office = payload;
        s.home = null;
      }
      // if setting address as home
      else if (payload.is_home) {
        s.home = payload;
      } else {
        s.addresses.push(payload);
        s.home = null;
      }

      return s;
    case 'EDIT_OFFICE':
      s = {
        ...state,
      };

      if (payload.is_home) {
        if (state.home) {
          newAddr = {
            ...state.home,
            is_home: false,
          };
          s.addresses.push(newAddr);
        }
        s.home = payload;
        s.office = null;
      } else if (payload.is_office) {
        s.office = payload;
      } else {
        s.addresses.push(payload);
        s.office = null;
      }

      return s;
    case 'DELETE_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.filter((addr) => {
          return addr._id !== payload;
        }),
      };

    case 'ADDRESS_UNDER_EDIT':
      return {
        ...state,
        address_under_edit: {
          ...action.payload,
        },
      };

    case 'CLEAR_LISTING':
      return DEFAULT_ADDRESS;
    default:
      throw new Error();
  }
}
