import * as ActionTypes from 'states/redux/ActionTypes';

export const changeLanguage = (lng) => async (dispatch) => {
  try {
    dispatch({
      type: ActionTypes.CHANGE_LANGUAGE,
      payload: lng,
    });
  } catch (error) {}
};
