import React, {useState} from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  TextInput,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {CustomFont as Text} from 'styles/CustomFont';
import {RFValue, getStatusBarHeight} from 'styles/ResponsiveFont';
import {useTranslation} from 'react-i18next';
import {themes} from 'utils/themeProvider';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import mapIcon from '../../../assets/icons/mapicon.png';
import {exp} from 'react-native-reanimated';
import {NoDataView} from './NoDataView';

import {GOOGLE_MAP_API_KEY} from '../../../../config';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const createPlacesAutocompleteSessionToken = (a) => {
  return a
    ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
        /[018]/g,
        createPlacesAutocompleteSessionToken,
      );
};

const LocationNavBar = ({
  children,
  LeftButton,
  handleLeftNavButton,
  RightButton,
  handleRightNavButton,
  placeholder,
  MiddleTextInput,
}) => {
  const {t, i18n} = useTranslation();

  return (
    <>
      <LinearGradient
        colors={['#BBDB9C', '#468c64']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={{flex: 0}}>
        <StatusBar
          backgroundColor={'transparent'}
          translucent={true}
          barStyle="light-content"
          height
        />
      </LinearGradient>
      <View style={styles.backgroundContainer}>
        {/* <LinearGradient
          colors={['#BBDB9C', '#468c64']}
          start={{x: 1, y: 0}}
          end={{x: 0, y: 0}}
          style={styles.linearGradientNavBar}> */}
                 <View
          style={[themes.GREEN_BACKGROUND, styles.linearGradientNavBar]}
          >
          <View style={styles.wrapper}>
            <View style={styles.wrapSection}>
              <View>
                {LeftButton ? (
                  <LeftButton handleLeftNavButton={handleLeftNavButton} />
                ) : (
                  <View style={styles.backButton} />
                )}
              </View>
              <View>
                {RightButton ? (
                  <RightButton handleRightNavButton={handleRightNavButton} />
                ) : (
                  <View style={styles.backButton} />
                )}
              </View>
            </View>

            {MiddleTextInput && MiddleTextInput}
            {/* <View style={styles.locationWrap}>
              <Ionicons
                name="ios-location-sharp"
                color="#468c64"
                size={20}
                style={styles.locationiconWrap}
              />

              <TextInput placeholder={placeholder} />
            </View> */}
          </View>

          {/* <SearchBar
            placeholder="Deliver to"
            inputContainerStyle={styles.inputContainerStyle}
            containerStyle={{
              backgroundColor: 'transparent',
              borderBottomColor: 'transparent',
              borderTopColor: 'transparent',
            }}
            inputStyle={styles.inputStyle}
          /> */}
        </View>
        {children}
      </View>
    </>
  );
};

export const MiddleTextInput = ({
  icon,
  placeholder,
  onPressAddress,
  onChangeText,
}) => {
  switch (icon) {
    case 'Location':
      return (
        <View style={styles.locationWrap} keyboardShouldPersistTaps="handled">
          <Ionicons
            name="ios-location-sharp"
            color="#468c64"
            size={20}
            style={styles.locationiconWrap}
          />
          <MapInput {...{placeholder, onPressAddress}} />
        </View>
      );

    case 'Search':
      return (
        <View style={styles.locationWrap} keyboardShouldPersistTaps="handled">
          <Ionicons
            name="search"
            color="#B2B2B2"
            size={20}
            style={styles.locationiconWrap}
          />
          <TextInput
            placeholder={placeholder}
            onChangeText={onChangeText}
            autoFocus={true}
            style={{
              height: Platform.OS === 'ios' ? height * 0.05 : height * 0.07,
              color: '#5d5d5d',
              fontSize: 16,
              justifyContent: 'center',           
            }}
          />
        </View>
      );

    default:
      return (
        <View style={styles.locationWrap} keyboardShouldPersistTaps="handled">
          <MapInput {...{placeholder, onPressAddress}} />
        </View>
      );
  }
};

export const LeftButton = ({handleLeftNavButton}) => {
  return (
    <>
      <TouchableOpacity style={styles.backButton} onPress={handleLeftNavButton}>
        <Ionicons name="chevron-back-outline" size={25} color="white" />
      </TouchableOpacity>
    </>
  );
};

export const RightButton = ({handleRightNavButton}) => {
  return (
    <>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleRightNavButton}>
        <Image source={mapIcon} style={styles.mapIcon} />
        {/* <FontAwesome name='map-o'  size={20} color="white"/> */}
      </TouchableOpacity>
    </>
  );
};

