import {BASE_URL} from '../../config';
import {fetchData} from 'utils/helper';

export const addRemoteFCMToken = async ({fcm_token}) => {
  const route = BASE_URL + '/notification';
  const method = 'POST';
  const body = {
    fcm_token,
  };

  try {
    const response = await fetchData({route, method, body});
    const {success} = response;
    if (!success) throw 'Error';

    return success;
  } catch (error) {
    console.log('Error in posting FCM Token. Please try again later.');
    throw new Error(error);
  }
};

export const updateRemoteFCMToken = async ({old_fcm_token, new_fcm_token}) => {
  const route = BASE_URL + '/notification';
  const method = 'PATCH';
  const body = {
    old_fcm_token,
    new_fcm_token,
  };

  try {
    const response = await fetchData({route, method, body});
    const {success} = response;
    if (!success) throw 'Error';

    return success;
  } catch (error) {
    console.log('Error in patching FCM Token. Please try again later.');
    throw new Error(error);
  }
};

export const getNotification = async ({skip, t}) => {
  const route = BASE_URL + `/notification?skip=${skip}`;
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';

    return results;
  } catch (error) {
    throw new Error(error);
  }
};
