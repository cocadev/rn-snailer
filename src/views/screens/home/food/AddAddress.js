import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';

import NavBar, {LeftButton} from '../../component/NavBar';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {NoDataView} from '../../component/NoDataView';
import {GOOGLE_MAP_API_KEY} from '../../../../../config';
import {
  getAddress,
  addAddress,
  changeDefaultHomeAddress,
  changeDefaultWorkAddress,
  addDefaultWorkAddress,
} from 'services/address';
import {MoveOrderContext} from 'states/context/moveOrder.context';
import {ParcelOrderContext} from 'states/context/parcelOrder.context';
import RNLocation from 'react-native-location';

navigator.geolocation = require('@react-native-community/geolocation');
import {AddressContext, SET_LISTING} from 'states/context/address.context';

const createPlacesAutocompleteSessionToken = (a) => {
  return a
    ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
        /[018]/g,
        createPlacesAutocompleteSessionToken,
      );
};

const getLocation = () =>{
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log('position----------------');
      console.log(position);
    },
    (error) => {console.log(error);},
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
  );
}

const AddAddress = ({navigation, route}) => {
  const {parcelOrder, dispatchParcelOrder} = useContext(ParcelOrderContext);
  const {address, dispatchAddress} = useContext(AddressContext);
  const [locationDetails, setLocationDetails] = useState();

  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const {t, i18n} = useTranslation();
  const [onPress, setOnPress] = useState(false);
  const [chooseAddress, setChooseAddress] = useState(
    address.addresses.map((item, val) => ({
      description: item.address,
      geometry: item.location,
    })) || [],
  );

  const onPressAddress = async (data, details) => {
    try {
      setLocationDetails(details);
      const {
        address_components,
        formatted_address,
        geometry: {
          location: {lat, lng},
        },
      } = details;

      const dispatchObject = (action, changeIndex = null) => {
        const unit_no = address_components.find((c) => {
          return c.types[0] === 'street_number';
        });

        const floor = address_components.find((c) => {
          return c.types[0] === 'floor';
        });

        const postcode = address_components.find((c) => {
          return c.types[0] === 'postal_code';
        });

        const state = address_components.find((c) => {
          return c.types[0] === 'locality';
        });

          return {
            type: 'ADDRESS_UNDER_EDIT',
            payload: {
              _id: '',
              is_home: action === 'SET_HOME' ? true : false,
              is_office: action === 'SET_OFFICE' ? true : false,
              address: {
                full_address: formatted_address,
                unit_no: unit_no ? unit_no.long_name : '',
                block: '',
                level: floor ? floor.long_name : '',
                postcode: postcode ? postcode.long_name : '',
                location: {
                  type: 'Point',
                  coordinates: [lng, lat],
                },
                state: state ? state.long_name : '',
              },
              contact: {
                name: '',
                mobile: '',
              },
              action,
              changeIndex,
            },
          };
      };

      let addressObj;
      setOnPress(true);
      // add parcel sender location
      if(route.params?.parcel){
        addressObj = dispatchObject('SET_SENDER_LOCATION');
        dispatchParcelOrder(addressObj);
      }
      // adding others address
      else if (route.params?.add_an_address) {
        dispatchAddress(dispatchObject('ADD_ADDRESS'));
      }
      // adding home address
      else if (route.params?.chooseHome) {
        dispatchAddress(dispatchObject('SET_HOME'));
      }
      // adding work address
      else if (route.params?.chooseWork) {
        dispatchAddress(dispatchObject('SET_OFFICE'));
      }
      // change pickup address
      else if (route.params?.moveMap_pickUp) {
        dispatchAddress(dispatchObject('CHANGE_PICKUP_ADDRESS'));
      }
      // change dropoff address
      else if (route.params?.moveMap_dropOff) {
        dispatchAddress(dispatchObject('CHANGE_DROPOFF_ADDRESS'));
      }
      // change stop location
      else if (route.params?.moveMap_edit_stopLocation) {
        dispatchAddress(
          dispatchObject(
            'EDIT_STOPLOCATION_ADDRESS',
            route.params?.changeIndex,
          ),
        );
      }
      // add stop location
      else {
        dispatchAddress(
          dispatchObject('ADD_STOPLOCATION_ADDRESS', route.params?.changeIndex),
        );
      }
      
      if(route.params?.parcel){
        navigation.navigate('ParcelDelivery', {address: addressObj});
      }
      else
        navigation.navigate('MoveMapScreen');
    } catch (e) {
      console.log(e);
    } finally {
      setOnPress(false);
    }
  };

  return (
    <NavBar
      title={'Search Your Place'}
      {...{
        LeftButton,
        handleLeftNavButton,
        title: t('address'),
      }}>
      <MiddleTextInput
        placeholder="Search"
        onPressAddress={onPressAddress}
        {...{onPress, chooseAddress, t, navigation, dispatchAddress, route}}
      />
      <Text>
      </Text>
    </NavBar>
  );
};

