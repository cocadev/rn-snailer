import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import HomePage from '../screens/home/HomePage';
import HomeInfo from '../screens/home/HomeInfo';
import PaymentMethod from '../screens/home/PaymentMethod';
import AddPaymentMethod from '../screens/home/AddPaymentMethod';

import MapDeliveryScreen from '../screens/home/food/MapDeliveryScreen';
import DeliveredReview from '../screens/home/food/DeliveredReview';
import DeliveredReviewSubmitted from '../screens/home/food/DeliveredReviewSubmitted';
import PaymentWebview from '../screens/home/PaymentWebview';

import ItemHomePage from '../screens/home/food/ItemHomePage';
import ProductDetail from '../screens/home/food/ProductDetail';
import BranchDetail from '../screens/home/BranchDetail';
import AddSavedPlace from '../screens/home/food/AddSavedPlace';
import ChangeAddress from '../screens/home/food/ChangeAddress';
import ChoosePlace from '../screens/home/food/ChoosePlace';
import AddAddress from '../screens/home/food/AddAddress';
import CurrentAddress from '../screens/home/food/CurrentAddress';
import MapScreen from '../screens/home/food/MapScreen';
import SearchCraving from '../screens/home/food/SearchCraving';
import RecommendedItem from '../screens/home/RecommendedItem';
import Order from '../screens/home/Order';
import OrderDetail from '../screens/home/OrderDetail';
import PlaceOrder from '../screens/home/food/PlaceOrder';
import Webview from '../screens/home/Webview';

import MoveScreen from '../screens/home/move/MoveScreen';
import MoveOrderHistoryList from '../screens/home/move/MoveOrderHistoryList';
import MoveOrderDetail from '../screens/home/move/MoveOrderDetail';
import MoveMapScreen from '../screens/home/move/MoveMapScreen';
import MoveConfirmOrder from '../screens/home/move/MoveConfirmOrder';
import MoveUpdateInfo from '../screens/home/move/MoveUpdateInfo';
import MoveAddImage from '../screens/home/move/MoveAddImage';
import AdditionalServices from '../screens/home/move/AdditionalServices';

import ParcelScreen from '../screens/home/parcel/ParcelScreen';
import ParcelOrderHistoryList from '../screens/home/parcel/ParcelOrderHistoryList';
import ParcelDelivery from '../screens/home/parcel/ParcelDelivery';
import ParcelDropoff from '../screens/home/parcel/ParcelDropoff';
import ParcelTracking from '../screens/home/parcel/ParcelTracking';
import TrackingDetail from '../screens/home/parcel/TrackingDetail';
import ParcelOrderDetail from '../screens/home/parcel/ParcelOrderDetail';
import SenderDetails from '../screens/home/parcel/SenderDetails';
import ReceiverDetails from '../screens/home/parcel/ReceiverDetails';
import ParcelOrder from '../screens/home/parcel/ParcelOrder';
import ParcelConfirmOrder from '../screens/home/parcel/ParcelConfirmOrder';
import CalculateWeight from '../screens/home/parcel/CalculateWeight';
import QRCamera from '../screens/home/parcel/QRCamera';

import CardDetail from '../screens/home/CardDetail';
import PaymentScreen from '../screens/payment/PaymentScreen';
import {BranchContextProvider} from '../../states/context/branch.context';
import TermsOfUse from '../screens/account/support/TermsOfUse';
import PrivacyPolicy from '../screens/account/support/PrivacyPolicy';
import { CreatePin } from '../../services/pin';
import CreatePIN from '../screens/payment/createpin/CreatePIN';

const HomeStack = createStackNavigator();

