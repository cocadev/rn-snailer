import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView,
  Text,
  FlatList,
} from 'react-native';

import {postNearbyRestaurants, postNearbyStore} from 'services/branch';
import {AddressContext} from 'states/context/address.context';

import {RFValue} from 'styles/ResponsiveFont';
import NavBar, {LeftButton} from '../component/NavBar';
import {ScrollView} from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';

import ItemCard from '../component/home/ItemCard';

const RecommendedItem = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const {address, dispatchAddress} = useContext(AddressContext);
  const [currentLocation, setCurrentLocation] = useState(
    address.selected_address ? address.selected_address : address.addresses[0],
  );
  const {type, title} = route.params;
  const [item, setItem] = useState([]);
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(0);
  const [noMoreData, setNoMoreData] = useState(false);
  const [initLoad, setInitLoad] = useState(false);

  const handleRefresh = async () => {
    setCounter(0);
    setItem([]);
    getData();
  };

  const handleLoadMore = async () => {
    if (!noMoreData && initLoad) {
      getData();
    }
  };

  const handleLeftNavButton = () => {
    navigation.goBack();
  };
  const handleGetNearbyRestaurants = async () => {
    try {
      const result = await postNearbyRestaurants({
        latitude: currentLocation.location.coordinates[1],
        longitude: currentLocation.location.coordinates[0],
        t,
        skip: counter,
      });
      return result;
    } catch (e) {
      throw e;
    }
  };

  const handleAllRestaurants = async () => {
    try {
      const result = await postNearbyRestaurants({
        latitude: 0,
        longitude: 0,
        t,
        skip: counter,
      });
      return result;
    } catch (e) {
      throw e;
    }
  };

  const handleGetNearbyStores = async () => {
    try {
      const result = await postNearbyStore({
        latitude: currentLocation.location.coordinates[1],
        longitude: currentLocation.location.coordinates[0],
        t,
        skip: counter,
      });
      return result;
    } catch (e) {
      throw e;
    }
  };

  const handleGetAllStores = async () => {
    try {
      const result = await postNearbyStore({
        latitude: 0,
        longitude: 0,
        t,
        skip: counter,
      });
      return result;
    } catch (e) {
      throw e;
    }
  };

  useEffect(() => {
    getData();
    setInitLoad(true);
  }, []);

  const getData = async () => {
    let result = [];
    setLoading(true);
    try {
      if (type === 'food') {
        switch (title) {
          case 'near_you':
            result = await handleGetNearbyRestaurants();
            break;
          case 'recommended_for_you':
            result = await handleAllRestaurants();
          default:
            break;
        }
      } else {
        switch (title) {
          case 'near_you':
            result = await handleGetNearbyStores();
            break;
          case 'recommended_for_you':
            result = await handleGetAllStores();
            break;
          default:
            break;
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
    if (result.length < 10) setNoMoreData(true);
    setItem((prev) => [...prev, ...result]);
    setCounter((prev) => prev + 10);
  };

  return (
    <NavBar title={t(title)} {...{LeftButton, handleLeftNavButton}}>
      <FlatList
        style={{paddingTop: height * 0.01}}
        data={item}
        keyExtractor={(item) => item._id}
        renderItem={({item}) => (
          <ItemCard
            food
            item_name={item.branch_name}
            item_image={item.image}
            // item_category="Non-halal"
            item_rating={item.rating}
            // item_eta="39 mins"
            // item_distance="6.9 km"
            // item_price="RM 6.90"
            // item_discount="30"
          />
        )}
        refreshing={loading}
        onRefresh={handleRefresh}
        onEndReachedThreshold={0.3}
        onEndReached={handleLoadMore}
      />
      {/* <ScrollView style={{paddingTop: height * 0.01}}>
        <ItemCard
          food
          item_name="MCD"
          item_category="Non-halal"
          item_rating="4.5"
          item_eta="39 mins"
          item_distance="6.9 km"
          item_price="RM 6.90"
          item_discount="30"
        />
        <ItemCard
          food
          item_name="MCD2 Jalan Bangsar, Taman Bangsar 1233"
          item_category="Drinks"
          item_rating="4.5"
          item_eta="39 mins"
          item_distance="6.9 km"
          item_price="RM 6.90"
          item_discount="30"
        />
      </ScrollView> */}
    </NavBar>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 25,
    backgroundColor: 'white',
    marginHorizontal: width * 0.03,
    marginVertical: width * 0.015,
    padding: width * 0.03,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  text: {
    marginLeft: width * 0.03,
    marginRight: width * 0.01,
    alignSelf: 'center',
    fontSize: RFValue(13),
  },
  primarytext: {
    marginRight: width * 0.01,
    fontSize: RFValue(13),
  },
  primaryWrap: {
    flexDirection: 'column',
    marginLeft: width * 0.03,
  },
  image: {
    width: 30,
    height: 30,
    marginLeft: width * 0.03,
    marginRight: width * 0.01,
    alignSelf: 'center',
  },
  button: {
    width: width * 0.8,
    height: width * 0.13,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: width * 0.03,
    marginBottom: width * 0.02,
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 1,
    fontWeight: 'bold',
    fontSize: RFValue(14),
    ...Platform.select({
      ios: {
        alignItems: 'center',
        lineHeight: width * 0.12,
        height: width * 0.12,
      },
      android: {
        textAlignVertical: 'center',
      },
      default: {
        alignItems: 'center',
        textAlignVertical: 'center',
      },
    }),
  },
});

export default RecommendedItem;
