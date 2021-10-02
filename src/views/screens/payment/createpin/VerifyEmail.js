import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
  TextInput,
  Text,
} from 'react-native';
import {RFValue} from 'styles/ResponsiveFont';
import {themes} from 'utils/themeProvider';

import {useTranslation} from 'react-i18next';

import NavBar, {LeftButton} from '../../component/NavBar';

const VerifyEmail = ({navigation}) => {
  const handleLeftNavButton = () => {
    navigation.goBack();
  };
  const navigateToPINSuccess = () => {
    navigation.navigate('PINSuccess');
  };
  const {t, i18n} = useTranslation();

  return (
    <NavBar title={t('set_up_a_pin')} {...{LeftButton, handleLeftNavButton}}>
      <View style={styles.container}>
        <Text style={styles.text}>{t('your_verified_email_address')}</Text>
        <TextInput
          style={[themes.GREEN_BOARDER, styles.textInput]}
          placeholder="snailer@gmail.com"
        />
      </View>
      <View style={styles.container}>
        <Text style={[themes.TEXT_TITLE_GREY, styles.alertText]}>
          {t('email_verification_alert')}
        </Text>
        <Text style={[themes.TEXT_TITLE_GREY, styles.alertText]}>
          {t('email_verification_alert2')}
        </Text>
      </View>
      <View style={styles.buttonWrap}>
        <TouchableOpacity onPress={navigateToPINSuccess}>
          <Text style={[themes.GREEN_BUTTON, styles.button]}>
            {t('submit')}
          </Text>
        </TouchableOpacity>
      </View>
    </NavBar>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginTop: height * 0.05,
  },
  text: {
    fontWeight: 'bold',
    fontSize: RFValue(18),
    textAlign: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: height * 0.01,
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
  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    height: width * 0.12,
    fontSize: RFValue(13),
    textAlign: 'center',
    paddingHorizontal: width * 0.03,
    marginVertical: height * 0.02,
    marginHorizontal: width * 0.08,
    backgroundColor: 'white',
  },
  alertText: {
    marginHorizontal: width * 0.08,
    textAlign: 'center',
  },
  buttonWrap: {
    flex: 1,
    justifyContent: 'flex-end',
    marginVertical: height * 0.03,
  },
});

export default VerifyEmail;
