import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  Animated,
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';

import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';

import FoodPreparingGif from '../../../../assets/gif/FoodPreparingGif.gif';
import GroceryPreparingGif from '../../../../assets/gif/GroceryPreparingGif.gif';
import WaitingRestaurantGif from '../../../../assets/gif/WaitingRestaurantGif.gif';
import RiderGif from '../../../../assets/gif/RiderGif.gif';

import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';

import StepIndicator from 'react-native-step-indicator';
import {connect} from 'react-redux';

const DeliveryStatus = ({setModalVisible, orderStat}) => {
  const {t, i18n} = useTranslation();
  const labels = [t('confirming'), t('preparing'), t('delivering'), t('arrived')];
  const customStyles = {
    stepIndicatorSize: 10,
    labelColor: '#B2B2B2',
    labelAlign: 'flex-start',
    labelSize: 14,
    stepIndicatorLabelFontSize: 1,
    currentStepIndicatorLabelFontSize: 1,
    currentStepLabelColor: '#000000',
    separatorUnFinishedColor: '#468c64',
    stepIndicatorFinishedColor: '#468c64',
    stepIndicatorUnFinishedColor: '#468c64',
    stepIndicatorCurrentColor: '#468c64',
    stepIndicatorLabelCurrentColor: '#468c64',
    stepIndicatorLabelFinishedColor: '#468c64',
    stepIndicatorLabelUnFinishedColor: '#468c64',
    separatorStrokeWidth: 2,
    stepIndicatorSize: 10,
    currentStepIndicatorSize: 20,
    currentStepStrokeWidth: 0,
  };

  const status = ({gif}) => {
    switch (gif) {
      case 'FoodPreparingGif':
        return (
          <>
            <Image source={FoodPreparingGif} style={styles.gifWrap} />
          </>
        );
      case 'GroceryPreparingGif':
        return (
          <>
            <Image source={GroceryPreparingGif} style={styles.gifWrap} />
          </>
        );
      case 'WaitingRestaurantGif':
        return (
          <>
            {/* TODO - add waiting restaurant text */}
            {/* <Image source={WaitingRestaurantGif} style={styles.gifWrap} /> */}
          </>
        );
      case 'RiderGif':
        return (
          <>
            {/*TODO - add waiting rider text  */}
            <Image source={RiderGif} style={styles.gifWrap} />
          </>
        );
    }
  };

  const [gif, setGif] = useState(
    orderStat.latest_order.item_type === 'food'
      ? {gif: 'FoodPreparingGif'}
      : {gif: 'GroceryPreparingGif'},
  );
  const [stepPosition, setStepPosition] = useState(0);

  useEffect(() => {
    if (
      orderStat.latest_order.status === 'merchant_preparing' ||
      orderStat.latest_order.status === 'rider_picking_up'
    ) {
      setStepPosition(1);
    } else if (orderStat.latest_order.status === 'delivering') {
      setGif({gif: 'RiderGif'});
      setStepPosition(2);
    } else if (orderStat.latest_order.status === 'delivered') {
      setStepPosition(3);
      setModalVisible(true);
    }
  }, [orderStat]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.item}>
          <View style={styles.column1}>
            {/* {status({gif: 'FoodPreparingGif'})} */}
            {status(gif)}
          </View>
          <View style={styles.column2}>
            <StepIndicator
              labels={labels}
              direction="vertical"
              currentPosition={stepPosition}
              stepCount="4"
              customStyles={customStyles}
            />
          </View>
        </View>
      </View>
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  item: {
    marginHorizontal: width * 0.04,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: height * 0.21,
  },
  column1: {
    width: width * 0.5,
    alignItems: 'flex-end',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  column2: {
    width: width * 0.33,
    height: '100%',
    flexDirection: 'column',
    paddingVertical: Platform.OS === 'ios' ? height * 0.02 : height * 0.02,
  },
  gifWrap: {
    width: '80%',
    height: '80%',
    borderRadius: 20,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: RFValue(10),
    paddingVertical: height * 0.005,
  },
});

const mapStateToProps = (state) => {
  return {
    orderStat: state.order,
  };
};

export default connect(mapStateToProps)(DeliveryStatus);
