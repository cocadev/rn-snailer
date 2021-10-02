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
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';
import {useTranslation} from 'react-i18next';
import {themes} from 'utils/themeProvider';
import Feather from 'react-native-vector-icons/Feather';

import NavBar, {LeftButton} from '../component/NavBar';
import {Loader} from '../component/Loader';
import SnailerWallet from '../../../assets/images/logo.png';
import {
  formatCurrency,
  formatDate,
  formatCurrencyWithNoCurrency,
} from '../../../utils/helper';
import {getSpecificOrder} from '../../../services/order';

const PaymentDetail = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const [detail, setDetail] = useState(route.params?.item);
  const [loading, setLoading] = useState(false);

  const handleLeftNavButton = () => {
    navigation.goBack();
  };
  const renderType = (payment_action) => {
    let text;
    switch (payment_action) {
      case 'snailer_service_refund':
        text = t('refund');
        break;
      case 'snailer_service_payment':
        text = t('payment');
        break;
      case 'snailer_service_top_up':
        text = t('top_up');
        break;
    }
    return text;
  };

  const renderStatus = (status) => {
    let text;
    switch (status) {
      case 'waiting_gateway_confirm':
        text = t('waiting_payment_confirm');
        break;
      case 'top_up_confirmed':
        text = t('top_up_successful');
        break;
      case 'cancelled_by_payment_system':
        text = t('top_up_cancelled');
        break;
    }
    return text;
  };

  const navigateToOrderDetails = async (order_id) => {
    setLoading(true);
    const results = await handleGetOrder(order_id);
    if (results) {
      results.item_type === 'parcel'
        ? navigation.navigate('ParcelOrderDetail', {
            origin: 'PaymentDetail',
            viewOnly: true,
            order_id: results._id,
          })
        : results.item_type === 'move'
        ? navigation.navigate('MoveOrderDetail', {
            origin: 'PaymentDetail',
            viewOnly: true,
            order_id: results._id,
          })
        : navigation.navigate('ProductDetail', {
            origin: 'PaymentDetail',
            viewOnly: true,
            viewOrder: results,
          });
    }
  };

  const handleGetOrder = async (order_id) => {
    try {
      const results = await getSpecificOrder({order_id, t});

      return results;
    } catch (err) {
      console.log('PaymentHistory -> handleGetOrder err', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar
        title={t('transaction_detail')}
        {...{LeftButton, handleLeftNavButton}}>
        <Loader {...{loading}} />
        <View style={styles.secondContainer}>
          <View style={[themes.BACKGROUND_WHITE_WRAP, styles.detailWrap]}>
            <View style={styles.column1}>
              <Text style={themes.TEXT_TITLE_GREY}>{t('amount')}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.subColumn}>
                <Text style={themes.TEXT_TITLE_GREY}>{t('RM')}</Text>
              </View>
              <View style={styles.column2}>
                <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.priceText]}>
                  {formatCurrencyWithNoCurrency(detail?.amount)}
                </Text>
              </View>
            </View>
          </View>
          <View style={[themes.BACKGROUND_WHITE_WRAP, styles.subdetailWrap]}>
            <View style={styles.column1}>
              <Text style={themes.TEXT_TITLE_GREY}>{t('type')}</Text>
            </View>
            <View style={styles.timeColumn}>
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>
                {renderType(detail?.payment_action)}
              </Text>
            </View>
          </View>
          {detail?.status && (
            <View style={[themes.BACKGROUND_WHITE_WRAP, styles.subdetailWrap]}>
              <View style={styles.column1}>
                <Text style={themes.TEXT_TITLE_GREY}>{t('status')}</Text>
              </View>
              <View style={styles.timeColumn}>
                <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>
                  {renderStatus(detail?.status)}
                </Text>
              </View>
            </View>
          )}
          <View style={[themes.BACKGROUND_WHITE_WRAP, styles.subdetailWrap]}>
            <View style={styles.column1}>
              <Text style={themes.TEXT_TITLE_GREY}>{t('date_and_time')}</Text>
            </View>
            <View style={styles.timeColumn}>
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>
                {detail?.create_time &&
                  formatDate({
                    timeStamp: detail.create_time,
                    type: 'DD MMM YYYY, h:mm a',
                  })}
              </Text>
            </View>
          </View>
          <View
            style={[
              themes.BACKGROUND_WHITE_WRAP,
              styles.transactiondetailWrap,
            ]}>
            <Text style={themes.TEXT_TITLE_GREY}>{t('transaction_id')}</Text>
            <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.text]}>
              {detail?._id.slice(20)}
            </Text>
          </View>
          {detail?.payment_action !== 'snailer_service_top_up' && (
            <TouchableOpacity
              onPress={() => navigateToOrderDetails(detail.order_id)}
              style={[
                themes.BACKGROUND_WHITE_WRAP,
                styles.transactiondetailWrap,
                {flexDirection: 'row'},
                {justifyContent: 'space-between'},
              ]}>
              <View>
                <Text style={themes.TEXT_TITLE_GREY}>{t('order_id')}</Text>
                <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.text]}>
                  {detail?.order_id.slice(20)}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[themes.TEXT_TITLE_GREY]}>
                  {t('view_order_details')}
                </Text>
                <Feather
                  name="chevron-right"
                  size={25}
                  style={[styles.right, themes.TEXT_TITLE_GREY]}
                />
              </View>
            </TouchableOpacity>
          )}
          {/* <View
            style={[
              themes.BACKGROUND_WHITE_WRAP,
              styles.transactiondetailWrap,
            ]}>
            <Text style={themes.TEXT_TITLE_GREY}>{t('merchant_id')}</Text>
            <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.text]}>
              SNAILER1213412346
            </Text>
          </View> */}
        </View>
        {/* <View style={{flex: 1, justifyContent: 'flex-end'}}>
          {report ? (
            <TouchableOpacity onPress={handleLeftNavButton}>
              <Text style={[themes.RED_BUTTON, styles.button]}>
                {t('report')}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              <Text style={[themes.GREY_BUTTON, styles.button]}>
                {t('report')}
              </Text>
            </TouchableOpacity>
          )}
        </View> */}
      </NavBar>
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  bottomRow: {
    justifyContent: 'space-between',
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
    flexDirection: 'row',
  },
  detailWrap: {
    flexDirection: 'row',
    paddingHorizontal: width * 0.06,
    paddingVertical: Platform.OS === 'ios' ? height * 0.025 : height * 0.035,
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'ios' ? height * 0.002 : height * 0.003,
  },
  subdetailWrap: {
    flexDirection: 'row',
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.025,
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'ios' ? height * 0.002 : height * 0.003,
    alignItems: 'center',
  },
  transactiondetailWrap: {
    flexDirection: 'column',
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.025,
    marginTop: Platform.OS === 'ios' ? height * 0.002 : height * 0.003,
  },
  column1: {
    width: width * 0.4,
  },
  column2: {
    width: width * 0.25,
    alignItems: 'flex-end',
    alignSelf: 'center',
  },
  timeColumn: {
    width: width * 0.5,
    alignItems: 'flex-end',
    alignSelf: 'center',
  },
  subColumn: {
    width: width * 0.06,
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: RFValue(23),
    fontWeight: 'bold',
  },
  iconSize: {
    width: width * 0.08,
    height: width * 0.08,
  },
  text: {
    paddingTop: height * 0.005,
  },
  button: {
    width: width * 0.7,
    height: width * 0.13,
    alignSelf: 'center',
    textAlign: 'center',
    // marginTop: Platform.OS === 'ios' ? height * 0.245 : height * 0.1,
    marginBottom: height * 0.03,
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
        marginVertical: width * 0.05,
      },
      android: {
        textAlignVertical: 'center',
        marginVertical: width * 0.03,
      },
      default: {
        alignItems: 'center',
        textAlignVertical: 'center',
        marginVertical: width * 0.03,
      },
    }),
  },
});

export default PaymentDetail;
