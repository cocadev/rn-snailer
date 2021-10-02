import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Platform,
  Dimensions,
  FlatList,
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import Carousel, {Pagination} from 'react-native-snap-carousel';

import WideAdsCard from '../../../screens/component/home/WideAdsCard';

import NavBar, {LeftButton, RightButton} from '../../component/NavBar';
import ParcelOrderItem from '../../component/parcel/ParcelOrderItem';

import delivery from '../../../../assets/icons/deliveryicon.png';
import dropoff from '../../../../assets/icons/dropoff.png';

import {themes} from 'utils/themeProvider';
import {getParcelWithinRange} from '../../../../services/parcel';
import {getBanner} from '../../../../services/banner';
import {NoDataView} from '../../component/NoDataView';
import {formatDate} from '../../../../utils/helper';

const ParcelScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [order, setOrder] = useState([]);
  const [banner, setBanner] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const ref_tracking_blur = useRef();
  const trackingCanNavigate = useRef(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      handleGetOrder();
    });
    handleGetBanner();

    return unsubscribe;
  }, []);

  const handleGetOrder = async () => {
    try {
      const tempOrder = await getParcelWithinRange({t});

      setOrder(tempOrder);
    } catch {}
  };
  const handleGetBanner = async () => {
    try {
      const results = await getBanner({type: 'parcel', t});
      setBanner(results);
    } catch (err) {
      console.log('HomeInfo -> handleGetBanner err:', err);
    }
  };

  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const handleRightNavButton = () => {
    navigation.navigate('ParcelOrderHistoryList');
  };

  const navigateToParcelDelivery = () => {
    navigation.navigate('ParcelDelivery');
  };

  const navigateToParcelDropoff = () => {
    navigation.navigate('ParcelDropoff');
  };

  const navigateToParcelTracking = () => {
    navigation.navigate('ParcelTracking');
  };

  const navigateToParcelOrderDetail = (orderId) => {
    navigation.navigate('ParcelOrderDetail', {
      origin: 'ParcelScreen',
      viewOnly: true,
      order_id: orderId,
    });
  };
  const [type, setType] = useState([{type: t('Ads')}, {type: t('Ads')}]);
  const handleOnPress = (title, url) => {
    if (url) {
      navigation.navigate('Webview', {title, url});
    }
  };

  return (
    <>
      <NavBar
        title={t('parcel')}
        {...{
          LeftButton,
          handleLeftNavButton,
          RightButton: RightButton({button: 'History', handleRightNavButton}),
        }}>
        <View>
          <TouchableOpacity
            style={[
              themes.BACKGROUND_WHITE_WRAP,
              themes.SHADOW_DEFAULT,
              styles.searchBar,
            ]}
            onPress={navigateToParcelTracking}>
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
                style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.inputStyle]}
                autoCorrect={false}
                autoFocus={false}
                keyboardHandlingEnabled={false}
                numberOfLines={1}
                ref={ref_tracking_blur}
                onFocus={() => {
                  ref_tracking_blur.current.blur();
                  if (trackingCanNavigate.current === true) {
                    navigateToParcelTracking();
                    trackingCanNavigate.current = false;
                  } else {
                    trackingCanNavigate.current = true;
                  }
                }}
                placeholder={t('tracking_placeholder')}
                placeholderTextColor="#C0C0C0"
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              themes.GREEN_BOARDER,
              themes.GREEN_BUTTON,
              themes.SHADOW_DEFAULT,
              styles.placeButton,
            ]}
            onPress={navigateToParcelDelivery}>
            <View style={styles.buttonContainer}>
              <Image source={delivery} style={styles.iconStyle} />
              <Text style={[themes.EDIT_WHITE_TEXT, styles.buttonText]}>
                {t('delivery')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              themes.GREEN_BOARDER,
              themes.GREEN_BUTTON,
              themes.SHADOW_DEFAULT,
              styles.placeButton,
            ]}
            onPress={navigateToParcelDropoff}>
            <View style={styles.buttonContainer}>
              <Image source={dropoff} style={styles.iconStyle} />
              <Text style={[themes.EDIT_WHITE_TEXT, styles.buttonText]}>
                {t('drop_off')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={[themes.SHADOW_DEFAULT]}>
          <Carousel
            data={banner}
            renderItem={({item, index}) => (
              <WideAdsCard
                key={item._id}
                image={`${item._id}/${item.image}`}
                onPress={() => handleOnPress(item.title, item.landing_url)}
              />
            )}
            onSnapToItem={(index) => setActiveSlide(index)}
            windowSize={1}
            sliderWidth={width}
            itemWidth={width}
            autoplay={true}
            autoplayDelay={1000}
            autoplayInterval={6000}
          />
        </View>
        <Pagination
          dotsLength={banner.length}
          activeDotIndex={activeSlide}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: '#468c64',
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={1}
        />
        <View style={styles.titleWrap}>
          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.titleText]}>
            {t('recent_parcel')}
          </Text>
        </View>
        {order.length == 0 && <NoDataView />}
        {order.length > 0 && (
          <ScrollView showsVerticalScrollIndicator={false}>
            {order.map((item, i) => {
              return i >= 10 ? null : (
                <ParcelOrderItem
                  key={i}
                  onPress={() => navigateToParcelOrderDetail(item._id)}
                  order_id={item.tracking_no}
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
              );
            })}
            <View style={{height: height * 0.05}} />
          </ScrollView>
        )}
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
    borderRadius: 15,
    marginHorizontal: width * 0.05,
    marginTop: height * 0.015,
    marginBottom: height * 0.01,
    height: height * 0.07,
    width: width * 0.9,
  },
  searchIcon: {
    marginHorizontal: width * 0.03,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  placeButton: {
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'space-around',
    marginHorizontal: width * 0.01,
    flexDirection: 'row',
    borderRadius: 15,
    fontWeight: 'bold',
    ...Platform.select({
      ios: {
        lineHeight: width * 0.06,
        marginTop: height * 0.005,
        marginBottom: height * 0.01,
        height: height * 0.07,
        width: width * 0.42,
      },
      android: {
        marginTop: height * 0.006,
        marginBottom: height * 0.01,
        height: height * 0.09,
        width: width * 0.42,
      },
      default: {
        alignItems: 'center',
        textAlignVertical: 'center',
      },
    }),
  },
  buttonText: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: RFValue(14),
    marginHorizontal: width * 0.01,
  },
  iconStyle: {
    alignSelf: 'center',
    width: width * 0.065,
    height: width * 0.065,
    marginHorizontal: width * 0.01,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  titleWrap: {
    marginHorizontal: width * 0.05,
    paddingBottom: height * 0.01,
  },
  titleText: {
    fontSize: RFValue(14),
  },
  inputStyle: {
    width: width * 0.7,
  },
});

export default ParcelScreen;
