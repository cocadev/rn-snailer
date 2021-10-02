import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Modal,
} from 'react-native';
import EnterPIN, {PINMiddleButton} from '../../component/popup/EnterPIN';
import {verifyPin} from '../../../../services/pin';
import {Loader} from '../../component/Loader';

import {RFValue} from 'styles/ResponsiveFont';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';

import NavBar, {LeftButton} from '../../component/NavBar';
import ParcelOrderForm from '../../component/parcel/ParcelOrderForm';

import Octicons from 'react-native-vector-icons/Octicons';
import cash from '../../../../assets/icons/payment-cash.png';
import online from '../../../../assets/icons/payment-onlinebanking.png';
import wallet from '../../../../assets/icons/payment-snailerwallet.png';

import {createParcel} from '../../../../services/parcel';
import {ParcelOrderContext} from 'states/context/parcelOrder.context';
import {formatDate} from '../../../../utils/helper';
import {findCityAndState} from './pdf/postcode';
import {Alert} from 'react-native';
import {getPaymentStatus} from 'services/payment';
import payment_id from '../../../../assets/payment_id.json';
import {ORDER_STATUS} from '../../../../utils/enum';
const ParcelOrder = ({navigation, route}) => {
  //const [service, setService] = useState();
  const [result, setResult] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(false);
  const {parcelOrder, dispatchParcelOrder} = useContext(ParcelOrderContext);
  const {t, i18n} = useTranslation();
  const senderState = findCityAndState(parcelOrder.sender.postcode);
  const receiverState = findCityAndState(parcelOrder.receiver.postcode);
  const [promoCode, setPromoCode] = useState();
  const [total, setTotal] = useState(parcelOrder.total);
  const [PINmodalVisible, PINsetModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState('');
  const PINmodalMessage = t('enter_pin');
  const PINsubMessage = t('show_pin');
  const PINButtonGroup = () => {
    return PINMiddleButton({
      onPress: handleVerifyPIN,
      buttonText: t('enter'),
      entered: pin.length === 6,
    });
  };

  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (route.params?.paymentMethod) {
      setPaymentMethod(route.params.paymentMethod);
      setSelectedPaymentMethod(true);
    }
  }, [route.params]);
  const handleGetPaymentStatus = async () => {
    try {
      setLoading(true);
      const payment_success = await getPaymentStatus({
        type: 'order',
        order_id: result._id,
      });

      if (payment_success) {
        setModalVisible(true);
        setResult((prev) => ({...prev, status: ORDER_STATUS.CREATED}));
      } else {
        alert(t('fail_payment'));
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyPIN = async () => {
    try {
      const success = await verifyPin({pin, t});

      if (success) {
        PINsetModalVisible((prev) => !prev);
        const response = await handleConfirmOrder(false);
        if (response) setModalVisible(true);
      } else {
        alert(t('incorrect_pin'));
      }
    } catch (err) {}
  };
  const navigateToEnterPINModal = () => {
    PINsetModalVisible((prev) => !prev);
  };
  const handlePressPlaceOrder = async () => {
    if (paymentMethod === 'cash') {
      const response = await handleConfirmOrder(false);
      if (response) setModalVisible(true);
      if (result) setModalVisible(true);
    } else if (paymentMethod === 'wallet') {
      navigateToEnterPINModal();
    } else {
      const response = await handleConfirmOrder(false);
      if (response) {
        navigation.navigate('PaymentWebview', {
          order_id: response._id,
          type: 'order',
          origin: 'ParcelOrder',
        });
      } else {
        alert('fail_place_order');
      }
    }
  };
  useEffect(() => {
    console.log('route.params?.test', route.params?.test);
    if (route.params?.test) {
      if (result) handleGetPaymentStatus();
    }
  }, [route.params?.test]);

  const handleConfirmOrder = async (preview) => {
    if (preview == false) setLoading(true);
    try {
      const response = await createParcel({
        parcelTitle: parcelOrder.itemName,
        parcelType: parcelOrder.type,
        parcelWeight: parseInt(parcelOrder.dimension.weight),
        courierID: parcelOrder.courierId,
        riderRemark: parcelOrder.remark,
        dimension: {
          height: parseInt(parcelOrder.dimension.height),
          width: parseInt(parcelOrder.dimension.width),
          depth: parseInt(parcelOrder.dimension.length),
        },
        sender: {
          ...parcelOrder.sender,
          postcode: parcelOrder.sender.postcode.toString(),
        },
        receiver: {
          ...parcelOrder.receiver,
          postcode: parcelOrder.receiver.postcode.toString(),
        },
        promoCode: promoCode ? promoCode.toUpperCase() : '',
        paymentMethod: preview
          ? 'cash'
          : paymentMethod != 'cash' && paymentMethod != 'wallet'
          ? 'online'
          : paymentMethod,
        paymentID: preview
          ? null
          : paymentMethod !== 'cash' && paymentMethod !== 'wallet'
          ? payment_id[paymentMethod]
          : null,
        previewBool: preview,
        pin: pin,
        t,
      });
      if (response) {
        if (preview) {
          setTotal(response.amount.total);
          dispatchParcelOrder({type: 'SET_TOTAL', payload: response});
        } else {
          setResult(response);
        }
      }
      return response;
    } catch (err) {
      if (preview) {
        Alert.alert(t('warning'), t('voucher is not available'));
        setPromoCode('');
      }
      alert(err);
      console.log(
        'ParcelOrder -> handleConfirmOrder err:',
        JSON.stringify(err),
      );
    } finally {
      setLoading(false);
    }
  };

  const navigateToParcelConfirmOrder = () => {
    setModalVisible(false);
    navigation.navigate('ParcelConfirmOrder', {parcel: result});
  };

  const navigateToPaymentMethod = () => {
    navigation.navigate('PaymentMethod', {
      topup: false,
      origin: 'ParcelOrder',
      amount: parcelOrder.total || 0,
    });
  };

  return (
    <>
      <Loader {...{loading: loading}} />
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
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.modalText]}>
              {t('Parcel Order have been successfully made!')}
            </Text>
            <Pressable
              style={[themes.GREEN_BUTTON, styles.button]}
              onPress={navigateToParcelConfirmOrder}>
              <Text style={[themes.EDIT_WHITE_TEXT, styles.buttonText]}>
                {t('OK')}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <NavBar
        title={t('confirm_order')}
        {...{
          LeftButton,
          handleLeftNavButton,
        }}>
        <ScrollView>
          <ParcelOrderForm
            package_name={parcelOrder.itemName}
            weight={parcelOrder.dimension.weight}
            receiver_name={parcelOrder.receiver.name}
            receiver_phone={parcelOrder.receiver.contact}
            receiver_address={parcelOrder.receiver.full_address}
            receiver_state={receiverState.state}
            sender_name={parcelOrder.sender.name}
            sender_phone={parcelOrder.sender.contact}
            sender_address={parcelOrder.sender.full_address}
            sender_state={senderState.state}
            total={parcelOrder.total}
            remark={parcelOrder.remark}
          />
          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.headerTitle]}>
            {t('promo_code')}
          </Text>
          <View style={[themes.BACKGROUND_WHITE_WRAP]}>
            <TextInput
              placeholderTextColor="#C0C0C0"
              value={promoCode}
              style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.textInput]}
              autoCorrect={false}
              placeholder={t('promo_placeholder')}
              onChangeText={(val) => setPromoCode(val)}
              onBlur={() => {
                if (promoCode) {
                  setPromoCode(promoCode.toUpperCase());
                  handleConfirmOrder(true);
                }
              }}
            />
          </View>

          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.headerTitle]}>
            {t('payment_details')}
          </Text>
          <TouchableOpacity onPress={navigateToPaymentMethod}>
            <View
              style={[themes.BACKGROUND_WHITE_WRAP, styles.paymentContainer]}>
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
                    <Image source={online} style={styles.image} />
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
                  <Octicons
                    name="credit-card"
                    size={25}
                    color="#468c64"
                    style={{paddingHorizontal: width * 0.01}}
                  />
                  <Text
                    style={[themes.EDIT_GREEN_TEXT, styles.paymentMethodText]}>
                    {t('select_payment_method')}
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>
          <View style={styles.disclaimerRow}>
            <Text style={styles.disclaimerText}>{t('tnc_parcel')}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('TermsOfUse', {parcel: true})}>
              <Text style={styles.TnC}>{` ${t('tnc')}`}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <TouchableOpacity
          onPress={() => {
            if (paymentMethod) {
              handlePressPlaceOrder();
            } else {
              Alert.alert(t('warning'), t('no_payment_method'));
            }
          }}
          style={[themes.GREEN_BUTTON, styles.placeButton]}>
          <Text style={[themes.EDIT_WHITE_TEXT, styles.buttonText]}>
            {t('place_order')}
          </Text>
        </TouchableOpacity>
      </NavBar>
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  placeButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    height: width * 0.125,
    width: width * 0.75,
    bottom: width * 0.1,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: RFValue(14),
  },
  headerTitle: {
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
    fontSize: RFValue(13),
  },
  paymentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.06,
  },
  TnC: {
    fontSize: RFValue(12),
    fontWeight: 'bold',
    color: '#468c64',
  },
  disclaimerText: {
    fontSize: RFValue(12),
  },
  disclaimerRow: {
    marginHorizontal: width * 0.03,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: height * 0.015,
    marginBottom: height * 0.15,
  },
  textStyle: {
    alignSelf: 'center',
    paddingHorizontal: width * 0.03,
  },
  textInput: {
    fontSize: RFValue(12),
    textAlign: 'justify',
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
  },
  centeredView: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 8,
    elevation: 2,
    width: width * 0.5,
  },
  modalText: {
    fontSize: RFValue(12),
    textAlign: 'center',
    marginHorizontal: width * 0.01,
    marginVertical: height * 0.01,
  },
  paymentMethodText: {
    marginHorizontal: width * 0.03,
  },
});

export default ParcelOrder;
