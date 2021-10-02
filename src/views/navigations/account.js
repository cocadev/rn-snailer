import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import AccountScreen from '../screens/account/AccountScreen';
import EditProfile from '../screens/account/EditProfile';
import Help from '../screens/account/support/Help';
import TermsOfUse from '../screens/account/support/TermsOfUse';
import PrivacyPolicy from '../screens/account/support/PrivacyPolicy';
import LocateUs from '../screens/account/support/LocateUs';
import ChangeLanguage from '../screens/account/ChangeLanguage';
import ChoosePlace from '../screens/home/food/ChoosePlace';
import AddAddress from '../screens/home/food/AddAddress';
import MoveMapScreen from '../screens/home/move/MoveMapScreen';
import ActivityScreen from '../screens/activity/ActivityList';
import PaymentScreen from '../screens/payment/PaymentScreen';
import NotificationScreen from '../screens/notification/NotificationScreen';
import PaymentDetail from '../screens/payment/PaymentDetail';
import TopUp from '../screens/payment/topup/TopUp';
import TopUpAmount from '../screens/payment/topup/TopUpAmount';
import CreatePIN from '../screens/payment/createpin/CreatePIN';
import ConfirmPIN from '../screens/payment/createpin/ConfirmPIN';
import PINSuccess from '../screens/payment/createpin/PINSuccess';
import VerifyEmail from '../screens/payment/createpin/VerifyEmail';
import OtpScreen from '../screens/auth/OtpScreen';
import PaymentMethod from '../screens/home/PaymentMethod';
import PaymentWebview from '../screens/home/PaymentWebview';
import PaymentHistory from '../screens/payment/PaymentHistory';

const AccountStack = createStackNavigator();

export default NotificationScreenStack = () => {
  return (
    <AccountStack.Navigator headerMode="none">
      <AccountStack.Screen name="AccountScreen" component={AccountScreen} />
      <AccountStack.Screen name="EditProfile" component={EditProfile} />

      <AccountStack.Screen name="ChoosePlace" component={ChoosePlace} />
      <AccountStack.Screen name="AddAddress" component={AddAddress} />
      <AccountStack.Screen name="MoveMapScreen" component={MoveMapScreen} />

      <AccountStack.Screen name="Help" component={Help} />
      <AccountStack.Screen name="TermsOfUse" component={TermsOfUse} />
      <AccountStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <AccountStack.Screen name="LocateUs" component={LocateUs} />

      <AccountStack.Screen name="ChangeLanguage" component={ChangeLanguage} />

      <AccountStack.Screen name="ActivityScreen" component={ActivityScreen} />
      <AccountStack.Screen name="NotificationScreen" component={NotificationScreen} />

      <AccountStack.Screen name="PaymentScreen" component={PaymentScreen} />
      <AccountStack.Screen name="TopUpScreen" component={TopUp} />

      <AccountStack.Screen name="CreatePIN" component={CreatePIN} />
      <AccountStack.Screen name="ConfirmPIN" component={ConfirmPIN} />
      <AccountStack.Screen name="VerifyEmail" component={VerifyEmail} />
      <AccountStack.Screen name="PINSuccess" component={PINSuccess} />
      <AccountStack.Screen name="OtpScreen" component={OtpScreen} />

      <AccountStack.Screen name="TopUpAmount" component={TopUpAmount} />
      <AccountStack.Screen name="PaymentMethod" component={PaymentMethod} />
      <AccountStack.Screen name="PaymentWebview" component={PaymentWebview} />
      <AccountStack.Screen name="PaymentDetail" component={PaymentDetail} />
      <AccountStack.Screen name="PaymentHistory" component={PaymentHistory} />

    </AccountStack.Navigator>
  );
};
