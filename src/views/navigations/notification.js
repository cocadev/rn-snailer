import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import NotificationScreen from '../screens/notification/NotificationScreen';

const NotificationStack = createStackNavigator();

export default NotificationScreenStack = () => {
  return (
    <NotificationStack.Navigator headerMode="none">
      <NotificationStack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
      />
    </NotificationStack.Navigator>
  );
};
