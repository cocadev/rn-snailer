import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';

//UI
import Feather from 'react-native-vector-icons/Feather';
import {CustomFont as Text} from 'styles/CustomFont';
import {RFValue, getStatusBarHeight} from 'styles/ResponsiveFont';
import {themes} from 'utils/themeProvider';
import {connect} from 'react-redux';

//icon
import google from '../../../assets/icons/google.png';
import applelogin from '../../../assets/icons/applelogin.png';
import logo from '../../../assets/images/logo.png';
import {changeLanguage} from '../../../states/redux/ActionCreators/setting';
import {useTranslation} from 'react-i18next';

//Auth
import {getGoogleToken, getAppleToken} from '../../../services/auth';
import {
  signInWithGoogle,
  signInWithApple,
} from 'states/redux/ActionCreators/auth';
import {Loader} from '../component/Loader';

const LogInScreen = ({
  navigation,
  changeLanguageRedux,
  signInWithApple,
  signInWithGoogle,
}) => {
  const {t, i18n} = useTranslation();

  const changeLanguage = () => {
    switch (i18n.language) {
      case 'cn':
        changeLanguageRedux('en');
        return i18n.changeLanguage('en');
      case 'en':
        changeLanguageRedux('bm');
        return i18n.changeLanguage('bm');
      case 'bm':
        changeLanguageRedux('cn');
        return i18n.changeLanguage('cn');
      default:
        changeLanguageRedux('en');
        return i18n.changeLanguage('en');
    }
  };

  // Auth
  const [loading, setLoading] = useState(false);

  const handleLoginApple = async () => {
    try {
      setLoading(true);
      const {
        email,
        fullName: {familyName, givenName},
        identityToken,
      } = await getAppleToken();
      setLoading(false);

      if (!identityToken) {
        return alert(t('error_signin_alert_1'));
      }

      await signInWithApple({email, familyName, givenName, identityToken});
    } catch (error) {
      setLoading(false);
    }
  };

  const handleLoginGoogle = async () => {
    try {
      setLoading(true);
      const userInfo = await getGoogleToken();
      setLoading(false);

      const success = await signInWithGoogle({userInfo, t});
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <Loader {...{loading}} />
      <View style={[themes.GREEN_BACKGROUND]}>
        <StatusBar
          backgroundColor={'transparent'}
          translucent={true}
          barStyle="light-content"
        />
        <View style={styles.background}>
          <View style={{flex: 0.75}}>
            <TouchableOpacity
              style={[
                styles.changeLanguageWrapper,
                themes.BUTTON_BACKGROUD_COLOR,
              ]}
              onPress={changeLanguage}>
              <Feather
                name="globe"
                size={20}
                style={[styles.languageIcon, themes.ICON_COLOR]}
              />
              <Text style={[styles.languageButtonText, themes.BUTTON_TEXT]}>
                {t('language')}
              </Text>
            </TouchableOpacity>
            <Image source={logo} style={styles.logo} />
          </View>

          <View
            style={{
              justifyContent: 'flex-start',
              flex: 1,
            }}>
            <TouchableOpacity
              style={[styles.googleButton, themes.BUTTON_BACKGROUD_COLOR]}
              onPress={handleLoginGoogle}>
              <View style={styles.iconWrapper}>
                <Image source={google} style={styles.icon} />
              </View>
              <Text style={[styles.socialLogInButtonText, themes.BUTTON_TEXT]}>
                {t('continue_with_google')}
              </Text>
            </TouchableOpacity>
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={[
                  styles.googleButton,
                  themes.BUTTON_BACKGROUD_COLOR,
                  {marginBottom: width * 0.05},
                ]}
                onPress={handleLoginApple}>
                <View style={styles.iconWrapper}>
                  <Image source={applelogin} style={styles.icon} />
                </View>
                <Text
                  style={[styles.socialLogInButtonText, themes.BUTTON_TEXT]}>
                  {t('continue_with_apple')}
                </Text>
              </TouchableOpacity>
            )}
            <Text style={[styles.disclaimerText, {marginTop: height * 0.015}]}>
              By logging in, you agree with our
            </Text>
            <View style={styles.disclaimerWrapper}>
              <TouchableOpacity
                onPress={() => navigation.navigate('TermsOfUse')}>
                <Text style={styles.TnC}>Terms and Conditions</Text>
              </TouchableOpacity>
              <Text style={styles.disclaimerText}> and </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('PrivacyPolicy')}>
                <Text style={styles.TnC}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const {height, width} = Dimensions.get('window');
