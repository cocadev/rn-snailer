import {BASE_URL} from '../../config';
import {fetchData} from '../utils/helper';
import {useTranslation} from 'react-i18next';

export const createReview = async ({
  order_id,
  riderScore,
  storeScore,
  riderDescription,
  storeDescription,
  t,
}) => {
  const route = BASE_URL + `/review/${order_id}`;
  const method = 'POST';
  const body = {
    review_title: 'rating',
    rider: {
      score: riderScore,
      description: riderDescription,
    },
    branch: {
      score: storeScore,
      description: storeDescription,
    },
  };

  try {
    const response = await fetchData({route, method, body});
    const {success, results} = response;
    if (!success) throw 'Error';
    return success;
  } catch (error) {
    alert(t('alert_error_reviewjs_1'));
    throw new Error(JSON.stringify(error));
  }
};

export const getAllReviews = async ({t, skip = 0}) => {
  const route = BASE_URL + `/review?skip=${skip}`;
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (error) {
    alert(t('alert_error_reviewjs_2'));
    throw new Error(JSON.stringify(error));
  }
};

export const getReviewOfOrder = async ({order_id, t}) => {
  const route = BASE_URL + `/review/order/${order_id}`;
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (error) {
    alert(t('alert_error_reviewjs_2'));
    throw new Error(JSON.stringify(error));
  }
};

export const getReview = async ({review_id, t}) => {
  const route = BASE_URL + `/review/${review_id}`;
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (error) {
    alert(t('alert_error_reviewjs_2'));
    throw new Error(JSON.stringify(error));
  }
};

export const changeReview = async ({
  review_id,
  review_title,
  riderScore,
  storeScore,
  riderDescription,
  storeDescription,
  t,
}) => {
  const route = BASE_URL + `/review/${review_id}`;
  const method = 'PATCH';
  const body = {
    review_title: 'rating',
    rider: {
      score: riderScore,
      description: riderDescription,
    },
    branch: {
      score: storeScore,
      description: storeDescription,
    },
  };

  try {
    const response = await fetchData({route, method, body});
    const {success, results} = response;
    if (!success) throw 'Error';
    return success;
  } catch (error) {
    alert(t('alert_error_reviewjs_3'));
    throw new Error(JSON.stringify(error));
  }
};
