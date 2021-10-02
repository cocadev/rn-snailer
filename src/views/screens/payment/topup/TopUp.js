import React from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';
import {useTranslation} from 'react-i18next';
import {themes} from 'utils/themeProvider';

import NavBar, {LeftButton} from '../../component/NavBar';

import paymentCard from '../../../../assets/icons/payment-card.png';
import paymentOnlineBanking from '../../../../assets/icons/payment-onlinebanking.png';
import paymentMaybank from '../../../../assets/icons/payment-maybank.png';

const TopUp = ({navigation}) => {
  const {t, i18n} = useTranslation();

  const handleLeftNavButton = () => {
    navigation.goBack();
  };
  const navigateToTopUpAmount = () => {
    navigation.navigate('TopUpAmount');
  };

  return (
    <NavBar title={t('credits')} {...{LeftButton, handleLeftNavButton}}>
      <Text style={[styles.titleWrap, themes.NORMAL_TEXT_BLACK_BOLD]}>
        {t('top_up_with')}
      </Text>
      <TouchableOpacity style={styles.wrapper} onPress={navigateToTopUpAmount}>
        <Image source={paymentCard} style={styles.image} />
        <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
          {t('credit_debit_card')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.wrapper} onPress={navigateToTopUpAmount}>
        <Image source={paymentOnlineBanking} style={styles.image} />
        <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
          {t('online_banking')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.wrapper} onPress={navigateToTopUpAmount}>
        <Image source={paymentMaybank} style={styles.image} />
        <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
          {t('maybank2u')}
        </Text>
      </TouchableOpacity>
    </NavBar>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  titleWrap: {
    marginHorizontal: width * 0.055,
    marginVertical: height * 0.022,
  },
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

export default TopUp;
