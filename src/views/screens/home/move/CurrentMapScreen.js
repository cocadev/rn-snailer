// import React, {useState, useContext, useEffect} from 'react';
// import {
//   StyleSheet,
//   View,
//   Dimensions,
//   Platform,
//   Text,
//   Image,
//   Button,
//   Alert,
//   TouchableOpacity,
// } from 'react-native';

// import {RFValue} from 'styles/ResponsiveFont';

// import NavBar, {LeftButton} from '../../component/NavBar';

// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import {themes} from 'utils/themeProvider';
// import {useTranslation} from 'react-i18next';
// import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
// import {NoDataView} from '../../component/NoDataView';
// import {GOOGLE_MAP_API_KEY} from '../../../../../config';
// import {
//   getAddress,
//   addAddress,
//   changeDefaultHomeAddress,
//   changeDefaultWorkAddress,
//   addDefaultWorkAddress,
// } from 'services/address';
// import {MoveOrderContext} from 'states/context/moveOrder.context';
// import {ParcelOrderContext} from 'states/context/parcelOrder.context';
// import RNLocation, { subscribeToLocationUpdates } from 'react-native-location';
// import {AddressContext, SET_LISTING} from 'states/context/address.context';
// import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
// import Geolocation from '@react-native-community/geolocation';
// import { PermissionsAndroid } from 'react-native';
// import { SafeAreaView } from 'react-native';

// const AddCurrentAddress = ({navigation, route}) => {
//   const {parcelOrder, dispatchParcelOrder} = useContext(ParcelOrderContext);
//   const {address, dispatchAddress} = useContext(AddressContext);
//   const [locationDetails, setLocationDetails] = useState();
//   const handleLeftNavButton = () => { navigation.goBack()};
//   const {t, i18n} = useTranslation();
//   const [onPress, setOnPress] = useState(false);
//   const [chooseAddress, setChooseAddress] = useState(
//     address.addresses.map((item, val) => ({
//       description: item.address,
//       geometry: item.location,
//     })) || [],
//   );
//   // const [currentLocation, setCurrentLocation] = useState(initialState);
//   const [position, setPosition] = useState({
//     latitude: 3.3292,
//     longitude: 101.5899,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0922,
//   });

//   useEffect(() => {
//     const requestLocationPermission = async () => {
//       if (Platform.OS === 'ios') {
//         getOneTimeLocation();
//         subscribeLocationLocation();
//       } else {
//         try {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//             {
//               title: 'Location Access Required',
//               message: 'This App needs to Access your location',
//             }
//           );
//           if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//             Geolocation.getCurrentPosition((pos) => {
//               const crd = pos.coords;
//               setPosition({
//                 latitude: crd.latitude,
//                 longitude: crd.longitude,
//                 latitudeDelta: 0.0922,
//                 longitudeDelta: 0.0421,
//               });
//               console.log(position);
//             },
//               (error) => {
//                   console.log(error.code, error.message);
//               },
//               {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
//           );
//           } else {
//             setLocationStatus('Permission Denied');
//           }
//         } catch (err) {
//           console.warn(err);
//         }
//       }
//     };
//     requestLocationPermission();
//   }, []);

//   return (
//     <NavBar
//       title={'Search Your Place'}
//       {...{
//         LeftButton,
//         handleLeftNavButton,
//         title: t('address'),
//       }}>
//       {/* <MiddleTextInput
//         placeholder="SearchAAA"
//         onPressAddress={onPressAddress}
//         {...{onPress, chooseAddress, t, navigation, dispatchAddress, route}}
//       /> */}
//       <Marker
//         coordinate = {position}
//         description = "This is your places"
//       />
// 				<MapView style={styles.map}
//         minZoomLevel = {20}
//         style = {styles.map}
//         provider = {PROVIDER_GOOGLE}
//         initialRegion = {position}
//         showsUserLocation = {true}
//       />
//     </NavBar>
    
//   );
// };

// const {height, width} = Dimensions.get('window');

// const styles = StyleSheet.create({
//   container: {
// 		flex: 1,
// 		justifyContent: 'center',
// 		alignItems: 'stretch',
// 		backgroundColor: 'gray',
// 	},
// 	map: {
//     flex: 1,
// 		...StyleSheet.absoluteFill,
//     zIndex: -1
// 	},
//   imageContainer: {
//     height: height,
//     justifyContent: 'center',
//   },
//   locationWrap: {
//     ...Platform.select({
//       ios: {
//         zIndex: 1,
//       },
//     }),
//   },
//   preciseLocationWrap: {
//     padding: width * 0.05,

//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   bigWrapContainer: {
//     marginHorizontal: width * 0.02,
//     // marginTop: height * 0.02,
//     backgroundColor: 'white',
//     borderRadius: 30,
//     backgroundColor: '#FFFFFF',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 3,
//     },
//     shadowOpacity: 0.27,
//     shadowRadius: 4.65,
//     elevation: 6,
//     zIndex: -1,
//   },
//   precisecolumn1: {
//     width: width * 0.15,
//     alignItems: 'center',
//     alignSelf: 'center',
//   },
//   column1: {
//     width: width * 0.1,
//     alignItems: 'center',
//     alignSelf: 'center',
//   },
//   column2: {
//     width: width * 0.7,
//     flexDirection: 'column',
//   },
//   column3: {
//     width: width * 0.1,

//     alignItems: 'flex-end',
//     alignSelf: 'center',
//   },
//   smallText: {
//     fontSize: RFValue(10),
//     paddingTop: height * 0.008,
//   },
//   itemWrap: {
//     flexDirection: 'row',
//     marginHorizontal: width * 0.03,
//     paddingVertical: height * 0.02,
//   },
//   preciseitemWrap: {
//     flexDirection: 'row',
//     paddingVertical: Platform.OS === 'ios' ? height * 0.018 : height * 0.02,
//   },
//   collapseCol: {
//     alignSelf: 'center',
//     alignItems: 'center',
//   },
//   collapsecolumn2: {
//     width: width * 0.63,
//     flexDirection: 'column',
//   },
//   collapsecolumn3: {
//     width: width * 0.1,
//     alignSelf: 'center',
//     alignItems: 'flex-end',
//   },
// });

// export default AddCurrentAddress;