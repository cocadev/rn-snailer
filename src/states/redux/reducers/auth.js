import * as ActionTypes from 'states/redux/ActionTypes';
// import {PURGE} from 'redux-persist';

// The auth reducer. The starting state sets authentication
// based on a token being in local storage. In a real app,
// we would also want a util to check if the token is expired.

const INITIAL_STATE = {
  is_authenticated: false,
  mobile_verified: false,
  user: {
    _id: undefined,
    first_name: undefined,
    last_name: undefined,
    mobile: undefined,
    email: undefined,
    image: null,
  },
};

export const Auth = (state = INITIAL_STATE, action) => {
  const {type, payload} = action;
  let s;
  switch (type) {
    case ActionTypes.SIGN_IN_SUCCESS:
      s = {
        ...state,
        user: {
          ...state.user,
          ...action.user,
        },
        is_authenticated: true,
      };
      return s;
    case ActionTypes.SIGN_IN_FAILURE:
      s = {
        ...state,
        is_authenticated: true,
      };
      return s;
    case ActionTypes.SIGN_OUT_SUCCESS:
      return INITIAL_STATE;
    case ActionTypes.UNAUTHORIZED_REDIRECT:
      s = {
        ...state,
        is_authenticated: false,
      };
      return s;
    case ActionTypes.UPDATE_USER_BASIC_PROFILE:
      s = {
        ...state,
        user: {
          ...state.user,
          first_name: payload.givenName,
          last_name: payload.familyName,
          mobile: payload.phone_number.toString(),
          email: payload.email,
        },
      };
      return s;
    case ActionTypes.UPDATE_PROFILE_IMAGE:
      s = {
        ...state,
        user: {
          ...state.user,
          image: payload,
        },
      };
      return s;
    case ActionTypes.UPDATE_PIN:
      s = {
        ...state,
        user: {
          ...state.user,
          hashed_pin: true,
        },
      };
      return s;
    case ActionTypes.PHONE_VERIFICATION:
      s = {
        ...state,
        user: {
          ...state.user,
          mobile: payload ? payload : state.user.mobile,
        },
        mobile_verified: true,
      };
      return s;
    // case PURGE:
    //   return INITIAL_STATE;
    default:
      return state;
  }
};
