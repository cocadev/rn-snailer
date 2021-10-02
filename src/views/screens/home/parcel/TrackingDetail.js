import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  Linking,
  ScrollView,
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';
import {useTranslation} from 'react-i18next';
import {Loader} from '../../component/Loader';
import NavBar, {LeftButton} from '../../component/NavBar';

import enquiry from '../../../../assets/icons/enquiry.png';
import {themes} from 'utils/themeProvider';
import {getParcelByTracking} from '../../../../services/parcel';
import {FlatList} from 'react-native-gesture-handler';
import {formatDate} from '../../../../utils/helper';
import ImageWithFallBack from '../../component/ImageFallBack';
import parcel from '../../../../assets/icons/parcel.png';
import {SNIALER_PARCEL_TEL} from '../../../../../config';
const TrackingDetail = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const [loading, setLoading] = useState(false);
  const [parcelOrder, setParcelOrder] = useState();

  useEffect(() => {
    if (route.params?.trackingNo) {
      handleTrackCourier(route.params?.trackingNo);
    }
  }, [route.params]);

  const handleTrackCourier = async (trackingNo) => {
    try {
      setLoading(true);
      const results = await getParcelByTracking({trackingNo: trackingNo, t});
      if (results) {
        setParcelOrder(results);
      }
    } catch (err) {
      console.log('TrackingDetail -> handleTrackCourier err', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const navigateToParcelOrderDetail = (orderId) => {
    navigation.navigate('ParcelOrderDetail', {
      viewOnly: true,
      order_id: orderId,
    });
  };

  const TrackingItemCard = ({
    order_id,
    waybill,
    sender_name,
    receiver_name,
    status,
    picked_image,
    delivered_image,
    courier_id,
    courier_image,
  }) => {
    return (
      <>
        <View style={styles.titleView}>
          <Text style={[themes.TEXT_TITLE_LIGHTGREY]}>{t('order_id')}</Text>
          <Text style={[themes.TEXT_TITLE_LIGHTGREY]}>{order_id}</Text>
        </View>
        <View style={themes.BACKGROUND_WHITE_WRAP}>
          <View style={styles.row1}>
            <ImageWithFallBack
              type={'parcel_price'}
              style={styles.courierLogo}
              source={`${courier_id}/${courier_image}`}
            />
            <Text style={themes.NORMAL_TEXT_BLACK_BOLD}>
              {t('waybill_no')} {waybill}
            </Text>
          </View>
          <View style={styles.row2}>
            <View style={styles.colContainer}>
              <View style={styles.col1}>
                <View style={[themes.GREEN_BUTTON, styles.frIcon]}>
                  <Text style={themes.EDIT_WHITE_TEXT}>{t('FR')}</Text>
                </View>
                <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.nameText]}>
                  {sender_name}
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
                <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.nameText]}>
                  {receiver_name}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.row3}>
            <TouchableOpacity
              onPress={onCall}
              style={[themes.GREY_BOARDER, styles.placeButton]}>
              <View style={styles.leftButton}>
                <Image source={enquiry} style={styles.iconStyle} />
                <Text style={[themes.EDIT_GREEN_TEXT, styles.buttonText]}>
                  {t('enquiry')}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigateToParcelOrderDetail(order_id)}
              style={[themes.GREY_BOARDER, styles.placeButton]}>
              <View style={styles.rightButton}>
                <Image source={parcel} style={styles.iconStyle} />
                <Text style={[themes.EDIT_GREEN_TEXT, styles.buttonText]}>
                  {t('parcel_detail')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.titleView]}>
          {t('track_info')}
        </Text>
        <TrackingInfo
          order_id={order_id}
          status={status}
          picked_image={picked_image}
          delivered_image={delivered_image}
        />
      </>
    );
  };

  const TrackingInfo = ({order_id, status, picked_image, delivered_image}) => {
    return (
      <ScrollView scrollIndicatorInsets={{right: 1}}>
        <View style={themes.BACKGROUND_WHITE_WRAP}>
          <View style={styles.container}>
            <FlatList
              inverted
              data={status}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => {
                return (
                  <View style={styles.tracksInfo}>
                    <View
                      style={[
                        item == status[status.length - 1]
                          ? themes.GREEN_BUTTON
                          : themes.GREY_BUTTON,
                        styles.dot,
                      ]}
                    />
                    <View style={styles.textView}>
                      <Text
                        style={[
                          item == status[status.length - 1]
                            ? themes.EDIT_GREEN_TEXT
                            : themes.TEXT_TITLE_LIGHTGREY,
                        ]}>
                        {item.status_text}
                      </Text>
                      <Text
                        style={[
                          item == status[status.length - 1]
                            ? themes.EDIT_GREEN_TEXT
                            : themes.TEXT_TITLE_LIGHTGREY,
                          styles.date,
                        ]}>
                        {formatDate({
                          timeStamp: item.update_time,
                          type: 'YYYY-MM-DD hh:mmA',
                        })}
                      </Text>
                      {item.status_text.match('has been picked') &&
                      picked_image ? (
                        <ImageWithFallBack
                          type={'parcel'}
                          style={styles.courierLogo}
                          source={`${order_id}/${picked_image}`}
                        />
                      ) : item.status_text.match('delivered') &&
                        delivered_image ? (
                        <ImageWithFallBack
                          type={'parcel'}
                          style={styles.courierLogo}
                          source={`${order_id}/${delivered_image}`}
                        />
                      ) : null}
                    </View>
                    {item.status_text.match('picked') ||
                    item.status_text.match('delivered') ? (
                      <View
                        style={[
                          item == status[status.length - 1]
                            ? themes.GREEN_BUTTON
                            : themes.GREY_BUTTON,
                          styles.line2,
                        ]}
                      />
                    ) : (
                      <View
                        style={[
                          item == status[status.length - 1]
                            ? themes.GREEN_BUTTON
                            : themes.GREY_BUTTON,
                          styles.line,
                        ]}
                      />
                    )}
                  </View>
                );
              }}
            />
          </View>
        </View>
      </ScrollView>
    );
  };

  const onCall = () => {
    Linking.openURL(`tel:${SNIALER_PARCEL_TEL}`);
  };

  return (
    <>
      <Loader {...{loading}} />
      <NavBar
        title={t('order_track')}
        {...{
          LeftButton,
          handleLeftNavButton,
        }}>
        {parcelOrder && (
          <TrackingItemCard
            order_id={parcelOrder._id}
            waybill={parcelOrder.tracking_no}
            sender_name={parcelOrder.sender.name}
            receiver_name={parcelOrder.receiver.name}
            status={parcelOrder.status_track}
            picked_image={parcelOrder.picked_up_image}
            delivered_image={parcelOrder.delivered_image}
            courier_image={parcelOrder.courier_image}
            courier_id={parcelOrder.courier_id}
          />
        )}
      </NavBar>
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
  },
  row1: {
    alignItems: 'center',
  },
  courierLogo: {
    height: width * 0.15,
    width: width * 0.3,
    marginTop: width * 0.05,
    marginBottom: width * 0.02,
  },
  row2: {
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
  row3: {
    flexDirection: 'row',
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
  iconStyle: {
    width: width * 0.06,
    height: width * 0.06,
    marginHorizontal: width * 0.02,
  },
  buttonText: {
    marginHorizontal: width * 0.02,
  },
  container: {
    marginVertical: height * 0.03,
    marginHorizontal: width * 0.05,
  },
  tracksInfo: {
    flexDirection: 'row',
    marginBottom: height * 0.02,
  },
  dot: {
    width: width * 0.02,
    height: width * 0.02,
    borderRadius: 100,
    marginTop: height * 0.005,
    marginLeft: width * 0.05,
  },
  line: {
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: width * 0.02,
        left: width * 0.0575,
        width: width * 0.002,
        height: height * 0.065,
      },
      android: {
        top: width * 0.02,
        left: width * 0.0585,
        width: width * 0.002,
        height: height * 0.09,
      },
    }),
  },
  line2: {
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: width * 0.02,
        left: width * 0.0575,
        width: width * 0.002,
        height: height * 0.16,
      },
      android: {
        top: width * 0.02,
        left: width * 0.0585,
        width: width * 0.002,
        height: height * 0.195,
      },
    }),
  },
  textView: {
    marginLeft: width * 0.05,
  },
  date: {
    marginTop: height * 0.01,
  },
});

export default TrackingDetail;
