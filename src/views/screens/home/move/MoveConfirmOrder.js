import React, {useState, useContext, useEffect} from 'react';
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
} from 'react-native';
import {RFValue} from 'styles/ResponsiveFont';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';

import NavBar, {LeftButton} from '../../component/NavBar';
import AddNoteModal from '../../component/popup/AddNoteModal';
import EnterPIN, {PINMiddleButton} from '../../component/popup/EnterPIN';
import {Loader} from '../../component/Loader';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';

import cash from '../../../../assets/icons/payment-cash.png';
import wallet from '../../../../assets/icons/payment-snailerwallet.png';

import carsedan from '../../../../assets/images/M-car(sedan).png';
import motorcycle from '../../../../assets/images/M-motorcycle.png';
import payment_id from '../../../../assets/payment_id.json';

import {MoveOrderContext} from 'states/context/moveOrder.context';
import {PaymentOrderContext} from '../../../../states/context/paymentOrder.context';
import {createMoveOrder} from 'services/order';
import {getPaymentStatus} from '../../../../services/payment';
import {verifyPin} from '../../../../services/pin';
import {
  formatCurrency,
  formatCurrencyWithNoCurrency,
} from '../../../../utils/helper';

import {connect} from 'react-redux';
import {saveOrderToRedux} from '../../../../states/redux/ActionCreators/order';

