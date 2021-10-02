import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
  Text,
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';
import {SearchBar} from 'react-native-elements';
import {useTranslation} from 'react-i18next';

import NavBar, {LeftButton} from '../component/NavBar';
import AddNoteModal, {ButtonColor} from '../component/popup/AddNoteModal';
import ImageWithFallBack from '../component/ImageFallBack';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native-gesture-handler';
import {formatCurrency} from '../../../utils/helper';

const OrderDetail = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const handleLeftNavButton = () => {
    navigation.goBack();
  };
  const {food, item, type} = route.params;
  const report = true;
  const orders =
    type === 'food'
      ? route.params.item.food_orders
      : route.params.item.goods_orders;

  const navigateToMessageModal = () => {
    setModalVisible((prev) => !prev);
  };
  const [modalVisible, setModalVisible] = useState(false);
  const NotemodalTitle = t('report_this_transaction');
  const NotemodalText = t('please_type_your_comment_here');

  return (
    <>
      <NavBar
        title={
          route.params && route.params.type === 'food'
            ? t('food_orders')
            : t('grocery_orders')
        }
        {...{LeftButton, handleLeftNavButton}}>
        <ScrollView>
          <View style={styles.bottomRow}>
            <Text style={[themes.TEXT_TITLE_LIGHTGREY]}>{t('booking_ID')}</Text>
            <TouchableOpacity>
              <Text style={[themes.TEXT_TITLE_LIGHTGREY]}>
                {item.order_id.slice(20)}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[themes.BACKGROUND_WHITE_WRAP]}>
            <View style={styles.rowWrap}>
              <View style={styles.column1}>
                <ImageWithFallBack
                  type={type === 'food' ? 'food' : 'grocery'}
                  style={styles.imageSize}
                />
              </View>
              <View style={styles.column2}>
                <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]} numberOfLines={1}>
                  {item.branch_name}
                </Text>
                <Text
                  style={[themes.EDIT_ORANGE_TEXT, styles.smallText]}
                  numberOfLines={1}>
                  {t('ongoing')}
                </Text>
              </View>
            </View>
          </View>
          <View style={{height: height * 0.002}} />
          <View style={[themes.BACKGROUND_WHITE_WRAP]}>
            <View style={[styles.rowWrap, styles.subrowWrap]}>
              <View style={styles.iconWrap}>
                <Ionicons
                  name="location-sharp"
                  size={22}
                  style={themes.ICON_COLOR_RED}
                />
              </View>
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]} numberOfLines={1}>
                {item && item.location && item.location.address}
              </Text>
            </View>
          </View>

          <View style={styles.titleWrap}>
            <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
              {t('order_summary')}
            </Text>
          </View>
          {orders &&
            orders.map((item, val) => {
              return (
                <View
                  key={val}
                  style={[themes.BACKGROUND_WHITE_WRAP, styles.backgroundWrap]}>
                  <View style={[themes.GREEN_BOARDER, styles.itemNumWrap]}>
                    <Text style={[styles.textGreen, themes.EDIT_GREEN_TEXT]}>
                      {item.quantity}x
                    </Text>
                  </View>
                  <View style={styles.deliveryInfoWrap}>
                    <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>
                      {type === 'food' ? item.food_name : item.goods_name}
                    </Text>
                    <Text style={[themes.TEXT_TITLE_GREY, styles.normalText]}>
                      {type === 'food'
                        ? item.food_description
                        : item.goods_description}
                    </Text>
                  </View>
                  <View style={styles.price}>
                    <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>
                      {formatCurrency('myr', item.unit_price * item.quantity)}
                    </Text>
                  </View>
                </View>
              );
            })}

          <View style={[themes.BACKGROUND_WHITE_WRAP, styles.backgroundWrap]}>
            <View style={[themes.GREEN_BOARDER, styles.totalWrap]}>
              <View style={[styles.totalrowWrap]}>
                <Text style={[styles.priceColumn1, themes.TEXT_TITLE_GREY]}>
                  {t('subtotal')}
                </Text>
                <Text style={styles.priceColumn2}>{t('RM')}</Text>
                <Text style={styles.priceColumn3}>
                  {formatCurrency('myr', item.amount.base_amount).slice(4)}
                </Text>
              </View>
              <View style={[styles.totalrowWrap]}>
                <Text style={[styles.priceColumn1, themes.TEXT_TITLE_GREY]}>
                  {t('delivery_fees')}
                </Text>
                <Text style={styles.priceColumn2}>{t('RM')}</Text>
                <Text style={styles.priceColumn3}>
                  {formatCurrency('myr', item.amount.rider_fee).slice(4)}
                </Text>
              </View>
              <View style={[themes.GREEN_BOARDER, styles.lasttotalrowWrap]}>
                <Text style={[styles.priceColumn1, themes.TEXT_TITLE_GREY]}>
                  {t('tax_amount')}
                </Text>
                <Text style={styles.priceColumn2}>{t('RM')}</Text>
                <Text style={styles.priceColumn3}>
                  {formatCurrency('myr', item.amount.tax_amount).slice(4)}
                </Text>
              </View>
              <View style={[styles.totalpricerowWrap]}>
                <Text
                  style={[
                    styles.totalpriceColumn,
                    themes.NORMAL_TEXT_BLACK_BOLD,
                  ]}>
                  {t('total')}
                </Text>
                <Text style={[themes.EDIT_GREEN_TEXT, styles.priceColumn2]}>
                  {t('RM')}
                </Text>
                <Text style={[themes.EDIT_GREEN_TEXT, styles.priceColumn3]}>
                  {formatCurrency('myr', item.amount.total).slice(4)}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        {report ? (
          <TouchableOpacity onPress={navigateToMessageModal}>
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
      </NavBar>

      <AddNoteModal
        {...{
          message: NotemodalTitle,
          noteText: NotemodalText,
          modalVisible,
          setModalVisible,
          ButtonColor: ButtonColor({color: 'RED', context: t('report')}),
        }}
      />
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  bottomRow: {
    justifyContent: 'space-between',
    marginHorizontal: width * 0.05,
    marginBottom: height * 0.01,
    marginTop: height * 0.02,
    flexDirection: 'row',
  },
  rowWrap: {
    paddingHorizontal: width * 0.07,
    paddingVertical: height * 0.015,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: width * 0.15,
  },
  subrowWrap: {
    paddingTop: 0,
    paddingBottom: height * 0.015,
    paddingRight: width * 0.15,
  },
  column1: {
    width: width * 0.1,
    alignItems: 'center',
  },
  column2: {
    width: width * 0.7,
    paddingHorizontal: width * 0.035,
    flexDirection: 'column',
  },
  imageSize: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: 250,
  },
  smallText: {
    fontSize: RFValue(11),
    paddingTop: height * 0.005,
  },
  iconWrap: {
    borderRadius: 50,
    width: width * 0.055,
    height: width * 0.055,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: width * 0.02,
  },
  titleWrap: {
    justifyContent: 'space-between',
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
    flexDirection: 'row',
  },
  text: {
    fontSize: RFValue(13),
  },
  textGreen: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    alignContent: 'center',
  },
  backgroundWrap: {
    flexDirection: 'row',
    padding: width * 0.05,
    marginTop: height * 0.002,
  },
  itemNumWrap: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  priceColumn1: {
    textAlign: 'right',
    fontWeight: 'bold',
    width: width * 0.45,
    paddingHorizontal: width * 0.05,
    fontSize: RFValue(13),
  },
  priceColumn2: {
    textAlign: 'center',
    fontWeight: 'bold',
    width: width * 0.1,
  },
  priceColumn3: {
    textAlign: 'right',
    fontWeight: 'bold',
    width: width * 0.35,
    paddingHorizontal: width * 0.1,
  },
  totalpriceColumn: {
    textAlign: 'right',
    fontWeight: 'bold',
    width: width * 0.45,
    paddingHorizontal: width * 0.05,
  },
  totalpricerowWrap: {
    paddingVertical: width * 0.03,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  lasttotalrowWrap: {
    paddingVertical: width * 0.02,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderWidth: 0,
  },
  totalWrap: {
    borderWidth: 1,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    backgroundColor: 'white',
    paddingTop: width * 0.01,
  },
  totalrowWrap: {
    paddingVertical: width * 0.02,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  deliveryInfoWrap: {
    marginLeft: width * 0.03,
    width: width * 0.5,
  },
  normalText: {
    marginTop: height * 0.01,
  },
  price: {
    alignSelf: 'flex-start',
    alignItems: 'flex-end',
    paddingRight: width * 0.05,
    width: width * 0.3,
  },
  button: {
    width: width * 0.7,
    height: width * 0.13,
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: width * 0.03,
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

export default OrderDetail;
