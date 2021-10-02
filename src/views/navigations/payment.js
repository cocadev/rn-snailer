import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import PaymentScreen from '../screens/payment/PaymentScreen';
import PaymentHistory from '../screens/payment/PaymentHistory';
import PaymentDetail from '../screens/payment/PaymentDetail';

import AddCard from '../screens/payment/addcard/AddCard';

import TopUp from '../screens/payment/topup/TopUp';
import TopUpAmount from '../screens/payment/topup/TopUpAmount';

import CreatePIN from '../screens/payment/createpin/CreatePIN';
import ConfirmPIN from '../screens/payment/createpin/ConfirmPIN';
import VerifyEmail from '../screens/payment/createpin/VerifyEmail';
import PINSuccess from '../screens/payment/createpin/PINSuccess';
import OtpScreen from '../screens/auth/OtpScreen';

import PaymentMethod from '../screens/home/PaymentMethod';
import PaymentWebview from '../screens/home/PaymentWebview';
import ProductDetail from '../screens/home/food/ProductDetail';
import MoveOrderDetail from '../screens/home/move/MoveOrderDetail';
import DeliveredReview from '../screens/home/food/DeliveredReview';
import DeliveredReviewSubmitted from '../screens/home/food/DeliveredReviewSubmitted';

import {PaymentOrderContextProvider} from '../../states/context/paymentOrder.context';

import ParcelOrderDetail from '../screens/home/parcel/ParcelOrderDetail';

const PaymentStack = createStackNavigator();

export default PaymentScreenStack = () => {
  return (
    <PaymentOrderContextProvider>
      <PaymentStack.Navigator headerMode="none">
        <PaymentStack.Screen name="PaymentScreen" component={PaymentScreen} />
        <PaymentStack.Screen name="PaymentHistory" component={PaymentHistory} />
        <PaymentStack.Screen name="PaymentDetail" component={PaymentDetail} />

        <PaymentStack.Screen name="AddCard" component={AddCard} />

        <PaymentStack.Screen name="TopUp" component={TopUp} />
        <PaymentStack.Screen name="TopUpAmount" component={TopUpAmount} />

        <PaymentStack.Screen name="PaymentMethod" component={PaymentMethod} />
        <PaymentStack.Screen name="PaymentWebview" component={PaymentWebview} />

        <PaymentStack.Screen
          name="ParcelOrderDetail"
          component={ParcelOrderDetail}
        />
        <PaymentStack.Screen name="ProductDetail" component={ProductDetail} />
        <PaymentStack.Screen
          name="MoveOrderDetail"
          component={MoveOrderDetail}
        />
        <PaymentStack.Screen
          name="DeliveredReview"
          component={DeliveredReview}
        />
        <PaymentStack.Screen
          name="DeliveredReviewSubmitted"
          component={DeliveredReviewSubmitted}
        />

        <PaymentStack.Screen name="CreatePIN" component={CreatePIN} />
        <PaymentStack.Screen name="ConfirmPIN" component={ConfirmPIN} />
        <PaymentStack.Screen name="VerifyEmail" component={VerifyEmail} />
        <PaymentStack.Screen name="PINSuccess" component={PINSuccess} />
        <PaymentStack.Screen name="OtpScreen" component={OtpScreen} />
      </PaymentStack.Navigator>
    </PaymentOrderContextProvider>
  );
};