const HomeStackScreen = () => {
  return (
    <BranchContextProvider>
      <HomeStack.Navigator headerMode="none">
        <HomeStack.Screen name="HomePage" component={HomePage} />
        <HomeStack.Screen name="HomeInfo" component={HomeInfo} />
        <HomeStack.Screen name="Webview" component={Webview} />
        <HomeStack.Screen name="PaymentMethod" component={PaymentMethod} />
        <HomeStack.Screen name="AddPaymentMethod" component={AddPaymentMethod} />

        <HomeStack.Screen
          name="MapDeliveryScreen"
          component={MapDeliveryScreen}
        />
        <HomeStack.Screen name="DeliveredReview" component={DeliveredReview} />
        <HomeStack.Screen
          name="DeliveredReviewSubmitted"
          component={DeliveredReviewSubmitted}
        />

        <HomeStack.Screen name="ItemHomePage" component={ItemHomePage} />
        <HomeStack.Screen name="ProductDetail" component={ProductDetail} />
        <HomeStack.Screen name="PaymentWebview" component={PaymentWebview} />
        <HomeStack.Screen name="BranchDetail" component={BranchDetail} />
        <HomeStack.Screen name="AddSavedPlace" component={AddSavedPlace} />
        <HomeStack.Screen name="ChangeAddress" component={ChangeAddress} />
        <HomeStack.Screen name="ChoosePlace" component={ChoosePlace} />
        <HomeStack.Screen name="AddAddress" component={AddAddress} />
        <HomeStack.Screen name="CurrentAddress" component={CurrentAddress} />
        <HomeStack.Screen name="MapScreen" component={MapScreen} />
        <HomeStack.Screen name="SearchCraving" component={SearchCraving} />
        <HomeStack.Screen name="RecommendedItem" component={RecommendedItem} />
        <HomeStack.Screen name="Order" component={Order} />
        <HomeStack.Screen name="OrderDetail" component={OrderDetail} />
        <HomeStack.Screen name="PlaceOrder" component={PlaceOrder} />

        <HomeStack.Screen name="MoveScreen" component={MoveScreen} />
        <HomeStack.Screen name="MoveOrderHistoryList" component={MoveOrderHistoryList} />
        <HomeStack.Screen name="MoveOrderDetail" component={MoveOrderDetail} />
        <HomeStack.Screen name="MoveMapScreen" component={MoveMapScreen} />
        <HomeStack.Screen name="CurrentMapScreen" component={MoveMapScreen} />
        <HomeStack.Screen
          name="MoveConfirmOrder"
          component={MoveConfirmOrder}
        />
        <HomeStack.Screen name="MoveUpdateInfo" component={MoveUpdateInfo} />
        <HomeStack.Screen name="MoveAddImage" component={MoveAddImage} />
        <HomeStack.Screen
          name="AdditionalServices"
          component={AdditionalServices}
        />

        <HomeStack.Screen name="ParcelScreen" component={ParcelScreen} />
        <HomeStack.Screen name="ParcelOrderHistoryList" component={ParcelOrderHistoryList}/>
        <HomeStack.Screen name="ParcelDelivery" component={ParcelDelivery} />
        <HomeStack.Screen name="ParcelDropoff" component={ParcelDropoff} />
        <HomeStack.Screen name="ParcelTracking" component={ParcelTracking} />
        <HomeStack.Screen name="TrackingDetail" component={TrackingDetail} />
        <HomeStack.Screen name="ParcelOrderDetail" component={ParcelOrderDetail} />
        <HomeStack.Screen name="SenderDetails" component={SenderDetails} />
        <HomeStack.Screen name="ReceiverDetails" component={ReceiverDetails} />
        <HomeStack.Screen name="ParcelOrder" component={ParcelOrder} />
        <HomeStack.Screen
          name="ParcelConfirmOrder"
          component={ParcelConfirmOrder}
        />
        <HomeStack.Screen name="CalculateWeight" component={CalculateWeight} />
        <HomeStack.Screen name="QRCamera" component={QRCamera} />
        <HomeStack.Screen name="TermsOfUse" component={TermsOfUse} />
        <HomeStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />

        <HomeStack.Screen name="CardDetail" component={CardDetail} />
        <HomeStack.Screen name="PaymentScreen" component={PaymentScreen} />
        <HomeStack.Screen name="CreatePin" component={CreatePIN} />
      </HomeStack.Navigator>
    </BranchContextProvider>
  );
};

export default HomeStackScreen;