const MiddleTextInput = ({
  placeholder,
  onPressAddress,
  onPress,
  chooseAddress,
  t,
  navigation,
  dispatchAddress,
  route
}) => {
  return (
    <View style={styles.locationWrap} keyboardShouldPersistTaps="handled">
      <MapInput
        {...{
          placeholder,
          onPressAddress,
          onPress,
          chooseAddress,
          t,
          navigation,
          dispatchAddress,
          route
        }}
      />
    </View>
  );
};

export const LocationCard = ({
  onPressAddress,
  location_name,
  location_location,
  location_distance,
  bookmark,
}) => {
  const handleLeftNavButton = () => {
    navigation.navigate('AddSavedPlace');
  };
  return (
    <>
      <View style={styles.preciseLocationWrap}>
        <View style={styles.column2}>
          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>{location_name}</Text>
          <Text
            style={[themes.TEXT_TITLE_GREY, styles.smallText]}
            numberOfLines={1}>
            {location_distance} • {location_location}
          </Text>
        </View>
        <View style={styles.column3}>
          {bookmark ? (
            <FontAwesome name="bookmark" size={25} color="#468c64" />
          ) : (
            <FontAwesome name="bookmark-o" size={25} color="#468c64" />
          )}
        </View>
      </View>
    </>
  );
};

