import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
  Text,
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';

import LocationNavBar, {
  LeftButton,
  MiddleTextInput,
} from '../../component/LocationNavBar';
import ItemCard from '../../component/home/ItemCard';

//images

import {ScrollView} from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';
import {getFoodCatalogue, getGoodsCatalogue} from '../../../../services/branch';
import {AddressContext} from 'states/context/address.context';

//services
import {BasketContext} from 'states/context/basket.context';
const SearchCraving = ({navigation, route}) => {
  const {basket} = useContext(BasketContext);
  const {address} = useContext(AddressContext);
  const {type} = route.params;
  //console.log(address.postal_address.location.coordinates);
  const handleLeftNavButton = () => {
    navigation.goBack();
  };
  const {t, i18n} = useTranslation();

  const [catalogue, setCatalogue] = useState([]);
  //console.log('SearchCraving -> foodCatalogue', foodCatalogue);

  useEffect(() => {
    const handleGetFoodCatalogue = async () => {
      try {
        const food_catalogue = await getFoodCatalogue({t});
        setCatalogue(food_catalogue);
      } catch (error) {
        console.log('handleGetFoodCatalogue -> error', error);
      }
    };
    const handleGetGoodsCatalogue = async () => {
      try {
        const goods_catalogue = await getGoodsCatalogue({t});
        setCatalogue(goods_catalogue);
      } catch (error) {
        console.log('handleGetGoodsCatalogue -> error', error);
      }
    };
    if (route.params && route.params.type === 'food') {
      handleGetFoodCatalogue();
    } else {
      handleGetGoodsCatalogue();
    }
  }, []);

  const noresult = true;

  const searchFilter = (value) => {
    if (catalogue.length === 0) {
      alert(t('error_food_catalogue_alert_1'));
    } else {
      const filteredCatalogue = catalogue.filter((item) => {
        //item.branch_name === value.toLowerCase() <--- exact branch search
        return item.branch_name.startsWith(value.toLowerCase()); // <---- starts with search
      });
      setCatalogue(filteredCatalogue);
    }
  };

  return (
    <LocationNavBar
      {...{
        LeftButton,
        handleLeftNavButton,
        MiddleTextInput: MiddleTextInput({
          icon: 'Search',
          placeholder: t('what_are_you_craving'),
          onChangeText: searchFilter,
        }),
      }}>
      <ScrollView>
        {catalogue && catalogue.length > 0 ? (
          catalogue.map((item, val) => {
            return <Result key={val} {...{navigation, item, type}} />;
          })
        ) : (
          <Suggestion />
        )}
      </ScrollView>
      {basket.order && basket.order.length > 0 && (
        <FloatIcon {...{navigation, order: basket, type: route.params.type}} />
      )}
    </LocationNavBar>
  );
};

const Result = ({navigation, item, type}) => {
  const onPressCard = (item) => {
    navigation.navigate('BranchDetail', {item: item, type: type});
  };
  return (
    <View>
      <ItemCard
        item_name={item.branch_name}
        item_category="Non-halal"
        item_rating="4.5"
        item_eta="39 mins"
        item_distance="6.9 km"
        item_price="RM 6.90"
        item_discount="30"
        onPress={() => onPressCard(item)}
      />
    </View>
  );
};

const Suggestion = () => {
  const {t, i18n} = useTranslation();

  return (
    <>
      <ScrollView>
        <View style={styles.titleText}>
          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>
            {t('popular_cuisines')}
          </Text>
        </View>
        <View style={styles.checkboxContainer}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={styles.popularWrap}>
              <Text style={themes.TEXT_TITLE_GREY}>{t('halal')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.popularWrap}>
              <Text style={themes.TEXT_TITLE_GREY}>{t('dessert')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.popularWrap}>
              <Text style={themes.TEXT_TITLE_GREY}>{t('fried_chicken')}</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={styles.popularWrap}>
              <Text style={themes.TEXT_TITLE_GREY}>{t('burgers')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.popularWrap}>
              <Text style={themes.TEXT_TITLE_GREY}>{t('beverages')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.popularWrap}>
              <Text style={themes.TEXT_TITLE_GREY}>{t('fast_food')}</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={styles.popularWrap}>
              <Text style={themes.TEXT_TITLE_GREY}>{t('western')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.popularWrap}>
              <Text style={themes.TEXT_TITLE_GREY}>{t('chicken')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.popularWrap}>
              <Text style={themes.TEXT_TITLE_GREY}>{t('malaysian')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.alltitleText}>
          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>
            {t('all_cuisines')}
          </Text>
        </View>
        <TouchableOpacity style={styles.allWrap}>
          <Text style={themes.TEXT_TITLE_GREY}>{t('art&crafts')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.allWrap}>
          <Text style={themes.TEXT_TITLE_GREY}>{t('asian')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.allWrap}>
          <Text style={themes.TEXT_TITLE_GREY}>{t('baked_goods')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.allWrap}>
          <Text style={themes.TEXT_TITLE_GREY}>{t('bakery')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.allWrap}>
          <Text style={themes.TEXT_TITLE_GREY}>{t('bbq')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.allWrap}>
          <Text style={themes.TEXT_TITLE_GREY}>{t('beauty')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.allWrap}>
          <Text style={themes.TEXT_TITLE_GREY}>{t('beverages')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.allWrap}>
          <Text style={themes.TEXT_TITLE_GREY}>{t('breakfast')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.allWrap}>
          <Text style={themes.TEXT_TITLE_GREY}>{t('breakfast&brunch')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.allWrap}>
          <Text style={themes.TEXT_TITLE_GREY}>{t('bubble_tea')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const FloatIcon = ({navigation, order, type}) => {
  const navigateToProductDetail = () => {
    navigation.navigate('ProductDetail', {type: type});
  };

  return (
    <>
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={navigateToProductDetail}>
        <View style={styles.basketIcon}>
          <Feather name="shopping-bag" size={35} color="#468c64" />
          <View style={[styles.numWrap, themes.GREEN_BUTTON]}>
            {/* THE NUM SHOULD BE LESS THAN 100? */}
            <Text style={[themes.EDIT_WHITE_TEXT, styles.numText]}>
              {order.order.length}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  checkboxContainer: {
    marginHorizontal: width * 0.04,
    justifyContent: 'space-between',
  },
  titleText: {
    marginHorizontal: width * 0.05,
    fontSize: RFValue(13),
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
  },
  popularWrap: {
    marginRight: width * 0.02,
    marginVertical: Platform.OS === 'ios' ? height * 0.008 : height * 0.01,
    paddingVertical: width * 0.018,
    paddingHorizontal: width * 0.05,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 4,
  },
  alltitleText: {
    marginHorizontal: width * 0.05,
    fontSize: RFValue(13),
    marginTop: height * 0.03,
    marginBottom: height * 0.02,
  },
  allWrap: {
    marginHorizontal: width * 0.055,
    height: Platform.OS === 'ios' ? height * 0.05 : height * 0.065,
    justifyContent: 'center',
    marginBottom: Platform.OS === 'ios' ? height * 0.012 : height * 0.015,
    paddingVertical: width * 0.018,
    paddingHorizontal: width * 0.05,
    borderRadius: 25,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 4,
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
});

export default SearchCraving;
