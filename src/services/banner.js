import {fetchData} from '../utils/helper';
import {BASE_URL} from '../../config';

export const getBanner = async ({type, t}) => {
  const route = `${BASE_URL}/banner?type=${type}`;
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';

    return results;
  } catch (error) {
    // alert('Error retrieving banner. Please try again later.');
    throw new Error(JSON.stringify(error));
  }
};
