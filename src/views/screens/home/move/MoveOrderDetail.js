import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  Text,
  Linking,
} from 'react-native';
import {RFValue} from 'styles/ResponsiveFont';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';
import Carousel, {Pagination} from 'react-native-snap-carousel';

import Entypo from 'react-native-vector-icons/Entypo';

import NavBar, {LeftButton} from '../../component/NavBar';

import carsedan from '../../../../assets/images/M-car(sedan).png';
import motorcycle from '../../../../assets/images/M-motorcycle.png';
import cash from '../../../../assets/icons/payment-cash.png';
import online from '../../../../assets/icons/payment-onlinebanking.png';
import wallet from '../../../../assets/icons/payment-snailerwallet.png';
import {ScrollView} from 'react-native-gesture-handler';
import {Loader} from '../../component/Loader';
import {getMoveOrderDetails} from '../../../../services/order';
import {NoDataView} from '../../component/NoDataView';
import {formatCurrency, formatCurrencyWithNoCurrency} from '../../../../utils/helper';
import {connect} from 'react-redux';
import ImageWithFallBack from '../../component/ImageFallBack';

const MoveOrderDetail = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const order_id = route.params?.order_id;
  const [order, setOrder] = useState(
    route.params?.viewOrder ? route.params?.viewOrder : null,
  );
  const [loading, setLoading] = useState(false);
  const handleLeftNavButton = () => {
    route.params.origin ? navigation.goBack() : navigation.navigate('HomePage');
  };

  const handleGetOrder = async () => {
    try {
      setLoading(true);
      const results = await getMoveOrderDetails({order_id, t});
      if (results) setOrder(results);
    } catch (err) {
      console.log('MoveOrderDatail -> handleGetOrder err', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (order_id) {
      handleGetOrder();
    }
  }, []);

  // ImageCarousel
  const [activeSlide, setActiveSlide] = useState(0);
  const CarouselImage = [
    {
      type: 'FR',
      image: order && order.move_orders.images[0],
      address: order && order.location.address,
    },
  ];
  if (order) {
    order.move_orders &&
      order.move_orders.destinations &&
      order.move_orders.destinations.map((item, index) => {
        if (index < order.move_orders.destinations.length - 1) {
          CarouselImage.push({
            type: 'SL',
            image: item.image,
            address: item.address,
          });
        } else {
          CarouselImage.push({
            type: 'TO',
            image: item.image,
            address: item.address,
          });
        }
      });
  }

  const handleStatus = (status) => {
    switch (status) {
      case 'waiting_rider_confirm':
        return t('Pending');
      case 'rider_picking_up':
        return t('rider_picking_up');
      case 'delivering':
        return order.current_destination_index >= 0
          ? t('delivered_to_stop') + `${order.current_destination_index + 1}`
          : t('delivering');
      case 'delivered':
        return t('delivered');
      case 'handled_by_admin':
        return t('handled_by_admin_status');
      case 'cancelled_by_platform':
        return t('cancelled_by_platform_status');
      case 'cancelled_by_payment_system':
        return t('cancelled_by_payment_system');
      default:
        return null;
    }
  };

  return (
    <>
      <Loader {...{loading}} />
      <NavBar title={t('move_orders')} {...{LeftButton, handleLeftNavButton}}>
        {order ? (
          <ScrollView scrollIndicatorInsets={{right: 1}}>
            <View style={styles.bottomRow}>
              <Text style={[themes.TEXT_TITLE_LIGHTGREY]}>
                {t('booking_ID')}
              </Text>
              <TouchableOpacity>
                <Text style={[themes.TEXT_TITLE_LIGHTGREY]}>
                  {(order._id || order.order_id).slice(20)}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[themes.BACKGROUND_WHITE_WRAP]}>
              <View style={styles.rowWrap}>
                <View style={styles.column1}>
                  <Image
                    source={
                      order &&
                      order.move_orders &&
                      order.move_orders.type_of_vehicle === 'car'
                        ? carsedan
                        : motorcycle
                    }
                    style={styles.imageSize}
                  />
                </View>
                <View style={styles.column2}>
                  <Text
                    style={[themes.NORMAL_TEXT_BLACK_BOLD]}
                    numberOfLines={1}>
                    {t(
                      order &&
                        order.move_orders &&
                        order.move_orders.type_of_vehicle,
                    )}
                  </Text>
                  <Text
                    style={[themes.TEXT_TITLE_LIGHTGREY, styles.smallText]}
                    numberOfLines={1}>
                    {handleStatus(order.status)}
                    {/* {t('delivered')} • GF-683 */}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{height: height * 0.002}} />

            <View style={[themes.BACKGROUND_WHITE_WRAP, styles.item]}>
              <View style={styles.infoWrapper}>
                <View style={styles.addresscontainer}>
                  <View style={[styles.iconstyle, themes.BUTTON_GREEN]}>
                    <Text style={[styles.icontext, themes.ICON_COLOR_WHITE]}>
                      {t('FR')}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.infoText}>
                      {order && order.location && order.location.address}
                    </Text>
                  </View>
                </View>

                {!!order &&
                  !!order.move_orders &&
                  !!order.move_orders.destinations &&
                  order.move_orders.destinations.length > 1 &&
                  order.move_orders.destinations.map((addr, index) => {
                    if (index < order.move_orders.destinations.length - 1) {
                      return (
                        <View key={index} style={styles.addresscontainer}>
                          <View
                            style={[
                              styles.iconstyle,
                              themes.BUTTON_WHITE,
                              themes.GREEN_BOARDER,
                            ]}>
                            <Text style={[styles.icontext, themes.ICON_COLOR]}>
                              {t('SL')}
                            </Text>
                          </View>
                          <Text style={styles.infoText}>{addr.address}</Text>
                        </View>
                      );
                    }
                  })}

                <View style={styles.addresscontainer}>
                  <View
                    style={[
                      styles.iconstyle,
                      themes.BUTTON_WHITE,
                      themes.GREEN_BOARDER,
                    ]}>
                    <Text style={[styles.icontext, themes.ICON_COLOR]}>
                      {t('TO')}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.infoText}>
                      {
                        order.move_orders.destinations[
                          order.move_orders.destinations.length - 1
                        ].address
                      }
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{height: height * 0.002}} />
            {order.rider_mobile && <RiderDetail item={order} />}

            <View style={styles.titleWrap}>
              <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('order_summary')}
              </Text>
            </View>

            <View style={[themes.BACKGROUND_WHITE_WRAP, styles.tableWrapper]}>
              <View style={styles.table}>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.subColumn1}>
                    <Text
                      style={[
                        themes.NORMAL_TEXT_BLACK_BOLD,
                        styles.subColumnText,
                      ]}>
                      {t('order_name')}
                    </Text>
                  </View>
                  <View style={styles.subColumn2}>
                    <Text
                      style={[
                        themes.NORMAL_TEXT_BLACK_BOLD,
                        styles.subColumnText,
                      ]}>
                      {t('dimension')}
                    </Text>
                  </View>
                  <View style={styles.subColumn3}>
                    <Text
                      style={[
                        themes.NORMAL_TEXT_BLACK_BOLD,
                        styles.subColumnText,
                      ]}>
                      {t('quantity')}
                    </Text>
                  </View>
                </View>
                {!!order &&
                  !!order.move_orders &&
                  order.move_orders.delivery_items.length > 0 &&
                  order.move_orders.delivery_items.map((item, val) => (
                    <ListItem item={item} key={val} />
                  ))}
              </View>
              <View style={styles.bottomColumns2}>
                {!!order.services && order.services.length > 0 && (
                  <>
                    <View
                      style={[styles.serviceheader, themes.BUTTON_BG_GREEN]}>
                      <Text style={styles.servicetext}>
                        {t('additional_services')}{' '}
                      </Text>
                    </View>
                    {order.services.map((service, index) => {
                      return <ListService key={index} item={service} t={t} />;
                    })}
                  </>
                )}
                <View style={styles.totalPriceContainer}>
                  <View style={styles.lasttotalPriceWrapper}>
                    <Text style={styles.priceColumn1}>{t('subtotal')}</Text>
                    <Text style={[styles.priceColumn2, themes.EDIT_GREEN_TEXT]}>
                      {t('RM')}
                    </Text>
                    <Text style={[styles.priceColumn3, themes.EDIT_GREEN_TEXT]}>
                      {formatCurrencyWithNoCurrency(order.amount.base_amount)}
                    </Text>
                  </View>
                </View>
                {order.amount.service_charge != 0 && (
                  <View style={styles.totalPriceContainer}>
                    <View style={styles.lasttotalPriceWrapper}>
                      <Text style={styles.priceColumn1}>
                        {t('additional_services2')}
                      </Text>
                      <Text
                        style={[styles.priceColumn2, themes.EDIT_GREEN_TEXT]}>
                        {t('RM')}
                      </Text>
                      <Text
                        style={[styles.priceColumn3, themes.EDIT_GREEN_TEXT]}>
                        {formatCurrencyWithNoCurrency(
                          order.amount.service_charge,
                        )}
                      </Text>
                    </View>
                  </View>
                )}
                <View style={styles.totalPriceContainer}>
                  <View style={styles.lasttotalPriceWrapper}>
                    <Text style={styles.priceColumn1}>{t('tax_amount')}</Text>
                    <Text style={[styles.priceColumn2, themes.EDIT_GREEN_TEXT]}>
                      {t('RM')}
                    </Text>
                    <Text style={[styles.priceColumn3, themes.EDIT_GREEN_TEXT]}>
                      {formatCurrencyWithNoCurrency(order.amount.tax_amount)}
                    </Text>
                  </View>
                </View>
                {order.amount.discount != 0 && (
                  <View style={styles.totalPriceContainer}>
                    <View style={styles.lasttotalPriceWrapper}>
                      <Text style={styles.priceColumn1}>{t('discount')}</Text>
                      <Text
                        style={[styles.priceColumn2, themes.EDIT_GREEN_TEXT]}>
                        {t('RM')}
                      </Text>
                      <Text
                        style={[styles.priceColumn3, themes.EDIT_GREEN_TEXT]}>
                        {'- ' +
                          formatCurrencyWithNoCurrency(order.amount.discount)}
                      </Text>
                    </View>
                  </View>
                )}
                <View style={styles.totalPriceContainer}>
                  <View style={styles.lasttotalPriceWrapper}>
                    <Text style={styles.priceColumn1}>{t('total')}</Text>
                    <Text style={[styles.priceColumn2, themes.EDIT_GREEN_TEXT]}>
                      {t('RM')}
                    </Text>
                    <Text style={[styles.priceColumn3, themes.EDIT_GREEN_TEXT]}>
                      {formatCurrencyWithNoCurrency(order.amount.total)}
                    </Text>
                  </View>
                </View>
              </View>
              {(order.status == 'delivering' ||
                order.status == 'delivered' ||
                order.status == 'handled_by_admin') && (
                <ImageCarousel
                  CarouselImage={CarouselImage}
                  setActiveSlide={setActiveSlide}
                  activeSlide={activeSlide}
                  order_id={order.order_id}
                />
              )}
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
              <View style={styles.paymentWrap}>
                <>
                  {order.payment_method === 'cash' ? (
                    <>
                      <Image source={cash} style={styles.image} />
                      <Text
                        style={[
                          themes.EDIT_GREEN_TEXT,
                          styles.paymentMethodText,
                        ]}>
                        {t('cash')}
                      </Text>
                    </>
                  ) : order.payment_method === 'wallet' ? (
                    <>
                      <Image source={wallet} style={styles.image} />
                      <Text
                        style={[
                          themes.EDIT_GREEN_TEXT,
                          styles.paymentMethodText,
                        ]}>
                        {t('snailer_wallet')}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Image source={online} style={styles.image} />
                      <Text
                        style={[
                          themes.EDIT_GREEN_TEXT,
                          styles.paymentMethodText,
                        ]}>
                        {t(`${order.payment_method}`)}
                      </Text>
                    </>
                  )}
                </>
              </View>
            </View>
          </ScrollView>
        ) : (
          <NoDataView />
        )}
      </NavBar>
    </>
  );
};

