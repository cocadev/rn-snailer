import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  BackHandler
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';
import Carousel from 'react-native-snap-carousel';
import Ionicons from 'react-native-vector-icons/Ionicons';
import onetonlorry from '../../../../assets/images/M-1tonlorry.png';
import threetonlorry from '../../../../assets/images/M-3tonlorry.png';
import carmvp from 'assets/images/M-car(mvp).png';
import carsedan from 'assets/images/M-car(sedan).png';
import motorcycle from '../../../../assets/images/M-motorcycle.png';
import pickup from '../../../../assets/images/M-pickup.png';
import van from '../../../../assets/images/M-van.png';

import MoveCarSelection from '../../component/home/MoveCarSelection';
import ChangeOptionModal, { MiddleButton } from '../../component/popup/ChangeDeliveryOption';

import NavBar, { LeftButton, RightButton } from '../../component/NavBar';
import DeleteModal, { LeftRightButton } from '../../component/popup/DeleteConfirmationModal';

import {createMoveOrder} from 'services/order';
import {MoveOrderContext, SET_LISTING} from 'states/context/moveOrder.context';
import {AddressContext} from '../../../../states/context/address.context';
import { formatDate, formatCurrencyWithNoCurrency } from '../../../../utils/helper';
import {FlatList} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';

const MoveScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [modalNaviVisible, setModalNaviVisible] = useState(false);
  const {moveOrder, dispatchMoveOrder} = useContext(MoveOrderContext);
  const {address, dispatchAddress} = useContext(AddressContext);
  const [total, setTotal] = useState(0);
  const [vehicle, setVehicle] = useState('car');
  const [services, setServices] = useState([]);
  const [changedService, setChangedService] = useState(false);
  const [slLength, setSlLength] = useState(0);

  const stayScreen = () => {
    setModalNaviVisible((prev) => !prev);
  };
  const message = t('clear_filled_information_title');
  const subMessage = t('clear_filled_information_subtitle');

  const ButtonNaviBackGroup = () => {
    const left = {
      text: t('no'),
      onPress: stayScreen,
    };
    const right = {
      text: t('yes'),
      onPress: handleClearAddressList,
    };
    return LeftRightButton({option: 'GREEN', left, right});
  };

  const handleClearAddressList = () => {
    setModalNaviVisible(false);
    dispatchMoveOrder({type: 'CLEAR_LISTING'});
    navigation.navigate('HomePage');
  };

  const handleLeftNavButton = () => {
    if (
      moveOrder.pickup.length > 0 ||
      moveOrder.stoplocation.length > 0 ||
      moveOrder.dropoff.length > 0 ||
      moveOrder.move_image.length > 0
    ) {
      setModalNaviVisible(true);
    } else {
      navigation.navigate('HomePage');
    }
  };
  const handleRightNavButton = () => {
    navigation.navigate('Order', {type: 'move'});
  };

  const dispatchObject = ({details, action, changeIndex = null}) => {
    return {
      type: 'ADDRESS_UNDER_EDIT',
      payload: {
        _id: '',
        is_home: false,
        is_office: false,
        address: {
          full_address: details.address,
          unit_no: details.unit_no,
          block: details.block,
          level: details.level,
          postcode: details.postcode,
          location: {
            type: 'Point',
            coordinates: [details.longitude, details.latitude],
          },
        },
        contact: {
          name: details.contact_name,
          mobile: details.contact_phone,
        },
        action,
        changeIndex,
      },
    };
  };

  const navigateToAddAddress_pickup = () => {
    navigation.navigate('AddAddress', {moveMap_pickUp: true});
  };

  const navigateToAddAddress_dropoff = () => {
    navigation.navigate('AddAddress', {moveMap_dropOff: true});
  };

  const navigateToAddAddress_stoplocation = (index = null) => {
    navigation.navigate('AddAddress', {
      moveMap_stopLocation: true,
      changeIndex: index,
    });
  };
  const navigateToMoveMap_pickup = (details) => {
    dispatchAddress(dispatchObject({details, action: 'CHANGE_PICKUP_ADDRESS'}));
    navigation.navigate('MoveMapScreen');
  };

  const navigateToMoveMap_dropoff = (details) => {
    dispatchAddress(
      dispatchObject({details, action: 'CHANGE_DROPOFF_ADDRESS'}),
    );
    navigation.navigate('MoveMapScreen');
  };

  const navigateToMoveMap_stoplocation = (details, changeIndex = null) => {
    dispatchAddress(
      dispatchObject({
        details,
        action: 'EDIT_STOPLOCATION_ADDRESS',
        changeIndex,
      }),
    );
    navigation.navigate('MoveMapScreen');
  };

  const handleRemoveStoplocation = (index) => {
    dispatchMoveOrder({
      type: 'REMOVE_STOPLOCATION_ADDRESS',
      payload: index,
    });
  };

  const handleDeliverButton = () => {
    setTimeModalShow(false);
    setModalVisible(false);
    setDate(new Date());
    setFormattedDate(
      formatDate({timeStamp: new Date(), type: 'dddd, MMMM DD YYYY, h:mm a'}),
    );
  };

  const handleDeliverNow = () => {
    setDate(new Date());
    setFormattedDate(
      formatDate({timeStamp: new Date(), type: 'dddd, MMMM DD YYYY, h:mm a'}),
    );

    if (validateOrder()) {
      navigation.navigate('MoveConfirmOrder', {
        time: formattedDate,
        date: date.toString(),
        vehicle: vehicle,
        services: services,
        total: total,
      });
    }
  };
  const ButtonGroup = () => {
    return MiddleButton({
      onPress: handleModalButton,
      buttonText: t('continue'),
    });
  };

  const checkSLEntered = () => {
    for (let i = 0; i < slLength; i++) {
      if (!moveOrder.stoplocation[i]) return false;
    }
    return true;
  };

  useEffect(() => {
    const backAction = () => {
      handleLeftNavButton();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const coordinates =
      moveOrder.pickup.length > 0 && moveOrder.dropoff.length > 0
        ? [
            {
              longitude: moveOrder.pickup[0].longitude,
              latitude: moveOrder.pickup[0].latitude,
            },
            {
              longitude: moveOrder.dropoff[0].longitude,
              latitude: moveOrder.dropoff[0].latitude,
            },
          ]
        : null;

    setVehicle(type[activeSlide].value);

    const handlePreviewOrder = async () => {
      if (
        moveOrder.pickup.length === 0 ||
        moveOrder.dropoff.length === 0 ||
        (slLength !== 0 && checkSLEntered() === false)
      ) {
        return;
      }
      try {
        const response = await createMoveOrder({
          location: {
            address: moveOrder.pickup[0].address,
            type: 'Point',
            coordinates: [
              moveOrder.pickup[0].longitude,
              moveOrder.pickup[0].latitude,
            ],
            unit_no: moveOrder.pickup[0].unit_no,
            level: moveOrder.pickup[0].level,
            block: moveOrder.pickup[0].block,
            contact_name: moveOrder.pickup[0].contact_name,
            contact_number: moveOrder.pickup[0].contact_phone,
          },
          delivery_time: new Date(),
          orders: {
            destinations: moveOrder.stoplocation
              .concat(moveOrder.dropoff)
              .map((addr) => {
                return {
                  address: addr.address,
                  type: 'Point',
                  longitude: addr.longitude,
                  latitude: addr.latitude,
                  unit_no: addr.unit_no,
                  level: addr.level,
                  block: addr.block,
                  contact_name: addr.contact_name,
                  contact_number: addr.contact_phone,
                };
              }),
            type_of_vehicle: vehicle,
            delivery_items: moveOrder.order.map((ele) => {
              return {
                ...ele,
                // dimension: {
                //   depth: parseInt(ele.dimension.depth * 10),
                //   width: parseInt(ele.dimension.width * 10),
                //   height: parseInt(ele.dimension.height * 10),
                // },
              };
            }),
          },
          services: services,
          order_remark: '',
          rider_remark: '',
          images: [],
          payment_method: 'cash',
          preview: true,
          promo_code: '',
          t,
        });
        if (response.success) {
          setTotal(response.results.amount.total);
        }
      } catch (err) {
        console.log('MoveScreen -> handlePreviewOrder err', err);
      }
    };
    handlePreviewOrder();
  }, [
    moveOrder.order.length,
    moveOrder.pickup.length,
    moveOrder.stoplocation.length,
    moveOrder.dropoff.length,
    services,
    vehicle,
  ]);

  useEffect(() => {
    const temp = addService.filter((item) => {
      if (item.checked === true) {
        return item.value;
      }
    });

    if (temp.length > 0) {
      const servicesArr = temp.map((s) => {
        if (s.value === 'return_trip') {
          return vehicle === 'car' ? `car_${s.value}` : `motorbike_${s.value}`;
        } else {
          return s.value;
        }
      });
      setServices(servicesArr);
    } else {
      setServices([]);
    }

    setChangedService(false);
  }, [changedService, vehicle]);

  const [activeSlide, setActiveSlide] = useState(0);
  const [type, setType] = useState([
    // {photo: onetonlorry, type: t('1ton_lorry'), value: '1-Ton Lorry'},
    // {photo: threetonlorry, type: t('3ton_lorry'), value: '3-Ton Lorry'},
    {photo: carsedan, type: t('car_sedan'), value: 'car'},
    // {photo: carmvp, type: t('car_mpv'), value: 'MPV'},
    {photo: motorcycle, type: t('motorcycle'), value: 'motorbike'},
    // {photo: pickup, type: t('pickup_4v4'), value: 'Pickup(4x4)'},
    // {photo: van, type: t('van'), value: 'Van'},
  ]);

  const [addService, setAddservice] = useState([
    {
      add_service: t('personal_shopper') + ' (RM 4)',
      value: 'personal_shopper',
      checked: false,
    },
    {
      add_service: t('extra_care_insurance') + ' (RM 1)',
      value: 'extra_care_insurance',
      checked: false,
    },
    // {
    //   add_service: t('return_trip'),
    //   value: 'return_trip',
    //   checked: false,
    // },
    {
      add_service: t('door_to_door_delivery') + ' (RM 4)',
      value: 'door_to_door_delivery',
      checked: false,
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [showTimeModal, setTimeModalShow] = useState(true);
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState(
    formatDate({timeStamp: new Date(), type: 'dddd, MMMM DD YYYY, h:mm a'}),
  );
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowTimePicker(false);
    setDate(currentDate);
    setFormattedDate(
      formatDate({timeStamp: currentDate, type: 'dddd, MMMM DD YYYY, h:mm a'}),
    );
  };

  const validateOrder = () => {
    if (moveOrder.pickup.length === 0) {
      alert(t('alert_error_moveScreenjs_1'));
    } else if (moveOrder.dropoff.length === 0) {
      alert(t('alert_error_moveScreenjs_2'));
    } else if (slLength > 0 && checkSLEntered() === false) {
      alert(t('alert_error_moveScreenjs_10'));
    } else if (moveOrder.move_image.length === 0) {
      alert(t('alert_error_moveScreenjs_9'));
    } else {
      return true;
    }
  };

  const navigateToChangeOptionModal = () => {
    if (validateOrder()) {
      setModalVisible((prev) => !prev);
      setTimeModalShow(true);
    }
  };

  const handleModalButton = () => {
    if (validateOrder()) {
      setModalVisible((prev) => !prev);
      navigation.navigate('MoveConfirmOrder', {
        time: formattedDate,
        date: date.toString(),
        vehicle: vehicle,
        total: total,
        services: services,
      });
    }
  };

  const modalMessage = t('change_option');

  const TimeButtonGroup = () => {
    return MiddleButton({
      onPress: handleModalButton,
      buttonText: t('set_pickup_time'),
    });
  };
  const handleScheduleButton = () => {
    setTimeModalShow(false);
    setModalVisible(false);
  };

  const handleModalChevronLeftButton = () => {
    setTimeModalShow(false);
    setModalVisible(false);
  };

  const handleChangeVehicleType = (index) => {
    setActiveSlide(index);
    setVehicle(type[index].value);
  };

  const navigateToAdditionalServices = (type) => {
    let param = '';
    if (type === 'personal_shopper') {
      param = 'Shopper';
    } else if (type === 'extra_care_insurance') {
      param = 'Care';
    } else if (type === 'return_trip') {
      param = 'Trip';
    } else if (type === 'door_to_door_delivery') {
      param = 'Door';
    }
    navigation.navigate('AdditionalServices', {param});
  };

  const handleAddImage = async () => {
    if (moveOrder.move_image.length >= 4) alert(t('maximum_4_image_allow'));
    else {
      try {
        const image = await ImagePicker.openPicker({
          multiple: true,
          compressImageQuality: 0.5,
          maxFiles: 4 - moveOrder.move_image.length,
        });
        dispatchMoveOrder({
          type: 'ADD_IMAGE',
          payload: image,
        });
      } catch (error) {
        console.log('handleAddImage -> error', error);
      } finally {
      }
    }
  };

  const handleAddImageCam = async () => {
    if (moveOrder.move_image.length >= 4) alert(t('maximum_4_image_allow'));
    else {
      try {
        const image = await ImagePicker.openCamera({
          cropping: true,
          compressImageQuality: 0.5,
        });
        dispatchMoveOrder({
          type: 'ADD_IMAGE',
          payload: [image],
        });
      } catch (error) {
        console.log('handleAddImage -> error', error);
      } finally {
      }
    }
  };

  const handleDeleteImage = (x) => {
    try {
      dispatchMoveOrder({
        type: 'DELETE_IMAGE',
        payload: x,
      });
    } catch (e) {
      console.log('handleDeleteImage -> e', e);
    }
  };

  const carousel = useRef(null);
  return (
    <>
      <NavBar
        title={t('move')}
        {...{
          LeftButton,
          handleLeftNavButton,
          RightButton: RightButton({button: 'History', handleRightNavButton}),
        }}>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <ScrollView>
            <View style={styles.carouselContainer}>
              <Carousel
                removeClippedSubviews={false}
                ref={carousel}
                data={type}
                renderItem={({item, index}) => {
                  return (
                    <MoveCarSelection
                      key={index}
                      image={item.photo}
                      onPress={() => {
                        carousel.current.snapToItem(index);
                        handleChangeVehicleType(index);
                      }}
                    />
                  );
                }}
                scrollEnabled={false}
                windowSize={1}
                sliderWidth={width}
                itemWidth={width * 0.25}
                layout={'default'}
                firstItem={4}
                inactiveSlideShift={height * 0.02}
                inactiveSlideOpacity={0.7}
                loop={false}
              />
            </View>
            <View>
              <Text style={[themes.GREEN_BUTTON, styles.carType]}>
                {type[activeSlide].type}
              </Text>
            </View>
            <LocationSection
              {...{
                navigateToAddAddress_pickup,
                navigateToAddAddress_dropoff,
                navigateToAddAddress_stoplocation,
                navigateToMoveMap_pickup,
                navigateToMoveMap_dropoff,
                navigateToMoveMap_stoplocation,
                moveOrder,
                handleRemoveStoplocation,
                slLength,
                setSlLength,
              }}
            />
            {/* TEST */}
            <View style={[themes.GREEN_BOARDER, themes.BACKGROUND_WHITE_WRAP, styles.orderDetailWrap]}>
              <View style={[themes.GREEN_BOARDER_BOTTOM, {borderBottomWidth: 1}]}>
                <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.title]}>
                  {t('add_images')}
                </Text>
              </View>
              <View style={{height: 8}}></View>
              <View>
                <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.subTitle]}>
                  {t('upload_at_least_one_image_for_your_order')}
                </Text>
                <TouchableOpacity style={themes.SHADOW_DEFAULT} onPress={handleAddImage}>
                  <Text style={[themes.GREEN_BOARDER, themes.EDIT_GREEN_TEXT, styles.addImage]}>
                    {t('add_images_from_library')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={themes.SHADOW_DEFAULT} onPress={handleAddImageCam}>
                  <Text style={[ themes.GREEN_BOARDER, themes.EDIT_GREEN_TEXT, styles.addImage]}>
                    {t('add_images_using_camera')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{}}>
                {moveOrder && (
                  <FlatList
                    data={moveOrder.move_image}
                    keyExtractor={(item, value) => value.toString()}
                    numColumns={2}
                    renderItem={({item, index}) => {
                      return (
                        <View style={styles.imageWrapRow}>
                          <View style={styles.imageCol1}>
                            <Image source={{uri: item.path}} style={styles.image} />
                            <TouchableOpacity style={[styles.imageRightButton, themes.BUTTON_GREEN]} onPress={() => handleDeleteImage(item)}>
                              <Ionicons name="close" size={18} style={themes.ICON_COLOR_WHITE}/>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    }}
                  />
                )}
              </View>
            </View>

            <View style={[themes.GREEN_BOARDER, themes.BACKGROUND_WHITE_WRAP, styles.orderDetailWrap]}>
              <View style={[themes.GREEN_BOARDER_BOTTOM, {borderBottomWidth: 1}]}>
                <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.title]}>
                  {t('additional_services')}
                </Text>
              </View>
              <View style={{height: 8}}></View>

              {addService && addService.map((item, index) => {
                return (
                  <AdditionalService
                    key={index}
                    item={item}
                    {...{
                      index, vehicle,
                      setAddservice,
                      addService,
                      setChangedService,
                      navigateToAdditionalServices,
                    }}
                  />
                );
              })}
            </View>
            <View style={{height: 10}}></View>
          </ScrollView>

          <View style={themes.BACKGROUND_WHITE_WRAP}>
            {moveOrder.move_image.length > 0 > 0 ? (
              <View style={styles.stickyTotal}>
                <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
                  {t('total1')}
                </Text>
                <Text style={[themes.EDIT_GREEN_TEXT]}>
                  {t('RM')} {formatCurrencyWithNoCurrency(total)}
                </Text>
              </View>
            ) : null}

            <View style={styles.twoButtonWrap}>
              <TouchableOpacity onPress={navigateToChangeOptionModal}>
                <Text
                  style={
                    moveOrder.pickup.length > 0 &&
                    moveOrder.dropoff.length > 0 &&
                    moveOrder.move_image.length > 0 &&
                    checkSLEntered()
                      ? [
                          themes.GREEN_BOARDER,
                          themes.EDIT_GREEN_TEXT,
                          styles.button,
                        ]
                      : [themes.GREY_BUTTON, styles.button]
                  }>
                  {t('schedule')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeliverNow}>
                <Text
                  style={
                    moveOrder.pickup.length > 0 &&
                    moveOrder.dropoff.length > 0 &&
                    moveOrder.move_image.length > 0 &&
                    checkSLEntered()
                      ? [themes.GREEN_BUTTON, styles.button]
                      : [themes.GREY_BUTTON, styles.button]
                  }>
                  {t('deliver_now')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <ChangeOptionModal
            {...{
              title: modalMessage,
              navigation,
              modalVisible,
              setModalVisible,
              showTimeModal,
              setTimeModalShow,
              handleDeliverButton,
              handleScheduleButton,
              ButtonGroup,
              TimeButtonGroup,
              handleModalChevronLeftButton,
              date,
              formattedDate,
              onChange,
              showTimePicker,
              setShowTimePicker,
            }}
          />
        </KeyboardAvoidingView>
      </NavBar>

      <DeleteModal
        {...{
          message: message,
          subMessage: subMessage,
          modalVisible: modalNaviVisible,
          setModalVisible: setModalNaviVisible,
          ButtonGroup: ButtonNaviBackGroup,
        }}
      />
    </>
  );
};

