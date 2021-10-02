import {BASE_URL} from '../../config';
import {fetchData} from '../utils/helper';
import axios from 'axios';

// export const createFoodOrder = async ({
//   store_id,
//   branch_id,
//   order,
//   address,
//   order_remark,
//   rider_remark,
//   delivery_time,
//   preview,
//   payment_method,
//   delivery_method,
//   payment_id,
//   promo_code,
//   pin = '',
//   t,
// }) => {
//   const route = `${BASE_URL}/order?type=food${preview ? '&preview=true' : ''}`;
//   const method = 'POST';
//   const data = {
//     store_id,
//     branch_id,
//     orders: order.map((order) => {
//       return {
//         store_food_id: order._id,
//         quantity: order.quantity,
//         variations: order.variations,
//       };
//     }),
//     location: {
//       address: address.full_address,
//       type: address.location.type,
//       coordinates: [...address.location.coordinates],
//     },
//     order_remark,
//     rider_remark,
//     delivery_time,
//     payment_method,
//     delivery_method,
//     promo_code,
//     pin,
//   };
//   if (payment_id) {
//     data['payment_id'] = payment_id;
//   }

//   let body = new FormData();
//   body.append('json', JSON.stringify(data));
//   console.log(data);
//   try {
//     const response = await fetchData({
//       route,
//       method,
//       body,
//       is_form: true,
//     });
//     //const {success, results, message} = response;
//     //if (!success) throw message;
//     return response;
//   } catch (error) {
//     // alert(t('alert_error_orderjs_1'));
//     // throw new Error(JSON.stringify(error));
//     console.log(error)
//   }
// };

