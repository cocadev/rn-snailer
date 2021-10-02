import {BASE_URL, BASE_URL_V2} from '../../config';
import {fetchData} from '../utils/helper';
import {useTranslation} from 'react-i18next';

export const postNearbyRestaurants = async ({latitude, longitude, t,skip =0}) => {
  const route = BASE_URL + `/store?type=food&skip=${skip}`;
  const method = 'POST';
  const body = {
    latitude,
    longitude,
  };

  try {
    const response = await fetchData({route, method, body});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (error) {
    alert(t('alert_error_branchjs_1'));
    throw new Error(JSON.stringify(error));
  }
};

export const postNearbyStore = async ({latitude, longitude, t,skip =0}) => {
  const route = BASE_URL + `/store?type=goods&skip=${skip}`;
  const method = 'POST';
  const body = {
    latitude,
    longitude,
  };

  try {
    const response = await fetchData({route, method, body});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (error) {
    alert(t('alert_error_branchjs_2'));
    throw new Error(JSON.stringify(error));
  }
};

export const getFoodCatalogue = async ({t, branch_id}) => {
  const route = BASE_URL + `/branch/${branch_id}?type=food`;
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (error) {
    alert(t('alert_error_branchjs_3'));
    throw new Error(JSON.stringify(error));
  }
};

export const getGoodsCatalogue = async ({t, branch_id}) => {
  const route = BASE_URL + `/branch/${branch_id}?type=goods`;
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (error) {
    alert(t('alert_error_branchjs_4'));
    throw new Error(JSON.stringify(error));
  }
};

export const getFoodDetails = async ({branch_food_id, t}) => {
  const route =
    BASE_URL + `/branch/${branch_id}/product/${branch_food_id}?type=food`;
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (error) {
    alert(t('alert_error_branchjs_5'));
    throw new Error(JSON.stringify(error));
  }
};

export const getGoodsDetails = async ({branch_goods_id, t}) => {
  const route =
    BASE_URL + `/branch/${branch_id}/product/${branch_goods_id}?type=goods`;
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (error) {
    alert(t('alert_error_branchjs_6'));
    throw new Error(JSON.stringify(error));
  }
};




export const postFoodCategory = async ({branch_id}) => {
  const route = BASE_URL_V2 + `/branch-categories/${branch_id}`;
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (error) {
    alert(t('alert_error_branchjs_7'));
    throw new Error(JSON.stringify(error));
  }
}
