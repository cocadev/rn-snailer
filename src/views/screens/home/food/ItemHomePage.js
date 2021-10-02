import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  View, Dimensions,
  TouchableOpacity,
  Text, FlatList,
  Image, ScrollView
} from 'react-native';
import {RFValue} from 'styles/ResponsiveFont';
import SubNavBar, { LeftButton, RightButton, SubTitle, Title } from '../../component/SubNavBar';
import MerchantCard from '../../component/home/AdsCard';
import WideAdsCard from '../../component/home/WideAdsCard';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Feather from 'react-native-vector-icons/Feather';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';

//Context api
import {AddressContext} from 'states/context/address.context';
import {BasketContext} from 'states/context/basket.context';
import {BranchContext} from 'states/context/branch.context';

//Current location libs
import RNLocation from 'react-native-location';

//services
import {postNearbyRestaurants, postNearbyStore} from 'services/branch';
import {postFoodCategory, postGoodCategoty} from '../../../../services/branch';
import {getBanner} from '../../../../services/banner';
import {NoDataView} from '../../component/NoDataView';

import beverage from '../../../../assets/category/food/beverage.png';
import dessert from '../../../../assets/category/food/dessert.png';
import fastfood from '../../../../assets/category/food/fastfood.png';
import halal from '../../../../assets/category/food/halal.png';
import local from '../../../../assets/category/food/local.png';
import near from '../../../../assets/category/food/near.png';
import noodle from '../../../../assets/category/food/noodle.png';
import rice from '../../../../assets/category/food/rice.png';
import cake from '../../../../assets/category/mart/cake.png';
import electronic from '../../../../assets/category/mart/electronic.png';
import fashion from '../../../../assets/category/mart/fashion.png';
import flower from '../../../../assets/category/mart/flower.png';
import frozen from '../../../../assets/category/mart/frozen.png';
import hardware from '../../../../assets/category/mart/hardware.png';
import minimart from '../../../../assets/category/mart/minimart.png';
import phamacies from '../../../../assets/category/mart/phamacies.png';

RNLocation.configure({
  distanceFilter: 5.0,
});

