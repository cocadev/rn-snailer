import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';

import {useTranslation} from 'react-i18next';
import {themes} from 'utils/themeProvider';

import WideAdsCard from '../component/home/WideAdsCard';
import AdsCard from '../component/home/AdsCard';
import Article from '../component/popup/Article';

import foodicon from '../../../assets/foodIcon3.png';
import groceryicon from '../../../assets/groceryIcon3.png';
import vehicleicon from '../../../assets/ondemandIcon3.png';
import selfpickup from '../../../assets/parcelIcon3.png';

import {ScrollView} from 'react-native-gesture-handler';

import Carousel, {Pagination} from 'react-native-snap-carousel';
import {
  getOnGoingFoodOrder,
  getOnGoingGoodsOrder,
  getOnGoingMoveOrder,
} from '../../../services/order';
import {getBanner} from '../../../services/banner';
import {getActivityFeed} from '../../../services/activity';
import {getAddress} from '../../../services/address';
import Snackbar from 'react-native-snackbar';
import {CommonActions} from '@react-navigation/native';
import {connect} from 'react-redux';
import {saveAllOrdersToRedux} from '../../../states/redux/ActionCreators/order';

import {AddressContext} from '../../../states/context/address.context';

const HomeInfo = ({navigation, routes, order, _saveAllOrdersToRedux}) => {
  const {address, dispatchAddress} = useContext(AddressContext);
  const [orders, setOrders] = useState([]);
  const [banner, setBanner] = useState([]);
  const [activity, setActivity] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(true);
  const {t, i18n} = useTranslation();

  useEffect(() => {
    const handleGetAddress = async () => {
      const add = await getAddress({t});
      dispatchAddress({type: 'SET_LISTING', payload: add});
    };
    handleGetAddress();
  }, []);

  useEffect(() => {
    const handleGetOngoingOrder = async () => {
      let allOrders = [];
      try {
        const f = await getOnGoingFoodOrder({t});
        const g = await getOnGoingGoodsOrder({t});
        const m = await getOnGoingMoveOrder({t});
        allOrders = [...allOrders, ...f, ...g, ...m];
        setOrders(allOrders);
        _saveAllOrdersToRedux({order: allOrders});
      } catch (err) {
        console.log('HomeInfo -> handleGetOngoingOrder err:', err);
      }
    };

    const handleGetBanner = async () => {
      try {
        const results = await getBanner({type: 'home', t});
        setBanner(results);
      } catch (err) {
        console.log('HomeInfo -> handleGetBanner err:', err);
      }
    };

    const handleGetActivityFeed = async () => {
      try {
        const results = await getActivityFeed({t});

        setActivity(results);
      } catch (err) {
        console.log('HomeInfo -> handleGetActivityFeed err:', err);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      handleGetBanner();
      handleGetActivityFeed();
      handleGetOngoingOrder();
    });

    setTimeout(() => {
      setShowSnackbar(false);
    }, 1000);

    return unsubscribe;
  }, []);

  return (
    <ScrollView>
      <MenuBar {...{navigation, setShowSnackbar}} />
      <Promotion {...{navigation, banner, activity}} />
      {orders.length > 0 &&
        showSnackbar &&
        Snackbar.show({
          text: t('ongoing_order'),
          duration: Snackbar.LENGTH_LONG,
          textColor: '#000',
          backgroundColor: '#EEE',
          action: {
            text: t('view'),
            textColor: '#468c64',
            onPress: () => {
              setShowSnackbar(false);
              navigation.dispatch(
                CommonActions.navigate({
                  name: 'ActivityList',
                }),
              );
            },
          },
        })}
    </ScrollView>
  );
};

