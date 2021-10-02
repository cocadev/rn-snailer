import {BASE_URL as URL} from '../../config';
import {fetchData} from '../utils/helper';
// temporary use v2 for address
const BASE_URL = URL.slice(0, -2) + 'v2';

export const getAddress = async ({t}) => {
  const route = BASE_URL + '/address';
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';

    return results;
  } catch (error) {
    alert(t('alert_error_addressjs_1'));
    throw new Error(JSON.stringify(error));
  }
};

export const addAddress = async ({is_home, is_office, address, contact, t}) => {
  const route = BASE_URL + '/address';
  const method = 'POST';
  const body = {
    is_home, 
    is_office, 
    address,
    contact
  };

  try {
    const response = await fetchData({route, method, body});
    const {success, results} = response;
    if (!success) throw 'Error';
    return {success, results};
  } catch (error) {
    alert(t('alert_error_addressjs_2'));
    throw new Error(JSON.stringify(error));
  }
};

export const editAddress = async ({_id, is_home, is_office, address, contact, t}) => {
  const route = BASE_URL + `/address/${_id}`;
  const method = 'PATCH';
  const body = {
    is_home, 
    is_office, 
    address, 
    contact,
  };

  try {
    const response = await fetchData({route, method, body});
    const {success, results} = response;
    if (!success) throw 'Error';

    return response;
  } catch (error) {
    alert(t('alert_error_addressjs_3'));
    throw new Error(JSON.stringify(error));
  }
};

export const deleteAddress = async ({address_id, t}) => {
  const route = BASE_URL + `/address/${address_id}`;
  const method = 'DELETE';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';

    return success;
  } catch (error) {
    alert(t('alert_error_addressjs_4'));
    throw new Error(JSON.stringify(error));
  }
};
