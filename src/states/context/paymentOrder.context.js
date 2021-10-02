import React, {useReducer, createContext} from 'react';

const INITIAL_VALUES = null;

export const PaymentOrderContext = createContext(INITIAL_VALUES);

export const PaymentOrderContextProvider = (props) => {
  const [paymentOrder, dispatchPaymentOrder] = useReducer(
    reducer,
    INITIAL_VALUES,
  );
  return (
    <PaymentOrderContext.Provider value={{paymentOrder, dispatchPaymentOrder}}>
      {props.children}
    </PaymentOrderContext.Provider>
  );
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_PAYMENT_ORDER':
      return action.payload;
    case 'CLEAR':
      return INITIAL_VALUES;
    default:
      return state;
  }
};