const AdditionalService = ({
  item,
  index: serviceIndex,
  setAddservice,
  addService,
  vehicle,
  setChangedService,
  navigateToAdditionalServices,
}) => {
  return (
    <>
      <View style={styles.bottomRowWrap}>
        <View style={styles.bottomCol1}>
          <TouchableOpacity
            onPress={() => {
              setAddservice((prev) => {
                prev[serviceIndex].checked = !prev[serviceIndex].checked;
                return [...prev];
              });
              setChangedService(true);
            }}>
            {item.checked ? (
              <View style={[themes.GREEN_BUTTON, styles.checkboxWrap]}>
                <Text style={[styles.text, themes.ICON_COLOR_WHITE]}>✓</Text>
              </View>
            ) : (
              <View style={[themes.GREEN_BOARDER, styles.checkboxWrap]} />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.bottomCol2}>
          <Text style={themes.NORMAL_TEXT_BLACK_BOLD}>
            {item.add_service}
            {item.value === 'return_trip'
              ? vehicle === 'car'
                ? ' (RM 10)'
                : ' (RM 4)'
              : null}
          </Text>
          <TouchableOpacity
            onPress={() => navigateToAdditionalServices(item.value)}>
            <Image
              source={pickup}
              style={[themes.GREEN_BOARDER, styles.serviceIconWrap]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const LocationSection = ({
  navigateToAddAddress_pickup,
  navigateToAddAddress_dropoff,
  navigateToAddAddress_stoplocation,
  navigateToMoveMap_pickup,
  navigateToMoveMap_dropoff,
  navigateToMoveMap_stoplocation,
  moveOrder,
  handleRemoveStoplocation,
  slLength,
  setSlLength,
}) => {
  const {t, i18n} = useTranslation();
  const handleAddLocation = () => {
    if (slLength < 10) {
      setSlLength((prev) => prev + 1);
    }
  };

  const handleMinusLocation = (index) => {
    setSlLength((prev) => prev - 1);
    handleRemoveStoplocation(index);
  };

  const PickUpRow = () => {
    return (
      <TouchableOpacity
        onPress={() =>
          moveOrder.pickup.length > 0
            ? navigateToMoveMap_pickup(moveOrder.pickup[0])
            : navigateToAddAddress_pickup()
        }
        style={styles.pickUpContainer}>
        <View style={[themes.GREEN_BUTTON, styles.toIcon]}>
          <Text style={themes.EDIT_WHITE_TEXT}>{t('FR')}</Text>
        </View>
        {moveOrder && moveOrder.pickup.length > 0 ? (
          <View style={styles.locationText}>
            <Text style={themes.NORMAL_TEXT_BLACK_BOLD} numberOfLines={3}>
              {moveOrder.pickup[0].address}
            </Text>
          </View>
        ) : (
          <View style={styles.locationText}>
            <Text style={themes.TEXT_TITLE_LIGHTGREY}>
              {t('pick_up_location')}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const DropOffRow = () => {
    return (
      <TouchableOpacity
        onPress={() =>
          moveOrder.dropoff.length > 0
            ? navigateToMoveMap_dropoff(moveOrder.dropoff[0])
            : navigateToAddAddress_dropoff()
        }
        style={styles.dropOffContainer}>
        <View style={[themes.GREEN_BUTTON, styles.toIcon]}>
          <Text style={themes.EDIT_WHITE_TEXT}>{t('TO')}</Text>
        </View>
        {moveOrder && moveOrder.dropoff.length > 0 ? (
          <View style={styles.locationDropOffText}>
            <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]} numberOfLines={3}>
              {moveOrder.dropoff[0].address}
            </Text>
          </View>
        ) : (
          <View style={styles.locationDropOffText}>
            <Text style={themes.TEXT_TITLE_LIGHTGREY}>
              {t('drop_off_location')}
            </Text>
          </View>
        )}
        <TouchableOpacity
          onPress={handleAddLocation}
          style={[themes.GREEN_BUTTON, styles.addIcon]}>
          <Text style={themes.EDIT_WHITE_TEXT}>{t('+')}</Text>
        </TouchableOpacity>
        <View style={[themes.GREEN_BUTTON, styles.circleWrapTop]} />
      </TouchableOpacity>
    );
  };

  const MiddleRow = () => {
    const stopLocations = [];

    for (let index = 0; index < slLength; index++) {
      stopLocations.push(
        <>
        <View style={[themes.GREEN_BOARDER_BOTTOM, styles.locationBorder]} />
          <TouchableOpacity
            onPress={() =>
              moveOrder.stoplocation[index]
                ? navigateToMoveMap_stoplocation(
                    moveOrder.stoplocation[index],
                    index,
                  )
                : navigateToAddAddress_stoplocation(index)
            }
            key={index}
            style={[styles.middleContainer]}>
            <View style={[themes.GREEN_BUTTON, styles.toIcon]}>
              <Text style={themes.EDIT_WHITE_TEXT}>{t('SL')}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              {moveOrder && moveOrder.stoplocation[index] ? (
                <View style={[styles.locationDropOffText]}>
                  <Text style={themes.NORMAL_TEXT_BLACK_BOLD} numberOfLines={3}>
                    {moveOrder.stoplocation[index]?.address}
                  </Text>
                </View>
              ) : (
                <View style={styles.locationDropOffText}>
                  <Text style={themes.TEXT_TITLE_LIGHTGREY}>
                    {t('stop_location')}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                onPress={() => handleMinusLocation(index)}
                style={[themes.GREEN_BUTTON, styles.addIcon]}>
                <Text style={themes.EDIT_WHITE_TEXT}>{t('-')}</Text>
              </TouchableOpacity>
            </View>
            <View style={[themes.GREEN_BUTTON, styles.circleWrapTop]} />
          </TouchableOpacity>
          
        </>,
      );
    }

    return stopLocations;
  };

  return (
    <View
      style={[
        themes.GREEN_BOARDER,
        themes.BACKGROUND_WHITE_WRAP,
        styles.locationWrap,
      ]}>
      <PickUpRow />
      <View style={[themes.GREEN_BOARDER_BOTTOM, styles.locationBorder]} />
      <DropOffRow />
      {MiddleRow()}
    </View>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  carouselContainer: {
    marginTop: height * 0.03,
    height: Platform.OS === 'ios' ? height * 0.15 : height * 0.15,
  },
  carType: {
    width: width * 0.4,
    alignSelf: 'center',
    textAlign: 'center',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    fontSize: RFValue(14),
    fontWeight: 'bold',
    ...Platform.select({
      ios: {
        alignItems: 'center',
        lineHeight: width * 0.1,
        height: width * 0.1,
      },
      android: {
        textAlignVertical: 'center',
        height: height * 0.06,
      },
      default: {
        alignItems: 'center',
        textAlignVertical: 'center',
      },
    }),
  },
  imageRightButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.05,
    height: width * 0.05,
    right: 0,
    top: 0,
  },
  column1: {
    width: width * 0.2,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.012,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
  },
  col2row1: {
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  col2row2: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  row2: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  locationIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: 25,
    borderWidth: 1,
  },
  fromWrap: {
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: 250,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fromText: {
    fontSize: RFValue(15),
  },
  firstdot: {
    width: width * 0.03,
    height: width * 0.03,
    borderRadius: 250,
    alignSelf: 'center',
    marginTop: height * 0.005,
  },
  seconddot: {
    width: width * 0.025,
    height: width * 0.025,
    borderRadius: 250,
    alignSelf: 'center',
    marginTop: height * 0.005,
    opacity: 0.8,
  },
  thirddot: {
    width: width * 0.02,
    height: width * 0.02,
    borderRadius: 250,
    alignSelf: 'center',
    marginTop: height * 0.005,
    opacity: 0.6,
  },
  toWrap: {
    marginTop: height * 0.005,
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: 250,
    borderWidth: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallText: {
    marginTop: height * 0.01,
  },
  nulllocationText: {
    paddingVertical: height * 0.02,
  },
  title: {
    paddingHorizontal: width * 0.03,
    paddingBottom: height * 0.01,
  },
  orderDetailWrap: {
    marginTop: height * 0.045,
    marginHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
    borderWidth: 1,
    borderRadius: 10,
  },
  table: {
    marginHorizontal: width * 0.03,
    marginVertical: height * 0.02,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BBDB9C',
  },
  subColumnText: {
    fontSize: RFValue(11),
    textAlign: 'center',
  },
  subsubColumnText: {
    width: width * 0.1,
    fontSize: RFValue(11),
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrap: {
    // flex: 1,
    borderColor: '#cccccc',
    borderBottomWidth: 0,
    marginBottom: 0,
    alignItems: 'center',
  },
  subColumn1: {
    width: width * 0.28,
    paddingVertical: height * 0.008,
    justifyContent: 'center',
  },
  subColumn2: {
    width: width * 0.35,
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#BBDB9C',
    borderRightWidth: 1,
    borderRightColor: '#BBDB9C',
    paddingVertical: height * 0.008,
    justifyContent: 'center',
  },
  subColumn3: {
    width: width * 0.15,
    borderRightWidth: 1,
    borderRightColor: '#BBDB9C',
    alignItems: 'center',
    paddingVertical: height * 0.008,
    justifyContent: 'center',
  },
  subColumn4: {
    width: width * 0.07,
    alignItems: 'center',
    paddingVertical: height * 0.008,
    justifyContent: 'center',
  },
  plusIconWrap: {
    marginVertical: height * 0.025,
    marginHorizontal: width * 0.03,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    width: width * 0.09,
    height: width * 0.09,
    borderRadius: 250,
    borderWidth: 1,
  },
  serviceIconWrap: {
    marginHorizontal: width * 0.03,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    width: width * 0.07,
    height: width * 0.07,
    borderRadius: 250,
    borderWidth: 1,
  },
  addImage: {
    width: width * 0.5,
    alignSelf: 'center',
    textAlign: 'center',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    fontSize: RFValue(14),
    fontWeight: 'bold',
    marginTop: height * 0.005,
    marginBottom: height * 0.015,
    ...Platform.select({
      ios: {
        alignItems: 'center',
        lineHeight: width * 0.1,
        height: width * 0.11,
      },
      android: {
        textAlignVertical: 'center',
        height: height * 0.065,
      },
      default: {
        alignItems: 'center',
        textAlignVertical: 'center',
      },
    }),
  },
  bottomRowWrap: {
    flexDirection: 'row',
    marginVertical: height * 0.01,
    marginHorizontal: width * 0.05,
  },
  bottomCol1: {
    width: width * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subTitle: {
    paddingVertical: height * 0.01,
    textAlign: 'center',
  },
  checkboxWrap: {
    width: width * 0.05,
    height: width * 0.05,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  bottomCol2: {
    width: width * 0.7,
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  stickyTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.12,
    marginTop: height * 0.015,
  },
  button: {
    width: width * 0.44,
    height: width * 0.13,
    alignSelf: 'center',
    textAlign: 'center',
    overflow: 'hidden',
    borderRadius: 25,
    borderWidth: 1,
    fontWeight: 'bold',
    fontSize: RFValue(14),
    ...Platform.select({
      ios: {
        alignItems: 'center',
        lineHeight: width * 0.12,
        height: width * 0.12,
        marginBottom: width * 0.06,
        marginTop: width * 0.03,
      },
      android: {
        textAlignVertical: 'center',
        marginVertical: width * 0.03,
      },
      default: {
        alignItems: 'center',
        textAlignVertical: 'center',
      },
    }),
  },
  text: {
    fontSize: RFValue(13),
  },
  twoButtonWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.05,
  },
  locationWrap: {
    marginTop: height * 0.03,
    marginHorizontal: width * 0.04,
    borderWidth: 1,
    borderRadius: 10,
  },
  pickUpContainer: {
    flexDirection: 'row',
    // padding: height * 0.02,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  dropOffContainer: {
    flexDirection: 'row',
    // padding: height * 0.02,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  middleContainer: {
    flexDirection: 'row',
    // padding: height * 0.02,
  },
  toIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5000,
    padding: width * 0.02,
    margin: height * 0.02,
    height: height * 0.06,
    width: height * 0.06,
  },
  locationText: {
    width: width * 0.65,
    justifyContent: 'center',
  },
  locationDropOffText: {
    width: width * 0.53,
    justifyContent: 'center',
  },
  addIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5000,
    height: height * 0.045,
    width: height * 0.045,
    alignSelf: 'center',
    padding: width * 0.02,
    marginHorizontal: height * 0.019,
  },
  circleWrapBottom: {
    width: width * 0.03,
    height: width * 0.03,
    borderRadius: 100,
    position: 'absolute',
    bottom: height * 0.003,
    left: height * 0.042,
  },
  circleWrapTop: {
    width: width * 0.02,
    height: width * 0.02,
    borderRadius: 100,
    position: 'absolute',
    top: height * 0.005,
    left: height * 0.0445,
    opacity: 0.8,
  },
  locationBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#468c64',
    width: width * 0.7,
    alignSelf: 'flex-end',
  },
  imageWrapRow: {
    flexDirection: 'row',
    marginVertical: height * 0.02,
    marginHorizontal: width * 0.03,
    justifyContent: 'space-between',
  },
  imageCol1: {
    width: width * 0.4,
    height: width * 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width * 0.4,
    height: width * 0.4,
  },
});

export default MoveScreen;
