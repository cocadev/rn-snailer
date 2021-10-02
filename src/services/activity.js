import {fetchData} from '../utils/helper';
import {BASE_URL} from '../../config';

export const getActivityFeed = async ({t}) => {
  const route = `${BASE_URL}/activity_feed`;
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';

    return results;
  } catch (error) {
    console.log('Error retrieving Activity Feed');
    throw new Error(JSON.stringify(error));
  }
};
