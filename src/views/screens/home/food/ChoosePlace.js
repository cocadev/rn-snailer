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
  FlatList,
  RefreshControl,
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';
import NavBar, {LeftButton} from '../../component/NavBar';
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
import {addAddress, deleteAddress} from 'services/address';
import {MoveOrderContext} from 'states/context/moveOrder.context';
import {getAddress} from 'services/address';
import {ParcelOrderContext} from 'states/context/parcelOrder.context';

const ChoosePlace = ({navigation, route}) => {
  const {parcelOrder, dispatchParcelOrder} = useContext(ParcelOrderContext);
  const {savedplace, type} = route.params;
  const parcel = route.params?.parcel;
  const food = route.params?.food;
  const grocery = route.params?.grocery;
  const {address, dispatchAddress} = useContext(AddressContext);
  const {dispatchMoveOrder} = useContext(MoveOrderContext);
  const [refreshing, setRefreshing] = useState(false);
  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const handleGetAddress = async () => {
    try {
      setRefreshing(true);
      const add = await getAddress({t});
      dispatchAddress({type: 'SET_LISTING', payload: add});
    } catch (error) {
      console.log('ChoosePlace -> handleGetAddress err', error);
    } finally {
      setRefreshing(false);
    }
  };

  const navigateToCurrentAddress = () => {
    navigation.navigate('CurrentAddress', parcel ? {
      add_an_address: false,
      parcel: parcel,
    } : {
      add_an_address: false,
    });
  };

  const navigateToAddAddress = () => {
    navigation.navigate('AddAddress', parcel ? {
      add_an_address: false,
      parcel: parcel,
      food: food,
      grocery: grocery,
    } : {
      add_an_address: true,
    });
  };

  const navigateAddDefaultHome = () => {
    navigation.navigate('AddAddress', {chooseWork: false, chooseHome: true});
  };

  const navigateAddDefaultWork = () => {
    navigation.navigate('AddAddress', {chooseWork: true, chooseHome: false});
  };

  const handleEditAddress = (item) => {
    dispatchAddress({
      type: 'ADDRESS_UNDER_EDIT',
      payload: {
        ...item,
        address: {
          ...item.address,
          postcode: item.address.postcode,
        },
        action: 'EDIT_ADDRESS',
      },
    });
    navigation.navigate('MoveMapScreen');
  };

  const handleEditSavedHome = () => {
    dispatchAddress({
      type: 'ADDRESS_UNDER_EDIT',
      payload: {
        ...address.home,
        action: 'EDIT_HOME',
      },
    });
    navigation.navigate('MoveMapScreen');
  };

  const handleEditSavedWork = () => {
    dispatchAddress({
      type: 'ADDRESS_UNDER_EDIT',
      payload: {
        ...address.office,
        action: 'EDIT_OFFICE',
      },
    });
    navigation.navigate('MoveMapScreen');
  };

  const {t, i18n} = useTranslation();
  const handleSelectHome = () => {
    if (!parcel) {
      dispatchAddress({
        type: 'SET_ITEM',
        payload: address.home,
      });
      navigation.navigate('ItemHomePage', {type});
    } else {
      handleForSenderAndReceiver({items: address.home});
    }
  };
  const handleSelectWork = () => {
    if (!parcel) {
      dispatchAddress({
        type: 'SET_ITEM',
        payload: address.office,
      });
      navigation.navigate('ItemHomePage', {type});
    } else {
      handleForSenderAndReceiver({items: address.office});
    }
  };
  const handleSelectOthersAddress = (items) => {
    if (!parcel) {
      dispatchAddress({type: 'SET_ITEM', payload: items});
      navigation.navigate('ItemHomePage', {type});
    } else {
      handleForSenderAndReceiver({items: items});
    }
  };

  const handleForSenderAndReceiver = ({items}) => {
    if (parcel == 'sender') {
      dispatchParcelOrder({
        type: 'SET_SENDER',
        payload: {
          sender: {
            name: items.contact.name,
            contact: items.contact.mobile,
            full_address: items.address.full_address,
            unit_no: items.address.unit_no,
            block: items.address.block,
            level: items.address.level,
            postcode: items.address.postcode,
            location: items.address.location,
          },
        },
      });

      navigation.goBack();
      route.params.onGoBack({address: items.address.full_address, location: items.address.location});
    } else {
      let receiverIn = {
        name: items.contact.name,
        contact: items.contact.mobile,
        full_address: items.address.full_address,
        email: route.params?.receiverEmail,
        postcode: items.address.postcode,
      };

      dispatchParcelOrder({
        type: 'SET_RECEIVER',
        payload: {
          receiver: receiverIn,
        },
      });

      navigation.goBack();
      route.params.onGoBack({receiverInput: receiverIn});
    }
  };

  const handleDeleteSavedAddress = async ({address_id}) => {
    try {
      const success = await deleteAddress({address_id, t});

      if (success) {
        dispatchAddress({
          type: 'DELETE_ADDRESS',
          payload: address_id,
        });
      }
    } catch (e) {
      console.log('ChoosePlace -> deleteAddress err:', e);
    }
  };

  return (
    <NavBar
      title={savedplace ? t('saved_places') : t('choose_a_place')}
      {...{
        LeftButton,
        handleLeftNavButton,
      }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleGetAddress}
          />
        }>
        <View style={{height: 8}}></View>

        <TouchableOpacity
          style={[themes.GREEN_BUTTON, styles.bigbutton]}
          onPress={navigateToCurrentAddress}>
          <Text style={[themes.EDIT_WHITE_TEXT]}>{t('use_current_location')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[themes.GREEN_BUTTON, styles.bigbutton]}
          onPress={navigateToAddAddress}>
          <Text style={[themes.EDIT_WHITE_TEXT]}>{t('add_an_address')}</Text>
          <Text style={[themes.EDIT_WHITE_TEXT, styles.textspacing]}>
            {t('save_your_favourite_place')}
          </Text>
        </TouchableOpacity>
        

        <View style={styles.titleWrap}>
          <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
            {t('favourites')}
          </Text>
        </View>

        {address.home && (
          <TouchableOpacity
            style={[
              themes.GREEN_BOARDER,
              themes.GREEN_BUTTON,
              styles.placeButton,
            ]}
            onPress={savedplace ? handleEditSavedHome : handleSelectHome}>
            <View style={{flexDirection: 'column'}}>
              <View style={[styles.favAddressCol1]}>
                <View style={styles.col1}>
                  <Ionicons
                    name="md-home-outline"
                    size={Platform.OS == 'ios' ? 25 : 20}
                    color="#FFFFFF"
                    style={styles.icon}
                  />
                </View>
                <View style={styles.col2}>
                  <Text style={[themes.EDIT_WHITE_TEXT, styles.buttonText]}>
                    {t('home')}
                  </Text>
                </View>
              </View>
              <View style={[themes.GREEN_BUTTON, styles.favAddressCol2]}>
                <Text
                  style={[themes.EDIT_WHITE_TEXT, {textAlign: 'center'}]}
                  numberOfLines={2}>
                  {address.home?.address?.full_address}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {address.office && (
          <TouchableOpacity
            style={[
              themes.GREEN_BOARDER,
              themes.GREEN_BUTTON,
              styles.placeButton,
            ]}
            onPress={savedplace ? handleEditSavedWork : handleSelectWork}>
            <View style={{flexDirection: 'column'}}>
              <View style={[themes.GREEN_BUTTON, styles.favAddressCol1]}>
                <View style={styles.col1}>
                  <Ionicons
                    name="briefcase-outline"
                    size={Platform.OS == 'ios' ? 25 : 20}
                    color="#FFFFFF"
                    style={styles.icon}
                  />
                </View>
                <View style={styles.col2}>
                  <Text style={[themes.EDIT_WHITE_TEXT, styles.buttonText]}>
                    {t('work')}
                  </Text>
                </View>
              </View>
              <View style={[themes.GREEN_BUTTON, styles.favAddressCol2]}>
                <Text
                  style={[themes.EDIT_WHITE_TEXT, {textAlign: 'center'}]}
                  numberOfLines={2}>
                  {address.office?.address?.full_address}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {!address.home && (
          <TouchableOpacity
            style={[themes.GREEN_BUTTON, styles.button]}
            onPress={navigateAddDefaultHome}>
            <View style={styles.col1}>
              <Ionicons
                name="md-home-outline"
                size={25}
                color="#FFFFFF"
                style={styles.icon}
              />
            </View>
            <View style={styles.col2}>
              <Text style={[themes.EDIT_WHITE_TEXT, styles.buttonText]}>
                {t('add_home')}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {!address.office && (
          <TouchableOpacity
            style={[themes.GREEN_BUTTON, styles.button]}
            onPress={navigateAddDefaultWork}>
            <View style={styles.col1}>
              <Ionicons
                name="briefcase-outline"
                size={25}
                color="#FFFFFF"
                style={styles.icon}
              />
            </View>
            <View style={styles.col2}>
              <Text style={[themes.EDIT_WHITE_TEXT, styles.buttonText]}>
                {t('add_work')}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {address && address.addresses.length > 0 && <View style={styles.titleWrap}>
          <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
            {t('others')}
          </Text>
          
        </View>}

        {address &&
          address.addresses.length > 0 &&
          address.addresses.map((items, value) => {
            if (items.is_home || items.is_office) {
              return null;
            } else {
              const name = items?.address?.full_address.split(',');
              return (
                <OthersAddressCard
                  key={value}
                  onPress={() => {
                    savedplace
                      ? handleEditAddress(items)
                      : handleSelectOthersAddress(items);
                  }}
                  // disabled={savedplace}
                  address={items?.address?.full_address}
                  address_name={name?.[0]}
                  onPressDelete={() =>
                    handleDeleteSavedAddress({
                      address_id: items._id,
                    })
                  }
                />
              );
            }
          })}

        {parcel != 'receiver' && <TouchableOpacity
          style={[themes.GREEN_BUTTON, styles.bigbutton]}
          onPress={navigateToAddAddress}>
          <Text style={[themes.EDIT_WHITE_TEXT]}>{t('add_an_address')}</Text>
          <Text style={[themes.EDIT_WHITE_TEXT, styles.textspacing]}>
            {t('save_your_favourite_place')}
          </Text>
        </TouchableOpacity>}
      </ScrollView>
      
    </NavBar>
  
  );
};

const OthersAddressCard = ({
  onPress,
  disabled,
  address,
  address_name,
  onPressDelete,
}) => {
  return (
    <TouchableOpacity
      style={styles.bigWrapContainer}
      disabled={disabled}
      onPress={onPress}>
      <View style={styles.preciseLocationWrap}>
        <TouchableOpacity onPress={onPressDelete}>
          <View style={styles.column1}>
            <FontAwesome name="bookmark" size={25} color="#468c64" />
          </View>
        </TouchableOpacity>
        <View style={styles.column2}>
          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>{address_name}</Text>
          <Text style={[themes.TEXT_TITLE_GREY, styles.smallText]}>
            {/* 0.21km • */}
            {address}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  bigbutton: {
    width: width * 0.7,
    height: Platform.OS === 'ios' ? height * 0.08 : height * 0.1,
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    marginHorizontal: width * 0.01,
    flexDirection: 'row',
    borderRadius: 15,
    borderWidth: 1,
    fontWeight: 'bold',
    flexDirection: 'column',

    marginHorizontal: width * 0.01,
    marginVertical: height * 0.01,
    // alignItems: 'center',
    // flexDirection: 'column',
    // borderRadius: 15,
    // borderWidth: 1,
    // fontWeight: 'bold',
  },
  button: {
    width: width * 0.7,
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    marginHorizontal: width * 0.01,
    flexDirection: 'row',
    borderRadius: 15,
    borderWidth: 1,
    fontWeight: 'bold',
    ...Platform.select({
      ios: {
        lineHeight: width * 0.06,
        marginVertical: height * 0.005,
        height: height * 0.05,
      },
      android: {
        marginVertical: height * 0.006,
        height: height * 0.065,
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
    fontSize: Platform.OS === 'ios' ? RFValue(13) : RFValue(14),
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
    width: width * 0.1,
    alignItems: 'center',
    alignSelf: 'center',
  },
  column2: {
    width: width * 0.8,
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
    marginRight: width * 0.03,
  },
  textspacing: {
    fontSize: RFValue(10),
    paddingTop: width * 0.01,
  },
  preciseLocationWrap: {
    padding: width * 0.05,

    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bigWrapContainer: {
    marginHorizontal: width * 0.03,
    marginVertical: height * 0.01,
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
  text: {
    fontSize: RFValue(13),
  },
  titleWrap: {
    justifyContent: 'space-between',
    marginHorizontal: width * 0.05,
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
    flexDirection: 'row',
  },
  col1: {
    width: width * 0.08,
  },
  col2: {
    width: width * 0.45,
  },
  icon: {
    alignSelf: 'center',
    marginHorizontal: width * 0.01,
  },
  placeButton: {
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    marginHorizontal: width * 0.01,
    flexDirection: 'row',
    borderRadius: 15,
    borderWidth: 0.5,
    fontWeight: 'bold',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    ...Platform.select({
      ios: {
        lineHeight: width * 0.06,
        marginTop: height * 0.005,
        marginBottom: height * 0.01,
        height: height * 0.11,
      },
      android: {
        marginTop: height * 0.006,
        marginBottom: height * 0.01,
        height: height * 0.135,
      },
      default: {
        alignItems: 'center',
        textAlignVertical: 'center',
      },
    }),
  },
  favAddressCol1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: width * 0.68,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  favAddressCol2: {
    flex: 1,
    alignItems: 'center',
    width: width * 0.68,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingHorizontal: width * 0.05,
  },
  favAddressCol3: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: width * 0.68,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 2
  },
});

export default ChoosePlace;
