import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
  Text,
} from 'react-native';
import {connect} from 'react-redux';
import {RFValue} from 'styles/ResponsiveFont';
import {useTranslation} from 'react-i18next';
import {themes} from 'utils/themeProvider';

import BackgroundImage from '../../../assets/images/GreenBG.png';
import WalletGif from '../../../assets/gif/WalletGif.gif';
import CardIcon from '../../../assets/icons/PT-addcard.png';
import TopUpIcon from '../../../assets/icons/PT-topup.png';
import PINIcon from '../../../assets/icons/PT-pin.png';

import Feather from 'react-native-vector-icons/Feather';

import NavBar, {LeftButton} from '../component/NavBar';
import {getTransactionList, getWalletBalance} from '../../../services/payment';
import {formatCurrency, formatCurrencyWithNoCurrency} from '../../../utils/helper';
import {Loader} from '../component/Loader';
import FastImage from 'react-native-fast-image';

const PaymentScreen = ({navigation, user}) => {
  const {t, i18n} = useTranslation();
  const [transactionList, setTransactionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [walletBalance, setWalletBalance] = useState();
  const navigateToTopUp = () => {
    navigation.navigate('TopUpAmount');
  };
  const navigateToCreatePIN = () => {
    navigation.navigate('CreatePIN');
  };
  const navigateToChangePIN = () => {
    navigation.navigate('CreatePIN', {
      change: true,
    });
  };

  const navigateToPaymentHistory = () => {
    navigation.navigate('PaymentHistory');
  };
  const navigateToPaymentDetail = (item) => {
    navigation.navigate('PaymentDetail', {item});
  };
  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      handleGetWalletBalance();
    });

    return unsubscribe;
  }, []);

  const handleGetWalletBalance = async () => {
    try {
      setRefreshing(true);
      const response = await getWalletBalance();
      if (response) setWalletBalance(response.wallet_balance);
      const response1 = await getTransactionList({skip: 0});
      if (response1) setTransactionList(response1.transactions);
    } catch (error) {
      console.log('PaymentScreen -> handleGetWalletBalance err', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  return (
    <>
    <NavBar title ={t('payment')}
    {...{LeftButton, handleLeftNavButton}}>
      <Loader {...{loading}} />
        <View style={{width: width, height: height - height * 0.28}}>
          <Image
            source={BackgroundImage}
            style={styles.backgroundImageContainer}
          />
          <View style={styles.gifWrap}>
            <FastImage
              source={WalletGif}
              style={styles.gifSize}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
          <View style={styles.bigContainer}>
            <View style={styles.menuRow}>
              <TouchableOpacity
                style={[themes.BUTTON_GREEN, styles.button1]}
                onPress={navigateToTopUp}>
                <Image source={TopUpIcon} style={styles.iconSize} />
                <Text style={[themes.EDIT_WHITE_TEXT, styles.buttonText]}>
                  {t('top_up')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[themes.BUTTON_GREEN, styles.button1]}>
                <Image source={CardIcon} style={styles.iconSize} />
                <Text style={[themes.EDIT_WHITE_TEXT, styles.buttonText]}>
                  {t('RM')} {formatCurrencyWithNoCurrency(walletBalance)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[themes.BUTTON_GREEN, styles.button1]}
                onPress={
                  user.hashed_pin !== null
                    ? navigateToChangePIN
                    : navigateToCreatePIN
                }>
                <Image source={PINIcon} style={styles.iconSize} />
                <Text style={[themes.EDIT_WHITE_TEXT, styles.buttonText]}>
                  {user.hashed_pin !== null ? t('change_pin') : t('create_pin')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.secondContainer}>
            <View style={styles.bottomRow}>
              <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('recent_transactions')}
              </Text>
              <TouchableOpacity onPress={navigateToPaymentHistory}>
                <Text
                  style={[styles.text, styles.textGreen, themes.EDIT_GREEN_TEXT]}>
                  {t('see_all')}
                </Text>
              </TouchableOpacity>
            </View>
            {transactionList.length == 0 ? (
              <View style={styles.nodataWrap}>
                <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.titleText]}>
                  {t('no_data_available')}
                </Text>
                <Text style={[themes.TEXT_TITLE_GREY, styles.text]}>
                  {t('no_data_explain')}
                </Text>
              </View>
            ) : (
              <FlatList
                style={{marginBottom: height * 0.2}}
                data={transactionList}
                keyExtractor={(item) => item._id}
                refreshing={refreshing}
                onRefresh={() => handleGetWalletBalance()}
                renderItem={({item}) => (
                  <TransactionCard {...{item, navigateToPaymentDetail, t}} />
                )}
              />
            )}
          </View>
        </View>
      </NavBar>
    </> 
  );
};

