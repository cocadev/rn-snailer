import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  Text,
  Modal,
} from 'react-native';
import {RFValue, getStatusBarHeight} from 'styles/ResponsiveFont';

import WaitingRestaurantGif from '../../../../assets/gif/WaitingRestaurantGif.gif';
import RiderGif from '../../../../assets/gif/RiderGif.gif';

const OrderStatus = ({
  STATUSmodalVisible,
  STATUSsetmodalVisible,
  STATUSButtonGroup,
  orderStat,
  deliveryMethod,
  hideButton,
  t,
}) => {
  const order = orderStat.latest_order;

  useEffect(() => {
    if (order && order.status === 'rider_picking_up') {
      STATUSsetmodalVisible(false);
    }
  }, [orderStat]);

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={STATUSmodalVisible}>
        {STATUSmodalVisible ? (
          <StatusBar backgroundColor={'#70707090'} barStyle="light-content" />
        ) : null}
        <View style={styles.blur}>
          <View style={styles.popUpContainer}>
            {order &&
              (order.status === 'merchant_preparing' ||
                order.status === 'rider_picking_up') &&
              deliveryMethod !== 'self_pick_up' && (
                <View style={styles.column1}>
                  <Image source={RiderGif} style={styles.gifWrap} />
                  <Text
                    style={[
                      styles.middleButtonText,
                      {color: 'black'},
                      {textAlign: 'center'},
                    ]}>
                    {t('waiting_rider_confirm')}
                  </Text>
                </View>
              )}
            {order &&
              deliveryMethod === 'self_pick_up' &&
              order.status === 'merchant_preparing' && (
                <View style={styles.column1}>
                  <Image source={WaitingRestaurantGif} style={styles.gifWrap} />
                  <Text
                    style={[
                      styles.middleButtonText,
                      {color: 'black'},
                      {textAlign: 'center'},
                    ]}>
                    {t('self_pickup_message')}
                  </Text>
                </View>
              )}
            {order &&
              (order.status === 'waiting_merchant_confirm' ||
                !order.status) && (
                <View style={styles.column1}>
                  <Image source={WaitingRestaurantGif} style={styles.gifWrap} />
                  <Text
                    style={[
                      styles.middleButtonText,
                      {color: 'black'},
                      {textAlign: 'center'},
                    ]}>
                    {t('waiting_merchant_confirm')}
                  </Text>
                </View>
              )}
            {order && order.status === 'cancelled_by_platform' && (
              <View style={styles.column1}>
                <Image source={WaitingRestaurantGif} style={styles.gifWrap} />
                <Text
                  style={[
                    styles.middleButtonText,
                    {color: 'black'},
                    {textAlign: 'center'},
                  ]}>
                  {t('cancelled_by_platform')}
                </Text>
              </View>
            )}
            {order && order.status === 'declined_by_merchant' && (
              <View style={styles.column1}>
                <Image source={WaitingRestaurantGif} style={styles.gifWrap} />
                <Text
                  style={[
                    styles.middleButtonText,
                    {color: 'black'},
                    {textAlign: 'center'},
                  ]}>
                  {t('declined_by_merchant')}
                </Text>
              </View>
            )}

            {STATUSButtonGroup && hideButton ? null : <STATUSButtonGroup />}
          </View>
        </View>
      </Modal>
    </>
  );
};

export const TryButton = ({onPress, buttonText, disabled}) => {
  return (
    <TouchableOpacity
      style={styles.middleButton}
      onPress={onPress}
      disabled={disabled}>
      <Text style={styles.middleButtonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

const {height, width} = Dimensions.get('window');
const statusBarHeight = getStatusBarHeight();

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  popUpContainer: {
    backgroundColor: '#FFFFFF',
    borderColor: '#00000029',
    borderWidth: 1,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.025,
    borderRadius: 20,
    justifyContent: 'center',
    // position: 'absolute',
    // top: height * 0.3,
    // left: width * 0.1,
    // right: width * 0.1,
  },
  blur: {
    width: width,
    height: height + statusBarHeight,
    backgroundColor: '#70707090',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleButton: {
    width: width * 0.6,
    backgroundColor: '#468c64',
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: width * 0.02,
    ...Platform.select({
      ios: {
        alignItems: 'center',
        lineHeight: width * 0.12,
        height: width * 0.12,
      },
      android: {
        textAlignVertical: 'center',
        height: width * 0.13,
      },
      default: {
        alignItems: 'center',
        textAlignVertical: 'center',
      },
    }),
  },
  middleButtonText: {
    fontSize: RFValue(14),
    color: 'white',
    fontWeight: 'bold',
  },
  column1: {
    width: width * 0.7,
  },
  gifWrap: {
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: 20,
  },
});

export default OrderStatus;
