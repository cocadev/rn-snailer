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
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {RFValue} from 'styles/ResponsiveFont';

import NavBar, {LeftButton} from '../component/NavBar';

import Feather from 'react-native-vector-icons/Feather';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';

import {getWalletBalance} from '../../../services/payment';

//icons
import paymentVisa from '../../../assets/icons/payment-visa.png';
import paymentCash from '../../../assets/icons/payment-cash.png';
import paymentOnlineBanking from '../../../assets/icons/payment-onlinebanking.png';
import paymentSnailerWallet from '../../../assets/icons/payment-snailerwallet.png';

const PaymentMethod = ({navigation, route, gotPin}) => {
  const {t, i18n} = useTranslation();
  const topup = route.params?.topup ? true : false;
  const onlineBanking = route.params?.onlineBanking ? true : false;
  const isSelfPickup = route.params?.isSelfPickup ? true : false;
  const amount = route.params?.amount || 0;
  const [balance, setBalance] = useState(null);

  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const navigateToAddPaymentMethod = () => {
    navigation.navigate('AddPaymentMethod');
  };
  const navigateToCardDetail = () => {
    navigation.navigate('CardDetail');
  };

  const handleSetPayment = (value) => {
    navigation.navigate(route.params.origin, {
      paymentMethod: value,
    });
  };

  const handleChooseOnlinePayment = () => {
    navigation.push('PaymentMethod', {
      onlineBanking: true,
      origin: route.params?.origin ? route.params.origin : 'ProductDetail',
    });
  };

  useEffect(() => {
    const handleGetWalletBalance = async () => {
      try {
        const results = await getWalletBalance();
        setBalance(results.wallet_balance);
      } catch (err) {
        console.log('PaymentMethod -> handleGetWalletBalance err', err);
      }
    };

    handleGetWalletBalance();
  }, []);

  return (
    <NavBar
      title={topup ? t('credit') : t('payment_method')}
      {...{LeftButton, handleLeftNavButton}}>
      <ScrollView style={{marginVertical: width * 0.05}}>
        {!onlineBanking &&
          !topup &&
          (isSelfPickup ? (
            <TouchableOpacity
              style={styles.wrapper}
              onPress={() => alert(t('cannot_pay_via_cash_alert'))}>
              <Image
                source={paymentCash}
                style={[styles.image, {opacity: 0.4}]}
              />
              <Text style={[styles.text, themes.TEXT_TITLE_LIGHTGREY]}>
                {t('cash')}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.wrapper}
              onPress={() => handleSetPayment('cash')}>
              <Image source={paymentCash} style={styles.image} />
              <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('cash')}
              </Text>
            </TouchableOpacity>
          ))}
        {!onlineBanking && !topup && (
          <TouchableOpacity
            style={styles.wrapper}
            onPress={handleChooseOnlinePayment}>
            <Image source={paymentOnlineBanking} style={styles.image} />
            {/* <View style={styles.primaryWrap}> */}
            <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
              {t('online')}
            </Text>
            {/* <Text style={[themes.TEXT_TITLE_GREY]}>{t('primary')}</Text> */}
            {/* </View> */}
          </TouchableOpacity>
        )}
        {!onlineBanking &&
          !topup &&
          (balance < amount || !gotPin ? (
            <TouchableOpacity
              style={styles.wrapper}
              onPress={() =>
                !gotPin
                  ? alert('Please create a pin at the payment tab!')
                  : alert(t('insufficient_wallet_balance'))
              }>
              <Image
                source={paymentSnailerWallet}
                style={[styles.image, {opacity: 0.4}]}
              />
              <Text style={[styles.text, themes.TEXT_TITLE_LIGHTGREY]}>
                {t('snailer_wallet')}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.wrapper}
              onPress={() => handleSetPayment('wallet')}>
              <Image source={paymentSnailerWallet} style={styles.image} />
              <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('snailer_wallet')}
              </Text>
            </TouchableOpacity>
          ))}
        {(onlineBanking || topup) && (
          <>
            <TouchableOpacity
              style={styles.wrapper}
              onPress={() => handleSetPayment('credit_debit_card')}>
              <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('credit_debit_card')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.wrapper}
              onPress={() => handleSetPayment('maybank2u')}>
              <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('maybank2u')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.wrapper}
              onPress={() => handleSetPayment('alliance')}>
              <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('alliance')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.wrapper}
              onPress={() => handleSetPayment('am_online')}>
              <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('am_online')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.wrapper}
              onPress={() => handleSetPayment('rhb')}>
              <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('rhb')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.wrapper}
              onPress={() => handleSetPayment('hong_leong')}>
              <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('hong_leong')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.wrapper}
              onPress={() => handleSetPayment('cimb')}>
              <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('cimb')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.wrapper}
              onPress={() => handleSetPayment('public_bank')}>
              <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('public_bank')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.wrapper}
              onPress={() => handleSetPayment('bank_rakyat')}>
              <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('bank_rakyat')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.wrapper}
              onPress={() => handleSetPayment('affin')}>
              <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('affin')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.wrapper}
              onPress={() => handleSetPayment('bsn')}>
              <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('bsn')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.wrapper}
              onPress={() => handleSetPayment('bank_islam')}>
              <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('bank_islam')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.wrapper}
              onPress={() => handleSetPayment('uob')}>
              <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('uob')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.wrapper}
              onPress={() => handleSetPayment('bank_muamalat')}>
              <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('bank_muamalat')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.wrapper}
              onPress={() => handleSetPayment('ocbc')}>
              <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('ocbc')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.wrapper}
              onPress={() => handleSetPayment('standard_chartered')}>
              <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('standard_chartered')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.wrapper}
              onPress={() => handleSetPayment('hsbc')}>
              <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('hsbc')}
              </Text>
            </TouchableOpacity>
          </>
        )}
        {/* {topup ? (
          <></>
        ) : (
          <TouchableOpacity onPress={navigateToAddPaymentMethod}>
            <Text style={[themes.GREEN_BUTTON, styles.button]}>
              {t('add_payment_method')}
            </Text>
          </TouchableOpacity>
        )} */}
      </ScrollView>
    </NavBar>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 25,
    backgroundColor: 'white',
    marginHorizontal: width * 0.03,
    marginVertical: width * 0.015,
    padding: width * 0.03,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  text: {
    marginLeft: width * 0.03,
    marginRight: width * 0.01,
    alignSelf: 'center',
    fontSize: RFValue(13),
  },
  primarytext: {
    marginRight: width * 0.01,
    fontSize: RFValue(13),
  },
  primaryWrap: {
    flexDirection: 'column',
    marginLeft: width * 0.03,
  },
  image: {
    width: 30,
    height: 30,
    marginLeft: width * 0.03,
    marginRight: width * 0.01,
    alignSelf: 'center',
  },
  button: {
    width: width * 0.8,
    height: width * 0.13,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: width * 0.03,
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
});

const mapStateToProps = (state) => {
  return {
    gotPin: state.auth.user.hashed_pin,
  };
};

export default connect(mapStateToProps)(PaymentMethod);