const ListService = ({item, t}) => {
  return (
    <View style={styles.servicecontent}>
      <Text style={styles.bullettext}>
        {'\u2B24'} {''}
      </Text>
      <Text style={styles.servicecontenttext}>{t(`${item}`)}</Text>
    </View>
  );
};

const ListItem = ({item}) => {
  return (
    <>
      <View style={[themes.GREEN_BOARDER_TOP, {flexDirection: 'row'}]}>
        <View style={styles.subColumn1}>
          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.subColumnText]}>
            {item.name}
          </Text>
        </View>
        <View style={styles.subColumn2}>
          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.subColumnText]}>
            {item.dimension.depth / 10} X {item.dimension.width / 10} X{' '}
            {item.dimension.height / 10}
          </Text>
        </View>
        <View style={styles.subColumn3}>
          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.subColumnText]}>
            {item.quantity}
          </Text>
        </View>
      </View>
    </>
  );
};

const RiderDetail = ({item}) => {
  const {t, i18n} = useTranslation();

  const handleRedirect = async () => {
    try {
      await Linking.openURL(`whatsapp://send?&phone=+60${rider_mobile}`);
    } catch (error) {
      if (Platform.OS === 'ios') {
        Linking.openURL(
          'https://apps.apple.com/lb/app/whatsapp-messenger/id310633997',
        );
      } else {
        Linking.openURL(
          'https://play.google.com/store/apps/details?id=com.whatsapp&hl',
        );
      }
    }
  };

  const DetailBar = ({title, content}) => {
    return (
      <View style={styles.detailBar}>
        <Text style={[themes.TEXT_TITLE_GREY, styles.detailTitle]}>
          {title}
        </Text>
        {title === t('rating') ? (
          <View style={{flexDirection: 'row'}}>
            {RenderRating({rating: content})}
          </View>
        ) : (
          <TouchableOpacity onPress={handleRedirect}>
            <Text style={themes.NORMAL_TEXT_BLACK_BOLD}>{content}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={[themes.BACKGROUND_WHITE_WRAP, styles.riderDetailContainer]}>
      <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
        {t('rider_details')}
      </Text>
      <View style={styles.detailRowContainer}>
        <View style={styles.detailRow}>
          <DetailBar
            title={t('rider_name')}
            content={item.rider_first_name + ' ' + item.rider_last_name}
          />
          <DetailBar
            title={t('phone_number')}
            content={`+60${item.rider_mobile}`}
          />
        </View>
      </View>
    </View>
  );
};

const RenderRating = ({rating}) => {
  switch (rating) {
    case 1:
      return (
        <>
          <Entypo name="star" size={15} style={themes.ICON_COLOR_YELLOW} />
          <Entypo name="star" size={15} style={themes.ICON_COLOR_DARKGREY} />
          <Entypo name="star" size={15} style={themes.ICON_COLOR_DARKGREY} />
          <Entypo name="star" size={15} style={themes.ICON_COLOR_DARKGREY} />
          <Entypo name="star" size={15} style={themes.ICON_COLOR_DARKGREY} />
        </>
      );
    case 2:
      return (
        <>
          <Entypo name="star" size={15} style={themes.ICON_COLOR_YELLOW} />
          <Entypo name="star" size={15} style={themes.ICON_COLOR_YELLOW} />
          <Entypo name="star" size={15} style={themes.ICON_COLOR_DARKGREY} />
          <Entypo name="star" size={15} style={themes.ICON_COLOR_DARKGREY} />
          <Entypo name="star" size={15} style={themes.ICON_COLOR_DARKGREY} />
        </>
      );
    case 3:
      return (
        <>
          <Entypo name="star" size={15} style={themes.ICON_COLOR_YELLOW} />
          <Entypo name="star" size={15} style={themes.ICON_COLOR_YELLOW} />
          <Entypo name="star" size={15} style={themes.ICON_COLOR_YELLOW} />
          <Entypo name="star" size={15} style={themes.ICON_COLOR_DARKGREY} />
          <Entypo name="star" size={15} style={themes.ICON_COLOR_DARKGREY} />
        </>
      );
    case 4:
      return (
        <>
          <Entypo name="star" size={15} style={themes.ICON_COLOR_YELLOW} />
          <Entypo name="star" size={15} style={themes.ICON_COLOR_YELLOW} />
          <Entypo name="star" size={15} style={themes.ICON_COLOR_YELLOW} />
          <Entypo name="star" size={15} style={themes.ICON_COLOR_YELLOW} />
          <Entypo name="star" size={15} style={themes.ICON_COLOR_DARKGREY} />
        </>
      );
    case 5:
      return (
        <>
          <Entypo name="star" size={15} style={themes.ICON_COLOR_YELLOW} />
          <Entypo name="star" size={15} style={themes.ICON_COLOR_YELLOW} />
          <Entypo name="star" size={15} style={themes.ICON_COLOR_YELLOW} />
          <Entypo name="star" size={15} style={themes.ICON_COLOR_YELLOW} />
          <Entypo name="star" size={15} style={themes.ICON_COLOR_YELLOW} />
        </>
      );
  }
};

const ImageCarousel = ({
  CarouselImage,
  setActiveSlide,
  activeSlide,
  order_id,
}) => {
  return (
    <>
      <Carousel
        data={CarouselImage}
        renderItem={({item, index}) =>
          item.image ? (
            <ImageContainer
              image={`${order_id}/${item.image}`}
              address={item.address}
              type={item.type}
              order_id={order_id}
            />
          ) : (
            <ImageContainer
              image={item.image}
              address={item.address}
              type={item.type}
              order_id={order_id}
            />
          )
        }
        onSnapToItem={(index) => setActiveSlide(index)}
        windowSize={1}
        sliderWidth={width}
        itemWidth={width}
        autoplay={true}
        autoplayDelay={1000}
        autoplayInterval={6000}
      />
      <Pagination
        dotsLength={CarouselImage.length}
        activeDotIndex={activeSlide}
        //containerStyle={{backgroundColor: 'rgba(0, 0, 0, 0.75)'}}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 5,
          backgroundColor: '#468c64',
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={1}
      />
    </>
  );
};

const ImageContainer = ({image, address, type}) => {
  const {t, i18n} = useTranslation();
  return (
    <View style={[styles.carouselWrapper, themes.SHADOW_DEFAULT]}>
      <View style={styles.imageContainer}>
        <ImageWithFallBack
          type={'move_order'}
          style={styles.carouselImage}
          source={image}
        />
      </View>
      {RenderStopLocation({type: type})}
      <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.labelText]}>
        {address}
      </Text>
    </View>
  );
};

const RenderStopLocation = ({type}) => {
  const {t, i18n} = useTranslation();
  switch (type) {
    case 'FR':
      return (
        <View
          style={[
            styles.contentWrapper,
            themes.GREEN_BUTTON,
            themes.SHADOW_DEFAULT,
          ]}>
          <Text style={themes.EDIT_WHITE_TEXT}>{t('FR')}</Text>
        </View>
      );
    case 'SL':
      return (
        <View
          style={[
            styles.contentWrapper,
            themes.GREEN_BOARDER,
            themes.SHADOW_DEFAULT,
            {backgroundColor: 'white'},
          ]}>
          <Text style={themes.EDIT_GREEN_TEXT}>{t('SL')}</Text>
        </View>
      );
    case 'TO':
      return (
        <View
          style={[
            styles.contentWrapper,
            themes.GREEN_BOARDER,
            themes.SHADOW_DEFAULT,
            {backgroundColor: 'white'},
          ]}>
          <Text style={themes.EDIT_GREEN_TEXT}>{t('TO')}</Text>
        </View>
      );
  }
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  paymentbackgroundWrap: {
    flexDirection: 'row',
    padding: width * 0.04,
    marginTop: height * 0.002,
    marginBottom: height * 0.1,
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
  image: {
    width: 40,
    height: 30,
    alignSelf: 'center',
  },
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
  item: {
    flexDirection: 'row',
    overflow: 'hidden',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  infoWrapper: {
    padding: width * 0.04,
    width: '100%',
    justifyContent: 'center',
    paddingLeft: width * 0.06,
  },
  infoText: {
    fontSize: RFValue(10),
    color: 'black',
    fontWeight: 'bold',
    lineHeight: 20,
    marginLeft: width * 0.03,
  },
  // infoBigTitle: {
  //     fontSize: RFValue(14),
  //     color: 'black',
  //     fontWeight: 'bold',
  // },
  addresscontainer: {
    flexDirection: 'row',
    marginVertical: height * 0.01,
    paddingRight: width * 0.06,
    alignItems: 'center',
  },
  iconstyle: {
    alignSelf: 'flex-start',
    // marginTop: height * 0.009,
    borderRadius: 50,
    height: width * 0.065,
    width: width * 0.065,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: width * 0.005,
  },
  icontext: {
    fontSize: RFValue(8),
    fontWeight: 'bold',
  },
  infosubText: {
    fontSize: RFValue(10),
    color: '#B2B2B2',
    fontWeight: 'bold',
    marginTop: height * 0.005,
    marginLeft: width * 0.03,
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
  tableWrapper: {
    paddingVertical: height * 0.03,
  },
  table: {
    marginHorizontal: width * 0.03,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#468c64',
  },
  subColumnText: {
    fontSize: RFValue(11),
  },
  subColumn1: {
    width: width * 0.34,
    alignItems: 'center',
    paddingVertical: height * 0.008,
  },
  subColumn2: {
    width: width * 0.34,
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#468c64',
    borderRightWidth: 1,
    borderRightColor: '#468c64',
    paddingVertical: height * 0.008,
  },
  subColumn3: {
    width: width * 0.25,
    alignItems: 'center',
    paddingVertical: height * 0.008,
  },
  orderDetailWrap: {
    marginTop: height * 0.045,
    marginHorizontal: width * 0.04,
    // paddingVertical: height * 0.01,
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  title: {
    paddingHorizontal: width * 0.03,
    paddingBottom: height * 0.01,
  },
  bottomRowWrap: {
    flexDirection: 'row',
    marginVertical: height * 0.01,
    marginHorizontal: width * 0.05,
  },
  bottomCol1: {
    width: width * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxWrap: {
    width: width * 0.05,
    height: width * 0.05,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  bottomCol2: {
    width: width * 0.7,
    justifyContent: 'center',
  },
  bottomColumns2: {
    marginTop: width * 0.05,
    marginHorizontal: width * 0.03,
    borderColor: '#468c64',
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  serviceheader: {
    borderBottomColor: '#468c64',
    borderBottomWidth: 1,
    paddingVertical: height * 0.01,
    paddingLeft: width * 0.05,
    marginBottom: height * 0.01,
  },
  servicetext: {
    fontWeight: 'bold',
    color: 'white',
  },
  servicecontent: {
    paddingBottom: height * 0.01,
    paddingLeft: width * 0.05,
    flexDirection: 'row',
    alignItems: 'center',
  },
  servicecontenttext: {
    fontWeight: 'bold',
    color: 'black',
    marginLeft: width * 0.02,
  },
  bullettext: {
    fontSize: RFValue(8),
    fontWeight: 'bold',
    color: '#468c64',
  },
  totalPriceContainer: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    borderTopColor: '#468c64',
    // borderTopWidth: 1,
    paddingVertical: height * 0.01,
  },
  lasttotalPriceWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  priceColumn1: {
    textAlign: 'left',
    fontWeight: 'bold',
    width: '44%',
    paddingLeft: width * 0.1,
  },
  priceColumn2: {
    textAlign: 'center',
    fontWeight: 'bold',
    width: '28%',
  },
  priceColumn3: {
    textAlign: 'right',
    fontWeight: 'bold',
    width: '35%',
    paddingRight: width * 0.08,
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
  promoCodeWrap: {
    flexDirection: 'row',
    padding: width * 0.05,
    marginTop: height * 0.002,
    // marginBottom: height * 0.1,
  },
  riderDetailContainer: {
    paddingHorizontal: width * 0.05,
    paddingVertical: width * 0.05,
    justifyContent: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: width * 0.05,
  },
  detailRowSecond: {
    flexDirection: 'row',
  },
  detailBar: {
    width: width * 0.5,
  },
  detailRowContainer: {
    marginTop: width * 0.05,
  },
  detailTitle: {
    marginBottom: width * 0.02,
  },
  carouselImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    borderRadius: RFValue(30),
  },
  imageContainer: {
    height: width * 0.5,
    width: width * 0.5,
    alignSelf: 'center',
    borderRadius: RFValue(30),
  },
  carouselWrapper: {
    ...Platform.select({
      ios: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: width * 0.04,
        borderRadius: RFValue(30),
      },
      android: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: width * 0.04,
      },
    }),
  },
  labelText: {
    width: width * 0.8,
    marginVertical: width * 0.05,
  },
  iconStyleCarousel: {
    borderRadius: 50,
    height: width * 0.065,
    width: width * 0.065,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: width * 0.005,
  },
  contentWrapper: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: RFValue(500),
    marginTop: width * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = (state) => {
  return {
    order: state.order.latest_order,
  };
};

export default connect(mapStateToProps)(MoveOrderDetail);
