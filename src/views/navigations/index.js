import React, {useState, useEffect} from 'react';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, Dimensions, StyleSheet, AppState, Platform, StatusBar, Text} from 'react-native';
import {navigationRef} from './RootNavigation';
import {createStackNavigator} from '@react-navigation/stack';

import OtpScreen from '../screens/auth/OtpScreen';

//icons
import homeafter from 'assets/icons/home_after.png';
import homebefore from 'assets/icons/home_before.png';
import activityafter from 'assets/icons/activity_after.png';
import activitybefore from 'assets/icons/activity_before.png';
import paymentafter from 'assets/icons/payment_after.png';
import paymentbefore from 'assets/icons/payment_before.png';
import notificationbefore from 'assets/icons/notification_before.png';
import notificationafter from 'assets/icons/notification_after.png';
import accountbefore from 'assets/icons/acc_before.png';
import accountafter from 'assets/icons/acc_after.png';

import {connect} from 'react-redux';
import {
  updateOrderStatus,
  riderAcceptedOrder,
  syncRiderLocationSuccess,
} from 'states/redux/ActionCreators/order';

import WSS from 'services/websocket';
import {getAppVersion} from '../../services/auth';
//auth
import AuthScreenStack from 'views/navigations/auth';
import HomeStackScreen from '../navigations/home';
import ActivityStackScreen from '../navigations/activity';
import NotificationStackScreen from '../navigations/notification';
import PaymentStackScreen from '../navigations/payment';
import AccountStackScreen from '../navigations/account';

import {AddressContextProvider} from '../../states/context/address.context';
import {BasketContextProvider} from '../../states/context/basket.context';
import {PaymentOrderContextProvider} from '../../states/context/paymentOrder.context';
import {MoveOrderContextProvider} from '../../states/context/moveOrder.context';
import {ParcelOrderContextProvider} from '../../states/context/parcelOrder.context';

import {useTranslation} from 'react-i18next';
import {getVersion} from 'react-native-device-info';

import AppUpdateModal from '../screens/component/popup/AppUpdateModal';
// FCM
import messaging from '@react-native-firebase/messaging';
import {
  addFCMTokenRedux,
  updateFCMTokenRedux,
} from '../../states/redux/ActionCreators/notification';

const MainNavigator = ({
  is_authenticated,
  lng,
  updateOrderStatus,
  riderAcceptedOrder,
  syncRiderLocationSuccess,
  fcm_token,
  fcm_user,
  addFCMTokenRedux,
  updateFCMTokenRedux,
  mobile_verified,
}) => {
  const {t, i18n} = useTranslation();
  const [appState, setAppState] = useState(AppState.currentState);
  const [modalVisible, setModalVisible] = useState(false);

  const compareVersion = (minAppVersion) => {
    const currentVersionArr = getVersion().split('.');
    const minVersionArr = minAppVersion.split('.');

    for (let i = 0; i < currentVersionArr.length; i++) {
      if (parseInt(currentVersionArr[i]) < parseInt(minVersionArr[i])) {
        setModalVisible(true);
        return;
      }
    }
  };

  const handleGetAppVersion = async () => {
    try {
      const results = await getAppVersion();

      if (results) {
        compareVersion(results);
      }
    } catch (err) {
      console.log('index -> handleGetAppVersion err', err);
    }
  };

  useEffect(() => {
    handleGetAppVersion();
    i18n.changeLanguage(lng);
  }, []);

  useEffect(() => {
    if (is_authenticated) {
      handleGetAppVersion();
      WSS.init(updateOrderStatus, riderAcceptedOrder, syncRiderLocationSuccess);
      AppState.addEventListener('change', handleAppStateChange);
    } else {
      WSS.closeWSS();
    }

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [appState, is_authenticated]);

  const checkPermission = async () => {
    if (Platform.OS === 'ios') {
      const iosPermission = await messaging().requestPermission({
        alert: true,
        sound: true,
      });
      if (iosPermission == 0) {
        await alert(
          'Please allow notification permission to provide a better service',
        );
      }
    }

    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('[FCMService] fcmToken', fcmToken); // fcm token from firebase
      console.log('[FCMToken] fcm_token', fcm_token); // fcm token from redux
      console.log('[FCMUser] fcm_user', fcm_user); // fcm use from redux
      if (!fcm_user) {
        addFCMTokenRedux({fcm_token: fcmToken}); // update fcm_user to true and POST new fcm_token to add
      } else {
        if (fcm_token !== fcmToken) {
          updateFCMTokenRedux({
            old_fcm_token: fcm_token,
            new_fcm_token: fcmToken,
          }); // if getToken is diff, update PUT new token
        }
      }
    }
  };

  useEffect(() => {
    if (is_authenticated) {
      checkPermission();

      messaging().onTokenRefresh((fcmToken) => {
        if (!fcm_user) {
          addFCMTokenRedux({fcm_token: fcmToken}); // in case, user is first time user to fcm
        } else {
          updateFCMTokenRedux({
            old_fcm_token: fcm_token,
            new_fcm_token: fcmToken,
          }); // if token refreshed, update PATCH new token
        }
      });
    }
  }, [is_authenticated]);

  const handleAppStateChange = (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      if (is_authenticated) {
        WSS.init(
          updateOrderStatus,
          riderAcceptedOrder,
          syncRiderLocationSuccess,
        );
      }
    }

    if (nextAppState === 'background') {
      WSS.closeWSS();
    }

    setAppState(nextAppState);
  };

  return (
    <NavigationContainer ref={navigationRef}>
      {is_authenticated ? (
        mobile_verified ? (
          <AppScreenTab />
        ) : (
          <PhoneVerificationScreenStack />
        )
      ) : (
        <AuthScreenStack />
      )}
      <AppUpdateModal modalVisible={modalVisible} />
    </NavigationContainer>
  );
};

