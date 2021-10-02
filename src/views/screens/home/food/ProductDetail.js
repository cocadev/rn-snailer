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
  AppState,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {RFValue} from 'styles/ResponsiveFont';
import {SearchBar} from 'react-native-elements';

import SubNavBar, {
  LeftButton,
  Title,
  SubTitle,
} from '../../component/SubNavBar';
import ChangeOptionModal, {
  MiddleButton,
  LeftRightButton,
} from '../../component/popup/ChangeDeliveryOption';
import DeleteConfirmationModal, {
  LeftRightButton as DeleteLeftRightButton,
} from '../../component/popup/DeleteConfirmationModal';
import EnterPIN, {PINMiddleButton} from '../../component/popup/EnterPIN';
import {createFoodOrder, createGoodsOrder} from 'services/order';
import {getPaymentStatus} from 'services/payment';
import {verifyPin} from '../../../../services/pin';
import WSS from 'services/websocket';
import OrderStatus, {TryButton} from '../../component/popup/OrderStatus';
import {ScrollView, RotationGestureHandler} from 'react-native-gesture-handler';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';
import {SwipeListView} from 'react-native-swipe-list-view';
import SoundPlayer from 'react-native-sound-player';

import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';
import googlemap from '../../../../assets/images/googlemap.png';
import delivery from '../../../../assets/icons/delivery.png';
import selfpickup from '../../../../assets/icons/selfpickup.png';
import cash from '../../../../assets/icons/payment-cash.png';
import online from '../../../../assets/icons/payment-onlinebanking.png';
import wallet from '../../../../assets/icons/payment-snailerwallet.png';

import {AddressContext} from 'states/context/address.context';
import {BasketContext} from 'states/context/basket.context';
import {PaymentOrderContext} from 'states/context/paymentOrder.context';
import AddNoteModal, {ButtonColor} from '../../component/popup/AddNoteModal';

import {
  updateOrderStatus,
  riderAcceptedOrder,
  syncRiderLocationSuccess,
  saveOrderToRedux,
  clearLatestOrder,
} from 'states/redux/ActionCreators/order';

import {
  formatDate,
  formatCurrencyWithNoCurrency,
} from '../../../../utils/helper';

import {CONSUMER_CONFIRM_TIME} from '../../../../../config';
import {Loader} from '../../component/Loader';
import payment_id from '../../../../assets/payment_id.json';