const ItemHomePage = ({navigation, route}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const {basket} = useContext(BasketContext);
  const {address, dispatchAddress} = useContext(AddressContext);
  const {branch, dispatchBranch} = useContext(BranchContext);
  const [currentLocation, setCurrentLocation] = useState(
    address.selected_address._id !== '' ? 
      address.selected_address.address : 
      address.addresses?.[0].address,
  );
  const [banner, setBanner] = useState([]);
  const [skip, setSkip] = useState(0);
  const [noMoreData, setNoMoreData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const {type} = route.params;
  const [textTitle, setTextTitle] = useState('');
  const [defaultModal, setDefaultModal] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [categoryID, setCategoryID] = useState('');
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleLeftNavButton = () => {
    navigation.goBack();
  };
  const handleAdsCard = (item) => {
    dispatchBranch({type: 'SET_SELECTED_BRANCH', payload: item});
    navigation.navigate('BranchDetail', {type: type});
  };
  const handleHistoryButton = () => {
    navigation.navigate('Order', {food: true, type: type});
  };
  const handleChangeLocation = () => {
    navigation.navigate('ChoosePlace', {savedplace: false});
  };
  const {t, i18n} = useTranslation();

  const handleGetNearbyRestaurants = async () => {
    try {
      setRefreshing(true);
      const nearbyRestaurants = await postNearbyRestaurants({
        latitude: currentLocation.location.coordinates[1],
        longitude: currentLocation.location.coordinates[0],
        skip: 0,
        t,
      });

      if (nearbyRestaurants.length < 10) {
        setNoMoreData(true);
      }
      setSkip(10);
      dispatchBranch({type: 'SET_BRANCH', payload: nearbyRestaurants});
    } catch (e) {
      console.log('handleGetNearbyRestaurants -> e', e);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLoadMoreNearbyRestaurants = async () => {
    if (!noMoreData && branch.nearbyBranch.length >= 10) {
      try {
        const nearbyRestaurants = await postNearbyRestaurants({
          latitude: currentLocation.location.coordinates[1],
          longitude: currentLocation.location.coordinates[0],
          skip,
          t,
        });

        if (nearbyRestaurants.length < 10) {
          setNoMoreData(true);
        }
        setSkip((prev) => prev + 10);
        dispatchBranch({
          type: 'SET_BRANCH_PAGINATION',
          payload: nearbyRestaurants,
        });
      } catch (e) {
        console.log('handleLoadMoreNearbyRestaurants -> e', e);
      }
    }
  };

  const handleGetNearbyStores = async () => {
    try {
      const nearbyStores = await postNearbyStore({
        latitude: currentLocation.location.coordinates[1],
        longitude: currentLocation.location.coordinates[0],
        skip: 0,
        t,
      });

      if (nearbyStores.length < 10) {
        setNoMoreData(true);
      }
      setSkip(10);
      dispatchBranch({type: 'SET_BRANCH', payload: nearbyStores});
    } catch (e) {
      console.log('handleGetNearbyStores -> e', e);
    }
  };

  const handleLoadMoreNearbyStores = async () => {
    if (!noMoreData && branch.nearbyBranch.length >= 10) {
      try {
        const nearbyStores = await postNearbyStore({
          latitude: currentLocation.location.coordinates[1],
          longitude: currentLocation.location.coordinates[0],
          skip,
          t,
        });

        if (nearbyStores.length < 10) {
          setNoMoreData(true);
        }
        setSkip((prev) => prev + 10);
        dispatchBranch({type: 'SET_BRANCH_PAGINATION', payload: nearbyStores});
      } catch (e) {
        console.log('handleLoadMoreNearbyStores -> e', e);
      }
    }
  };

  const onCategoryClick = (categoryID) => {
    setSelectedCategory(categoryID);
  }





  const handleRefresh = () => {
    setSkip(0);
    setNoMoreData(false);
    if (type === 'food') {
      handleGetNearbyRestaurants();
    } else {
      handleGetNearbyStores();
    }
  };

  const fetchAllBranches = (params) => {
    return {
      categoryID: params.categoryID
    }
  }

  useEffect(() => {
    const handleGetBanner = async () => {
      try {
        const results = await getBanner({type, t});

        setBanner(results);
      } catch (err) {
        console.log('ItemHomePage -> handleGetBanner err', err);
      }
    };

    if (type === 'food') {
      handleGetNearbyRestaurants();
    } else {
      handleGetNearbyStores();
    }
    handleGetBanner();
  }, []);

  fetchAllBranches({
    categoryID: selectedCategory
  }), [selectedCategory]

  const handleOnPress = (title, url) => {
    if (url) {
      navigation.navigate('Webview', {title, url});
    }
  };

  return (
    <SubNavBar
      {...{
        LeftButton,
        handleLeftNavButton,
        SubTitle: SubTitle({
          icon: 'Location',
          subTitle: currentLocation.full_address,
        }),
        Title: Title({textAlign: 'Left', title: t('deliver_to')}),
        RightButton: RightButton({button: 'History', handleHistoryButton}),
        handleChangeLocation,
      }}>
      
          
        {/* All Restaurant */}
        <ScrollView>
          {defaultModal ? (
            <View>
              <View style={styles.contentWrap}>
                <Carousel data={banner} renderItem={({item, index}) => (
                  <WideAdsCard
                    image={`${item._id}/${item.image}`}
                    onPress={() => handleOnPress(item.title, item.landing_url)}
                  />
                )}
              onSnapToItem={(index) => setActiveSlide(index)}
              windowSize={1}
              sliderWidth={width}
              itemWidth={width}
              autoplay={true}
              autoplayDelay={3000}
              autoplayInterval={6000}
              loop={true}
              />
            </View>
              <Text style={styles.Text}>{t('restaurants')}</Text>
              <View style={{height: 8}}></View>
              <View style={styles.row}>
                {branch && branch.nearbyBranch.length > 0 ? (
                  <FlatList
                    data={branch.nearbyBranch.sort((a, b) => b.is_open - a.is_open)}
                    numColumns={2}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    onEndReached={
                      type === 'food'
                        ? handleLoadMoreNearbyRestaurants
                        : handleLoadMoreNearbyStores
                    }
                    keyExtractor={(item) => item.branch_id}
                    onEndReachedThreshold={0.3}
                    renderItem={({item, index}) => {
                      return (
                        <MerchantCard
                          key={index}
                          type={'store'}
                          item_name={item.branch_name}
                          item_image={item.store_id + '/' + item.image}
                          rating={item.rating ? item.rating : null}
                          distance={item.distance ? item.distance : null}
                          rider_fee={item.rider_fee ? item.rider_fee : null}
                          item={item}
                          is_open={item.is_open}
                          display_info={true}
                          handleAdsCard={() => {
                            handleAdsCard(item);
                          }}
                        />
                      );
                    }}
                  />
                ) : (
                  <NoDataView />
                )}
              </View>
            </View>
          ) : null}
        </ScrollView>

        <Text>{categoryID}</Text>

        {/* Category */}
        <ScrollView>
          {isModalVisible ? (
            <View>
              <TouchableOpacity 
                style={styles.categoryButton}
                onPress={() => {setModalVisible(false) ; setDefaultModal(true)}} >
                <Feather name="x-circle" size={26} style={styles.closeButton} />
                <Text style={styles.Text2}>{textTitle}</Text>
              </TouchableOpacity>
              <View style={styles.row}>
                {branch && branch.categoryID && branch.nearbyBranch.length > 0 ? (
                  <FlatList
                    data={branch.nearbyBranch.sort((a, b) => b.is_open - a.is_open)}
                    numColumns={2}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    onEndReached={
                      type === 'food'
                        ? handleLoadMoreNearbyRestaurants
                        : handleLoadMoreNearbyStores
                    }
                    keyExtractor={(item) => item.categoryID}
                    onEndReachedThreshold={0.3}
                    renderItem={({item, index}) => {
                      return (
                        <MerchantCard
                          key={index}
                          type={'store'}
                          item_name={item.branch_name}
                          item_image={item.store_id + '/' + item.image}
                          rating={item.rating ? item.rating : null}
                          distance={item.distance ? item.distance : null}
                          rider_fee={item.rider_fee ? item.rider_fee : null}
                          item={item}
                          is_open={item.is_open}
                          display_info={true}
                          handleAdsCard={() => {
                            handleAdsCard(item);
                          }}
                        />
                      );
                    }}
                  />
                ) : (
                  <NoDataView />
                )}
              </View>
            </View>
          ) : null}
        </ScrollView>
        
        {basket.order && basket.order.length > 0 && (
          <FloatIcon {...{navigation, order: basket, type}} />
        )}
    </SubNavBar>
  );
};

const FloatIcon = ({navigation, order, type}) => {
  const navigateToProductDetail = () => {
    navigation.navigate('ProductDetail', {type});
  };

  let numberOfItems = 0;
  order.order.map((item, val) => {
    numberOfItems += item.quantity;
  });

  return (
    <TouchableOpacity
      style={styles.iconWrapper}
      onPress={navigateToProductDetail}>
      <View style={styles.basketIcon}>
        <Feather name="shopping-bag" size={35} color="#468c64" />
        <View style={[styles.numWrap, themes.GREEN_BUTTON]}>
          {order.order && (
            <Text style={[themes.EDIT_WHITE_TEXT, styles.numText]}>
              {numberOfItems}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  inputContainerStyle: {
    backgroundColor: 'white',
    borderColor: '#E4E4E4',
    borderRadius: 10,
    borderWidth: 1.5,
    borderBottomWidth: 1.5,
  },
  inputStyle: {
    fontWeight: 'bold',
    fontSize: RFValue(12),
  },
  dot: {
    marginTop: -60,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: width,
    flex: 1,
  },
  textGreen: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    alignContent: 'center',
  },
  bottomRow: {
    justifyContent: 'space-between',
    marginHorizontal: width * 0.05,
    flexDirection: 'row',
  },
  Text: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 15,
  },
  iconWrapper: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: 20,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: width * 0.08,
    right: width * 0.06,
    padding: width * 0.07,
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
  basketIcon: {
    width: 40,
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPostion: {
    position: 'absolute',
    bottom: width * 0.06,
    right: width * 0.045,
  },
  numWrap: {
    width: width * 0.05,
    height: width * 0.05,
    borderRadius: 50,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: width * 0.0,
    right: width * 0.0,
    top: width * 0.055,
    left: width * 0.05,
  },
  numText: {
    fontSize: RFValue(9),
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  contentWrap: {
    alignContent: 'center',
    marginBottom: height * 0.015,
  },
  iconWrap: {
    width: 80,
    marginVertical: height * 0.025,
    marginHorizontal: width * 0.03,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#468c64'
  },
  imageStyle: {
    width: 62,
    height: 62,
    resizeMode: 'contain'
  },
  menubar1: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: height * 0.001 - 10,
    justifyContent: 'space-between',
  },
  menubar2: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: height * 0.001 - 25,
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    color: 'white',
    marginLeft: 10,
  },
  categoryButton: {
    borderRadius: 20,
    backgroundColor: '#468c64',
    height: 28,
    marginLeft: 10,
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  Text2: {
    marginLeft: 40,
    marginRight: 15,
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
    flex: 1,
    alignContent: 'center'
  },
});

export default ItemHomePage;