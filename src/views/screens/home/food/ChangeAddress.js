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
  TextInput,
  Animated,
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';
import {SearchBar} from 'react-native-elements';
import Collapsible from 'react-native-collapsible';

import LocationNavBar, {
  LeftButton,
  RightButton,
  MiddleTextInput,
} from '../../component/LocationNavBar';

import {ScrollView} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';
import {AddressContext, SET_LISTING} from 'states/context/address.context';
import {getAddress} from 'services/address';

const ChangeAddress = ({navigation}) => {
  const {dispatchAddress} = useContext(AddressContext);
  const [collapse, setCollapse] = useState(false);
  const handleLeftNavButton = () => {
    navigation.goBack();
  };
  const handleRightNavButton = () => {
    navigation.navigate('MapScreen');
  };
  const [allAddress, setAllAddress] = useState([]);

  useEffect(() => {
    const handleGetAddress = async () => {
      const add = await getAddress({t});

      setAllAddress(add);
    };
    handleGetAddress();
  }, []);

  const navigateToChoosePlace = () => {
    dispatchAddress({type: SET_LISTING, payload: allAddress});
    navigation.navigate('ChoosePlace', {savedplace: false});
  };
  const navigateToAddAddress = () => {
    navigation.navigate('AddAddress');
  };
  const {t, i18n} = useTranslation();
  const onPressAddress = (data, details) => {
    const {
      formatted_address,
      geometry: {
        location: {lat, lng},
      },
    } = details;
    //console.log(details);
  };
  return (
    <LocationNavBar
      {...{
        LeftButton,
        handleLeftNavButton,
        RightButton,
        handleRightNavButton,
        MiddleTextInput: MiddleTextInput({
          icon: 'Location',
          placeholder: t('deliver_to'),
          onPressAddress,
        }),
      }}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[themes.GREEN_BUTTON, styles.button]}
          onPress={navigateToAddAddress}>
          <Ionicons name="md-home-outline" size={20} color="#FFFFFF" />
          <Text style={[themes.EDIT_WHITE_TEXT, styles.buttonText]}>
            {t('add_home')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[themes.GREEN_BUTTON, styles.button]}
          onPress={navigateToAddAddress}>
          <MaterialCommunityIcons
            name="briefcase-variant-outline"
            size={22}
            color="#FFFFFF"
          />
          <Text style={[themes.EDIT_WHITE_TEXT, styles.buttonText]}>
            {t('add_work')}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={themes.BACKGROUND_WHITE_WRAP}>
        <View style={styles.itemWrap}>
          <View style={styles.column1}>
            <FontAwesome name="bookmark-o" size={25} color="#468c64" />
          </View>
          <View style={styles.column2}>
            <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>
              {t('saved_places')}
            </Text>
            <Text style={[themes.TEXT_TITLE_GREY, styles.smallText]}>
              {t('select_a_delivery_address_easily')}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.column3}
            onPress={navigateToChoosePlace}>
            <Feather
              name="chevron-right"
              size={25}
              color="#B2B2B2"
              style={[themes.ICON_COLOR_BLACK]}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{height: height * 0.001}} />
      <View style={themes.BACKGROUND_WHITE_WRAP}>
        <View style={styles.itemWrap}>
          <View style={styles.column1}>
            <MaterialIcons name="my-location" size={25} color="#468c64" />
          </View>
          <View style={styles.column2}>
            <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>
              {t('use_current_location')}
            </Text>
            <Text style={[themes.TEXT_TITLE_GREY, styles.smallText]}>
              KL ECO CITY
            </Text>
          </View>
        </View>
      </View>
    </LocationNavBar>
  );
};

const PreciseLocation = ({location_name, location_distance, navigation}) => {
  const handleLeftNavButton = () => {
    navigation.goBack();
  };
  return (
    <>
      <View style={{height: height * 0.001, backgroundColor: '#00000029'}} />

      <TouchableOpacity
        style={[styles.preciseitemWrap]}
        onPress={handleLeftNavButton}>
        <View style={styles.column1}>
          <Octicons name="primitive-dot" size={25} color="#468c64" />
        </View>
        <View style={styles.collapsecolumn2}>
          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>{location_name}</Text>
          <Text style={[themes.TEXT_TITLE_GREY, styles.smallText]}>
            {location_distance}
          </Text>
        </View>
        <TouchableOpacity style={styles.collapsecolumn3}>
          <FontAwesome name="bookmark-o" size={25} color="#468c64" />
        </TouchableOpacity>
      </TouchableOpacity>
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  button: {
    width: width * 0.4,
    height: height * 0.06,
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    marginHorizontal: width * 0.01,
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: 25,
    borderWidth: 1,
    fontWeight: 'bold',
    ...Platform.select({
      ios: {
        alignItems: 'center',
        lineHeight: width * 0.06,
        height: width * 0.1,
      },
      default: {
        alignItems: 'center',
        textAlignVertical: 'center',
      },
    }),
  },
  buttonText: {
    alignItems: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    marginHorizontal: width * 0.01,
  },
  itemWrap: {
    flexDirection: 'row',
    marginHorizontal: width * 0.03,
    paddingVertical: height * 0.02,
  },
  preciseitemWrap: {
    flexDirection: 'row',
    paddingVertical: Platform.OS === 'ios' ? height * 0.018 : height * 0.02,
  },

  column1: {
    width: width * 0.15,
    alignItems: 'center',
    alignSelf: 'center',
  },
  column2: {
    width: width * 0.7,
    flexDirection: 'column',
  },
  column3: {
    width: width * 0.1,
    alignItems: 'center',
    alignSelf: 'center',
  },
  collapsecolumn2: {
    width: width * 0.63,
    flexDirection: 'column',
  },
  collapsecolumn3: {
    width: width * 0.1,
    alignSelf: 'center',
    alignItems: 'flex-end',
  },
  smallText: {
    fontSize: RFValue(10),
    paddingTop: width * 0.001,
  },
  preciseLocationWrap: {
    padding: width * 0.05,

    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bigWrapContainer: {
    marginHorizontal: width * 0.03,
    marginVertical: height * 0.02,
    backgroundColor: 'white',
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  item: {
    marginTop: width * 0.03,
    marginVertical: 5,
    marginHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    overflow: 'hidden',
  },
  infoWrapper: {
    margin: width * 0.035,
  },
  titleWrap: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: RFValue(15),
  },
  itemText: {
    marginRight: 40,
    fontSize: RFValue(10),
  },
  collapseCol: {
    alignSelf: 'center',
    alignItems: 'center',
  },
});

export default ChangeAddress;
