import {BASE_URL as URL} from '../../config';
import {fetchData} from '../utils/helper';
// temporary use v2 for address
const BASE_URL = URL.slice(0, -2) + 'v2';

export const createParcel = async ({
  parcelTitle,
  parcelType,
  parcelWeight,
  courierID,
  riderRemark,
  dimension,
  sender,
  receiver,
  promoCode,
  paymentMethod,
  paymentID,
  previewBool = false,
  pin = '',
  t,
}) => {
  const route = BASE_URL + `/parcel?preview=${previewBool}`;
  const method = 'POST';
  var body = {
    title: parcelTitle,
    parcel_type: parcelType.toLowerCase(),
    weight: parcelWeight,
    courier_id: courierID,
    dimension: dimension,
    sender: sender,
    receiver: receiver,
    promo_code: promoCode,
    payment_method: paymentMethod,
    pin,
  };

  if (riderRemark != undefined) {
    body = {
      ...body,
      rider_remark: riderRemark,
    };
  }

  if (paymentMethod == 'online') {
    body = {
      ...body,
      payment_id: paymentID,
    };
  }

  try {
    const response = await fetchData({route, method, body});
    const {success, results} = response;
    if (!success) throw response?.msg || 'Error';
    return results;
  } catch (error) {
    //alert(t('alert_error_parceljs_1'));
    throw new Error(JSON.stringify(error));
  }
};

export const getCourierByWeight = async ({
  parcelType = 'parcel',
  dimension,
  sender_location,
  weight,
  t,
}) => {
  const route = BASE_URL + `/parcel/parcel_price`;
  const method = 'POST';
  var body = {
    parcel_type: parcelType,
  };

  if (sender_location?.type != undefined) {
    body = {
      ...body,
      sender_location: sender_location,
    };
  }

  if (dimension) {
    body = {
      ...body,
      weight: parseInt(dimension.weight),
      dimension: {
        height: parseInt(dimension.height),
        width: parseInt(dimension.width),
        depth: parseInt(dimension.length),
      },
    };
  } else if (weight) {
    body = {
      ...body,
      weight: parseInt(weight * 1000),
    };
  }

  try {
    const response = await fetchData({route, method, body});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (error) {
    alert(t('alert_error_parceljs_1'));
    throw new Error(JSON.stringify(error));
  }
};

export const getParcelWithinRange = async ({
  startDate = '',
  endDate = '',
  skip = 0,
  t,
}) => {
  const route = BASE_URL + `/parcel?skip=${skip}`;
  const method = 'GET';
  if (startDate != '' && endDate != '') {
    route += `&start_date=${startDate}&end_date=${endDate}`;
  }

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (error) {
    alert(t('alert_error_parceljs_2'));
    throw new Error(JSON.stringify(error));
  }
};

export const getParcelByID = async ({parcelID, t}) => {
  const route = BASE_URL + `/parcel/parcel_id/${parcelID}`;
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (error) {
    alert(t('alert_error_parceljs_2'));
    throw new Error(JSON.stringify(error));
  }
};

export const getParcelByTracking = async ({trackingNo, t}) => {
  const route = BASE_URL + `/parcel/tracking_no/${trackingNo}`;
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (error) {
    alert(t('alert_error_parceljs_2'));
    throw new Error(JSON.stringify(error));
  }
};

export const getHub = async ({t}) => {
  const route = BASE_URL + `/parcel/dropoff_hub`;
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (error) {
    alert(t('alert_error_parceljs_3'));
    throw new Error(JSON.stringify(error));
  }
};