export const TransactionCard = ({item, navigateToPaymentDetail, t}) => {
  const {amount, create_time, payment_action, status} = item;
  let text;
  let styleObject;
  switch (payment_action) {
    case 'snailer_service_refund':
      text = t('refund');
      styleObject = themes.EDIT_ORANGE_TEXT;
      break;
    case 'snailer_service_payment':
      text = t('payment');
      styleObject = themes.NORMAL_TEXT_BLACK_BOLD;
      break;
    case 'snailer_service_top_up':
      switch (status) {
        case 'waiting_gateway_confirm':
          text = t('waiting_payment_confirm');
          styleObject = themes.NORMAL_TEXT_BLACK_BOLD;
          break;
        case 'top_up_confirmed':
          styleObject = themes.EDIT_GREEN_TEXT;
          text = t('top_up_successful');
          break;
        case 'cancelled_by_payment_system':
          text = t('top_up_cancelled');
          styleObject = themes.EDIT_RED_TEXT;
          break;
        default:
          text = status;
          styleObject = themes.NORMAL_TEXT_BLACK_BOLD;
      }
  }

  return (
    <TouchableOpacity
      style={[themes.BACKGROUND_WHITE_WRAP]}
      onPress={() => navigateToPaymentDetail(item)}>
      <View style={styles.paymentWrap}>
        <View style={styles.column1}>
          <Text style={[styleObject, styles.text]}>{text}</Text>
        </View>
        <View style={styles.column2}>
          <Text style={[styleObject, styles.text]}>
            {t('RM') + ' ' + formatCurrencyWithNoCurrency(amount)}
          </Text>
        </View>
        <View style={styles.column3}>
          <Feather
            name="chevron-right"
            size={25}
            style={themes.ICON_COLOR_BLACK}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  backgroundImageContainer: {
    alignSelf: 'center',
    width: width,
    height: height * 0.35,
    tintColor: '#468c64',
  },
  gifWrap: {
    position: 'absolute',
    alignSelf: 'flex-end',
    alignItems: 'center',
    top: 0,
    bottom: height * 0.95,
  },
  gifSize: {
    width: width * 0.6,
    height: height * 0.22,
    marginTop: height * 0.05,
  },
  icon: {
    position: 'absolute',
    right: width * 0.03,
    top: height * 0.055,
  },
  iconBack: {
    position: 'absolute',
    left: width * 0.03,
    top: height * 0.055,
  },
  bigContainer: {
    width: width,
    position: 'absolute',
    top: Platform.OS === 'ios' ? height * 0.27 : height * 0.28,
  },
  secondContainer: {
    marginTop: Platform.OS === 'ios' ? height * 0.07 : height * 0.11,
  },
  spacing: {
    marginTop: height * 0.0015,
  },
  menuRow: {
    flexDirection: 'row',
    marginHorizontal: width * 0.1,
    marginVertical: height * 0.01,
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.02,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    // justifyContent: 'space-between',
    justifyContent: 'space-around',
  },
  iconSize: {
    width: width * 0.08,
    height: width * 0.08,
  },
  button1: {
    borderRadius: 5,
    padding: width * 0.02,
    width: width * 0.24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    marginTop: height * 0.01,
    fontWeight: 'bold',
    fontSize: RFValue(10),
  },
  text: {
    fontSize: RFValue(14),
  },
  textGreen: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    alignContent: 'center',
  },
  bottomRow: {
    justifyContent: 'space-between',
    marginHorizontal: width * 0.055,
    marginBottom: height * 0.022,
    flexDirection: 'row',
  },
  paymentWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.08,
    marginVertical: height * 0.015,
    alignItems: 'center',
  },
  column1: {
    width: width * 0.3,
    flexDirection: 'column',
  },
  column2: {
    width: width * 0.4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  column3: {
    width: width * 0.05,
  },
  subText: {
    paddingTop: height * 0.006,
    fontSize: RFValue(10),
  },
  nodataWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: width * 0.3,
    paddingHorizontal: width * 0.04,
    height: height * 0.4,
  },
  titleText: {
    marginBottom: width * 0.02,
    fontSize: RFValue(15),
  },
  text: {
    fontSize: RFValue(13),
  },
});

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

export default connect(mapStateToProps)(PaymentScreen);