const MoveConfirmOrder = ({navigation, route, _saveOrderToRedux}) => {
  const {moveOrder, dispatchMoveOrder} = useContext(MoveOrderContext);
  const {paymentOrder, dispatchPaymentOrder} = useContext(PaymentOrderContext);
  const {t, i18n} = useTranslation();
  const [note, setNote] = useState('');
  const [addedNote, setAddedNote] = useState(false);
  const [vehicle, setVehicle] = useState(t('car_sedan'));
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(false);
  const [pin, setPin] = useState('');
  const [PINmodalVisible, PINsetModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const services = route.params?.services ? route.params?.services : null;
  const [total, setTotal] = useState(route.params?.total || 0);
  const [discount, setDiscount] = useState(0);
  const [showDiscount, setShowDiscount] = useState(false);

  const PINmodalMessage = t('enter_pin');
  const PINsubMessage = t('show_pin');
  const NotemodalTitle = t('add_a_note_to_driver');
  const NotemodalText = t('add_rider_note_text');
  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const navigateToPaymentMethod = () => {
    navigation.navigate('PaymentMethod', {
      topup: false,
      origin: 'MoveConfirmOrder',
      amount: total || 0,
    });
  };

  const navigateToEnterPINModal = () => {
    PINsetModalVisible((prev) => !prev);
  };

  const PINButtonGroup = () => {
    return PINMiddleButton({
      onPress: handleVerifyPIN,
      buttonText: t('enter'),
      entered: pin.length === 6,
    });
  };

  const navigateToAddNoteModal = () => {
    setModalVisible((prev) => !prev);
  };

  const handleOnChangeText = (value) => {
    setNote(value);
    if (value.length > 0) {
      setAddedNote(true);
    } else {
      setAddedNote(false);
    }
  };

  useEffect(() => {
    setVehicleName();
  }, []);

  useEffect(() => {
    if (route.params?.paymentMethod) {
      setPaymentMethod(route.params.paymentMethod);
      setSelectedPaymentMethod(true);
    }
  }, [route.params]);

  useEffect(() => {
    if (route.params?.test) {
      if (paymentOrder) handleGetPaymentStatus();
    }
  }, [route.params?.test]);

  const handleVerifyPIN = async () => {
    try {
      const success = await verifyPin({pin, t});

      if (success) {
        PINsetModalVisible((prev) => !prev);
        setLoading(true);
        const response = await handlePlaceOrder();

        handlePaymentSuccess({response});
        setPin('');
      } else {
        alert(t('incorrect_pin'));
      }
    } catch (err) {
      console.log('MoveConfirmOrder -> handleVerifyPin err', err);
    }
  };

  const handlePaymentSuccess = ({response}) => {
    if (response?.results) {
      response.results.status = 'waiting_rider_confirm';
      _saveOrderToRedux({order: response.results});
      dispatchMoveOrder({type: 'CLEAR_DETAILS'});
      dispatchPaymentOrder({type: 'CLEAR'});
      setTimeout(() => {
        navigation.replace('MoveOrderDetail', {
          viewOnly: true,
          order_id: response.results._id,
        });
      }, 200);
    } else {
      alert(t('incorrect_pin'));
    }
  };

  const handleGetPaymentStatus = async () => {
    try {
      setLoading(true);
      const payment_success = await getPaymentStatus({
        type: 'order',
        order_id: paymentOrder._id,
      });

      if (payment_success) {
        handlePaymentSuccess({
          response: {success: true, results: paymentOrder},
        });
      } else {
        alert(t('fail_payment'));
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const setVehicleName = () => {
    if (route.params) {
      if (route.params.vehicle === 'car') {
        setVehicle(t('car_sedan'));
      } else if (route.params.vehicle === 'motorbike') {
        setVehicle(t('motorcycle'));
      }
    }
  };

  const handlePreviewOrder = async () => {
    if (
      moveOrder.pickup.length === 0 ||
      moveOrder.dropoff.length + moveOrder.stoplocation.length === 0 ||
      moveOrder.order.length === 0
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
          type_of_vehicle: route.params.vehicle,
          delivery_items: moveOrder.order.map((ele) => {
            return {
              ...ele,
              dimension: {
                depth: parseInt(ele.dimension.depth * 10),
                width: parseInt(ele.dimension.width * 10),
                height: parseInt(ele.dimension.height * 10),
              },
            };
          }),
        },
        services: services,
        order_remark: '',
        rider_remark: '',
        images: [],
        payment_method: 'cash',
        preview: true,
        promo_code: promoCode ? promoCode.toUpperCase() : '',
        t,
      });

      if (response.success) {
        setTotal(response.results.amount.total);
        setDiscount(response.results.amount.discount);
        if (response.results.amount.discount > 0) setShowDiscount(true);
        else setShowDiscount(false);
      } else {
        setPromoCode(null);
        setTotal(route.params?.total || 0);
        setDiscount(0);
        setShowDiscount(false);
        alert(t(response.message));
      }
    } catch (err) {
      console.log('MoveScreen -> handlePreviewOrder err', JSON.stringify(err));
    }
  };

  const handlePlaceOrder = async () => {
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
        delivery_time: new Date(route.params.date),
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
          type_of_vehicle: route.params.vehicle,
          delivery_items: moveOrder.order.map((ele) => {
            return {
              ...ele,
              dimension: {
                depth: parseInt(ele.dimension.depth * 10),
                width: parseInt(ele.dimension.width * 10),
                height: parseInt(ele.dimension.height * 10),
              },
            };
          }),
        },
        services: services,
        order_remark: '',
        rider_remark: note,
        images: [...moveOrder.move_image],
        payment_method:
          paymentMethod !== 'cash' && paymentMethod !== 'wallet'
            ? 'online'
            : paymentMethod,
        payment_id:
          paymentMethod !== 'cash' && paymentMethod !== 'wallet'
            ? payment_id[paymentMethod]
            : null,
        promo_code: promoCode ? promoCode.toUpperCase() : '',
        pin: pin,
        t,
      });

      const {success, results} = response;
      if (success) {
        dispatchPaymentOrder({type: 'SET_PAYMENT_ORDER', payload: results});
      }

      return response;
    } catch (e) {
      console.log('handlePlaceOrder -> e', JSON.stringify(e));
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrderButton = async () => {
    if (paymentMethod === 'cash') {
      setLoading(true);
      const response = await handlePlaceOrder();
      handlePaymentSuccess({response});
    } else if (paymentMethod === 'wallet') {
      navigateToEnterPINModal();
    } else {
      const response = await handlePlaceOrder();

      if (response.success) {
        navigation.navigate('PaymentWebview', {
          order_id: response.results._id,
          type: 'order',
          origin: 'MoveConfirmOrder',
        });
      } else {
        alert('fail_place_order');
      }
    }
  };

  return (
    <>
      <Loader {...{loading}} />
      <NavBar title={t('confirm_order')} {...{LeftButton, handleLeftNavButton}}>
        <ScrollView>
          <View style={styles.imageWrap}>
            <Image
              source={
                route.params
                  ? route.params?.vehicle === 'car'
                    ? carsedan
                    : motorcycle
                  : null
              }
            />
            <Text style={[themes.GREEN_BUTTON, styles.carType]}>{vehicle}</Text>
          </View>
          <Text style={[themes.GREEN_BUTTON, styles.deliveryTime]}>
            {route.params ? route.params?.time : null}
          </Text>
          <View
            style={[
              themes.BACKGROUND_WHITE_WRAP,
              themes.SHADOW_DEFAULT,
              styles.noteWrap,
            ]}>
            <View style={[styles.noteCol1]}>
              {addedNote ? (
                <FontAwesome
                  name="sticky-note-o"
                  size={20}
                  style={themes.ICON_COLOR}
                />
              ) : (
                <FontAwesome name="plus" size={20} style={themes.ICON_COLOR} />
              )}
            </View>
            <View style={[styles.noteCol2]}>
              {addedNote ? (
                <Text style={themes.NORMAL_TEXT_BLACK_BOLD}>{note}</Text>
              ) : (
                <TouchableOpacity onPress={navigateToAddNoteModal}>
                  <Text style={themes.TEXT_TITLE_LIGHTGREY}>
                    {note.length > 0 ? note : t('add_a_note_to_driver')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={navigateToAddNoteModal}>
              <View style={[styles.noteCol3]}>
                <Feather
                  name="chevron-right"
                  size={20}
                  style={themes.ICON_COLOR_BLACK}
                />
              </View>
            </TouchableOpacity>
          </View>

          <PromoCodeSection
            {...{setPromoCode, handlePreviewOrder, promoCode}}
          />
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
              onPress={navigateToPaymentMethod}>
              {selectedPaymentMethod ? (
                paymentMethod === 'cash' ? (
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
                ) : paymentMethod === 'wallet' ? (
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
                    <Text
                      style={[
                        themes.EDIT_GREEN_TEXT,
                        styles.paymentMethodText,
                      ]}>
                      {t(paymentMethod)}
                    </Text>
                  </>
                )
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
        <View style={themes.BACKGROUND_WHITE_WRAP}>
          {showDiscount && (
            <View style={styles.stickyTotal}>
              <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('discount')}
              </Text>
              <Text style={[themes.EDIT_GREEN_TEXT]}>
                -{t('RM')}
                {route.params ? formatCurrencyWithNoCurrency(discount) : 0}
              </Text>
            </View>
          )}

          <View style={styles.stickyTotal}>
            <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
              {t('total1')}
            </Text>
            <Text style={[themes.EDIT_GREEN_TEXT]}>
              {t('RM')}
              {route.params ? formatCurrencyWithNoCurrency(total) : 0}
            </Text>
          </View>
          <BottomDetail
            {...{
              status: selectedPaymentMethod
                ? 'PendingPlaceOrder'
                : 'PendingSelectPaymentMethod',
              onPress: handlePlaceOrderButton,
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
          <AddNoteModal
            {...{
              message: NotemodalTitle,
              noteText: NotemodalText,
              onPress: navigateToAddNoteModal,
              modalVisible,
              setModalVisible,
              onChange: handleOnChangeText,
              note: note,
            }}
          />
        </View>
      </NavBar>
    </>
  );
};

const BottomDetail = ({status, onPress}) => {
  const {t, i18n} = useTranslation();

  switch (status) {
    case 'PendingSelectPaymentMethod':
      return (
        <TouchableOpacity>
          <Text style={[themes.GREY_BUTTON, styles.button]}>
            {t('place_order')}
          </Text>
        </TouchableOpacity>
      );
    case 'PendingPlaceOrder':
      return (
        <TouchableOpacity onPress={onPress}>
          <Text style={[themes.GREEN_BUTTON, styles.button]}>
            {t('place_order')}
          </Text>
        </TouchableOpacity>
      );
    case 'DonePlaceOrder':
      return (
        <TouchableOpacity onPress={onPress}>
          <Text style={[themes.ORANGE_BUTTON, styles.button]}>
            {t('pending_order')}
          </Text>
        </TouchableOpacity>
      );
  }
};

const PromoCodeSection = ({setPromoCode, handlePreviewOrder, promoCode}) => {
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
          // placeholderTextColor={themes.TEXT_TITLE_LIGHTGREY}
          onChangeText={(val) => setPromoCode(val)}
          onBlur={() => {
            setPromoCode(promoCode.toUpperCase());
            handlePreviewOrder();
          }}
        />
      </View>
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  imageWrap: {
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  carType: {
    width: width * 0.35,
    alignSelf: 'center',
    textAlign: 'center',
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
    fontSize: RFValue(14),
    fontWeight: 'bold',
    ...Platform.select({
      ios: {
        alignItems: 'center',
        lineHeight: width * 0.08,
        height: width * 0.08,
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
  deliveryTime: {
    // width: width * 0.7,
    paddingHorizontal: width * 0.05,
    alignSelf: 'center',
    textAlign: 'center',
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
    fontSize: RFValue(13),
    fontWeight: 'bold',
    ...Platform.select({
      ios: {
        alignItems: 'center',
        lineHeight: width * 0.08,
        height: width * 0.08,
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
  noteWrap: {
    borderRadius: 15,
    marginHorizontal: width * 0.08,
    marginVertical: height * 0.03,
    paddingHorizontal: width * 0.02,
    paddingVertical: Platform.OS === 'ios' ? height * 0.02 : height * 0.025,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noteCol1: {
    width: width * 0.14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteCol2: {
    width: width * 0.5,
    justifyContent: 'center',
  },
  noteCol3: {
    width: width * 0.14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    justifyContent: 'space-between',
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
    flexDirection: 'row',
  },
  text: {
    fontSize: RFValue(13),
  },
  contactWrap: {
    flexDirection: 'row',
    padding: width * 0.05,
  },
  contactCol1: {
    width: width * 0.15,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryInfoWrap: {
    marginLeft: width * 0.03,
    width: width * 0.5,
  },
  normalText: {
    marginTop: height * 0.01,
  },
  changeOptionButton: {
    alignSelf: 'center',
    alignItems: 'flex-end',
    width: width * 0.3,
    paddingRight: width * 0.03,
  },
  cardWrap: {
    width: width * 0.1,
    alignItems: 'center',
  },
  iconSize: {
    width: width * 0.08,
    height: width * 0.08,
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
  image: {
    width: 40,
    height: 25,
    alignSelf: 'center',
  },
  stickyTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.15,
    marginTop: height * 0.015,
  },
  text: {
    fontSize: RFValue(13),
  },
  button: {
    width: width * 0.8,
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
        marginTop: width * 0.03,
        marginBottom: width * 0.08,
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
  promoCodeWrap: {
    flexDirection: 'row',
    padding: width * 0.05,
    marginTop: height * 0.002,
    // marginBottom: height * 0.1,
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
    _saveOrderToRedux: ({order}) => dispatch(saveOrderToRedux({order})),
  };
};

export default connect(null, mapDispatchToProps)(MoveConfirmOrder);
