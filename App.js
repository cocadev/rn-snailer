/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {View, ActivityIndicator, LogBox, Platform} from 'react-native';
import Main from 'views/navigations/index/';

import {enableScreens} from 'react-native-screens';

//redux
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/es/integration/react';
import store, {persistor} from 'states/redux/ConfigureStore';
import 'utils/i18n';

// FCM
import messaging from '@react-native-firebase/messaging';

enableScreens();
LogBox.ignoreAllLogs();

const App = () => {
  useEffect(() => {
    const registerAppWithFCM = async () => {
      try {
        if (Platform.OS === 'ios') {
          await messaging().registerDeviceForRemoteMessages();
          await messaging().setAutoInitEnabled(true);
        }
      } catch (error) {
        console.log(
          '[FCMService registerDeviceForRemoteMessages error]',
          error,
        );
      }
    };
    registerAppWithFCM();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <Main />
      </PersistGate>
    </Provider>
  );
};

const Loading = () => (
  <View style={{backgroundColor: '#1A2430'}}>
    <ActivityIndicator />
  </View>
);

export default App;
