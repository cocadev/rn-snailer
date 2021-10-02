import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Platform,
  Text,
} from 'react-native';

import {RFValue, getStatusBarHeight} from 'styles/ResponsiveFont';

import SubNavBar, {
  LeftButton,
  Title,
  SubTitle,
} from '../../component/SubNavBar';
import DeliveryCard from '../../component/home/DeliveryCard';
import DeliveryStatus from '../../component/home/DeliveryStatus';
import MessageModal, {MiddleButton} from '../../component/popup/MessageModal';
import BottomSheet from 'reanimated-bottom-sheet';
import googlemap from '../../../../assets/images/googlemap.png';
import delivery from '../../../../assets/icons/delivery.png';
import selfpickup from '../../../../assets/icons/selfpickup.png';
import cash from '../../../../assets/icons/payment-cash.png';
import online from '../../../../assets/icons/payment-onlinebanking.png';
import wallet from '../../../../assets/icons/payment-snailerwallet.png';
import Entypo from 'react-native-vector-icons/Entypo';

import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';
import MapView, {Marker} from 'react-native-maps';

import {AddressContext} from '../../../../states/context/address.context';
import {
  formatDate,
  formatCurrencyWithNoCurrency,
} from '../../../../utils/helper';

import {connect} from 'react-redux';

