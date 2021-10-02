import {BASE_URL} from '../../config';
import {fetchData} from '../utils/helper';

export const createPin = async ({pin, confirm_pin, t}) => {
  const route = BASE_URL + `/pin`;
  const method = 'POST';
  const body = {
    pin,
    confirm_pin,
  };

  try {
    const response = await fetchData({route, method, body});
    const {success, results} = response;
    if (!success) throw 'Error';
    return success;
  } catch (error) {
    alert(t('alert_error_pinjs_1'));
    throw new Error(JSON.stringify(error));
  }
};

export const changePin = async ({old_pin, new_pin, confirm_pin, t}) => {
  const route = BASE_URL + `/pin`;
  const method = 'PATCH';
  const body = {
    old_pin,
    new_pin,
    confirm_pin,
  };

  try {
    const response = await fetchData({route, method, body});
    const {success, results} = response;
    if (!success) throw 'Error';
    return success;
  } catch (error) {
    alert(t('alert_error_pinjs_2'));
    throw new Error(JSON.stringify(error));
  }
};

export const verifyPin = async ({pin, t}) => {
  const route = BASE_URL + `/pin/verify`;
  const method = 'POST';
  const body = {
    pin,
  };

  try {
    const response = await fetchData({route, method, body});
    const {success, results} = response;

    return success;
  } catch (error) {
    alert(t('alert_error_pinjs_3'));
    throw new Error(JSON.stringify(error));
  }
};

export const requestChangePinOtp = async ({t}) => {
  const route = BASE_URL + `/pin/request_reset`;
  const method = 'POST';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';
    return success;
  } catch (error) {
    alert(t('alert_error_pinjs_4'));
    throw new Error(JSON.stringify(error));
  }
};

export const resetPin = async ({otp, pin, t}) => {
  const route = BASE_URL + `/pin/reset`;
  const method = 'POST';
  const body = {
    otp,
    pin,
  };

  try {
    const response = await fetchData({route, method, body});
    const {success, results} = response;
    if (!success) throw 'Error';
    return success;
  } catch (error) {
    alert(t('alert_error_pinjs_5'));
    throw new Error(JSON.stringify(error));
  }
};