const statusBarHeight = getStatusBarHeight();

const styles = StyleSheet.create({
  background: {
    height: '100%',
  },
  logo: {
    height: height * 0.25,
    width: height * 0.25,
    resizeMode: 'contain',
    marginTop: Platform.OS === 'ios' ? height * 0.05 : null,
    alignSelf: 'center',
  },
  googleButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: width * 0.03,
    width: width * 0.75,
    height: Platform.OS === 'ios' ? height * 0.075 : height * 0.1,
  },
  appleButton: {
    alignSelf: 'center',
    marginTop: width * 0.03,
    width: width * 0.75,
    height: height * 0.075,
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.2,
  },
  icon: {
    height: height * 0.04,
    width: height * 0.04,
  },
  socialLogInButtonText: {
    fontSize: RFValue(15),
    alignSelf: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    width: width * 0.55,
    paddingRight: width * 0.05,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  changeLanguageWrapper: {
    alignSelf: 'flex-end',
    marginTop: width * 0.1,
    marginHorizontal: width * 0.02,
    paddingVertical: width * 0.01,
    paddingHorizontal: width * 0.02,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  languageButtonText: {
    fontSize: RFValue(14),
    fontWeight: 'bold',
    justifyContent: 'center',
    paddingLeft: 5,
  },
  button: {
    width: width * 0.75,
    height: width * 0.13,
    alignSelf: 'center',
    textAlign: 'center',
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
  inputWrap: {
    marginVertical: width * 0.03,
  },
  phoneWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 2,
    borderRadius: 20,
    overflow: 'hidden',
    height: Platform.OS === 'ios' ? height * 0.06 : height * 0.08,
    width: width * 0.75,
    overflow: 'hidden',
  },
  phoneLeft: {
    justifyContent: 'center',
    fontSize: RFValue(13),
    fontWeight: 'bold',
    width: width * 0.3,
    height: Platform.OS === 'ios' ? height * 0.12 : height * 0.08,
    textAlign: 'right',
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#468c64',
    flexDirection: 'row',
  },
  myFlag: {
    alignSelf: 'center',
    // fontWeight: 'bold',
    // fontSize: RFValue(15),
    marginHorizontal: width * 0.01,
  },
  phone60: {
    alignSelf: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: RFValue(15),
    marginHorizontal: width * 0.01,
  },
  phoneRight: {
    width: width * 0.45,
    height: height * 0.06,
    paddingHorizontal: width * 0.03,
    fontWeight: 'bold',
    fontSize: RFValue(15),
    textAlignVertical: 'center',
  },
  optionLineWrap: {
    marginTop: height * 0.05,
    marginBottom: height * 0.03,
    flexDirection: 'row',
  },
  line: {
    height: 2,
    flex: 1,
    alignSelf: 'center',
    borderRadius: 20,
    marginLeft: width * 0.1,
  },
  line2: {
    height: 1,
    flex: 1,
    alignSelf: 'center',
    borderRadius: 20,
    marginRight: width * 0.1,
  },
  lineText: {
    marginHorizontal: width * 0.03,
    fontSize: RFValue(13),
  },
  text: {
    fontWeight: 'bold',
    fontSize: RFValue(15),
    textAlign: 'center',
    marginVertical: height * 0.02,
    marginHorizontal: width * 0.03,
  },
  disclaimerWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: width,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  disclaimerText: {
    fontSize: RFValue(13),
    color: 'white',
    alignSelf: 'center',
    textAlign: 'center',
  },
  TnC: {
    fontSize: RFValue(13),
    color: 'white',
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({
  signInWithApple: ({email, familyName, givenName, identityToken}) =>
    dispatch(signInWithApple({email, familyName, givenName, identityToken})),
  signInWithGoogle: (userInfo) => dispatch(signInWithGoogle(userInfo)),
  changeLanguageRedux: (lng) => dispatch(changeLanguage(lng)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LogInScreen);
