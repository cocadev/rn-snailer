import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import NavBar, {LeftButton, RightButton} from '../../component/NavBar';
import {themes} from 'utils/themeProvider';
import ParcelOrderItem from '../../component/parcel/ParcelOrderItem';
import {
  getParcelWithinRange,
  getParcelByTracking,
} from '../../../../services/parcel';
import {Loader} from '../../component/Loader';
import {NoDataView} from '../../component/NoDataView';
import {formatDate} from '../../../../utils/helper';

const ParcelTracking = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState();
  const [trackingNo, setTrackingNo] = useState('');
  const [parcelExistence, setParcelExistence] = useState(true);

  useEffect(() => {
    handleGetOrder();
  }, []);

  const handleGetOrder = async () => {
    setLoading(true);
    try {
      const tempOrder = await getParcelWithinRange({t});
      setOrder(tempOrder);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const handleRightNavButton = () => {
    navigation.navigate('QRCamera');
  };

  const navigateToParcelOrderDetail = (orderId) => {
    navigation.navigate('ParcelOrderDetail', {
      origin: 'ParcelTracking',
      viewOnly: true,
      noPrice: true,
      order_id: orderId,
    });
  };

  const handleCheckExistence = async (value) => {
    if (value != '') {
      var check = false;
      if (value.match(/^SNL[0-9]{18}/)) {
        setTrackingNo(value);

        order.forEach((element) => {
          if (element.tracking_no.match(value)) {
            check = true;
          }
        });

        if (!check)
          try {
            setLoading(true);
            const response = await getParcelByTracking({trackingNo: value, t});
            setOrder([
              {
                ...response,
                _id: response._id,
                tracking_no: response.tracking_no,
                sender_name: response.sender.name,
                receiver_name: response.receiver.name,
                status_text:
                  response.status_track[response.status_track.length - 1]
                    .status_text,
              },
            ]);
            check = true;
          } catch (error) {
            console.log('🚀 ~ handleCheckExistence ~ error', error);
          } finally {
            setLoading(false);
          }
      }
      setParcelExistence(check);
    }
  };

  return (
    <>
      <NavBar
        title={t('track')}
        {...{
          LeftButton,
          handleLeftNavButton,
          RightButton: RightButton({button: 'Scan', handleRightNavButton}),
        }}>
        <Loader {...{loading}} />
        <View style={themes.GREEN_BACKGROUND}>
          <View style={[themes.BACKGROUND_WHITE_WRAP, styles.searchBar]}>
            <View>
              <Ionicons
                name="search"
                size={24}
                color="#b2b2b2"
                style={styles.searchIcon}
              />
            </View>
            <View>
              <TextInput
                placeholderTextColor="#C0C0C0"
                style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.inputStyle]}
                autoCorrect={false}
                placeholder={t('tracking_placeholder')}
                onChangeText={(text) => {
                  handleCheckExistence(text);
                }}
                onEndEditing={(event) => {
                  handleCheckExistence(event.nativeEvent.text);
                }}
              />
            </View>
          </View>
        </View>
        <View>
          {parcelExistence ? (
            order.length == 0 ? (
              <NoDataView />
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{height: height}}>
                {order.map((item, i) => {
                  return (
                    (trackingNo == '' ||
                      order[i].tracking_no.match(trackingNo)) && (
                      <ParcelOrderItem
                        key={item.tracking_no}
                        order_id={item.tracking_no}
                        onPress={() => navigateToParcelOrderDetail(item._id)}
                        status={item.status}
                        status_description={item.status_text}
                        sender={item.sender_name}
                        receiver={item.receiver_name}
                        update_time={formatDate({
                          timeStamp: item.update_time,
                          type: 'DD/MM/YY HH:mm',
                        })}
                        order_type={t('delivery')}
                      />
                    )
                  );
                })}
                <View style={{height: height * 0.3}} />
              </ScrollView>
            )
          ) : (
            <NoDataView
              title={t('check_tracking')}
              subTitle={t('no_parcel_match')}
            />
          )}
        </View>
      </NavBar>
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  searchBar: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginHorizontal: width * 0.05,
    borderRadius: 15,
    marginTop: height * 0.015,
    marginBottom: height * 0.03,
    height: height * 0.07,
    width: width * 0.9,
  },
  searchIcon: {
    marginHorizontal: width * 0.03,
  },
  inputStyle: {
    width: width * 0.7,
  },
});

export default ParcelTracking;
