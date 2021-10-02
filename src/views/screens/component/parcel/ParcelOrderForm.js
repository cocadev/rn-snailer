import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  Platform,
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-simple-toast';
import Clipboard from '@react-native-community/clipboard';
import {formatCurrency, formatWeight} from '../../../../utils/helper';

const ParcelOrderForm = ({
  navigateToTrackingDetail,
  title,
  order_id,
  status,
  waybill,
  package_name,
  weight,
  receiver_name,
  receiver_phone,
  receiver_address,
  receiver_state,
  sender_name,
  sender_phone,
  sender_address,
  sender_state,
  total,
  remark,
  update_time,
  delivery,
  qrCode,
  noPrice = false,
}) => {
  const {t, i18n} = useTranslation();

  const handleCopyWaybill = () => {
    Clipboard.setString(waybill);

    Toast.show(t('copied'), Toast.LONG);
  };

  return (
    <>
      {order_id ? (
        <>
          <View style={[themes.BACKGROUND_WHITE_WRAP, styles.topView]}>
            <View style={styles.qrCode}>{qrCode}</View>
          </View>
          <View style={styles.orderId}>
            <Text style={[themes.TEXT_TITLE_LIGHTGREY]}>{t('order_id')}</Text>
            <Text style={[themes.TEXT_TITLE_LIGHTGREY]}>{order_id}</Text>
          </View>
        </>
      ) : null}
      <View style={[themes.BACKGROUND_WHITE_WRAP]}>
        {status ? (
          <>
            <View style={styles.row1}>
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.textStyle]}>
                {t('parcel_delivery')}
              </Text>
              <Text
                style={[
                  themes.EDIT_GREEN_TEXT,
                  {textAlign: 'right', width: width * 0.6},
                ]}>
                {status == 'cancelled_by_platform'
                  ? t('cancelled_parcel')
                  : t(status)}
              </Text>
            </View>
          </>
        ) : null}
        {order_id ? (
          <>
            <View style={styles.row2}>
              <View style={styles.rowContainer}>
                <Text style={themes.NORMAL_TEXT_BLACK_BOLD}>
                  {t('waybill_no')} {waybill}
                </Text>
              </View>
            </View>
            <View style={[styles.row3]}>
              <TouchableOpacity
                style={[themes.GREY_BOARDER, styles.placeButton]}
                onPress={handleCopyWaybill}>
                <View style={styles.leftButton}>
                  <Text style={[themes.EDIT_GREEN_TEXT]}>{t('copy')}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[themes.GREY_BOARDER, styles.placeButton]}
                onPress={navigateToTrackingDetail}>
                <View style={styles.rightButton}>
                  <Text style={[themes.EDIT_GREEN_TEXT]}>{t('track')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        ) : null}

        <View style={styles.row4}>
          <View style={styles.colContainer}>
            <View style={styles.col1}>
              <View style={[themes.GREEN_BUTTON, styles.frIcon]}>
                <Text style={themes.EDIT_WHITE_TEXT}>{t('FR')}</Text>
              </View>
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, , styles.nameText]}>
                {sender_name}
              </Text>
              <Text style={[themes.TEXT_TITLE_GREY, styles.colText]}>
                {sender_state}
              </Text>
            </View>
          </View>
          <View style={styles.col2}>
            <View style={[themes.GREEN_BUTTON, styles.circle1]} />
            <View style={[themes.GREEN_BUTTON, styles.circle2]} />
            <View style={[themes.GREEN_BUTTON, styles.circle3]} />
          </View>
          <View style={styles.colContainer}>
            <View style={styles.col3}>
              <View style={[themes.WHITE_BUTTON, styles.toIcon]}>
                <Text style={themes.EDIT_GREEN_TEXT}>{t('TO')}</Text>
              </View>
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, , styles.nameText]}>
                {receiver_name}
              </Text>
              <Text style={[themes.TEXT_TITLE_GREY, styles.colText]}>
                {receiver_state}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View>
        <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.mainTitle]}>
          {t('order_summary')}
        </Text>
      </View>
      <View style={[themes.BACKGROUND_WHITE_WRAP]}>
        <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.textTitle]}>
          {t('parcel_item')}
        </Text>
        <View
          style={[
            themes.WHITE_BUTTON,
            themes.SHADOW_DEFAULT,
            styles.smallViewInput,
          ]}>
          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.textInput]}>
            {package_name}
          </Text>
        </View>
        <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.textTitle]}>
          {t('weight')}
        </Text>
        <View
          style={[
            themes.WHITE_BUTTON,
            themes.SHADOW_DEFAULT,
            styles.smallViewInput,
          ]}>
          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.textInput]}>
            {formatWeight(weight)}
          </Text>
        </View>
        {title != t('order_detail') || delivery ? (
          <>
            <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.textTitle]}>
              {t('receiver')}
            </Text>
            <View
              style={[
                themes.WHITE_BUTTON,
                themes.SHADOW_DEFAULT,
                styles.bigViewInput,
              ]}>
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.nameInput]}>
                {receiver_name} | {receiver_phone}
              </Text>
              <Text
                style={[themes.TEXT_TITLE_GREY, styles.address]}
                numberOfLines={4}>
                {receiver_address}
              </Text>
            </View>
          </>
        ) : null}
        {title != t('order_detail') && delivery ? null : (
          <>
            <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.textTitle]}>
              {t('sender')}
            </Text>
            <View
              style={[
                themes.WHITE_BUTTON,
                themes.SHADOW_DEFAULT,
                styles.bigViewInput,
              ]}>
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.nameInput]}>
                {sender_name} | {sender_phone}
              </Text>
              <Text
                style={[themes.TEXT_TITLE_GREY, styles.address]}
                numberOfLines={4}>
                {sender_address}
              </Text>
            </View>
          </>
        )}
        {remark ? (
          <>
            <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.textTitle]}>
              {t('remark')}
            </Text>
            <View
              style={[
                themes.WHITE_BUTTON,
                themes.SHADOW_DEFAULT,
                styles.smallViewInput,
              ]}>
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.textInput]}>
                {remark}
              </Text>
            </View>
          </>
        ) : null}
        {!noPrice && (title != t('order_detail') || delivery) ? (
          <View
            style={[
              themes.WHITE_BUTTON,
              themes.SHADOW_DEFAULT,
              styles.orderSummary,
            ]}>
            <View style={styles.costView}>
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>{t('total1')}</Text>
              <Text style={[themes.EDIT_GREEN_TEXT]}>
                {formatCurrency('myr', total)}
              </Text>
            </View>
          </View>
        ) : null}
        <View style={{marginBottom: height * 0.02}}>
          {update_time ? (
            <Text style={[themes.TEXT_TITLE_LIGHTGREY, styles.timeStyle]}>
              {t('update_time')} : {update_time}
            </Text>
          ) : null}
        </View>
      </View>
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  topView: {
    alignItems: 'center',
  },
  headerText: {
    textAlign: 'center',
    fontSize: RFValue(13),
    marginHorizontal: width * 0.1,
    marginVertical: height * 0.03,
  },
  qrCode: {
    height: width * 0.5,
    width: width * 0.5,
    marginVertical: height * 0.04,
  },
  orderId: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
  },
  textStyle: {
    fontSize: RFValue(13),
  },
  row2: {
    borderTopWidth: 0.5,
    borderColor: '#B2B2B2',
  },
  rowContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
  },
  row3: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    borderColor: '#B2B2B2',
  },
  buttonView: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  placeButton: {
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.015,
    borderWidth: 0.3,
  },
  leftButton: {
    width: width * 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightButton: {
    width: width * 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row4: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: height * 0.02,
    marginHorizontal: width * 0.1,
  },
  colText: {
    width: 120,
    textAlign: 'center',
  },
  colContainer: {
    width: width * 0.4,
  },
  col1: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  col2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.15,
  },
  col3: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  frIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5000,
    padding: width * 0.02,
    margin: height * 0.005,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        height: height * 0.05,
        width: height * 0.05,
      },
      android: {
        height: height * 0.07,
        width: height * 0.07,
      },
    }),
  },

  toIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5000,
    borderWidth: 1,
    borderColor: '#468c64',
    padding: width * 0.02,
    margin: height * 0.005,
    ...Platform.select({
      ios: {
        height: height * 0.05,
        width: height * 0.05,
      },
      android: {
        height: height * 0.07,
        width: height * 0.07,
      },
    }),
  },
  nameText: {
    fontSize: RFValue(13),
    width: 120,
    textAlign: 'center',
  },
  circle1: {
    width: width * 0.04,
    height: width * 0.04,
    borderRadius: 100,
  },
  circle2: {
    width: width * 0.03,
    height: width * 0.03,
    borderRadius: 100,
    opacity: 0.8,
    marginLeft: 5,
    marginRight: 5,
  },
  circle3: {
    width: width * 0.02,
    height: width * 0.02,
    borderRadius: 100,
    opacity: 0.5,
  },
  mainTitle: {
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
    fontSize: RFValue(13),
  },
  textTitle: {
    marginHorizontal: width * 0.07,
    marginVertical: height * 0.02,
    fontSize: RFValue(13),
  },
  smallViewInput: {
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 15,
    height: 'auto',
    width: width * 0.9,
    marginHorizontal: width * 0.05,
  },
  bigViewInput: {
    width: width * 0.9,
    alignSelf: 'center',
    borderRadius: 15,
    height: 'auto',
    marginHorizontal: width * 0.05,
  },
  textInput: {
    fontSize: RFValue(12),
    textAlign: 'justify',
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
  },
  nameInput: {
    fontSize: RFValue(13),
    textAlign: 'justify',
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
  },
  address: {
    fontSize: RFValue(12),
    textAlign: 'justify',
    marginHorizontal: width * 0.05,
    marginBottom: width * 0.03,
    paddingRight: width * 0.2,
    lineHeight: 25,
  },
  courierLogo: {
    height: width * 0.13,
    width: width * 0.3,
    marginHorizontal: width * 0.05,
    marginTop: height * 0.02,
  },
  orderSummary: {
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 15,
    height: 'auto',
    width: width * 0.9,
    marginVertical: height * 0.02,
  },
  costView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.05,
    marginVertical: width * 0.02,
  },
  image: {
    alignSelf: 'center',
    height: width * 0.5,
    width: width * 0.5,
    marginVertical: height * 0.02,
  },
  timeStyle: {
    marginHorizontal: width * 0.05,
    marginVertical: width * 0.01,
  },
});

export default ParcelOrderForm;