export const MapInput = ({placeholder, onPressAddress}) => {
  const [session, setSession] = useState(
    createPlacesAutocompleteSessionToken(),
  );
  return (
    //<Modal animationType="slide" transparent={false} visible={true}>
    <GooglePlacesAutocomplete
      placeholder={placeholder}
      minLength={2} // minimum length of text to search
      autoFocus={false}
      returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
      keyboardAppearance={'default'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
      listViewDisplayed="auto" // true/false/undefined
      listEmptyComponent={() => {return <NoDataView />}}
      fetchDetails={true}
      renderDescription={(row) => {
        //console.log(row.description);
        return row.description;
      }} // custom description render
      onPress={onPressAddress}
      enablePoweredByContainer
      getDefaultValue={() => ''}
      query={{
        // available options: https://developers.google.com/places/web-service/autocomplete
        key: GOOGLE_MAP_API_KEY,
        sessiontoken: session,
        components: 'country:my',
        language: 'en', // language of the results
        //types: '(cities)', // default: 'geocode'
      }}
      styles={{
        container: {
          // borderWidth: 0,
          // borderColor: '#fff',
          // backgroundColor: 'transparent',
          width: '100%',
        },
        textInputContainer: {
          width: '100%',
          // borderWidth: 0,
          // borderColor: '#fff',
          backgroundColor: 'transparent',
        },
        textInput: {
          height: 35,
          color: '#5d5d5d',
          fontSize: 16,
          // borderWidth: 0,
          // borderColor: '#fff',
        },
        description: {
          fontWeight: 'bold',
        },
        listView: {
          borderWidth: 0,
          borderColor: '#ddd',
          backgroundColor: '#fff',
          //marginHorizontal: 20,
          overflow: 'visible',
          elevation: 5,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: {x: 0, y: 0},
          shadowRadius: 15,
          marginTop: 44,
          position: 'absolute',
          zIndex: 1000,
          width: width * 0.81,
        },
        predefinedPlacesDescription: {
          color: '#1faadb',
        },
      }}
      //currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
      //currentLocationLabel="Current location"
      nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      GooglePlacesSearchQuery={{
        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
        // rankby: 'distance',
        // type: 'cafe',
        sessiontoken: session,
      }}
      GooglePlacesDetailsQuery={{
        // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
        fields: 'formatted_address,geometry',
      }}
      //predefinedPlaces={[homePlace, workPlace]}
      debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
      //renderLeftButton={()  => <Image source={require('path/custom/left-icon')} />}
      //renderRightButton={() => <Text>Custom text after the input</Text>}
    />
    //</Modal>
  );
};

const {height, width} = Dimensions.get('screen');
const statusBarHeight = getStatusBarHeight();

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    width,
    height: null,
    backgroundColor: '#F5F5F5',
  },
  linearGradientNavBar: {
    top: 0,
    width: width,
    // alignSelf: 'center',
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: height * 0.02,
    // height: height * 0.12,
    paddingTop: statusBarHeight + height * 0.01,
    textAlign: 'center',
  },
  wrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    width: width * 0.3,
    marginTop: height * 0.01,
  },
  wrapSection: {
    width: width,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: width * 0.02,
  },

  locationIcon: {
    alignItems: 'center',
    alignSelf: 'center',
    fontSize: Platform.OS === 'ios' ? RFValue(13) : RFValue(11),
    paddingTop: Platform.OS === 'ios' ? width * 0.005 : 0,
    marginRight: width * 0.005,
  },
  mapIcon: {
    width: width * 0.06,
    height: width * 0.06,
    marginRight: Platform.OS === 'ios' ? width * 0.025 : width * 0.045,
  },
  locationWrap: {
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.9,
    height: Platform.OS === 'ios' ? height * 0.05 : height * 0.07,
    padding: Platform.OS === 'ios' ? width * 0.02 : width * 0.01,
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
  locationiconWrap: {
    paddingHorizontal: width * 0.01,
  },
  backButton: {
    width: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: width * 0.03,
  },
});

export default LocationNavBar;
