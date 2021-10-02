import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  Text,
} from 'react-native';
import {RFValue} from 'styles/ResponsiveFont';
import {themes} from 'utils/themeProvider';

import {useTranslation} from 'react-i18next';

import NavBar from '../../component/NavBar';
import PinSetUpDone from '../../../../assets/images/pinsetupdone.png';

const PINSuccess = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const change = route.params?.change ? true : false;
  const reset = route.params?.reset ? true : false;

  const navigateToPaymentScreen = () => {
    navigation.navigate('PaymentScreen');
  };

  return (
    <NavBar
      title={
        change ? t('change_pin') : reset ? t('reset_pin') : t('set_up_a_pin')
      }>
      <View style={styles.container}>
        <Image source={PinSetUpDone} style={styles.imageSize} />
        <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.text]}>
          {change
            ? t('pin_changed_successfully')
            : reset
            ? t('pin_reset_successfully')
            : t('pin_set_up_successfully')}
        </Text>
      </View>

      <View style={styles.buttonWrap}>
        <TouchableOpacity onPress={navigateToPaymentScreen}>
          <Text style={[themes.GREEN_BUTTON, styles.button]}>{t('okay')}</Text>
        </TouchableOpacity>
      </View>
    </NavBar>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginTop: height * 0.15,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  imageSize: {
    width: width * 0.8,
    height: height * 0.3,
  },
  text: {
    fontWeight: 'bold',
    fontSize: RFValue(22),
    textAlign: 'center',
    alignSelf: 'center',
    alignItems: 'center',
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
  buttonWrap: {
    flex: 1,
    justifyContent: 'flex-end',
    marginVertical: height * 0.03,
  },
});

export default PINSuccess;
