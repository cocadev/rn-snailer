import {BASE_URL, Web_CLIENT_ID} from '../../config';
import {fetchData} from 'utils/helper';
// import { LoginManager, AccessToken } from 'react-native-fbsdk';
import appleAuth from '@invertase/react-native-apple-authentication';
import {GoogleSignin} from '@react-native-community/google-signin';

export const getAppleToken = async () => {
  try {
    const apple_result = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    return apple_result;
  } catch (error) {
    console.log('error', JSON.stringify(error, null, 2));
  }
};

export const getGoogleToken = async () => {
  try {
    GoogleSignin.configure({
      //It is mandatory to call this method before attempting to call signIn()
      scopes: ['email', 'profile'],
      // Repleace with your webClientId generated from Firebase console
      webClientId: Web_CLIENT_ID,
      //iosClientId: IOS_CLIENT_ID,
    });
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    return userInfo;
  } catch (error) {
    console.log(`SignIn error: ${JSON.stringify(error, null, 2)}`);
  }
};

export const signInWithGoogle = async ({userInfo, t}) => {
  const route = BASE_URL + '/signin/google';
  const method = 'POST';
  const body = {
    user_info: userInfo,
  };

  try {
    const response = await fetchData({route, method, body});
    const {success, results} = response;
    if (!success) throw 'Error';

    return results;
  } catch (error) {
    alert(t('alert_error_authjs_1'));
    throw new Error(error);
  }
};

export const signInWithApple = async ({
  email,
  familyName,
  givenName,
  identityToken,
  t,
}) => {
  const route = BASE_URL + '/signin/apple';
  const method = 'POST';
  const body = {
    email,
    familyName,
    givenName,
    identityToken,
  };

  try {
    const response = await fetchData({route, method, body});
    const {success, results} = response;
    if (!success) throw 'Error';

    return results;
  } catch (error) {
    alert(t('alert_error_authjs_1'));
    throw new Error(error);
  }
};

export const signOut = async () => {
  const route = BASE_URL + '/signout';
  const method = 'POST';

  try {
    const response = await fetchData({route, method});
    const {success} = response;
    if (!success) throw 'Error';

    await GoogleSignin.signOut();

    return success;
  } catch (error) {
    //alert(t('alert_error_authjs_2'));
    throw new Error(error);
  }
};

// export const getUserInfo = async ({t}) => {
//   const route = BASE_URL + '/user';
//   const method = 'GET';

//   try {
//     const response = await fetchData({route, method});
//     const {success, results} = response;
//     if (!success) throw 'Error';

//     return results;
//   } catch (error) {
//     alert(t('alert_error_authjs_4'));
//     throw new Error(error);
//   }
// };

export const patchUserInfo = async ({user_info, image, t}) => {
  let route = BASE_URL + `/basic_profile?isUpdateImage=`;
  image ? (route += 'true') : (route += 'false');
  const method = 'PATCH';
  let body = new FormData();
  if (image)
    body.append('image', {
      uri: image.path,
      name: 'image.jpg',
      type: image.mime,
    });

  body.append(
    'json',
    JSON.stringify({
      first_name: user_info.givenName,
      last_name: user_info.familyName,
      mobile: user_info.phone_number,
      email: user_info.email,
    }),
  );

  try {
    const response = await fetchData({route, method, body, is_form: true});
    const {success, results} = response;
    if (!success) throw 'Error';

    return response;
  } catch (error) {
    alert(t('alert_error_authjs_3'));
    throw new Error(error);
  }
};

export const requestOTP = async ({mobile, t}) => {
  const route = BASE_URL + `/request_otp`;
  const method = 'POST';
  const body = {
    mobile,
  };

  try {
    const response = await fetchData({route, method, body});
    const {success, results} = response;
    if (!success) throw 'Error';
    return success;
  } catch (error) {
    alert(t('alert_error_authjs_5'));
    throw new Error(JSON.stringify(error));
  }
};

export const verifyOTP = async ({mobile, otp, t}) => {
  const route = BASE_URL + `/verify_otp`;
  const method = 'POST';
  const body = {
    mobile,
    otp,
  };

  try {
    const response = await fetchData({route, method, body});
    const {success, results} = response;
    if (!success) throw 'Error';
    return success;
  } catch (error) {
    alert(t('alert_error_authjs_6'));
    throw new Error(JSON.stringify(error));
  }
};

export const getAppVersion = async () => {
  const route = BASE_URL + `/version`;
  const method = 'GET';

  try {
    const response = await fetchData({route, method});
    const {success, results} = response;
    if (!success) throw 'Error';
    return results;
  } catch (err) {
    console.log('getAppversion -> err', err);
  }
};
