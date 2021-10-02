import store from 'states/redux/ConfigureStore';
import moment from 'moment';

async function stall(stallTime = 3000) {
  await new Promise((resolve) => setTimeout(resolve, stallTime));
}

export const handleTest = async () => {
  const BASE_URL = 'http://localhost:5000/api/host';
  const route = BASE_URL + '/protected';
  const method = 'GET';

  const response = await fetchData({route, method});
};

export const fetchData = async ({
  route,
  method = 'GET',
  headers = {'Content-Type': 'application/json'},
  body,
  is_form,
}) => {
  try {
    const response = await fetch(route, {
      method,
      headers: is_form ? undefined : headers,
      body: is_form ? body : body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      throw response;
    }
    const json = await response.json();
    return json;
  } catch (error) {
    const {status} = error;

    if (status === 401) {
      store.dispatch({
        type: 'SIGN_OUT_SUCCESS',
      });
      throw 'unauthorized access';
    }

    throw error;
  }
};

export const objToQueryString = (obj) => {
  const keyValuePairs = [];
  const key_length = Object.keys(obj).length;
  for (let i = 0; i < key_length; i += 1) {
    keyValuePairs.push(
      `${encodeURIComponent(Object.keys(obj)[i])}=${encodeURIComponent(
        Object.values(obj)[i],
      )}`,
    );
  }
  return keyValuePairs.join('&');
};

export const formatCurrency = (currency, amount, noCurrency) => {
  if (isNaN(amount)) {
    return 'RM 0';
  }

  if (noCurrency) return (Math.round(text * 100) / 100).toFixed(2);

  const text = (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: currency,
  });
  if (text == amount / 100)
    return (
      currency.toUpperCase() + ' ' + (Math.round(text * 100) / 100).toFixed(2)
    );
  else return text;
};

export const formatWeight = (weight) => {
  if (isNaN(weight)) {
    return '0kg';
  } else {
    return (Math.round(weight) / 1000).toFixed(4) + 'kg';
  }
};

export const formatCurrencyWithNoCurrency = (amount) => {
  if (isNaN(amount)) {
    return '0';
  } else {
    return (Math.round(amount) / 100).toFixed(2);
  }
};

export const formatDate = ({timeStamp, type = 'DD MMM YYYY, h:mm a'}) => {
  const date = moment(new Date(timeStamp)).locale('en').format(type);
  return date;
};

export const formatState = (state) => {
  switch (state) {
    case 'johor':
      return 'Johor';
    case 'kedah':
      return 'Kedah';
    case 'melaka':
      return 'Melaka';
    case 'negeri_sembilan':
      return 'Negeri Sembilan';
    case 'pahang':
      return 'Pahang';
    case 'penang':
      return 'Penang';
    case 'perak':
      return 'Perak';
    case 'perlis':
      return 'Perlis';
    case 'sarawak':
      return 'Sarawak';
    case 'sabah':
      return 'Sabah';
    case 'selangor':
      return 'Selangor';
    case 'terengganu':
      return 'Terengganu';
    case 'kuala_lumpur':
      return 'Federal Territory of Kuala Lumpur';
    case 'putrajaya':
      return 'Putrajaya';
    case 'labuan':
      return 'Labuan Federal Territory';
    default:
      return state;
  }
};