const MapDeliveryScreen = ({
  navigation,
  route,
  long,
  lat,
  status,
  rider_fn,
  rider_ln,
  rider_mobile,
  create_time,
  order,
}) => {
  const {t, i18n} = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const {address, dispatchAddress} = useContext(AddressContext);
  const defaultLat = address.selected_address.address.location.coordinates[1];
  const defaultLong = address.selected_address.address.location.coordinates[0];

  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const handleModalOkButton = () => {
    setModalVisible((prev) => !prev);
    navigation.replace('DeliveredReview', {
      order_id: order.latest_order.order_id || order.latest_order._id,
    });
  };
  const modalMessage = t('order_arrived');
  const modalSubMessage = t('please_collect');

  const sheetRef = React.useRef(null);
  const snapPoints = [
    100,
    Platform.OS === 'ios'
      ? Dimensions.get('window').height - Dimensions.get('window').height * 0.1
      : Dimensions.get('window').height -
        Dimensions.get('window').height * 0.108,
    100,
  ];

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const ButtonGroup = () => {
    return MiddleButton({onPress: handleModalOkButton, buttonText: t('okay')});
  };

  return (
    <>
      <SubNavBar
        {...{
          LeftButton,
          handleLeftNavButton,
          Title: Title({
            textAlign: 'Center',
            title: order.latest_order?.location?.address,
          }),
        }}>
        <View style={{}}>
          {status === 'delivering' ? (
            <MapView
              style={styles.mapStyle}
              initialRegion={{
                latitude: defaultLat,
                longitude: defaultLong,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              region={{
                latitude: lat - 0.01 || defaultLat,
                longitude: long || defaultLong,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}>
              <Marker
                coordinate={{
                  latitude: lat || defaultLat,
                  longitude: long || defaultLong,
                }}>
                <Image
                  style={{width: 45, height: 45}}
                  source={require('../../../../assets/icons/vehicleicon.png')}
                />
              </Marker>
              <Marker
                coordinate={{
                  latitude: defaultLat,
                  longitude: defaultLong,
                }}>
                <Image
                  style={{width: 45, height: 45}}
                  source={require('../../../../assets/icons/home_after.png')}
                />
              </Marker>
            </MapView>
          ) : (
            <View style={styles.centerGif}>
              <Image
                style={styles.centerGifImage}
                source={require('../../../../assets/gif/WaitingRestaurantGif.gif')}
              />
            </View>
          )}
          <View style={styles.cardWrap}>
            <DeliveryStatus {...{setModalVisible}} />
            <DeliveryCard
              rider_name={rider_fn && rider_ln ? `${rider_fn} ${rider_ln}` : ''}
              rider_phone={rider_mobile ? rider_mobile : ''}
              create_time={formatDate({
                timeStamp: create_time,
                type: 'MMM DD, YYYY, h:mm a',
              })}
              rider_car="Honda 1234"
              rider_etatime="7.30PM"
              rider_etamin="13min"
            />
          </View>
        </View>
      </SubNavBar>
      <BottomSheet
        ref={sheetRef}
        enabledBottomInitialAnimation={true}
        snapPoints={snapPoints}
        borderRadius={30}
        renderContent={() => (
          <RenderContent {...{snapPoints, open, order, address}} />
        )}
        onOpenEnd={onOpen}
        onCloseEnd={onClose}
      />
      <MessageModal
        {...{
          message: modalMessage,
          subMessage: modalSubMessage,
          navigation,
          modalVisible,
          setModalVisible,
          ButtonGroup,
        }}
      />
    </>
  );
};

const RenderContent = ({snapPoints, open, order, address}) => {
  const {t, i18n} = useTranslation();

  const baseAmount = order?.latest_order?.amount?.base_amount || 0;
  const deliveryFees = order?.latest_order?.amount?.rider_fee || 0;
  const taxAmount = order?.latest_order?.amount?.tax_amount || 0;
  const discount = order?.lastest_order?.amount?.discount || 0;
  const subTotal = order?.latest_order?.amount?.subtotal || 0;
  const smallOrderFee = order?.latest_order?.amount?.small_order_fee_charge || 0;
  const total = order?.latest_order?.amount?.total || 0;
  const type = order?.latest_order?.item_type;
  const orders =
    type === 'food'
      ? order?.latest_order?.food_orders
      : order?.latest_order?.goods_orders;
  const deliveryMethod = order?.latest_order?.delivery_method || 'rider';
  const paymentMethod = order?.latest_order?.payment_method || 'cash';

  return (
    <>
      {!open ? (
        <Entypo
          name="chevron-thin-up"
          size={50}
          style={[
            styles.bottomSheetStyle,
            themes.ICON_COLOR,
            {alignSelf: 'center'},
          ]}
        />
      ) : (
        <Entypo
          name="chevron-thin-down"
          size={50}
          style={[
            styles.bottomSheetStyle,
            themes.ICON_COLOR,
            {alignSelf: 'center'},
          ]}
        />
      )}
      <View
        style={[
          {
            backgroundColor: 'white',
            paddingHorizontal: 16,
            // CANNOT CHANGE
            paddingBottom:
              Platform.OS === 'ios' ? height * 0.05 : height * 0.05,
          },
          Platform.OS === 'ios' && {height: height - height * 0.1},
        ]}>
        <View style={styles.container2}>
          <View
            style={[
              themes.BACKGROUND_WHITE_WRAP,
              styles.backgroundWrap,
              styles.backgroundWrapBorderBottom,
            ]}>
            <View style={styles.mapWrap}>
              <Image source={googlemap} style={styles.mapSize} />
            </View>
            <View style={styles.addressInforWrap}>
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>
                {order?.latest_order?.location?.address || null}
              </Text>
              {/* <Text style={[themes.TEXT_TITLE_GREY, styles.normalText]}>
                {t('add_floor_unit_number')}
              </Text> */}
              <Text style={[themes.TEXT_TITLE_GREY, styles.normalText]}>
                {/* {order.latest_order.order_remark} */}
              </Text>
            </View>
          </View>
          <View
            style={[
              themes.BACKGROUND_WHITE_WRAP,
              styles.backgroundWrap,
              styles.backgroundWrapBorderBottom,
            ]}>
            <View style={styles.deliveryiconWrap}>
              <Image
                source={deliveryMethod === 'rider' ? delivery : selfpickup}
                style={styles.iconSize}
              />
            </View>
            <View style={styles.deliveryInfoWrap}>
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>
                {deliveryMethod === 'rider' ? t('delivery') : t('self_pickup')}
              </Text>
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.normalText]}>
                {formatDate({
                  timeStamp: order.latest_order.delivery_time,
                  type: 'dddd, MMMM DD YYYY, h:mm a',
                })}
              </Text>
            </View>
          </View>
          <View style={styles.titleWrap}>
            <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
              {t('order_summary')}
            </Text>
          </View>
          <View>
            {orders &&
              orders.length > 0 &&
              orders.map((ele, index) => {
                return (
                  <View key={index}>
                    <View style={{height: height * 0.002}} />
                    <View
                      style={[
                        themes.BACKGROUND_WHITE_WRAP,
                        styles.itemrowWrap,
                      ]}>
                      <View style={[themes.GREEN_BOARDER, styles.itemNumWrap]}>
                        <Text
                          style={[styles.textGreen, themes.EDIT_GREEN_TEXT]}>
                          {ele.quantity} x
                        </Text>
                      </View>
                      <View style={styles.deliveryInfoWrap}>
                        <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>
                          {type === 'food' ? ele.food_name : ele.goods_name}
                        </Text>
                        {type === 'food' ? (
                          ele.variations.map((variation) => {
                            return variation.choices.map((choice, index) => {
                              return (
                                <Text
                                  style={[
                                    themes.TEXT_TITLE_GREY,
                                    styles.normalText,
                                  ]}
                                  key={index}>
                                  {`${variation.choice_title}  -  ${choice.variation_name}`}
                                </Text>
                              );
                            });
                          })
                        ) : (
                          <Text
                            style={[themes.TEXT_TITLE_GREY, styles.normalText]}>
                            {ele.variation_name}
                          </Text>
                        )}
                      </View>
                      <View style={styles.price}>
                        <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>
                          {`${t('RM')} `}
                          {ele.total_price
                            ? formatCurrencyWithNoCurrency(ele.total_price)
                            : formatCurrencyWithNoCurrency(
                                ele.unit_price * ele.quantity,
                              )}
                        </Text>
                      </View>
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
                    {formatCurrencyWithNoCurrency(baseAmount)}
                  </Text>
                </View>
                <View style={[styles.totalrowWrap]}>
                  <Text style={[styles.priceColumn1, themes.TEXT_TITLE_GREY]}>
                    {t('delivery_fees')}
                  </Text>
                  <Text style={styles.priceColumn2}>{t('RM')}</Text>
                  <Text style={styles.priceColumn3}>
                    {formatCurrencyWithNoCurrency(deliveryFees)}
                  </Text>
                </View>
                <View style={[styles.totalrowWrap]}>
                  <Text style={[styles.priceColumn1, themes.TEXT_TITLE_GREY]}>
                    {t('small_order_fee')}
                  </Text>
                  <Text style={styles.priceColumn2}>{t('RM')}</Text>
                  <Text style={styles.priceColumn3}>
                    {formatCurrencyWithNoCurrency(smallOrderFee)}
                  </Text>
                </View>
                {discount != 0 ? (
                  <>
                    <View style={[styles.totalrowWrap]}>
                      <Text
                        style={[styles.priceColumn1, themes.TEXT_TITLE_GREY]}>
                        {t('tax_amount')}
                      </Text>
                      <Text style={styles.priceColumn2}>{t('RM')}</Text>
                      <Text style={styles.priceColumn3}>
                        {formatCurrencyWithNoCurrency(taxAmount)}
                      </Text>
                    </View>
                    <View
                      style={[themes.GREEN_BOARDER, styles.lasttotalrowWrap]}>
                      <Text
                        style={[styles.priceColumn1, themes.TEXT_TITLE_GREY]}>
                        {t('discount')}
                      </Text>
                      <Text style={styles.priceColumn2}>{t('RM')}</Text>
                      <Text style={styles.priceColumn3}>
                        {'- ' + formatCurrencyWithNoCurrency(discount)}
                      </Text>
                    </View>
                  </>
                ) : (
                  <View style={[themes.GREEN_BOARDER, styles.lasttotalrowWrap]}>
                    <Text style={[styles.priceColumn1, themes.TEXT_TITLE_GREY]}>
                      {t('tax_amount')}
                    </Text>
                    <Text style={styles.priceColumn2}>{t('RM')}</Text>
                    <Text style={styles.priceColumn3}>
                      {formatCurrencyWithNoCurrency(taxAmount)}
                    </Text>
                  </View>
                )}
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
                    {formatCurrencyWithNoCurrency(total)}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.titleWrap}>
              <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('payment_details')}
              </Text>
            </View>
            <View
              style={[
                themes.BACKGROUND_WHITE_WRAP,
                styles.paymentbackgroundWrap,
              ]}>
              {paymentMethod === 'cash' && (
                <View style={styles.paymentWrap}>
                  <Image source={cash} style={styles.image} />
                  <Text
                    style={[themes.EDIT_GREEN_TEXT, styles.paymentMethodText]}>
                    {t('cash')}
                  </Text>
                </View>
              )}
              {paymentMethod === 'online' && (
                <View style={styles.paymentWrap}>
                  <Image source={online} style={styles.image} />
                  <Text
                    style={[themes.EDIT_GREEN_TEXT, styles.paymentMethodText]}>
                    {t('online')}
                  </Text>
                </View>
              )}
              {paymentMethod === 'wallet' && (
                <View style={styles.paymentWrap}>
                  <Image source={wallet} style={styles.image} />
                  <Text
                    style={[themes.EDIT_GREEN_TEXT, styles.paymentMethodText]}>
                    {t('snailer_wallet')}
                  </Text>
                </View>
              )}
            </View>

            {/* </ScrollView> */}
          </View>
        </View>
      </View>
    </>
  );
};

const {height, width} = Dimensions.get('window');
const statusBarHeight = getStatusBarHeight();

const styles = StyleSheet.create({
  cardWrap: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? -height + 180 : -height + 150,
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
  },
  centerGif: {
    position: 'absolute',
    left: width / 2 - width * 0.25,
    top: height / 4 - width * 0.25,
    width: width,
    height: height,
  },
  centerGifImage: {
    width: width * 0.5,
    height: width * 0.5,
  },
  bottomSheetStyle: {
    marginHorizontal: Platform.OS === 'ios' ? width * 0.04 : width * 0.02,
    // borderRadius: 10,
    // borderBottomWidth: 5,
  },
  container2: {
    width: width * 0.9,
    marginTop: Platform.OS === 'ios' ? height * 0.01 : height * 0.013,
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
  titleWrap: {
    justifyContent: 'space-between',
    marginHorizontal: width * 0.02,
    marginVertical: height * 0.02,
    // marginBottom: height * 0.03,
    flexDirection: 'row',
  },
  backgroundWrap: {
    flexDirection: 'row',
    paddingVertical: width * 0.03,

    borderRadius: 10,
    //marginTop: height * 0.002,
  },
  backgroundWrapBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#70707090',
  },
  itemrowWrap: {
    flexDirection: 'row',
    paddingBottom: width * 0.05,
    paddingHorizontal: width * 0.02,
    // borderBottomWidth: 1,
    // borderBottomColor: '#70707090',
    borderRadius: 10,
    //marginTop: height * 0.002,
  },
  mapWrap: {
    alignItems: 'center',
    alignItems: 'center',
    width: width * 0.25,
  },
  deliveryiconWrap: {
    alignItems: 'center',
    alignItems: 'center',
    width: width * 0.15,
  },
  mapSize: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: 20,
  },
  iconSize: {
    width: width * 0.1,
    height: width * 0.1,
  },
  addressInforWrap: {
    marginHorizontal: width * 0.02,
    width: width * 0.6,
    justifyContent: 'center',
  },
  deliveryInfoWrap: {
    marginLeft: width * 0.03,
    width: width * 0.5,
  },
  normalText: {
    marginTop: height * 0.01,
  },
  editIcon: {
    alignSelf: 'flex-end',
  },
  changeOptionButton: {
    alignSelf: 'center',
    alignItems: 'flex-end',
    // width: width * 0.3,
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
  price: {
    alignItems: 'flex-end',
    paddingRight: width * 0.05,
    width: width * 0.3,
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
  lasttotalrowWrap: {
    paddingVertical: width * 0.02,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderWidth: 0,
  },
  priceColumn1: {
    textAlign: 'left',
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
  paymentWrap: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentMethodText: {
    marginHorizontal: width * 0.03,
  },
  paymentbackgroundWrap: {
    flexDirection: 'row',
  },
  button: {
    width: width * 0.7,
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
      },
      android: {
        textAlignVertical: 'center',
        marginBottom: width * 0.03,
      },
      default: {
        alignItems: 'center',
        textAlignVertical: 'center',
      },
    }),
  },
  stickyTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.15,
    marginVertical: height * 0.015,
  },
  image: {
    width: 40,
    height: 30,
    alignSelf: 'center',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'black',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'rgb(204, 0, 0)',
    right: 0,
  },
  backTextWhite: {
    color: '#FFF',
  },
});

const mapStateToProps = (state) => {
  return {
    long: state.order.latest_order?.location?.coordinates[0] || 101.675095,
    lat: state.order.latest_order?.location?.coordinates[1] || 3.1186517,
    status: state.order.latest_order.status,
    rider_fn: state.order.latest_order.rider_first_name,
    rider_ln: state.order.latest_order.rider_last_name,
    rider_mobile: state.order.latest_order.rider_mobile,
    create_time: state.order.latest_order.create_time,
    order: state.order,
  };
};

export default connect(mapStateToProps)(MapDeliveryScreen);
