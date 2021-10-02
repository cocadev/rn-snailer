import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  Modal,
  TextInput,
  Text,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {connect} from 'react-redux';
import {RFPercentage, RFValue} from 'styles/ResponsiveFont';
import {themes} from 'utils/themeProvider';

import Feather from 'react-native-vector-icons/Feather';
import {useTranslation} from 'react-i18next';

import NavBar, {LeftButton} from '../component/NavBar';

import {changePin, resetPin, requestChangePinOtp} from '../../../services/pin';
import {verifyOTP, requestOTP} from '../../../services/auth';
import {phoneVerification} from '../../../states/redux/ActionCreators/auth';

const OtpScreen = ({navigation, route, mobile, verifyMobile}) => {
  const {t, i18n} = useTranslation();
  const [otp, setOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [newMobile, setNewMobile] = useState('');
  const change = route.params?.change ? true : false;
  const reset = route.params?.reset ? true : false;
  let timer = null;

  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const handleSubmitOTP = async () => {
    if (otp === '') {
      alert(t('enter_otp_alert'));
    } else {
      try {
        if (reset) {
          const success = await resetPin({otp, pin: route.params?.pin, t});

          if (success) {
            clearInterval(timer);
            navigation.navigate('PINSuccess', {
              reset: true,
            });
          }
        } else {
          const success = await verifyOTP({
            mobile: change ? mobile : newMobile,
            otp,
            t,
          });

          if (success) {
            if (change) {
              const success = await changePin({...route.params?.pin, t});

              if (success) {
                clearInterval(timer);
                navigation.navigate('PINSuccess', {
                  change: true,
                });
              }
            } else {
              clearInterval(timer);
              verifyMobile(newMobile);
            }
          }
        }
      } catch (err) {
        console.log('OtpScreen -> handleSubmitOTP err', err);
      }
    }
  };

  const handleRequestOTP = async () => {
    if (!change && !reset && newMobile == '') {
      alert(t('enter_mobile_number'));
    } else {
      try {
        if (otpTimer <= 0) {
          setOtpTimer(60);
          timer = setInterval(() => {
            setOtpTimer((prev) => {
              if (prev === 0) {
                clearInterval(timer);
                setOtpTimer(0);
              } else {
                return prev - 1;
              }
            });
          }, 1000);

          if (reset) {
            await requestChangePinOtp({t});
          } else {
            await requestOTP({mobile: change ? mobile : newMobile, t});
          }
        } else {
          alert(t('try_in_1_minute'));
        }
      } catch (err) {
        console.log('OtpScreen -> handleRequestOTP err', err);
      }
    }
  };

  return (
    <NavBar
      title={change || reset ? t('enter_otp') : t('continue_with_mobile')}
      LeftButton={(change || reset) && LeftButton}
      handleLeftNavButton={(change || reset) && handleLeftNavButton}>
      <KeyboardAvoidingView
        contentContainerStyle={{flex: 1}}
        behavior={'height'}>
        <ScrollView>
          <View
            style={[
              styles.container,
              themes.BACKGROUND_WHITE_WRAP,
              themes.SHADOW_DEFAULT,
            ]}>
            {!change && !reset && (
              <View style={{marginBottom: height * 0.02}}>
                <Text
                  style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.fontSize14]}>
                  {t('phone_number')}
                </Text>
                <View style={styles.phoneNumberRow}>
                  <View
                    style={[
                      themes.GREY_BOARDER_BOTTOM,
                      styles.textInputContainer,
                      {flex: 0.12},
                    ]}>
                    <TextInput
                      value="+60"
                      editable={false}
                      style={[themes.NORMAL_TEXT_BLACK_BOLD]}
                    />
                  </View>
                  <View
                    style={[
                      themes.GREY_BOARDER_BOTTOM,
                      styles.textInputContainer,
                      {flex: 0.4},
                    ]}>
                    <TextInput
                      value={newMobile}
                      onChangeText={(val) => setNewMobile(val)}
                      keyboardType={'phone-pad'}
                      placeholder={'eg. 123456789'}
                      style={themes.NORMAL_TEXT_BLACK_BOLD}
                    />
                  </View>
                  <TouchableOpacity
                    style={{flex: 0.4}}
                    onPress={handleRequestOTP}>
                    <View
                      style={[themes.GREEN_BOARDER, styles.requestOTPButton]}>
                      <Text style={themes.BUTTON_TEXT}>
                        {otpTimer > 0 ? `Try in ${otpTimer}` : t('request_otp')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <View>
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.fontSize14]}>
                {t('enter_otp')}
              </Text>
              <View style={styles.otpRow}>
                <View style={[styles.secondTextInputContainer]}>
                  <TextInput
                    placeholder={'000000'}
                    style={[
                      themes.NORMAL_TEXT_BLACK_BOLD,
                      styles.fontSize20,
                      {marginTop: width * 0.05, marginBottom: width * 0.02},
                    ]}
                    value={otp}
                    onChangeText={(val) => setOtp(val)}
                    keyboardType="numeric"
                    maxLength={6}
                  />
                </View>
                {(change || reset) && (
                  <TouchableOpacity onPress={handleRequestOTP}>
                    <View style={[themes.GREEN_BOARDER, styles.requestOTPButton]}>
                      <Text style={themes.BUTTON_TEXT}>
                        {otpTimer > 0 ? `${t('try_in')} ${otpTimer}` : t('request_otp')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {/* <View>
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.fontSize14]}>
                {t('do_you_have_a_referral_code')} ?
              </Text>
              
              <View>
                <View
                  style={[
                    themes.GREY_BOARDER_BOTTOM,
                    styles.secondTextInputContainer,
                  ]}>
                  <TextInput
                    placeholder={t('enter_your_referral_code')}
                    style={[
                      themes.NORMAL_TEXT_BLACK_BOLD,
                      styles.fontSize20,
                      {marginTop: width * 0.05, marginBottom: width * 0.02},
                    ]}
                  />
                </View>
              </View>
            </View> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <TouchableOpacity
        style={[themes.GREEN_BUTTON, themes.SHADOW_DEFAULT, styles.nextButton]}
        onPress={handleSubmitOTP}>
        <Text style={[themes.BUTTON_TEXT_WHITE, styles.fontSize14]}>
          {t('next')}
        </Text>
      </TouchableOpacity>
    </NavBar>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: '94%',
    marginVertical: width * 0.05,
    paddingBottom: width * 0.05,
    borderRadius: 5,
    paddingHorizontal: width * 0.05,
    paddingVertical: width * 0.05,
    justifyContent: 'space-between',
  },
  requestOTPButton: {
    height: width * 0.13,
    width: width * 0.3,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  phoneNumberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: width * 0.02,
  },
  textInputContainer: {
    borderBottomWidth: 0.5,
    paddingRight: width * 0.03,
    justifyContent: 'center',
  },
  secondTextInputContainer: {
    borderBottomWidth: 0.5,
    width: width * 0.5,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fontSize14: {
    fontSize: RFValue(14),
  },
  fontSize20: {
    fontSize: RFValue(20),
  },

  requestCodeText: {
    fontWeight: 'bold',
    fontSize: RFValue(12),
    marginTop: width * 0.01,
  },
  nextButton: {
    marginHorizontal: width * 0.07,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: width * 0.15,
  },
});

const mapStateToProps = (state) => {
  return {
    mobile: state.auth.user.mobile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    verifyMobile: (mobile) => dispatch(phoneVerification(mobile)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OtpScreen);
