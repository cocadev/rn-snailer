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
  KeyboardAvoidingView,
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';
import {TabView} from 'react-native-tab-view';
import {useTranslation} from 'react-i18next';
import {themes} from 'utils/themeProvider';
import payment_id from '../../../../assets/payment_id.json';
import PriceCurrency from '../../component/PriceCurrency';

import NavBar, {LeftButton} from '../../component/NavBar';
import {Loader} from '../../component/Loader';

import Octicons from 'react-native-vector-icons/Octicons';
import mastercard from '../../../../assets/icons/payment-mastercard.png';

import {getPaymentStatus, topupWallet} from '../../../../services/payment';
import {PaymentOrderContext} from '../../../../states/context/paymentOrder.context';

const TopUpAmount = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentSelected, setPaymentSelected] = useState(false);
  const [topupValue, setTopupValue] = useState(0);
  const [selectedValue, setSelectedValue] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const {paymentOrder, dispatchPaymentOrder} = useContext(PaymentOrderContext);
  const numRegex = /\D+/;

  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const navigateToPaymentMethod = () => {
    navigation.navigate('PaymentMethod', {origin: 'TopUpAmount', topup: true});
  };

  const handleSelectValue = (value) => {
    setTopupValue(value);
    setSelectedValue(value);
  };

  const handleGetPaymentStatus = async () => {
    try {
      setPaymentLoading(true);
      const payment_success = await getPaymentStatus({
        type: 'top_up',
        order_id: paymentOrder,
        t,
      });

      if (payment_success) {
        dispatchPaymentOrder({type: 'CLEAR'});
        navigation.popToTop();
      } else {
        alert(t('fail_payment'));
      }
    } catch (err) {
      console.log('TopUpAmount -> handleGetPaymentStatus err', err);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleTopUpWallet = async () => {
    try {
      const {success, results} = await topupWallet({
        payment_id: payment_id[paymentMethod],
        amount: parseInt(topupValue),
        t,
      });

      if (success) {
        return results;
      }

      return null;
    } catch (err) {
      console.log('TopUpAmount -> handleTopUpWallet err', err);
    }
  };

  const handleTopUpButton = async () => {
    const order_id = await handleTopUpWallet();

    if (order_id) {
      dispatchPaymentOrder({type: 'SET_PAYMENT_ORDER', payload: order_id});
      try {
        navigation.navigate('PaymentWebview', {
          order_id,
          type: 'top_up',
          origin: 'TopUpAmount',
        });
      } catch (error) {
        console.log('TopUpAmount -> handleTopUpButton err', error);
      }
    } else {
      console.log('Failed to get id');
    }
  };

  useEffect(() => {
    dispatchPaymentOrder({type: 'CLEAR_ORDER'});
  }, []);

  useEffect(() => {
    if (route.params?.test) {
      if (paymentOrder) handleGetPaymentStatus();
    }
  }, [route.params?.test]);

  useEffect(() => {
    if (route.params?.paymentMethod) {
      setPaymentMethod(route.params.paymentMethod);
      setPaymentSelected(true);
    }
  }, [route.params?.paymentMethod]);

  return (
    <NavBar title={t('top_up')} {...{LeftButton, handleLeftNavButton}}>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <Loader {...{loading: paymentLoading}} />
        <Text style={[styles.titleWrap, themes.NORMAL_TEXT_BLACK_BOLD]}>
          {t('select_a_topup_value')}
        </Text>

        <View style={themes.BACKGROUND_WHITE_WRAP}>
          <View style={[themes.GREEN_BOARDER, styles.amountRow]}>
            <TouchableOpacity
              style={[
                styles.column1,
                selectedValue === ('50' * 100) && themes.GREEN_BUTTON,
              ]}
              onPress={() => handleSelectValue('50' * 100)}>
              <Text
                style={
                  selectedValue === ('50' * 100)
                    ? themes.EDIT_WHITE_TEXT
                    : themes.EDIT_GREEN_TEXT
                }>
                50
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                selectedValue === ('100' * 100)
                  ? [styles.column2, themes.GREEN_BUTTON]
                  : [themes.GREEN_BOARDER, styles.column2]
              }
              onPress={() => handleSelectValue('100' * 100)}>
              <Text
                style={
                  selectedValue === ('100' * 100)
                    ? themes.EDIT_WHITE_TEXT
                    : themes.EDIT_GREEN_TEXT
                }>
                100
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.column3,
                selectedValue === ('200' * 100) && themes.GREEN_BUTTON,
              ]}
              onPress={() => handleSelectValue('200' * 100)}>
              <Text
                style={
                  selectedValue === ('200' * 100)
                    ? themes.EDIT_WHITE_TEXT
                    : themes.EDIT_GREEN_TEXT
                }>
                200
              </Text>
            </TouchableOpacity>
          </View>
          <PriceCurrency
            placeholder={t('enter_at_least_RM20')}
            style={[themes.GREEN_BOARDER, styles.textInput]}
            onValueChange={(value) => {
              // test for non-digit value, set value only when no non-digit is present
              if (value <= 100000 && !numRegex.test(value)) {
                setTopupValue(value);
              }
            }}
            value={topupValue}
            // keyboardType="numeric"
          />
        </View>

        <View style={styles.titleWrap}>
          <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
            {t('payment_method')}
          </Text>
        </View>
        <View
          style={[themes.BACKGROUND_WHITE_WRAP, styles.paymentbackgroundWrap]}>
          <TouchableOpacity
            style={styles.paymentWrap}
            onPress={navigateToPaymentMethod}>
            {paymentSelected ? (
              <>
                {/* <Image source={mastercard} style={styles.image} /> */}
                <Text style={[styles.paymentMethodText]}>
                  {t(paymentMethod)}
                </Text>
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
        <View style={styles.buttonWrap}>
          {/* {paymentSelected && topupValue >= 2000 ? ( */}
            {paymentSelected && topupValue >= 100 ? (
            <TouchableOpacity onPress={handleTopUpButton}>
              <Text style={[themes.GREEN_BUTTON, styles.button]}>
                {t('top_up')}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              <Text style={[themes.GREY_BUTTON, styles.button]}>
                {t('top_up')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </NavBar>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  titleWrap: {
    marginHorizontal: width * 0.055,
    marginVertical: height * 0.022,
  },
  amountRow: {
    marginHorizontal: width * 0.055,
    marginVertical: height * 0.022,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  column1: {
    width: width * 0.3,
    alignItems: 'center',
    paddingVertical: height * 0.015,
  },
  column2: {
    width: width * 0.3,
    alignItems: 'center',
    paddingVertical: height * 0.015,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  column3: {
    width: width * 0.3,
    alignItems: 'center',
    paddingVertical: height * 0.015,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    height: width * 0.12,
    fontSize: RFValue(13),
    fontWeight: 'bold',
    paddingHorizontal: width * 0.02,
    marginBottom: height * 0.022,
    marginHorizontal: width * 0.05,
    backgroundColor: 'white',
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
  textGreen: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    alignContent: 'center',
  },
  paymentWrap: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentMethodText: {
    marginHorizontal: width * 0.03,
    fontWeight: 'bold',
  },
  paymentbackgroundWrap: {
    flexDirection: 'row',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    marginTop: height * 0.002,
    marginBottom: height * 0.1,
  },
  buttonWrap: {
    flex: 1,
    justifyContent: 'flex-end',
    marginVertical: height * 0.03,
  },
  button: {
    width: width * 0.8,
    height: width * 0.13,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: height * 0.02,
    marginBottom: width * 0.02,
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
  image: {
    width: 40,
    height: 25,
    alignSelf: 'center',
  },
});

export default TopUpAmount;
