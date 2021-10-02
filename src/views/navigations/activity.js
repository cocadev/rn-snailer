import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import ActivityList from '../screens/activity/ActivityList';
import ActivityScreen from '../screens/activity/ActivityScreen';
import MapDeliveryScreen from '../screens/home/food/MapDeliveryScreen';
import MoveOrderDetail from '../screens/home/move/MoveOrderDetail';
import ProductDetail from '../screens/home/food/ProductDetail';
import DeliveredReview from '../screens/home/food/DeliveredReview';
import DeliveredReviewSubmitted from '../screens/home/food/DeliveredReviewSubmitted';
import Order from '../screens/home/Order';
import {AddressContextProvider} from '../../states/context/address.context';
import {BasketContextProvider} from '../../states/context/basket.context';
import {PaymentOrderContextProvider} from '../../states/context/paymentOrder.context';

const ActivityStack = createStackNavigator();

export default ActivityScreenStack = () => {
  return (
    <AddressContextProvider>
      <BasketContextProvider>
        <PaymentOrderContextProvider>
          <ActivityStack.Navigator headerMode="none">
            <ActivityStack.Screen
              name="ActivityList"
              component={ActivityList}
            />
            <ActivityStack.Screen
              name="ActivityScreen"
              component={ActivityScreen}
            />
            <ActivityStack.Screen
              name="MapDeliveryScreen"
              component={MapDeliveryScreen}
            />
            <ActivityStack.Screen
              name="MoveOrderDetail"
              component={MoveOrderDetail}
            />
            <ActivityStack.Screen
              name="ProductDetail"
              component={ProductDetail}
            />
            <ActivityStack.Screen name="Order" component={Order} />
            <ActivityStack.Screen
              name="DeliveredReview"
              component={DeliveredReview}
            />
            <ActivityStack.Screen
              name="DeliveredReviewSubmitted"
              component={DeliveredReviewSubmitted}
            />
          </ActivityStack.Navigator>
        </PaymentOrderContextProvider>
      </BasketContextProvider>
    </AddressContextProvider>
  );
};
