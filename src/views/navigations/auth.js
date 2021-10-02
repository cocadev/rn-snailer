import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import SignInScreen from 'views/screens/auth/SignIn';
import OtpScreen from '../screens/auth/OtpScreen';
import TermsOfUse from '../screens/account/support/TermsOfUse';
import PrivacyPolicy from '../screens/account/support/PrivacyPolicy';

const AuthStack = createStackNavigator();

export default AuthScreenStack = () => {
  return (
    <AuthStack.Navigator headerMode="none">
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="OtpScreen" component={OtpScreen} />
      <AuthStack.Screen name="TermsOfUse" component={TermsOfUse} />
      <AuthStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
    </AuthStack.Navigator>
  );
};
