import * as ActionTypes from '../ActionTypes';
import {
  addRemoteFCMToken,
  updateRemoteFCMToken,
} from '../../../services/notification';

export const addFCMTokenRedux = ({fcm_token}) => async (dispatch) => {
  try {
    const response = await addRemoteFCMToken({fcm_token});
    if (response) {
      dispatch({
        type: ActionTypes.POST_FCM_TOKEN,
        payload: {
          fcm_user: true,
          fcm_token: fcm_token,
        },
      });
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const updateFCMTokenRedux = ({old_fcm_token, new_fcm_token}) => async (
  dispatch,
) => {
  try {
    const response = await updateRemoteFCMToken({old_fcm_token, new_fcm_token});
    if (response) {
      dispatch({
        type: ActionTypes.PATCH_FCM_TOKEN,
        payload: {
          fcm_token: new_fcm_token,
        },
      });
    }
  } catch (error) {
    throw new Error(error);
  }
};
