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
  Alert,
  KeyboardAvoidingView,
} from 'react-native';

import {RFValue, getStatusBarHeight} from 'styles/ResponsiveFont';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SubNavBar, {
  LeftButton,
  Title,
  SubTitle,
} from '../../component/SubNavBar';
import {Formik} from 'formik';
import * as yup from 'yup';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';
import MapView, {Marker} from 'react-native-maps';
import CheckBox from '@react-native-community/checkbox';

import {MoveOrderContext} from 'states/context/moveOrder.context';
import {AddressContext} from '../../../../states/context/address.context';

import {addAddress, editAddress} from '../../../../services/address';
import GetLocation from 'react-native-get-location'

const MoveMapScreen = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const {address: addressContext, dispatchAddress} = useContext(AddressContext);
  const address_under_edit = addressContext.address_under_edit;
  const [isHome, setIsHome] = useState(address_under_edit.is_home);
  const [isOffice, setIsOffice] = useState(address_under_edit.is_office);
  const [address, setAddress] = useState(
    address_under_edit?.address.full_address,
  );
  const [lat, setLat] = useState(
    address_under_edit?.address.location.coordinates[1],
  );
  const [lng, setLng] = useState(
    address_under_edit?.address.location.coordinates[0],
  );
  const mapRef = React.createRef();

  useEffect(() => {
    const lattemp = address_under_edit.address.location.coordinates[1];
    const lngtemp = address_under_edit.address.location.coordinates[0];

    setAddress(address_under_edit?.address.full_address);
    setLat(lattemp);
    setLng(lngtemp);
    mapRef.current.animateToRegion({
      latitude: lattemp + 0.01,
      longitude: lngtemp,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  }, [address_under_edit?.address.full_address]);

  const handleLeftNavButton = () => {
    navigation.goBack();
  };
  const navigateToMoveScreen = () => {
    navigation.navigate('MoveScreen');
  };

  const navigateToAddAddress = (index = null) => {
    if (address_under_edit?.action === 'CHANGE_PICKUP_ADDRESS')
      navigation.navigate('AddAddress', {
        moveMap_pickUp: true,
      });
    else if (address_under_edit?.action === 'CHANGE_DROPOFF_ADDRESS')
      navigation.navigate('AddAddress', {
        moveMap_dropOff: true,
      });
    else
      navigation.navigate('AddAddress', {
        moveMap_edit_stopLocation: true,
        changeIndex: index,
      });
  };

  const initialValues = {
    unit_no: address_under_edit.address.unit_no,
    level: address_under_edit.address.level,
    block: address_under_edit.address.block,
    postcode: address_under_edit.address.postcode,
    contact_name: address_under_edit.contact.name,
    contact_phone: address_under_edit.contact.mobile,
  };
  const {dispatchMoveOrder} = useContext(MoveOrderContext);

  const handleSetLocationInfo = async (values) => {
    try {
      const {
        unit_no = '',
        level = '',
        block = '',
        postcode: enteredPostcode,
        contact_name,
        contact_phone,
      } = values;

      const requestObject = () => {
        return {
          _id: address_under_edit._id,
          is_home: isHome,
          is_office: isOffice,
          address: {
            full_address: address,
            unit_no,
            block,
            level,
            postcode: enteredPostcode,
            location: {
              type: 'Point',
              coordinates: [lng, lat],
            },
          },
          contact: {
            name: contact_name,
            mobile: contact_phone,
          },
          t,
        };
      };

      const dispatchObject = (type) => {
        return {
          type,
          payload: {
            address,
            latitude: lat,
            longitude: lng,
            unit_no,
            level,
            block,
            postcode: enteredPostcode,
            contact_name,
            contact_phone,
          },
          changeIndex: address_under_edit?.changeIndex,
        };
      };

      const handleAddressOnSuccess = (type, payload) => {
        dispatchAddress({type, payload});
        navigation.navigate('ChoosePlace');
      };

      if (address_under_edit?.action === 'EDIT_ADDRESS') {
        const {success} = await editAddress(requestObject());

        if (success) {
          handleAddressOnSuccess(address_under_edit?.action, requestObject());
        }
      } else if (
        address_under_edit?.action === 'EDIT_HOME' ||
        address_under_edit?.action === 'EDIT_OFFICE'
      ) {
        const {success} = await editAddress(requestObject());

        if (success) {
          handleAddressOnSuccess(address_under_edit?.action, requestObject());
        }
      } else if (address_under_edit?.action === 'ADD_ADDRESS') {
        const {success, results} = await addAddress(requestObject());

        if (success) {
          handleAddressOnSuccess(address_under_edit?.action, results);
        }
      } else if (address_under_edit?.action === 'SET_HOME') {
        const {success, results} = await addAddress(
          requestObject({is_home: true}),
        );

        if (success) {
          handleAddressOnSuccess(address_under_edit?.action, results);
        }
      } else if (address_under_edit?.action === 'SET_OFFICE') {
        const {success, results} = await addAddress(
          requestObject({is_office: true}),
        );

        if (success) {
          handleAddressOnSuccess(address_under_edit?.action, results);
        }
      } else if (address_under_edit?.action === 'CHANGE_PICKUP_ADDRESS') {
        dispatchMoveOrder(dispatchObject('CHANGE_PICKUP_ADDRESS'));
        navigateToMoveScreen();
      } else if (address_under_edit?.action === 'CHANGE_DROPOFF_ADDRESS') {
        dispatchMoveOrder(dispatchObject('CHANGE_DROPOFF_ADDRESS'));
        navigateToMoveScreen();
      } else if (address_under_edit?.action === 'ADD_STOPLOCATION_ADDRESS') {
        dispatchMoveOrder(dispatchObject('ADD_STOPLOCATION_ADDRESS'));
        navigateToMoveScreen();
      } else if (address_under_edit?.action === 'EDIT_STOPLOCATION_ADDRESS') {
        dispatchMoveOrder(dispatchObject('EDIT_STOPLOCATION_ADDRESS'));
        navigateToMoveScreen();
      }
    } catch (e) {
      console.log('handleSetLocationInfo --> ', e);
      alert('some_error');
    }
  };

  const validationSchema = yup.object().shape({
    contact_name: yup.string().required('Required'),
    contact_phone: yup.number().required('Required'),
    postcode: yup.number().required('Required'),
  });

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={(values) => {
        handleSetLocationInfo(values);
      }}
      validationSchema={validationSchema}>
      {({
        values,
        handleChange,
        handleBlur,
        handleSubmit,
        errors,
        touched,
        dirty,
        isValid,
      }) => {
        return (
          <SubNavBar
            {...{
              LeftButton,
              handleLeftNavButton,
              Title: Title({
                textAlign: 'Left',
                title: route.params?.moveMap_pickUp
                  ? t('pick_up_from')
                  : t('deliver_to'),
              }),
              SubTitle: SubTitle({
                icon: 'Location',
                subTitle: address,
              }),
            }}>
            <KeyboardAvoidingView
              behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
              style={{flex: 1}}>
              <MapView
                style={styles.mapStyle}
                ref={mapRef}
                initialRegion={{
                  latitude: lat,
                  longitude: lng,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}>
                <Marker coordinate={{latitude: lat, longitude: lng}} />
              </MapView>
              <View
                style={[
                  themes.GREEN_BOARDER,
                  themes.BACKGROUND_WHITE_WRAP,
                  themes.SHADOW_DEFAULT,
                  styles.cardWrap,
                ]}>
                <View style={styles.rowWrap}>
                  <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
                    {t('delivery_info_optional')}
                  </Text>
                  {(address_under_edit.action === 'CHANGE_PICKUP_ADDRESS' ||
                    address_under_edit.action === 'CHANGE_DROPOFF_ADDRESS' ||
                    address_under_edit.action === 'ADD_STOPLOCATION_ADDRESS' ||
                    address_under_edit.action === 'EDIT_STOPLOCATION_ADDRESS') && (
                    <TouchableOpacity
                      style={[themes.GREEN_BUTTON, styles.changeAddressButton]}
                      onPress={() =>
                        navigateToAddAddress(address_under_edit?.changeIndex)
                      }>
                      <Text style={themes.BUTTON_TEXT_WHITE}>
                        {t('change_address')}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={[themes.GREEN_BOARDER_TOP, styles.rowWrap2]}>
                  <TextInput
                    placeholderTextColor="#C0C0C0"
                    style={styles.smalltextInput}
                    placeholder={t('unit_no')}
                    onChangeText={handleChange('unit_no')}
                    onBlur={handleBlur('unit_no')}
                    value={values.unit_no}
                  />
                  <TextInput
                    placeholderTextColor="#C0C0C0"
                    style={styles.smalltextInput2}
                    placeholder={t('FLR')}
                    onChangeText={handleChange('level')}
                    onBlur={handleBlur('level')}
                    value={values.level}
                  />
                </View>

                <View style={[themes.GREEN_BOARDER_TOP, styles.rowWrap]}>
                  <TextInput
                    placeholderTextColor="#C0C0C0"
                    style={styles.textInput}
                    placeholder={t('building/block')}
                    onChangeText={handleChange('block')}
                    onBlur={handleBlur('block')}
                    value={values.block}
                  />
                </View>

                <View style={[themes.GREEN_BOARDER_TOP, styles.rowWrap]}>
                  <TextInput
                    placeholderTextColor="#C0C0C0"
                    style={styles.textInput}
                    placeholder={t('postcode') + '*'}
                    placeholderTextColor={
                      errors &&
                      errors.postcode &&
                      touched &&
                      touched.postcode &&
                      'red'
                    }
                    onChangeText={handleChange('postcode')}
                    onBlur={handleBlur('postcode')}
                    keyboardType={'numeric'}
                    value={values.postcode}
                    editable={address_under_edit.address.postcode === ''}
                  />
                </View>

                <View style={[themes.GREEN_BOARDER_TOP, styles.contactrowWrap]}>
                  <TextInput
                    style={[styles.contacttextInput]}
                    placeholder={t('contact_name') + '*'}
                    placeholderTextColor={
                      errors &&
                      errors.contact_name &&
                      touched &&
                      touched.contact_name ?
                      'red' : "#C0C0C0"
                    }
                    onChangeText={handleChange('contact_name')}
                    onBlur={handleBlur('contact_name')}
                    value={values.contact_name}
                  />
                  {/* errors && errors.contact_name && (
                    <Text style={{color: 'red'}}>
                      Require.
                    </Text>
                  )
                  <AntDesign
                    name="contacts"
                    size={27}
                    style={themes.ICON_COLOR}
                  /> */}
                </View>

                <View style={[themes.GREEN_BOARDER_TOP, styles.rowWrap]}>
                  <TextInput
                    style={styles.textInput}
                    placeholder={t('contact_phone') + '*'}
                    placeholderTextColor={
                      errors &&
                      errors.contact_phone &&
                      touched &&
                      touched.contact_phone ?
                      'red' : "#C0C0C0"
                    }
                    onChangeText={handleChange('contact_phone')}
                    onBlur={handleBlur('contact_phone')}
                    keyboardType={'numeric'}
                    value={values.contact_phone}
                  />
                  {/*errors && errors.contact_phone && (
                    <Text style={{color: 'red'}}>
                      Require.
                    </Text>
                  )*/}
                </View>
                {(address_under_edit.action === 'ADD_ADDRESS' ||
                  address_under_edit.action === 'SET_HOME' ||
                  address_under_edit.action === 'SET_OFFICE' ||
                  address_under_edit.action === 'EDIT_HOME' ||
                  address_under_edit.action === 'EDIT_OFFICE' ||
                  address_under_edit.action === 'EDIT_ADDRESS') && (
                  <View style={[themes.GREEN_BOARDER_TOP, styles.rowWrap2]}>
                    <View style={styles.checkBoxWrap}>
                      <CheckBox
                        style={{
                          height: 20,
                          width: 20,
                        }}
                        onCheckColor={'#468c64'} //IOS PROPS FOR COLOR
                        onTintColor={'#468c64'}
                        tintColors={'22c639'} //ANDROID PROP FOR COLOR
                        value={isHome}
                        onValueChange={(newValue) => {
                          if (newValue && isOffice) {
                            setIsOffice(false);
                          }
                          setIsHome(newValue);
                        }}
                      />
                      <Text style={styles.radioText}>{t('home_address')}</Text>
                    </View>
                    <View style={styles.checkBoxWrap}>
                      <CheckBox
                        style={{
                          height: 20,
                          width: 20,
                        }}
                        onCheckColor={'#468c64'} //IOS PROPS FOR COLOR
                        onTintColor={'#468c64'}
                        tintColors={'22c639'} //ANDROID PROP FOR COLOR
                        value={isOffice}
                        onValueChange={(newValue) => {
                          if (newValue && isHome) {
                            setIsHome(false);
                          }
                          setIsOffice(newValue);
                        }}
                      />
                      <Text style={styles.radioText}>{t('work_address')}</Text>
                    </View>
                  </View>
                )}
              </View>
              <View style={{flex: 1, justifyContent: 'flex-end'}}>
                <TouchableOpacity
                  onPress={
                    isValid
                      ? handleSubmit
                      : () =>
                          Alert.alert(
                            t('error'),
                            t('incomplete_location_form_alert'),
                          )
                  }>
                  <Text style={[themes.GREEN_BUTTON, styles.button]}>
                    {address_under_edit?.action === 'ADD_ADDRESS' && t('add_address')}
                    {address_under_edit?.action === 'SET_HOME' && t('add_home')}
                    {address_under_edit?.action === 'SET_OFFICE' && t('add_work')}
                    {address_under_edit?.action === 'EDIT_HOME' && t('edit_home_address')}
                    {address_under_edit?.action === 'EDIT_OFFICE' && t('edit_work_address')}
                    {address_under_edit?.action === 'EDIT_ADDRESS' && t('edit_address')}
                    {address_under_edit?.action === 'CHANGE_PICKUP_ADDRESS' && t('set_pick_up_location')}
                    {address_under_edit?.action === 'CHANGE_DROPOFF_ADDRESS' && t('set_drop_off_location')}
                    {address_under_edit?.action === 'ADD_STOPLOCATION_ADDRESS' && t('set_stop_location')}
                    {address_under_edit?.action === 'EDIT_STOPLOCATION_ADDRESS' && t('edit_stop_location')}
                    {address_under_edit?.action === 'DELIVERY_ADDRESS' && t('set_delivery_location')}
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </SubNavBar>
        );
      }}
    </Formik>
  );
};

// const AddressCard = () => {
//   const {t, i18n} = useTranslation();
//   return (
//     <View
//       style={[
//         themes.GREEN_BOARDER,
//         themes.BACKGROUND_WHITE_WRAP,
//         themes.SHADOW_DEFAULT,
//         styles.cardWrap,
//       ]}>
//       <View style={styles.rowWrap}>
//         <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
//           {t('delivery_info_optional')}
//         </Text>
//       </View>
//       <View style={[themes.GREEN_BOARDER_TOP, styles.rowWrap2]}>
//         <TextInput
//           style={styles.smalltextInput}
//           placeholder={t('unit_no')}
//           onChange={(e) => {
//             setUnit_no(e.target.value);
//           }}
//         />
//         <TextInput
//           style={styles.smalltextInput2}
//           placeholder={t('FLR')}
//           onChange={(e) => {
//             setFloor(e.target.value);
//           }}
//         />
//       </View>

//       <View style={[themes.GREEN_BOARDER_TOP, styles.rowWrap]}>
//         <TextInput
//           style={styles.textInput}
//           placeholder={t('building/block')}
//           onChange={(e) => {
//             setBlock(e.target.value);
//           }}
//         />
//       </View>

//       <View style={[themes.GREEN_BOARDER_TOP, styles.contactrowWrap]}>
//         <TextInput
//           style={[styles.contacttextInput]}
//           placeholder={t('contact_name')}
//           onChange={(e) => {
//             setName(e.target.value);
//           }}
//         />
//         <AntDesign name="contacts" size={27} style={themes.ICON_COLOR} />
//       </View>

//       <View style={[themes.GREEN_BOARDER_TOP, styles.rowWrap]}>
//         <TextInput
//           style={styles.textInput}
//           placeholder={t('contact_phone')}
//           onChange={(e) => {
//             setMobile(e.target.value);
//           }}
//         />
//       </View>
//     </View>
//   );
// };

const {height, width} = Dimensions.get('window');
const statusBarHeight = getStatusBarHeight();

const styles = StyleSheet.create({
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
  },
  cardWrap: {
    // position: 'absolute',
    top: Platform.OS === 'ios' ? height * 0.01 : height * 0.02,
    marginHorizontal: width * 0.05,
    borderRadius: 10,
    borderWidth: 1,
    width: width * 0.9,
    zIndex: 1,
  },
  checkBoxWrap: {
    flexDirection: 'row',
    paddingVertical: height * 0.015,
  },
  text: {
    fontSize: RFValue(13),
  },
  radioText: {
    alignSelf: 'center',
    marginLeft: width * 0.03,
    marginRight: width * 0.02,
    fontSize: RFValue(13),
  },
  contactrowWrap: {
    flexDirection: 'row',
    paddingHorizontal: width * 0.03,
    paddingVertical: Platform.OS === 'ios' ? height * 0.015 : height * 0.01,
  },
  rowWrap: {
    paddingHorizontal: width * 0.03,
    paddingVertical: Platform.OS === 'ios' ? height * 0.015 : height * 0.01,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowWrap2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.03,
  },
  smalltextInput: {
    width: width * 0.4,
    paddingVertical: height * 0.01,
    borderRightWidth: 1,
    borderRightColor: '#468c64',
    height: Platform.OS === 'ios' ? height * 0.05 : height * 0.06,
  },
  smalltextInput2: {
    width: width * 0.4,
    paddingVertical: height * 0.01,
    paddingLeft: width * 0.02,
    height: Platform.OS === 'ios' ? height * 0.05 : height * 0.06,
  },
  textInput: {
    paddingVertical: height * 0.002,
    paddingHorizontal: width * 0.02,
  },
  contacttextInput: {
    width: width * 0.75,
    paddingVertical: height * 0.002,
    paddingHorizontal: width * 0.02,
  },
  button: {
    width: width * 0.8,
    height: width * 0.13,
    alignSelf: 'center',
    textAlign: 'center',
    // marginTop: Platform.OS === 'ios' ? height * 0.245 : height * 0.1,
    marginBottom: height * 0.03,
    marginTop: width * 0.03,
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
  changeAddressButton: {
    padding: width * 0.02,
    marginLeft: width * 0.05,
    borderRadius: RFValue(15),
  },
});

export default MoveMapScreen;
