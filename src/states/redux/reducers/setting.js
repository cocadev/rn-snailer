import * as ActionTypes from 'states/redux/ActionTypes';
// import {PURGE} from 'redux-persist';

// The auth reducer. The starting state sets authentication
// based on a token being in local storage. In a real app,
// we would also want a util to check if the token is expired.

const INITIAL_STATE = {
  lng: 'en',
};

export const Setting = (state = INITIAL_STATE, {type, payload}) => {
  switch (type) {
    case ActionTypes.CHANGE_LANGUAGE:
      return {...state, lng: payload};
    // case PURGE:
    //   return INITIAL_STATE;
    default:
      return state;
  }
};