export const createFoodOrder = async ({
  store_id,
  branch_id,
  order,
  address,
  order_remark,
  rider_remark,
  delivery_time,
  preview,
  payment_method,
  delivery_method,
  payment_id,
  promo_code,
  pin = '',
  t,
}) => {
  const route = `${BASE_URL}/order?type=food${preview ? '&preview=true' : ''}`;

  const data = {
    store_id,
    branch_id,
    orders: order.map((order) => {
      return {
        store_food_id: order._id,
        quantity: order.quantity,
        variations: order.variations,
      };
    }),
    location: {
      address: address.full_address,
      type: address.location.type,
      coordinates: [...address.location.coordinates],
    },
    delivery_method,
    order_remark,
    rider_remark,
    delivery_time,
    payment_method,
    promo_code,
    pin,
  };

  if (payment_id) {
    data['payment_id'] = payment_id;
  }
  try {
    const response = await axios.post(route, {json:data});
    return response.data;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export const createGoodsOrder = async ({
  store_id,
  branch_id,
  order,
  address,
  order_remark,
  rider_remark,
  delivery_time,
  preview,
  payment_method,
  delivery_method,
  payment_id,
  promo_code,
  pin = '',
  t,
}) => {
  const route = `${BASE_URL}/order?type=goods${preview ? '&preview=true' : ''}`;

  const method = 'POST';
  const data = {
    pin,
    store_id,
    branch_id,
    orders: order.map((order) => {
      return {
        store_goods_id: order._id,
        quantity: order.quantity,
        variation_name: order.variations[0].variation_name,
      };
    }),
    location: {
      address: address.full_address,
      type: address.location.type,
      coordinates: [...address.location.coordinates],
    },
    order_remark,
    rider_remark,
    delivery_time,
    payment_method,
    delivery_method,
    promo_code,
  };
  if (payment_id) {
    data['payment_id'] = payment_id;
  }

  let body = new FormData();
  body.append('json', JSON.stringify(data));
  try {
    const response = await fetchData({route, method, body, is_form: true});
    const {success, results, message} = response;
    // if (!success) throw message;
    return response;
  } catch (error) {
    // alert(t('alert_error_orderjs_2'));
    throw error;
  }
};

export const createMoveOrder = async ({
  location,
  delivery_time,
  orders,
  order_remark,
  rider_remark,
  images,
  services,
  payment_method,
  payment_id,
  preview,
  promo_code,
  pin = '',
  t,
}) => {
  const route = BASE_URL + `/order?type=move${preview ? '&preview=true' : ''}`;
  const method = 'POST';
  const data = {
    location,
    delivery_time,
    orders,
    services,
    order_remark,
    rider_remark,
    payment_method,
    promo_code,
    pin,
  };
  if (payment_id) {
    data['payment_id'] = payment_id;
  }

  let body = new FormData();
  body.append('json', JSON.stringify(data));
  for (let i = 0; i < images.length; i++) {
    body.append('images', {
      uri: images[i].path,
      name: 'image.jpg',
      type: images[i].mime,
    });
  }
  console.log(data);
  try {
    const response = await fetchData({route, method, body, is_form: true});
    const {success, results} = response;
    console.log(response.data);
    //if (!success) throw response.message;
    return response;
  } catch (error) {
    // alert(t('alert_error_orderjs_3'));
    // throw new Error(JSON.stringify(error));
    console.log(error);
  }
};

export const getMoveOrder = async ({t}) => {
  const route = BASE_URL + `/order?type=move`;
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (error) {
    alert(t('alert_error_orderjs_13'));
    throw new Error(JSON.stringify(error));
  }
};

export const getMoveOrderDetails = async ({order_id, t}) => {
  const route = BASE_URL + `/order/${order_id}?type=move`;
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (error) {
    alert(t('alert_error_orderjs_13'));
    throw new Error(JSON.stringify(error));
  }
};

export const getGoodsOrder = async ({t}) => {
  const route = BASE_URL + `/order?type=goods`;
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (error) {
    alert(t('alert_error_orderjs_12'));
    throw new Error(JSON.stringify(error));
  }
};

export const getFoodOrder = async ({t}) => {
  const route = BASE_URL + `/order?type=food`;
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (error) {
    alert(t('alert_error_orderjs_11'));
    throw new Error(JSON.stringify(error));
  }
};

export const cancelOrder = async ({order_id, t}) => {
  const route = BASE_URL + `/order/${order_id}/cancellation`;
  const method = 'PATCH';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (error) {
    alert(t('alert_error_orderjs_4'));
    throw new Error(JSON.stringify(error));
  }
};

export const getOnGoingFoodOrder = async ({t, skip = 0}) => {
  const route = BASE_URL + `/order?type=food&skip=${skip}`;
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (error) {
    alert(t('alert_error_orderjs_5'));
    throw new Error(JSON.stringify(error));
  }
};

export const getOnGoingGoodsOrder = async ({t, skip = 0}) => {
  const route = BASE_URL + `/order?type=goods&skip=${skip}`;
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (error) {
    alert(t('alert_error_orderjs_6'));
    throw new Error(JSON.stringify(error));
  }
};

export const getOnGoingMoveOrder = async ({t, skip = 0}) => {
  const route = BASE_URL + `/order?type=move&skip=${skip}`;
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (error) {
    alert(t('alert_error_orderjs_7'));
    throw new Error(JSON.stringify(error));
  }
};

export const getOrderHistory = async ({type, t, skip = 0}) => {
  const route = BASE_URL + `/order_history?type=${type}&skip=${skip}`; //type = food/goods/move
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (error) {
    alert(t('alert_error_orderjs_8'));
    throw new Error(JSON.stringify(error));
  }
};

export const getSpecificOrder = async ({order_id, t}) => {
  const route = BASE_URL + `/order/${order_id}`;
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (error) {
    alert(t('alert_error_orderjs_9'));
    throw new Error(JSON.stringify(error));
  }
};

export const getOnDemandFare = async ({coordinates, type_of_vehicle, t}) => {
  const route = BASE_URL + `/order/on_demand_fare`; //type = food/goods/move
  const method = 'POST';
  const body = {
    coordinates,
    type_of_vehicle,
  };

  try {
    const response = await fetchData({route, method, body});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (error) {
    alert(t('alert_error_orderjs_10'));
    throw new Error(JSON.stringify(error));
  }
};

// export const addPropertyImage = async ({property_id, images}) => {
//   const route = BASE_URL + `/property/${property_id}/image/add`;
//   const method = 'POST';

//   let body = new FormData();
//   for (let i = 0, l = images.length; i < l; i++) {
//     body.append('property', {
//       uri: images[i].path,
//       type: images[i].mime,
//       name: `${i}.jpeg`,
//     });
//   }

//   try {
//     const {
//       success,
//       results: {uri},
//     } = await fetchData({route, method, body, is_form: true});
//     if (!success) throw 'Error';

//     return {uri};
//   } catch (error) {
//     alert('Error add new property image. Please try again later.');
//     throw new Error(error);
//   }
// };
