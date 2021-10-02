import * as ActionTypes from 'states/redux/ActionTypes';
import {
  signInWithGoogle as _signInWithGoogle,
  signInWithApple as _signInWithApple,
  signOut as _signOut,
} from 'services/auth';

export const signInWithGoogle = (userInfo) => async (dispatch) => {
  try {
    const response = await _signInWithGoogle(userInfo);
    if (response.user.mobile) {
      dispatch({type: ActionTypes.PHONE_VERIFICATION});
    }
    if (response) {
      dispatch(signInSuccess(response.user));
    }
    return response;
  } catch (error) {
    signInFailure(error);
    // console.log('SignIn Error: ', error);
  }
};

export const signInWithApple = ({
  email,
  familyName,
  givenName,
  identityToken,
}) => async (dispatch) => {
  try {
    const response = await _signInWithApple({
      email,
      familyName,
      givenName,
      identityToken,
    });
    if (response.user.mobile) {
      dispatch({type: ActionTypes.PHONE_VERIFICATION});
    }
    if (response) {
      dispatch(signInSuccess(response.user));
    }
    return response;
  } catch (error) {
    signInFailure(error);
  }
};

export const signInSuccess = (response) => {
  return {
    type: ActionTypes.SIGN_IN_SUCCESS,
    user: response,
  };
};

export const signInFailure = (message) => {
  return {
    type: ActionTypes.SIGN_IN_FAILURE,
    message,
  };
};

export const signOut = () => async (dispatch) => {
  try {
    const response = await _signOut();
    dispatch(signOutSuccess());
    return response;
  } catch (error) {
    signInFailure(error);
  }
};

export const signOutSuccess = () => {
  return {
    type: ActionTypes.SIGN_OUT_SUCCESS,
  };
};

export const unauthorizedRedirect = () => {
  return {
    type: ActionTypes.AUTHORIZED_REDIRECT,
  };
};

export const updateUserProfileRedux = (updateObject) => {
  return {
    type: ActionTypes.UPDATE_USER_BASIC_PROFILE,
    payload: updateObject,
  };
};

export const updateProfileImageRedux = (image) => {
  return {
    type: ActionTypes.UPDATE_PROFILE_IMAGE,
    payload: image,
  };
};

export const updatePinRedux = () => {
  return {
    type: ActionTypes.UPDATE_PIN,
  };
};

export const phoneVerification = (mobile) => {
  return {
    type: ActionTypes.PHONE_VERIFICATION,
    payload: mobile,
  };
};
