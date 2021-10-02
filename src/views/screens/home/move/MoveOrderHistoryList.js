import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  Animated,
  FlatList,
  Image,
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';

import NavBar, {LeftButton} from '../../component/NavBar';
import OrderItem, {TextStatus} from '../../component/home/OrderItem';
import DeleteModal, {
  LeftRightButton,
} from '../../component/popup/DeleteConfirmationModal';

import onetonlorry from '../../../../assets/images/M-1tonlorry.png';
import threetonlorry from '../../../../assets/images/M-3tonlorry.png';
import carmvp from '../../../../assets/images/M-car(mvp).png';
import carsedan from '../../../../assets/images/M-car(sedan).png';
import Motorcycle from '../../../../assets/images/M-motorcycle.png';
import Van from '../../../../assets/images/M-van.png';
import {getMoveOrder} from 'services/order';
import {NoDataView} from '../../component/NoDataView';

const MoveOrderHistoryList = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    const handleGetOrder = async () => {
      try {
        const order = await getMoveOrder();
        setOrderHistory(order);
      } catch {}
    };
    handleGetOrder();
  }, []);

  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const navigateToOrderDetail = (item) => {
    navigation.navigate('MoveOrderDetail', {
      origin: 'ActivityList',
      viewOnly: true,
      order_id: item._id,
    });
  };

  // const [modalVisible, setModalVisible] = useState(false);
  // const navigateToDeleteConfirmationScreen = () => {
  //     setModalVisible((prev) => !prev);
  //   };
  //   const modalMessage = t('start_new_basket_confirmation');
  //   const modalSubMessage = t('start_new_basket_alert');
  //   const ButtonGroup = () => {
  //     const left = {
  //       text: t('cancel'),
  //       onPress: navigateToDeleteConfirmationScreen
  //     };
  //     const right = {
  //       text: t('proceed'),
  //       onPress: navigateToDeleteConfirmationScreen

  //     };
  //     return LeftRightButton({option: 'GREEN', left, right});
  //   };

  return (
    <NavBar title={t('move_orders')} {...{LeftButton, handleLeftNavButton}}>
      {/* <TouchableOpacity style={[themes.GREEN_BUTTON, styles.button]} onPress={navigateToDeleteConfirmationScreen}>
                    <Text>try</Text>
                </TouchableOpacity> */}
      <View style={{flex: 1}}>
        {/* {orderHistory &&
          orderHistory.map((item, val) => {
            //console.log(item);
            return (
              <View key={val}>
                <OrderList
                  order_image={
                    item.type_of_vehicle === 'Sedan' ? CarSedan : CarMVP
                  }
                  order_name={item.type_of_vehicle}
                  {...{
                    SubTitle: SubTitle({
                      type: 'Distance',
                      order_distance: '0.2km',
                      order_location: item.pickup.address,
                    }),
                    TextStatus: TextStatus({
                      color: 'History',
                      order_time: item.schedule,
                    }),
                    navigateToOrderDetail: navigateToOrderDetail(item),
                  }}
                />
              </View>
            );
          })} */}
        {orderHistory && orderHistory.length > 0 ? (
          <FlatList
            data={orderHistory}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, val}) => {
              return (
                <OrderItem
                  food
                  order_image={
                    item.type_of_vehicle === 'Sedan' ? carsedan : carmvp
                  }
                  order_name={item.type_of_vehicle}
                  subTitle={item.pickup.address}
                  {...{
                    TextStatus: TextStatus({
                      color: 'History',
                      order_time: item.schedule,
                    }),
                  }}
                  onPress={() => navigateToOrderDetail(item)}
                  key={val}
                />
              );
            }}
          />
        ) : (
          <NoDataView />
        )}
      </View>
    </NavBar>

    // {/* <DeleteModal
    //           {...{
    //           message: modalMessage,
    //           subMessage: modalSubMessage,
    //           navigation,
    //           modalVisible,
    //           setModalVisible,
    //           ButtonGroup,
    //           }}
    //       /> */}
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  button: {
    width: width * 0.44,
    height: width * 0.13,
    alignSelf: 'center',
    textAlign: 'center',
    overflow: 'hidden',
    borderRadius: 25,
    borderWidth: 1,
    fontWeight: 'bold',
    fontSize: RFValue(14),
    ...Platform.select({
      ios: {
        alignItems: 'center',
        lineHeight: width * 0.12,
        height: width * 0.12,
        marginBottom: width * 0.06,
        marginTop: width * 0.03,
      },
      android: {
        textAlignVertical: 'center',
        marginVertical: width * 0.03,
      },
      default: {
        alignItems: 'center',
        textAlignVertical: 'center',
      },
    }),
  },
  nodataWrap: {
    alignItems: 'center',
    marginBottom: width * 0.2,
  },
});

export default MoveOrderHistoryList;
