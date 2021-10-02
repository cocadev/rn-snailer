import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';
import {ORDER_STATUS} from '../../../../utils/enum';
const ParcelOrderItem = ({
  onPress,
  status,
  status_description,
  sender,
  receiver,
  update_time,
  order_type,
  order_id,
}) => {
  const {t, i18n} = useTranslation();

  const renderStatus = (status) => {
    if (status === ORDER_STATUS.DELIVERED)
      return (
        <View style={[themes.YELLOW_BACKGROUND, styles.orderStatus]}>
          <Text style={[themes.EDIT_WHITE_TEXT, styles.statusText]}>
            {t('signed')}
          </Text>
        </View>
      );
    else if (status === ORDER_STATUS.HANDLED_BY_ADMIN)
      //PARCEL_STATUS.HANDLED_BY_ADMIN)
      return (
        <View style={[themes.RED_BACKGROUND, styles.orderStatus]}>
          <Text style={[themes.EDIT_WHITE_TEXT, styles.statusText]}>
            {t('pass_team')}
          </Text>
        </View>
      );
    else if (status === ORDER_STATUS.HANDLED_BY_THIRD_PARTY_COURIER_SERVICE)
      return (
        <View style={[themes.YELLOW_BACKGROUND, styles.orderStatus]}>
          <Text style={[themes.EDIT_WHITE_TEXT, styles.statusText]}>
            {t('pass_partner')}
          </Text>
        </View>
      );
    else if (
      status === ORDER_STATUS.CANCELLED_BY_PAYMENT_SYSTEM ||
      status === ORDER_STATUS.CANCELLED_BY_PLATFORM
    )
      return (
        <View style={[themes.RED_BACKGROUND, styles.orderStatus]}>
          <Text style={[themes.EDIT_WHITE_TEXT, styles.statusText]}>
            {t('cancelled')}
          </Text>
        </View>
      );
    return (
      <View style={[themes.GREY_BACKGROUND, styles.orderStatus]}>
        <Text style={[themes.EDIT_WHITE_TEXT, styles.statusText]}>
          {t('on_going')}
        </Text>
      </View>
    );
  };

  return (
    <>
      <TouchableOpacity
        style={[
          themes.SHADOW_DEFAULT,
          themes.BACKGROUND_WHITE_WRAP,
          styles.itemCard,
        ]}
        onPress={onPress}>
        <View style={styles.row1}>
          <View style={styles.orderId}>
            <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]} numberOfLines={1}>
              {order_id}
            </Text>
          </View>
          {renderStatus(status)}
        </View>
        <View style={styles.itemWrap}>
          <View style={styles.row2}>
            <View style={styles.colContainer}>
              <View style={styles.col1}>
                <View style={[themes.GREEN_BUTTON, styles.frIcon]}>
                  <Text style={themes.EDIT_WHITE_TEXT}>{t('FR')}</Text>
                </View>
                <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.colText]}>{t('sender')}</Text>
                <Text style={[themes.TEXT_TITLE_GREY, styles.colText]}>{sender}</Text>
              </View>
            </View>
            <View style={styles.col2}>
              <View style={[themes.GREEN_BUTTON, styles.circle1]} />
              <View style={[themes.GREEN_BUTTON, styles.circle2]} />
              <View style={[themes.GREEN_BUTTON, styles.circle3]} />
            </View>
            <View style={styles.colContainer}>
              <View style={styles.col3}>
                <View style={[themes.GREEN_BUTTON_NAVIGATE, styles.toIcon]}>
                  <Text style={[themes.EDIT_GREEN_TEXT]}>{t('TO')}</Text>
                </View>
                <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.colText]}>
                  {t('receiver')}
                </Text>
                <Text style={[themes.TEXT_TITLE_GREY, styles.colText]}>{receiver}</Text>
              </View>
            </View>
          </View>
          <View style={styles.row3}>
            <View>
              <Text
                style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.textStyle]}
                numberOfLines={2}>
                {status_description}
              </Text>
              <Text
                style={[themes.TEXT_TITLE_LIGHTGREY, styles.textStyle]}
                numberOfLines={1}>
                {t('update_time')} : {update_time}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  itemCard: {
    marginHorizontal: width * 0.05,
    marginTop: height * 0.02,
    borderRadius: 15,
  },
  itemWrap: {
    marginHorizontal: width * 0.05,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row2: {
    flexDirection: 'row',
    marginVertical: height * 0.01,
    justifyContent: 'center',
  },
  row3: {
    marginTop: height * 0.01,
    marginBottom: height * 0.01,
    flexDirection: 'row',
    alignContent: 'center',
  },
  row4: {
    alignSelf: 'flex-end',
  },
  colText: {
    width: 120,
    textAlign: 'center',
  },
  colContainer: {
    width: width * 0.35,
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
    width: width * 0.1,
  },
  col3: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderId: {
    marginTop: height * 0.01,
    marginHorizontal: width * 0.05,
  },
  orderStatus: {
    borderBottomStartRadius: 15,
    borderTopRightRadius: 15,
    padding: 8,
    width: width * 0.29,
  },
  statusText: {
    textAlign: 'center',
  },
  frIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5000,
    borderWidth: 1,
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

  toIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5000,
    borderWidth: 1,
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
  textStyle: {
    fontSize: RFValue(10),
    marginVertical: height * 0.005,
  },
  statusIcon: {
    marginBottom: height * 0.01,
    width: width * 0.25,
    paddingHorizontal: width * 0.03,
    paddingVertical: width * 0.01,
    alignItems: 'center',
  },
});

export default ParcelOrderItem;