const ProductDetail = ({
  navigation,
  route,
  _updateOrderStatus,
  _riderAcceptedOrder,
  _syncRiderLocationSuccess,
  _saveOrderToRedux,
  _clearLatestOrder,
  orderStat,
}) => {
  const {t, i18n} = useTranslation();
  const {address, dispatchAddress} = useContext(AddressContext);
  const {basket, dispatchBasket} = useContext(BasketContext);
  const {paymentOrder, dispatchPaymentOrder} = useContext(PaymentOrderContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [PINmodalVisible, PINsetModalVisible] = useState(false);
  const [STATUSmodalVisible, STATUSsetmodalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [riderNoteModalVisible, setRiderNoteModalVisible] = useState(false);
  const [storeNoteModalVisible, setStoreNoteModalVisible] = useState(false);
  const [showTimeModal, setTimeModalShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState(
    formatDate({timeStamp: new Date(), type: 'dddd, MMMM DD YYYY, h:mm a'}),
  );
  const [placeOrderTimer, setPlaceOrderTimer] = useState();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pin, setPin] = useState('');
  const [riderNote, setRiderNote] = useState('');
  const [storeNote, setStoreNote] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('rider');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [hideButton, setHideButton] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [invalidPromoCode, setInvalidPromoCode] = useState(false);

  const selected_address = address.selected_address?.address;
  const viewOnly = route.params?.viewOnly ? true : false;
  const viewOrder = route.params?.viewOrder ? route.params.viewOrder : null;
  const type = route.params.viewOnly
    ? route.params.viewOrder.item_type
    : basket.order && basket.order.length > 0
    ? basket.order[0].type
    : null;
  const handleGetPaymentStatus = async () => {
    try {
      setPaymentLoading(true);
      const payment_success = await getPaymentStatus({
        type: 'order',
        order_id: paymentOrder._id,
      });

      if (payment_success) {
        STATUSsetmodalVisible(true);
        successFunction({response: {success: true, results: paymentOrder}});
      } else {
        alert(t('fail_payment'));
      }
    } catch (err) {
    } finally {
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    if (route.params?.test) {
      if (paymentOrder) handleGetPaymentStatus();
    }
  }, [route.params?.test]);

  const previewFoodOrder = async () => {
    let response;
    try {
      setPaymentLoading(true);
      response = await createFoodOrder({
        store_id: basket.store_id,
        branch_id: basket.branch_id,
        address: selected_address,
        order: basket.order,
        order_remark: storeNote,
        rider_remark: riderNote,
        delivery_time: date,
        preview: true,
        payment_method:
          (paymentMethod !== 'cash' && paymentMethod !== 'wallet') ||
          (paymentMethod === 'cash' && deliveryMethod === 'self_pick_up')
            ? 'online'
            : paymentMethod,
        delivery_method: deliveryMethod,
        promo_code: promoCode ? promoCode.toUpperCase() : '',
        pin: pin,
        t,
      });
      console.log({
        store_id: basket.store_id,
        branch_id: basket.branch_id,
        address: selected_address,
        order: basket.order,
        order_remark: storeNote,
        rider_remark: riderNote,
        delivery_time: date,
        preview: true,
        payment_method:
          (paymentMethod !== 'cash' && paymentMethod !== 'wallet') ||
          (paymentMethod === 'cash' && deliveryMethod === 'self_pick_up')
            ? 'online'
            : paymentMethod,
        delivery_method: deliveryMethod,
        promo_code: promoCode ? promoCode.toUpperCase() : '',
        pin: pin,
        t,
      })

      const {success, results} = response;
      if (success) {
        dispatchBasket({type: 'SET_PREVIEW', payload: results});
        setInvalidPromoCode(false);
      } else {
        setInvalidPromoCode(true);
        setPromoCode('');
        dispatchBasket({type: 'SET_VOUCHER_FAILED'});
        alert(t(response.message));
      }
    } catch (err) {
      
      setPaymentLoading(false);
      if (response?.message) {
        Alert.alert(t(response.message));
      } else {
        Alert.alert(t('error'), t('preview_order_alert'), [
          {
            text: t('OK'),
            onPress: handleLeftNavButton,
          },
        ]);
        dispatchBasket({type: 'CLEAR_BASKET'});
      }
    } finally {
      setPaymentLoading(false);
    }
  };

  const previewGoodsOrder = async () => {
    let response;
    try {
      setPaymentLoading(true);
      response = await createGoodsOrder({
        store_id: basket.store_id,
        branch_id: basket.branch_id,
        address: selected_address,
        order: basket.order,
        order_remark: storeNote,
        rider_remark: riderNote,
        delivery_time: date,
        preview: true,
        payment_method:
          (paymentMethod !== 'cash' && paymentMethod !== 'wallet') ||
          (paymentMethod === 'cash' && deliveryMethod === 'self_pick_up')
            ? 'online'
            : paymentMethod,
        delivery_method: deliveryMethod,
        promo_code: promoCode ? promoCode.toUpperCase() : '',
        t,
      });

      const {success, results} = response;
      if (success) {
        dispatchBasket({type: 'SET_PREVIEW', payload: results});
        setInvalidPromoCode(false);
      } else {
        setInvalidPromoCode(true);
        setPromoCode('');
        dispatchBasket({type: 'SET_VOUCHER_FAILED'});
        alert(t(response.message));
      }
    } catch (err) {
      setPaymentLoading(false);
      if (response?.message) {
        Alert.alert(t(response.message));
      } else {
        Alert.alert(t('error'), t('preview_order_alert'), [
          {
            text: t('OK'),
            onPress: handleLeftNavButton,
          },
        ]);
        dispatchBasket({type: 'CLEAR_BASKET'});
      }
    } finally {
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    if (deliveryMethod === 'self_pick_up' && paymentMethod === 'cash') {
      setPaymentMethod('online');
      setSelectedPaymentMethod(false);
    }
    if (!viewOnly && basket.order.length > 0) {
      if (type == 'food') {
        previewFoodOrder();
      } else {
        previewGoodsOrder();
      }
    }
  }, [basket.order, paymentMethod, deliveryMethod]);

  useEffect(() => {
    dispatchPaymentOrder({
      type: 'CLEAR',
    });
    _clearLatestOrder();
  }, []);

  useEffect(() => {
    if (route.params?.paymentMethod) {
      setPaymentMethod(route.params.paymentMethod);
      setSelectedPaymentMethod(true);
    }
  }, [route.params]);

  useEffect(() => {
    if (
      orderPlaced &&
      orderStat.latest_order &&
      orderStat.latest_order.status === 'rider_picking_up'
    ) {
      STATUSsetmodalVisible(false);
      dispatchBasket({type: 'CLEAR_LISTING'});
      navigation.replace('MapDeliveryScreen');
    }
    // else if (
    //   orderStat.latest_order &&
    //   orderStat.latest_order.status === 'cancelled_by_platform'
    // ) {
    // dispatchBasket({type: 'CLEAR_LISTING'});
    // }
  }, [orderStat]);

  useEffect(() => {
    let unsubscribe = null;
    unsubscribe = SoundPlayer.addEventListener(
      'FinishedLoadingFile',
      ({success}) => {},
    );

    SoundPlayer.loadSoundFile('notification', 'mp3');

    return () => {
      if (unsubscribe) {
        unsubscribe.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (STATUSmodalVisible) {
      try {
        SoundPlayer.play();
      } catch (err) {}
    }
  }, [STATUSmodalVisible]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowTimePicker(false);
    setDate(currentDate);
    setFormattedDate(
      formatDate({timeStamp: currentDate, type: 'dddd, MMMM DD YYYY, h:mm a'}),
    );
  };

  const handleLeftNavButton = () => {
    navigation.goBack();
  };
  const navigateToChangeAddress = () => {
    navigation.navigate('ChangeAddress');
  };
  const navigateToEditRiderNote = () => {
    setRiderNoteModalVisible(true);
  };
  const navigateToEditStoreNote = () => {
    setStoreNoteModalVisible(true);
  };
  const navigateToProductDetail = () => {
    if (basket.order && basket.order.length > 0) {
      navigation.navigate('BranchDetail', {type: basket.order[0].type});
    }
  };
  const navigateToPlaceOrder = (orderedItem, index) => {
    const item = basket.orderedItem.find((x) => {
      return type === 'food'
        ? x._id === orderedItem.store_food_id
        : x._id === orderedItem.store_goods_id;
    });

    if (item) {
      navigation.navigate('PlaceOrder', {
        item: item,
        orderedItem: orderedItem,
        branch_id: basket.order.branch_id,
        edit: true,
        type: type,
        index: index,
      });
    } else {
      navigation.navigate('BranchDetail');
    }
  };

  const navigateToChangeOptionModal = () => {
    setModalVisible((prev) => !prev);
  };

  const TimeButtonGroup = () => {
    return LeftRightButton({handleDeliverButton, handleScheduleButton, t});
  };
  const handleDeliverButton = () => {
    setTimeModalShow(false);
    setModalVisible(false);
    setDate(new Date());
    setFormattedDate(
      formatDate({timeStamp: new Date(), type: 'dddd, MMMM DD YYYY, h:mm a'}),
    );
  };
  const handleScheduleButton = () => {
    let currTime = new Date();
    if (date < currTime.getTime() + 60 * 60 * 1000) {
      alert(t('schedule_order_alert1'));
    } else if (date > currTime.setDate(currTime.getDate() + 1)) {
      alert(t('schedule_order_alert2'));
    } else {
      setTimeModalShow(false);
      setModalVisible(false);
    }
  };
  const handleModalChevronLeftButton = () => {
    setTimeModalShow(false);
  };
  const handlePlaceOrderButton = async () => {
    if (paymentMethod === 'cash') {
      STATUSsetmodalVisible(true);
      const orderTimer = setTimeout(async () => {
        const response = await handlePlaceCartOrders();
        successFunction({response});
      }, CONSUMER_CONFIRM_TIME);
      setPlaceOrderTimer(orderTimer);
    } else if (paymentMethod === 'wallet') {
      navigateToEnterPINModal();
    } else {
      const response = await handlePlaceCartOrders();
      if (response.success) {
        navigation.navigate('PaymentWebview', {
          order_id: response.results._id,
          type: 'order',
        });
      } else {
        alert('fail_place_order');
      }
    }
  };

  const successFunction = ({response}) => {
    response.results.status = 'waiting_merchant_confirm';
    if (response.success) {
      WSS.init(
        _updateOrderStatus,
        _riderAcceptedOrder,
        _syncRiderLocationSuccess,
      );
      // setHideButton(true);
      setOrderPlaced(true);
      _saveOrderToRedux({order: response.results});
      dispatchPaymentOrder({
        type: 'CLEAR',
      });
    }
  };

  const handlePlaceCartOrders = async () => {
    try {
      let response;
      if (route.params && route.params.type === 'food') {
        response = await createFoodOrder({
          store_id: basket.store_id,
          branch_id: basket.branch_id,
          address: selected_address,
          order: basket.order,
          order_remark: storeNote,
          rider_remark: riderNote,
          delivery_time: new Date(),
          payment_method:
            paymentMethod !== 'cash' && paymentMethod !== 'wallet'
              ? 'online'
              : paymentMethod,
          delivery_method: deliveryMethod,
          payment_id:
            paymentMethod !== 'cash' && paymentMethod !== 'wallet'
              ? payment_id[paymentMethod]
              : null,
          promo_code: promoCode ? promoCode.toUpperCase() : '',
          pin: pin,
          t,
        });
        // console.log(response.data)
        const {success, results} = response;
        if (success) {
          dispatchPaymentOrder({type: 'SET_PAYMENT_ORDER', payload: results});
        } else {
          alert(response.message);
        }
      } else if (route.params && route.params.type === 'goods') {
        response = await createGoodsOrder({
          pin: pin,
          store_id: basket.store_id,
          branch_id: basket.branch_id,
          address: selected_address,
          order: basket.order,
          order_remark: storeNote,
          rider_remark: riderNote,
          delivery_time: new Date(),
          payment_method:
            paymentMethod !== 'cash' && paymentMethod !== 'wallet'
              ? 'online'
              : paymentMethod,
          delivery_method: deliveryMethod,
          payment_id:
            paymentMethod !== 'cash' && paymentMethod !== 'wallet'
              ? payment_id[paymentMethod]
              : null,
          promo_code: promoCode ? promoCode.toUpperCase() : '',
          t,
        });
        //const {success, results} = response;
        if (response.success) {
          dispatchPaymentOrder({
            type: 'SET_PAYMENT_ORDER',
            payload: response?.results,
          });
        } else {
          alert(response.message);
        }
      }
      return response;
    } catch (e) {
      if (e === 'store_closed') {
        alert(t('alert_store_closed'));
      }
      console.log('ProductDetail -> handlePlaceOrder err', e);
    }
  };

  const handleVerifyPIN = async () => {
    try {
      const success = await verifyPin({pin, t});

      if (success) {
        PINsetModalVisible((prev) => !prev);
        STATUSsetmodalVisible(true);
        const response = await handlePlaceCartOrders();
        successFunction({response});
        setPin('');
      } else {
        alert(t('incorrect_pin'));
      }
    } catch (err) {}
  };

  const handleReviewOrder = () => {
    navigation.navigate('DeliveredReview', {
      order_id: viewOrder.order_id || viewOrder._id,
      viewOnly,
    });
  };

  const navigateToEnterPINModal = () => {
    PINsetModalVisible((prev) => !prev);
  };
  const navigateToPaymentMethod = () => {
    navigation.navigate('PaymentMethod', {
      topup: false,
      origin: 'ProductDetail',
      amount: basket?.preview?.amount?.total || 0,
      isSelfPickup: deliveryMethod === 'self_pick_up',
    });
  };
  const handleModalButton = () => {
    setModalVisible((prev) => !prev);
  };
  const STATUShandleModalButton = () => {
    STATUSsetmodalVisible((prev) => !prev);
    clearTimeout(placeOrderTimer);
    // navigation.navigate('MapDeliveryScreen');
  };
  const modalMessage = t('change_option');
  const PINmodalMessage = t('enter_pin');
  const PINsubMessage = t('show_pin');
  const riderNoteModalTitle = t('add_rider_note_title');
  const riderNoteModalText = t('add_rider_note_text');
  const storeNoteModalTitle = t('add_store_note_title');
  const storeNoteModalText = t('add_store_note_text');

  const deleteBasketModalTitle = t('delete_basket_title');
  const deleteBasketModalSubTitle = t('delete_basket_subtitle');

  const ButtonGroup = () => {
    return MiddleButton({
      onPress: handleModalButton,
      buttonText: t('continue'),
    });
  };

  const PINButtonGroup = () => {
    return PINMiddleButton({
      onPress: handleVerifyPIN,
      buttonText: t('enter'),
      entered: pin.length === 6,
    });
  };

  const STATUSButtonGroup = () => {
    let text;
    let handleOnPress;
    let disabled = false;
    if (orderStat.latest_order) {
      switch (orderStat.latest_order.status) {
        case 'waiting_merchant_confirm':
        case 'merchant_preparing':
          text = t('complete');
          handleOnPress = () => {
            dispatchBasket({type: 'CLEAR_BASKET'});
            navigation.popToTop();
          };
          break;
        case 'cancelled_by_platform':
        case 'declined_by_merchant':
          text = t('back');
          handleOnPress = () => {
            STATUSsetmodalVisible(false);
            navigation.popToTop();
          };
          break;
        default:
          text = t('cancel');
          handleOnPress = () => {
            clearTimeout(placeOrderTimer);
            STATUSsetmodalVisible(false);
          };
          break;
      }
    }

    return TryButton({
      onPress: handleOnPress,
      buttonText: text,
      disabled: disabled,
    });
  };

  const DeleteBasketButtonGroup = () => {
    return DeleteLeftRightButton({
      option: 'RED',
      left: {
        text: t('cancel'),
        onPress: () => setDeleteModalVisible(false),
      },
      right: {
        text: t('yes'),
        onPress: () => {
          dispatchBasket({
            type: 'CLEAR_BASKET',
          });
          setDeleteModalVisible(false);
          navigation.goBack();
        },
      },
    });
  };

  const closeRow = (rowMap, rowData) => {
    if (rowMap[rowData.index]) {
      rowMap[rowData.index].closeRow();
    }
  };

  const deleteRow = (rowData, rowMap) => {
    if (basket.order.length === 1) {
      setDeleteModalVisible(true);
    } else {
      closeRow(rowMap, rowData);
      dispatchBasket({type: 'DELETE_ITEM', payload: rowData.index});
    }
  };

  const renderHiddenItem = (rowData, rowMap) => (
    <>
      <View style={{height: height * 0.002}} />
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={() => deleteRow(rowData, rowMap)}>
          <Text style={styles.backTextWhite}>{t('remove')}</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <>
      <Loader {...{loading: paymentLoading}} />
      <SubNavBar
        {...{
          LeftButton,
          handleLeftNavButton,
          Title: Title({
            textAlign: 'Center',
            title: viewOnly
              ? viewOrder.self_pick_up
                ? viewOrder.branch_address
                : viewOrder.location.address
              : selected_address.full_address
              ? selected_address.full_address
              : t('current_location'),
            // address && address[0] && address[0].postal_address
            //   ? address[0].postal_address.address //TODO SEARCH FOR CURRENT LOCATION
            // : t('current_location'),
          }),
          // SubTitle: SubTitle({
          //   icon: 'Distance',
          //   subTitle: 'Distance from you: 2.8km',
          // }),
        }}>
        <ScrollView>
          {/* <View style={styles.titleWrap}>
            <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
              {t('deliver_to')}
            </Text>
            <TouchableOpacity onPress={navigateToChangeAddress}>
              <Text style={[styles.textGreen, themes.EDIT_GREEN_TEXT]}>
                {t('change_address')}
              </Text>
            </TouchableOpacity>
          </View> */}
          <View style={[themes.BACKGROUND_WHITE_WRAP, styles.backgroundWrap]}>
            <View style={styles.mapWrap}>
              <Image source={googlemap} style={styles.mapSize} />
            </View>
            <View style={styles.addressInforWrap}>
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>
                {viewOnly
                  ? viewOrder.self_pick_up
                    ? viewOrder.branch_address
                    : viewOrder.location.address
                  : selected_address.full_address
                  ? selected_address.full_address //TODO SEARCH FOR CURRENT LOCATION
                  : t('current_location')}
              </Text>
              {/* <Text style={[themes.TEXT_TITLE_GREY, styles.normalText]}>
                {t('add_floor_unit_number')}
              </Text> */}
            </View>
          </View>
          <View
            style={[
              themes.BACKGROUND_WHITE_WRAP,
              {paddingHorizontal: width * 0.05},
            ]}>
            {((viewOnly && viewOrder.rider_remark !== '') || !viewOnly) && (
              <View
                style={{flexDirection: 'row', paddingBottom: height * 0.02}}>
                <Text
                  style={[
                    themes.TEXT_TITLE_GREY,
                    styles.normalText,
                    {width: width * 0.85},
                  ]}>
                  {viewOrder
                    ? `${t('note_to_driver')}: ${viewOrder.rider_remark}`
                    : riderNote === ''
                    ? t('add_a_note_to_driver')
                    : `${t('note_to_driver')}: ${riderNote}`}
                </Text>
                {!viewOrder && (
                  <TouchableOpacity
                    style={styles.editIcon}
                    onPress={navigateToEditRiderNote}>
                    <Entypo name="edit" size={23} color="#468c64" />
                  </TouchableOpacity>
                )}
              </View>
            )}
            {((viewOnly && viewOrder.order_remark !== '') || !viewOnly) && (
              <View
                style={{flexDirection: 'row', paddingBottom: height * 0.02}}>
                <Text
                  style={[
                    themes.TEXT_TITLE_GREY,
                    styles.normalText,
                    {width: width * 0.85},
                  ]}>
                  {viewOrder
                    ? `${t('note_to_store')}: ${viewOrder.order_remark}`
                    : storeNote === ''
                    ? t('add_a_note_to_store')
                    : `${t('note_to_store')}: ${storeNote}`}
                </Text>
                {!viewOrder && (
                  <TouchableOpacity
                    style={styles.editIcon}
                    onPress={navigateToEditStoreNote}>
                    <Entypo name="edit" size={23} color="#468c64" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
          <View style={[themes.BACKGROUND_WHITE_WRAP, styles.backgroundWrap]}>
            <View style={styles.mapWrap}>
              <Image
                source={
                  viewOnly
                    ? viewOrder.self_pick_up
                      ? selfpickup
                      : delivery
                    : deliveryMethod === 'rider'
                    ? delivery
                    : selfpickup
                }
                style={styles.iconSize}
              />
            </View>
            <View style={styles.deliveryInfoWrap}>
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>
                {viewOnly
                  ? viewOrder.self_pick_up
                    ? t('self_pickup')
                    : t('delivery')
                  : deliveryMethod === 'rider'
                  ? t('delivery')
                  : t('self_pickup')}
              </Text>
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.normalText]}>
                {!viewOrder
                  ? formattedDate
                  : formatDate({
                      timeStamp: viewOrder.delivery_time,
                      type: 'dddd, MMMM DD YYYY, h:mm a',
                    })}
              </Text>
            </View>
            {!viewOrder && (
              <TouchableOpacity
                style={styles.changeOptionButton}
                onPress={navigateToChangeOptionModal}>
                <Text style={[themes.EDIT_GREEN_TEXT]}>
                  {t('change_options')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.titleWrap}>
            <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
              {t('order_summary')}
              <Text style={[styles.text, themes.TEXT_TITLE_GREY]}>
                {viewOnly && '  -  ' + t(`${viewOrder.status}_status`)}
              </Text>
            </Text>
            {!viewOrder && (
              <TouchableOpacity onPress={navigateToProductDetail}>
                <Text style={[styles.textGreen, themes.EDIT_GREEN_TEXT]}>
                  {t('add_items')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View>
            {(!!basket.preview || !!viewOrder) && (
              <SwipeListView
                data={
                  viewOnly
                    ? viewOrder.item_type === 'food'
                      ? viewOrder.food_orders
                      : viewOrder.goods_orders
                    : basket.preview.item_type === 'food'
                    ? basket.preview.food_orders
                    : basket.preview.goods_orders
                }
                disableLeftSwipe={viewOnly ? true : false}
                disableRightSwipe={viewOnly ? true : false}
                rightOpenValue={-75}
                previewRowKey={viewOnly ? '' : '0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                closeOnRowPress={true}
                closeOnRowOpen={true}
                closeOnScroll={true}
                keyExtractor={(item, index) => index.toString()}
                renderHiddenItem={renderHiddenItem}
                renderItem={({item, index}) => {
                  return (
                    <View key={item.order_id}>
                      <View style={{height: height * 0.002}} />
                      <View
                        style={[
                          themes.BACKGROUND_WHITE_WRAP,
                          styles.backgroundWrap,
                        ]}>
                        <View
                          style={[themes.GREEN_BOARDER, styles.itemNumWrap]}>
                          <Text
                            style={[styles.textGreen, themes.EDIT_GREEN_TEXT]}>
                            {item.quantity}x
                          </Text>
                        </View>
                        <View style={styles.deliveryInfoWrap}>
                          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>
                            {viewOnly
                              ? viewOrder.item_type === 'food'
                                ? item.food_name
                                : item.goods_name
                              : basket.preview &&
                                basket.preview.item_type === 'food'
                              ? item.food_name
                              : item.goods_name}
                          </Text>
                          {viewOnly ? (
                            viewOrder.item_type === 'food' ? (
                              item.variations.map((variation) => {
                                return variation.choices.map(
                                  (choice, index) => {
                                    return (
                                      <Text
                                        style={[
                                          themes.TEXT_TITLE_GREY,
                                          styles.normalText,
                                        ]}
                                        key={index}>
                                        {`${variation.choice_title}  -  ${choice.variation_name}`}
                                      </Text>
                                    );
                                  },
                                );
                              })
                            ) : (
                              <Text
                                style={[
                                  themes.TEXT_TITLE_GREY,
                                  styles.normalText,
                                ]}>
                                {item.variation_name}
                              </Text>
                            )
                          ) : basket.preview.item_type === 'food' ? (
                            item.variations.map((variation) => {
                              return variation.choices.map((choice, index) => {
                                return (
                                  <Text
                                    style={[
                                      themes.TEXT_TITLE_GREY,
                                      styles.normalText,
                                    ]}
                                    key={index}>
                                    {`${variation.choice_title}  -  ${choice.variation_name}`}
                                  </Text>
                                );
                              });
                            })
                          ) : (
                            <Text
                              style={[
                                themes.TEXT_TITLE_GREY,
                                styles.normalText,
                              ]}>
                              {item.variation_name}
                            </Text>
                          )}
                          {!viewOnly && (
                            <TouchableOpacity
                              onPress={() => navigateToPlaceOrder(item, index)}>
                              <Text
                                style={[
                                  themes.EDIT_GREEN_TEXT,
                                  styles.normalText,
                                ]}>
                                {t('edit')}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                        <View style={styles.price}>
                          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>
                            {`${t('RM')} `}
                            {formatCurrencyWithNoCurrency(
                              item.unit_price * item.quantity,
                            )}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                }}
              />
            )}
          </View>
          <View>
            {(!!viewOrder?.amount || !!basket?.preview?.amount) && (
              <View
                style={[themes.BACKGROUND_WHITE_WRAP, styles.backgroundWrap]}>
                <View style={[themes.GREEN_BOARDER, styles.totalWrap]}>
                  <View style={[styles.totalrowWrap]}>
                    <Text style={[styles.priceColumn1, themes.TEXT_TITLE_GREY]}>
                      {t('subtotal')}
                    </Text>
                    <Text style={styles.priceColumn2}>{t('RM')}</Text>
                    <Text style={styles.priceColumn3}>
                      {formatCurrencyWithNoCurrency(
                        viewOrder
                          ? viewOrder.amount.base_amount
                          : basket.preview.amount.base_amount,
                      )}
                    </Text>
                  </View>
                  <View style={[styles.totalrowWrap]}>
                    <Text style={[styles.priceColumn1, themes.TEXT_TITLE_GREY]}>
                      {t('delivery_fees')}
                    </Text>
                    <Text style={styles.priceColumn2}>{t('RM')}</Text>
                    <Text style={styles.priceColumn3}>
                      {formatCurrencyWithNoCurrency(
                        viewOrder
                          ? viewOrder.amount.rider_fee
                          : basket.preview.amount.rider_fee,
                      )}
                    </Text>
                  </View>
                  <View style={[styles.totalrowWrap]}>
                    <Text style={[styles.priceColumn1, themes.TEXT_TITLE_GREY]}>
                      {t('small_order_fee')}
                    </Text>
                    <Text style={styles.priceColumn2}>{t('RM')}</Text>
                    <Text style={styles.priceColumn3}>
                      {formatCurrencyWithNoCurrency(
                        viewOrder
                          ? viewOrder.amount.small_order_fee_charge
                          : basket.preview.amount.small_order_fee_charge || 0,
                      )}
                    </Text>
                  </View>
                  {viewOrder?.amount?.discount ||
                  basket?.preview?.amount?.discount ? (
                    <>
                      <View style={[styles.totalrowWrap]}>
                        <Text
                          style={[styles.priceColumn1, themes.TEXT_TITLE_GREY]}>
                          {t('tax_amount')}
                        </Text>
                        <Text style={styles.priceColumn2}>{t('RM')}</Text>
                        <Text style={styles.priceColumn3}>
                          {formatCurrencyWithNoCurrency(
                            viewOrder
                              ? viewOrder.amount.tax_amount
                              : basket.preview.amount.tax_amount,
                          )}
                        </Text>
                      </View>
                      <View
                        style={[themes.GREEN_BOARDER, styles.lasttotalrowWrap]}>
                        <Text
                          style={[styles.priceColumn1, themes.TEXT_TITLE_GREY]}>
                          {t('discount')}
                        </Text>
                        <Text style={styles.priceColumn2}>{t('RM')}</Text>
                        <Text style={styles.priceColumn3}>
                          {'- ' +
                            formatCurrencyWithNoCurrency(
                              viewOrder
                                ? viewOrder.amount.discount
                                : basket.preview.amount.discount,
                            )}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <View
                      style={[themes.GREEN_BOARDER, styles.lasttotalrowWrap]}>
                      <Text
                        style={[styles.priceColumn1, themes.TEXT_TITLE_GREY]}>
                        {t('tax_amount')}
                      </Text>
                      <Text style={styles.priceColumn2}>{t('RM')}</Text>
                      <Text style={styles.priceColumn3}>
                        {formatCurrencyWithNoCurrency(
                          viewOrder
                            ? viewOrder.amount.tax_amount
                            : basket.preview.amount.tax_amount,
                        )}
                      </Text>
                    </View>
                  )}
                  <View style={[styles.totalpricerowWrap]}>
                    <Text
                      style={[
                        styles.totalpriceColumn,
                        themes.NORMAL_TEXT_BLACK_BOLD,
                      ]}>
                      {t('total')}
                    </Text>
                    <Text style={[themes.EDIT_GREEN_TEXT, styles.priceColumn2]}>
                      {t('RM')}
                    </Text>
                    <Text style={[themes.EDIT_GREEN_TEXT, styles.priceColumn3]}>
                      {formatCurrencyWithNoCurrency(
                        viewOrder
                          ? viewOrder.amount.total
                          : basket.preview.amount.total,
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
          {!viewOnly && (
            <PromoCodeSection
              {...{
                promoCode,
                setPromoCode,
                type,
                previewGoodsOrder,
                previewFoodOrder,
              }}
            />
          )}
          <View style={styles.titleWrap}>
            <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
              {t('payment_details')}
            </Text>
          </View>
          <View
            style={[
              themes.BACKGROUND_WHITE_WRAP,
              styles.paymentbackgroundWrap,
            ]}>
            <TouchableOpacity
              style={styles.paymentWrap}
              disabled={viewOnly}
              onPress={navigateToPaymentMethod}>
              {selectedPaymentMethod || viewOnly ? (
                <>
                  {(viewOnly && viewOrder.payment_method === 'cash') ||
                  (!viewOnly && paymentMethod === 'cash') ? (
                    <>
                      <Image source={cash} style={styles.image} />
                      <Text
                        style={[
                          themes.EDIT_GREEN_TEXT,
                          styles.paymentMethodText,
                        ]}>
                        {t('cash')}
                      </Text>
                    </>
                  ) : (viewOnly && viewOrder.payment_method === 'wallet') ||
                    (!viewOnly && paymentMethod === 'wallet') ? (
                    <>
                      <Image source={wallet} style={styles.image} />
                      <Text
                        style={[
                          themes.EDIT_GREEN_TEXT,
                          styles.paymentMethodText,
                        ]}>
                        {t('snailer_wallet')}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Image source={online} style={styles.image} />
                      <Text
                        style={[
                          themes.EDIT_GREEN_TEXT,
                          styles.paymentMethodText,
                        ]}>
                        {t(
                          `${
                            viewOnly ? viewOrder.payment_method : paymentMethod
                          }`,
                        )}
                      </Text>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Octicons name="credit-card" size={25} color="#468c64" />
                  <Text
                    style={[themes.EDIT_GREEN_TEXT, styles.paymentMethodText]}>
                    {t('select_payment_method')}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
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
            handleDeliverButton,
            deliveryMethod,
            setDeliveryMethod,
          }}
        />
        <DeleteConfirmationModal
          {...{
            message: deleteBasketModalTitle,
            subMessage: deleteBasketModalSubTitle,
            modalVisible: deleteModalVisible,
            ButtonGroup: DeleteBasketButtonGroup,
          }}
        />
        <EnterPIN
          {...{
            title: PINmodalMessage,
            subMessage: PINsubMessage,
            navigation,
            PINmodalVisible,
            PINsetModalVisible,
            PINButtonGroup,
            pin,
            setPin,
          }}
        />
        <OrderStatus
          {...{
            navigation,
            STATUSmodalVisible,
            STATUSsetmodalVisible,
            STATUSButtonGroup,
            orderStat,
            deliveryMethod,
            hideButton,
            t,
          }}
        />
        <AddNoteModal
          modalVisible={riderNoteModalVisible}
          setModalVisible={setRiderNoteModalVisible}
          message={riderNoteModalTitle}
          noteText={riderNoteModalText}
          note={riderNote}
          ButtonColor
          onChange={setRiderNote}
        />
        <AddNoteModal
          modalVisible={storeNoteModalVisible}
          setModalVisible={setStoreNoteModalVisible}
          message={storeNoteModalTitle}
          noteText={storeNoteModalText}
          note={storeNote}
          onChange={setStoreNote}
        />
        <View style={themes.BACKGROUND_WHITE_WRAP}>
          {((viewOnly && viewOrder.status === 'delivered') || !viewOnly) && (
            <View style={styles.stickyTotal}>
              <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('total1')}
              </Text>
              <Text style={[themes.EDIT_GREEN_TEXT]}>
                {t('RM')}{' '}
                {viewOrder
                  ? formatCurrencyWithNoCurrency(viewOrder.amount.total)
                  : formatCurrencyWithNoCurrency(basket.preview.amount.total)}
              </Text>
            </View>
          )}
          {!!viewOnly ? (
            viewOrder.status === 'delivered' && (
              <TouchableOpacity onPress={handleReviewOrder}>
                <Text style={[themes.GREEN_BUTTON, styles.button]}>
                  {t('review')}
                </Text>
              </TouchableOpacity>
            )
          ) : selectedPaymentMethod &&
            basket.order &&
            basket.order.length > 0 ? (
            <TouchableOpacity onPress={handlePlaceOrderButton}>
              <Text style={[themes.GREEN_BUTTON, styles.button]}>
                {t('place_order')}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={[themes.GREY_BUTTON, styles.button]}>
              {t('place_order')}
            </Text>
          )}
        </View>
      </SubNavBar>
    </>
  );
};

const PromoCodeSection = ({
  promoCode,
  setPromoCode,
  type,
  previewGoodsOrder,
  previewFoodOrder,
}) => {
  const {t, i18n} = useTranslation();
  return (
    <>
      <View style={styles.titleWrap}>
        <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
          {t('promo_code')}
        </Text>
      </View>
      <View style={[themes.BACKGROUND_WHITE_WRAP, styles.promoCodeWrap]}>
        <TextInput
          value={promoCode}
          style={[styles.paymentWrap, themes.NORMAL_TEXT_BLACK_BOLD]}
          placeholder={t('insert_promo_code_here')}
          placeholderTextColor="#C0C0C0"
          onChangeText={(val) => setPromoCode(val)}
          onBlur={() => {
            setPromoCode(promoCode.toUpperCase());
            type == 'food' ? previewFoodOrder() : previewGoodsOrder();
          }}
        />
      </View>
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  text: {
    fontSize: RFValue(13),
  },
  textGreen: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    alignContent: 'center',
  },
  titleWrap: {
    justifyContent: 'space-between',
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
    flexDirection: 'row',
  },
  backgroundWrap: {
    flexDirection: 'row',
    padding: width * 0.05,
    //marginTop: height * 0.002,
  },
  mapWrap: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  mapSize: {
    width: width * 0.25,
    height: width * 0.25,
  },
  iconSize: {
    width: width * 0.1,
    height: width * 0.1,
  },
  addressInforWrap: {
    marginHorizontal: width * 0.05,
    width: width * 0.5,
    justifyContent: 'center',
  },
  deliveryInfoWrap: {
    marginLeft: width * 0.03,
    width: width * 0.5,
  },
  normalText: {
    marginTop: height * 0.01,
    // width: width * 0.85,
  },
  editIcon: {
    alignSelf: 'flex-end',
  },
  changeOptionButton: {
    alignSelf: 'center',
    alignItems: 'flex-end',
    width: width * 0.3,
  },
  itemNumWrap: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'flex-start',
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
  price: {
    alignSelf: 'flex-start',
    alignItems: 'flex-end',
    paddingRight: width * 0.05,
    width: width * 0.3,
  },
  totalWrap: {
    borderWidth: 1,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    backgroundColor: 'white',
    paddingTop: width * 0.01,
  },
  totalrowWrap: {
    paddingVertical: width * 0.02,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  lasttotalrowWrap: {
    paddingVertical: width * 0.02,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderWidth: 0,
  },
  priceColumn1: {
    textAlign: 'left',
    fontWeight: 'bold',
    width: width * 0.45,
    paddingHorizontal: width * 0.05,
    fontSize: RFValue(13),
  },
  priceColumn2: {
    textAlign: 'center',
    fontWeight: 'bold',
    width: width * 0.1,
  },
  priceColumn3: {
    textAlign: 'right',
    fontWeight: 'bold',
    width: width * 0.35,
    paddingHorizontal: width * 0.1,
  },
  totalpriceColumn: {
    textAlign: 'right',
    fontWeight: 'bold',
    width: width * 0.45,
    paddingHorizontal: width * 0.05,
  },
  totalpricerowWrap: {
    paddingVertical: width * 0.03,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  paymentWrap: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentMethodText: {
    marginHorizontal: width * 0.03,
  },
  paymentbackgroundWrap: {
    flexDirection: 'row',
    padding: width * 0.05,
    marginTop: height * 0.002,
    marginBottom: height * 0.1,
  },
  button: {
    width: width * 0.7,
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
      },
      android: {
        textAlignVertical: 'center',
        marginBottom: width * 0.03,
      },
      default: {
        alignItems: 'center',
        textAlignVertical: 'center',
      },
    }),
  },
  stickyTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.15,
    marginVertical: height * 0.015,
  },
  image: {
    width: 40,
    height: 30,
    alignSelf: 'center',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'black',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'rgb(204, 0, 0)',
    right: 0,
  },
  backTextWhite: {
    color: '#FFF',
  },
  promoCodeWrap: {
    flexDirection: 'row',
    padding: width * 0.05,
    marginTop: height * 0.002,
    // marginBottom: height * 0.1,
  },
});

const mapDispatchToProps = (dispatch) => ({
  _updateOrderStatus: ({order_id, status}) =>
    dispatch(updateOrderStatus({order_id, status})),
  _riderAcceptedOrder: ({order_id, status, rider}) =>
    dispatch(
      riderAcceptedOrder({
        order_id,
        status,
        rider,
      }),
    ),
  _syncRiderLocationSuccess: ({order_id, longitude, latitude}) =>
    dispatch(syncRiderLocationSuccess({order_id, longitude, latitude})),
  _saveOrderToRedux: ({order}) => dispatch(saveOrderToRedux({order})),
  _clearLatestOrder: () => dispatch(clearLatestOrder()),
});

const mapStateToProps = (state) => {
  return {
    orderStat: state.order,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
