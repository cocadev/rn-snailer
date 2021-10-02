import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Linking,
  Image,
  Platform,
} from 'react-native';

import {useTranslation} from 'react-i18next';

import NavBar, {LeftButton} from '../../component/NavBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNPickerSelect from 'react-native-picker-select';
import {RFValue} from 'styles/ResponsiveFont';

import MapView, {Marker, Callout} from 'react-native-maps';
import googlemap from '../../../../assets/icons/googlemap.png';
import applemap from '../../../../assets/icons/applemap.png';
import {themes} from 'utils/themeProvider';
import {getHub} from '../../../../services/parcel';
import {Loader} from '../../component/Loader';
import {formatState} from '../../../../utils/helper';

const ParcelDropoff = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [loader, setLoader] = useState(false);
  const [hub, setHub] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [selectedHub, setSelectedHub] = useState();
  const mapRef = useRef();
  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const handleGetHub = async () => {
    try {
      setLoader(true);
      const response = await getHub({t});
      if (response.length > 0) {
        setHub(response);
        setSelectedState(response[0].hub);
        moveMap(response[0].hub[0]);
      }
    } catch (error) {
      console.log('🚀 ~ handleGetHub ~ error', error);
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    handleGetHub();
  }, []);

  const moveMap = (hub) => {
    setSelectedHub(hub);
    mapRef.current.animateCamera({
      center: {
        latitude: hub.address.location.coordinates[1],
        longitude: hub.address.location.coordinates[0],
      },
    });
  };
  const showLocation = async () => {
    const lat = selectedHub.address.location.coordinates[1];
    const lng = selectedHub.address.location.coordinates[0];
    const label = selectedHub.name;
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${lat},${lng}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    Linking.openURL(url);
  };
  return (
    <>
      <NavBar
        title={t('drop_off')}
        {...{
          LeftButton,
          handleLeftNavButton,
        }}>
        <Loader loading={loader} />
        <View style={{flex: 1}}>
          <MapView
            style={styles.mapStyle}
            ref={mapRef}
            initialRegion={{
              latitude: 3.1179567,
              longitude: 101.67398,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}>
            {selectedHub && (
              <Marker
                title={t('location_name')}
                description={t('address')}
                coordinate={{
                  latitude: selectedHub.address.location.coordinates[1],
                  longitude: selectedHub.address.location.coordinates[0],
                }}>
                <Callout tooltip>
                  <View
                    style={[
                      themes.BACKGROUND_WHITE_WRAP,
                      styles.pointerCallout,
                    ]}>
                    <Text
                      style={[themes.NORMAL_TEXT_BLACK_BOLD]}
                      numberOfLines={2}>
                      {t('name')} : {selectedHub.name}
                    </Text>
                    <Text
                      style={[themes.NORMAL_TEXT_BLACK_BOLD]}
                      numberOfLines={4}>
                      {t('address')} : {selectedHub.address.full_address}
                    </Text>
                    <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>
                      {t('contact')} : {selectedHub.contact}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        themes.BUTTON_WHITE,
                        themes.SHADOW_DEFAULT,
                      ]}
                      onPress={() => showLocation()}>
                      {Platform.OS == 'ios' ? (
                        <Image source={applemap} style={styles.icon} />
                      ) : (
                        <Image source={googlemap} style={styles.icon} />
                      )}
                    </TouchableOpacity>
                  </View>
                </Callout>
              </Marker>
            )}
          </MapView>
          {hub.length > 0 && (
            <Picker
              item={hub}
              {...{setSelectedState, moveMap, setSelectedHub}}
            />
          )}
        </View>
        <ScrollView
          style={styles.locationView}
          showsVerticalScrollIndicator={false}>
          {selectedState.map((item, i) => {
            return (
              <TouchableOpacity
                key={item._id}
                onPress={() => {
                  moveMap(item);
                }}
                style={[
                  themes.WHITE_BUTTON,
                  themes.SHADOW_DEFAULT,
                  styles.locationButton,
                ]}>
                <Text
                  numberOfLines={1}
                  style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.textInput]}>
                  {item.name}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[themes.TEXT_TITLE_LIGHTGREY, styles.textInput]}>
                  {item.address.full_address}
                </Text>
              </TouchableOpacity>
            );
          })}
          <View
            style={{
              ...Platform.select({
                ios: {
                  marginBottom: width * 0.5,
                },
                android: {
                  marginBottom: width * 0.9,
                },
              }),
            }}
          />
        </ScrollView>
      </NavBar>
    </>
  );
};

const Picker = ({item, setSelectedState, moveMap}) => {
  const [selectedValue, setSelectedValue] = useState(0);
  return (
    <View
      style={[themes.WHITE_BUTTON, themes.SHADOW_DEFAULT, styles.chooseButton]}>
      <View style={[styles.inputView]}>
        <RNPickerSelect
          value={selectedValue}
          onValueChange={(value) => {
            if (value || value == 0) {
              setSelectedValue(value);
              setSelectedState(item[value].hub);
              moveMap(item[value].hub[0]);
            }
          }}
          items={item.map((e, index) => ({
            value: index,
            label: formatState(e.state),
          }))}
          style={{
            inputIOS: {
              color: 'black',
              fontWeight: 'bold',
              paddingLeft: width * 0.02,
              fontSize: RFValue(14),
              paddingRight: width * 0.07,
              width: width * 0.8,
            },
            inputAndroid: {
              color: 'black',
              fontWeight: 'bold',
              marginLeft: width * 0.015,
              fontSize: RFValue(14),
              width: width * 0.8,
              marginVertical: width * -0.03,
            },
          }}
          Icon={() => {
            return Platform.OS === 'ios' ? (
              <Ionicons
                name="chevron-forward-outline"
                size={20}
                color="black"
              />
            ) : (
              <Ionicons
                name="chevron-forward-outline"
                size={24}
                color="black"
              />
            );
          }}
        />
      </View>
    </View>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  icon: {
    height: width * 0.09,
    width: width * 0.09,
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
  },
  chooseButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    height: width * 0.15,
    width: width * 0.92,
    top: 30,
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.05,
  },
  locationView: {
    position: 'absolute',
    left: width * 0.04,
    height: width * 1.25,
    ...Platform.select({
      ios: {
        top: width * 1.4,
      },
      android: {
        top: width * 1.25,
      },
    }),
  },
  locationButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 35,
    height: width * 0.18,
    width: width * 0.92,
    marginBottom: width * 0.03,
  },
  textInput: {
    marginVertical: width * 0.005,
    marginHorizontal: width * 0.055,
  },
  pointerCallout: {
    flex: 1,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.01,
    width: width * 0.5,
  },
});

export default ParcelDropoff;