const PhoneStack = createStackNavigator();

const PhoneVerificationScreenStack = () => {
  return (
    <PhoneStack.Navigator headerMode="none">
      <PhoneStack.Screen name="OtpScreen" component={OtpScreen} />
    </PhoneStack.Navigator>
  );
};

const AppTab = createBottomTabNavigator();

const AppScreenTab = () => {
  const {t, i18n} = useTranslation();
  getTabBarVisible = (route, name) => {
    // If the focused route is not found, we need to assume it's the initial screen
    // This can happen during if there hasn't been any navigation inside the screen
    // In our case, it's "Feed" as that's the first screen inside the navigator
    const routeName = getFocusedRouteNameFromRoute(route) ?? name;

    return routeName == name;
  };

  return (
    <AddressContextProvider>
      <BasketContextProvider>
        <PaymentOrderContextProvider>
          <MoveOrderContextProvider>
            <ParcelOrderContextProvider>
              <StatusBar backgroundColor={'transparent'} translucent={true} barStyle="light-content" />
              <AppTab.Navigator
                initialRouteName="HomePage"
                tabBarOptions={{
                  activeTintColor: '#468c64',
                  inactiveTintColor: '#B5B5B5',
                }}>
                <AppTab.Screen
                  name={'HomePage'}
                  component={HomeStackScreen}
                  options={({route}) => ({
                    tabBarLabel: t('home'),
                    tabBarVisible: false,
                    tabBarIcon: ({focused}) => {
                      return (
                        <Image
                          source={focused ? homeafter : homebefore}
                          style={[styles.logoStyle]}
                        />
                      );
                    },
                  })}
                />
                <AppTab.Screen
                  name={'ActivityList'}
                  component={ActivityStackScreen}
                  options={({route}) => ({
                    tabBarLabel: t('activity'),
                    tabBarVisible: getTabBarVisible(route, 'ActivityList'),
                    tabBarIcon: ({focused}) => {
                      return (
                        <Image
                          source={focused ? activityafter : activitybefore}
                          style={[styles.logoStyle]}
                        />
                      );
                    },
                  })}
                />
                <AppTab.Screen
                  name={'PaymentScreen'}
                  component={PaymentStackScreen}
                  options={({route}) => ({
                    tabBarLabel: t('payment'),
                    tabBarVisible: getTabBarVisible(route, 'PaymentScreen'),
                    tabBarIcon: ({focused}) => {
                      return (
                        <Image
                          source={focused ? paymentafter : paymentbefore}
                          style={[styles.logoStyle]}
                        />
                      );
                    },
                  })}
                />
                <AppTab.Screen
                  name={'NotificationScreen'}
                  component={NotificationStackScreen}
                  options={({route}) => ({
                    tabBarLabel: t('notification'),
                    tabBarVisible: getTabBarVisible(route, 'NotificationScreen'),
                    tabBarIcon: ({focused}) => {
                      return (
                        <Image
                          source={
                            focused ? notificationafter : notificationbefore
                          }
                          style={[styles.logoStyle]}
                        />
                      );
                    },
                  })}
                />
                <AppTab.Screen
                  name={'AccountScreen'}
                  component={AccountStackScreen}
                  options={({route}) => ({
                    tabBarLabel: t('account'),
                    tabBarVisible: false,
                    tabBarIcon: ({focused}) => {
                      return (
                        <Image
                          source={focused ? accountafter : accountbefore}
                          style={[styles.logoStyle]}
                        />
                      );
                    },
                  })}
                />
              </AppTab.Navigator>
            </ParcelOrderContextProvider>
          </MoveOrderContextProvider>
        </PaymentOrderContextProvider>
      </BasketContextProvider>
    </AddressContextProvider>
  );
};
const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  logoStyle: {
    height: width * 0.08,
    width: width * 0.08,
  },
});

const mapStateToProps = (state /*, ownProps*/) => {
  const {auth, setting} = state;
  return {
    is_authenticated: auth.is_authenticated,
    lng: setting.lng,
    fcm_token: state.fcm.fcm_token,
    fcm_user: state.fcm.fcm_user,
    mobile_verified: state.auth.mobile_verified,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateOrderStatus: ({order_id, status}) =>
    dispatch(updateOrderStatus({order_id, status})),
  riderAcceptedOrder: ({order_id, status, rider}) =>
    dispatch(
      riderAcceptedOrder({
        order_id,
        status,
        rider,
      }),
    ),
  syncRiderLocationSuccess: ({order_id, longitude, latitude}) =>
    dispatch(syncRiderLocationSuccess({order_id, longitude, latitude})),
  addFCMTokenRedux: ({fcm_token}) => dispatch(addFCMTokenRedux({fcm_token})),
  updateFCMTokenRedux: ({old_fcm_token, new_fcm_token}) =>
    dispatch(updateFCMTokenRedux({old_fcm_token, new_fcm_token})),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainNavigator);
