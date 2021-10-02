import * as ActionTypes from '../ActionTypes';

const INITIAL_STATE = {
  fcm_token: undefined,
  fcm_user: false,
};

export const Fcm = (state = INITIAL_STATE, action) => {
  const {type, payload} = action;
  switch (type) {
    case ActionTypes.POST_FCM_TOKEN:
      return {
        ...state,
        fcm_token: payload.fcm_token,
        fcm_user: payload.fcm_user,
      };
    case ActionTypes.PATCH_FCM_TOKEN:
      return {
        ...state,
        fcm_token: payload,
      };
    case ActionTypes.SIGN_OUT_SUCCESS:
      return INITIAL_STATE;
    default:
      return state;
  }
};
