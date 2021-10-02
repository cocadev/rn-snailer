import {BASE_URL} from '../../config';
import {fetchData} from '../utils/helper';

export const getPaymentStatus = async ({type, order_id, t}) => {
  const route = BASE_URL + `/payment/${type}/${order_id}/status`;
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, payment_success} = response;
    if (!success) throw 'Error';
    return payment_success;
  } catch (error) {
    alert(t('alert_error_paymentjs_1'));
    throw new Error(JSON.stringify(error));
  }
};

export const topupWallet = async ({payment_id, amount, t}) => {
  const route = BASE_URL + '/wallet/topup_wallet';
  const method = 'POST';
  const body = {
    payment_id,
    amount,
  };

  try {
    const response = await fetchData({route, method, body});
    const {success} = response;
    if (!success) throw 'Error';
    return response;
  } catch (error) {
    alert(t('alert_error_paymentjs_2'));
    throw new Error(error);
  }
};

export const getWalletBalance = async () => {
  const route = BASE_URL + '/wallet/wallet_balance';
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';

    return results;
  } catch (err) {
    throw err;
  }
};

export const getTransactionList = async ({skip}) => {
  const route = BASE_URL + `/wallet/history?skip=${skip}`;
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';

    return results;
  } catch (err) {
    throw err;
  }
};