const MapInput = ({
  placeholder,
  onPressAddress,
  onPress,
  chooseAddress,
  t,
  navigation,
  dispatchAddress,
  route
}) => {
  const [session, setSession] = useState(
    createPlacesAutocompleteSessionToken(),
  );
  const [allAddress, setAllAddress] = useState([]);

  useEffect(() => {
    const handleGetAddress = async () => {
      const add = await getAddress({t});

      setAllAddress(add);
    };
    handleGetAddress();
  }, []);
  const navigateToChoosePlace = () => {
    dispatchAddress({type: 'SET_LISTING', payload: allAddress});
    navigation.navigate('ChoosePlace', {
      savedplace: false,
      moveMap_stopLocation: route.params?.moveMap_stopLocation,
      moveMap_dropOff: route.params?.moveMap_dropOff,
      moveMap_pickUp: route.params?.moveMap_pickUp,
    });
  };

  return (
    <>
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        //suppressDefaultStyles
        minLength={2} // minimum length of text to search
        autoFocus={true}
        returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
        keyboardAppearance={'default'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
        listViewDisplayed="auto" // true/false/undefined
        listEmptyComponent={() => {
          return <NoDataView />;
        }}
        fetchDetails={true}
        enablePoweredByContainer={true}
        renderRow={(row) => {
          const temp = row.description.split(",");
          return (
            <View style={styles.bigWrapContainer}>
              <LocationCard
                location_name={temp[0]}
                location_location={row.description}
                bookmark={onPress}
              />
            </View>
          );
        }}
        
        // custom description render
        // renderHeaderComponent={() => (
        //   <View>
        //     <View style={themes.BACKGROUND_WHITE_WRAP}>
        //       <View style={styles.itemWrap}>
        //         <View style={styles.column1}>
        //           <FontAwesome name="bookmark-o" size={25} color="#468c64" />
        //         </View>
        //         <View style={styles.column2}>
        //           <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>
        //             {t('saved_places')}
        //           </Text>
        //           <Text style={[themes.TEXT_TITLE_GREY, styles.smallText]}>
        //             {t('select_a_delivery_address_easily')}
        //           </Text>
        //         </View>
        //         <TouchableOpacity
        //           style={styles.column3}
        //           onPress={navigateToChoosePlace}>
        //           {/* <Feather
        //             name="chevron-right"
        //             size={25}
        //             color="#B2B2B2"
        //             style={[themes.ICON_COLOR_BLACK]}
        //           /> */}
        //         </TouchableOpacity>
        //       </View>
        //     </View>
        //     <View style={{height: height * 0.001}} />
        //   </View>
        // )}
        onPress={onPressAddress}
        onFail={error => console.error(error)}
        getDefaultValue={() => ''}
        query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: GOOGLE_MAP_API_KEY,
          sessiontoken: session,
          components: 'country:my',
          language: 'en', // language of the results
          //types: '(cities)', // default: 'geocode'
        }}
        textInputProps={{onBlur: () => {}}}
        currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
        // currentLocationLabel="Use Current location"
        nearbyPlacesAPI="GoogleReverseGeocoding" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        GooglePlacesSearchQuery={{
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          // rankby: 'distance',
          // type: 'cafe',
          sessiontoken: session,
        }}
        GoogleReverseGeocodingQuery={{
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
          key: GOOGLE_MAP_API_KEY,
          language: 'en',
        }}
        GooglePlacesDetailsQuery={{
          // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
          fields: 'address_components,formatted_address,geometry',
        }}
        //predefinedPlaces={chooseAddress}

        debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
        styles={{
          container: {
            width: '100%',
            height: height,
          },
          textInputContainer: {
            width: '100%',
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: '#fff',
          },
          textInput: {
            height: 35,
            color: '#5d5d5d',
            fontSize: 16,
          },
          separator: {
            borderWidth: 1,
            borderColor: '#fff',
          },
          description: {
            fontWeight: 'bold',
            height: 500,
          },
          row: {
            height: 120,
          },
          listView: {
            borderWidth: 1,
            borderColor: '#fff',
            backgroundColor: '#fff',
            //marginHorizontal: 20,
            elevation: 5,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: {x: 0, y: 0},
            shadowRadius: 15,
            marginTop: 44,
            position: 'absolute',
            zIndex: 1000,
            width: width * 0.99,
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
        }}
      />
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  imageContainer: {
    height: height,
    justifyContent: 'center',
  },
  locationWrap: {
    ...Platform.select({
      ios: {
        zIndex: 1,
      },
    }),
  },
  preciseLocationWrap: {
    padding: width * 0.05,

    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bigWrapContainer: {
    marginHorizontal: width * 0.02,
    // marginTop: height * 0.02,
    backgroundColor: 'white',
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    zIndex: -1,
  },
  precisecolumn1: {
    width: width * 0.15,
    alignItems: 'center',
    alignSelf: 'center',
  },
  column1: {
    width: width * 0.1,
    alignItems: 'center',
    alignSelf: 'center',
  },
  column2: {
    width: width * 0.7,
    flexDirection: 'column',
  },
  column3: {
    width: width * 0.1,

    alignItems: 'flex-end',
    alignSelf: 'center',
  },
  smallText: {
    fontSize: RFValue(10),
    paddingTop: height * 0.008,
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
  collapseCol: {
    alignSelf: 'center',
    alignItems: 'center',
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
});

export default AddAddress;
