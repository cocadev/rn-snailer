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
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';

import NavBar, {LeftButton} from '../component/NavBar';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';

//icons
import paymentSnailer from '../../../assets/images/logo.png';
import paymentCard from '../../../assets/icons/payment-card.png';
import paymentPaypal from '../../../assets/icons/payment-paypal.png';
import paymentMaybank from '../../../assets/icons/payment-maybank.png';

const AddPaymentMethod = ({navigation}) => {
  const {t, i18n} = useTranslation();

  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  return (
    <NavBar title={t('add_payment_method')} {...{LeftButton, handleLeftNavButton}}>
      <View style={{marginTop: width * 0.02}}>
        <TouchableOpacity style={styles.wrapper} onPress={handleLeftNavButton}>
          <Image source={paymentSnailer} style={styles.image} />
          <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
            {t('topup_credit')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.wrapper} onPress={handleLeftNavButton}>
          <Image source={paymentCard} style={styles.image} />
          <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
            {t('credit_debit_card')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.wrapper} onPress={handleLeftNavButton}>
          <Image source={paymentPaypal} style={styles.image} />
          <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
            {t('paypal')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.wrapper} onPress={handleLeftNavButton}>
          <Image source={paymentMaybank} style={styles.image} />
          <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
            {t('maybank2u')}
          </Text>
        </TouchableOpacity>
      </View>
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
  image: {
    width: 30,
    height: 30,
    marginLeft: width * 0.03,
    marginRight: width * 0.01,
    alignSelf: 'center',
  },
});

export default AddPaymentMethod;