const MenuBar = ({navigation, setShowSnackbar}) => {
  const {t, i18n} = useTranslation();

  const navigateToFoodHomePage = () => {
    setShowSnackbar(false);
    navigation.navigate('ChoosePlace', {type: 'food'});
  };
  const navigateToGrocerHomePage = () => {
    setShowSnackbar(false);
    navigation.navigate('ChoosePlace', {type: 'goods'});
  };
  const navigateToMoveScreen = () => {
    setShowSnackbar(false);
    navigation.navigate('MoveScreen');
  };
  const navigateToParcelScreen = () => {
    setShowSnackbar(false);
    navigation.navigate('ParcelScreen');
  };

  return (
    <>
      <View style={{backgroundColor: 'white'}}>
        <View style={styles.menubar}>
          <TouchableOpacity
            style={styles.iconWrap}
            onPress={navigateToMoveScreen}>
            <Image source={vehicleicon} style={styles.imageStyle} />
            <Text style={[styles.textWrap, themes.EDIT_WHITE_TEXT]}>
              {t('runner')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconWrap}
            onPress={navigateToParcelScreen}>
            <Image source={selfpickup} style={styles.imageStyle} />
            <Text style={[styles.textWrap, themes.EDIT_WHITE_TEXT]}>
              {t('parcel')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconWrap}
            onPress={navigateToFoodHomePage}>
            <Image source={foodicon} style={styles.imageStyle} />
            <Text style={[styles.textWrap, themes.EDIT_WHITE_TEXT]}>
              {t('food')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconWrap}
            onPress={navigateToGrocerHomePage}>
            <Image source={groceryicon} style={styles.imageStyle} />
            <Text style={[styles.textWrap, themes.EDIT_WHITE_TEXT]}>
              {t('grocery')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{height: width * 0.005}}></View>
    </>
  );
};

const Promotion = ({navigation, banner, activity}) => {
  const {t, i18n} = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [activeSlide, setActiveSlide] = useState(0);

  const handleAdsCard = (title, description, _id, image) => {
    setTitle(title);
    setDescription(description);
    setImage(_id + '/' + image);
    setModalVisible((prev) => !prev);
  };

  const handleOnPress = (title, url) => {
    if (url) {
      navigation.navigate('Webview', {title, url});
    }
  };

  return (
    <>
      <View style={{backgroundColor: 'white'}}>
        <View style={styles.contentWrap} />
        <Carousel
          data={banner}
          renderItem={({item, index}) => (
            <WideAdsCard
              image={`${item._id}/${item.image}`}
              onPress={() => handleOnPress(item.title, item.landing_url, console.log(item._id))}
            />
          )}
          onSnapToItem={(index) => setActiveSlide(index)}
          windowSize={1}
          sliderWidth={width}
          itemWidth={width}
          autoplay={true}
          autoplayDelay={1000}
          autoplayInterval={10000}
          loop={true}
          loopClonesPerSide={banner.length}
        />
        {/* <View style = {styles.dot}>
          <Pagination
            dotsLength={banner.length}
            activeDotIndex={activeSlide}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 8,
              backgroundColor: '#595959',
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
        </View> */}
        <Text style={styles.midText}>{t('whats_new')}</Text>
        <View style={styles.row}>
          {activity.length > 0 && activity.map((feed, index) => {
            return (
              <AdsCard
                key={index}
                ads
                item_name={feed.title}
                item_description={feed.description}
                item_image={`${feed._id}/${feed.image}`}
                type={'feed'}
                handleAdsCard={() =>
                  handleAdsCard(
                    feed.title,
                    feed.description,
                    feed._id,
                    feed.image,
                    console.log(feed.image)
                  )
                }
              />
            );
          })}
        </View>
        
      </View>

      <Article
        {...{
          title,
          description,
          image,
          navigation,
          modalVisible,
          setModalVisible,
        }}
      />
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  menubar: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: height * 0.007,
    justifyContent: 'space-between',
  },
  iconWrap: {
    marginVertical: height * 0.025,
    marginHorizontal: width * 0.025,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#468c64'
  },
  textWrap: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: height * 0.006,
    width: width * 0.2,
  },
  imageStyle: {
    width: 62,
    height: 62,
  },
  contentWrap: {
    alignContent: 'center',
    marginTop: -10,
  },
  // cardWrap: {
  //   marginHorizontal: width * 0.05,
  //   width: width * 0.5,
  //   borderRadius: 10,
  //   borderWidth: 1,
  //   borderColor: 'white',
  //   resizeMode: 'cover',
  // },
  adsWrap: {
    width: width - width * 0.05,
    height: height * 0.2,
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    marginVertical: width * 0.03,
    overflow: 'hidden',
  },
  dot: {
    marginTop: -60,
  },
  ads: {
    width: width - width * 0.05,
    height: height * 0.2,
    alignSelf: 'center',
    resizeMode: 'cover',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: width,
    flexWrap: 'wrap',
    marginTop: 0,
  },
  bullets: {
    position: 'absolute',
    top: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  bullet: {
    paddingHorizontal: 5,
    fontSize: 20,
  },
  midText: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 15,
  },
});

const mapStateToProps = (state) => {
  return {
    order: state.order,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    _saveAllOrdersToRedux: ({order}) => dispatch(saveAllOrdersToRedux({order})),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeInfo);
