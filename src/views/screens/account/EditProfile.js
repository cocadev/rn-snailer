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
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';

import {connect} from 'react-redux';

import {RFValue} from 'styles/ResponsiveFont';
import {useTranslation} from 'react-i18next';
import {themes} from 'utils/themeProvider';
import {patchUserInfo, updateProfileImage} from 'services/auth';
import Feather from 'react-native-vector-icons/Feather';
import {Formik} from 'formik';
import * as yup from 'yup';
import ImagePicker from 'react-native-image-crop-picker';

import NavBar, {LeftButton} from '../component/NavBar';
import ImageWithFallBack from '../component/ImageFallBack';
import {Loader} from '../component/Loader';
import {
  updateUserProfileRedux,
  updateProfileImageRedux,
} from '../../../states/redux/ActionCreators/auth';

const mapStateToProps = (state) => {
  return {
    userRedux: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserProfileRedux: (updateObject) =>
      dispatch(updateUserProfileRedux(updateObject)),
    updateProfileImageRedux: (image) =>
      dispatch(updateProfileImageRedux(image)),
  };
};

const EditProfile = ({
  navigation,
  route,
  userRedux,
  updateUserProfileRedux,
  updateProfileImageRedux,
}) => {
  const [submit, setSubmit] = useState(false);
  const [userInfo, setUserInfo] = useState(userRedux);
  const [profileImage, setProfileImage] = useState(null);
  const [edited, setEdited] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        multiple: false,
        compressImageQuality: 0.5,
      });
      if (image.size > 3 * 1024 * 1024) {
        alert(
          'Image size too large, please choose an image size smaller than 3MB',
        );
      } else {
        setProfileImage(image);
        setEdited(true);
      }
    } catch (error) {
      console.log('handleAddImage -> error', error);
    }
  };

  const compareFormValues = (values) => {
    const initial = Object.values(initialValues.user);
    const current = Object.values(values.user);

    for (let i = 0; i < initial.length; i++) {
      if (initial[i] !== current[i]) return true;
    }

    return false;
  };

  const handleChangeProfile = async (values) => {
    try {
      setSubmit(true);
      setLoading(true);
      let success = false;
      let imageSuccess = false;
      const infoChanged = compareFormValues(values);

      if (profileImage) {
        const {success, results} = await patchUserInfo({
          user_info: values.user,
          image: profileImage,
          t,
        });
        if (success) {
          imageSuccess = true;
          if (results?.image) updateProfileImageRedux(results.image);
        }
      } else {
        imageSuccess = true;
      }

      if (infoChanged) {
        success = await patchUserInfo({
          user_info: values.user,
          t,
        });

        if (success) {
          updateUserProfileRedux(values.user);
        }
      } else {
        success = true;
      }

      if (success && imageSuccess) {
        setTimeout(() => {
          navigation.goBack();
        }, 300);
      }
    } catch (e) {
      console.log('EditProfile -> handleChangeProfile err', e);
    } finally {
      setLoading(true);
    }
  };

  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const {t, i18n} = useTranslation();
  const user = userRedux;

  const initialValues = {
    user: {
      email: user.email,
      familyName: user.last_name,
      givenName: user.first_name,
      phone_number: user.mobile ? user.mobile : '',
      photo: user.image,
    },
  };

  const validationSchema = yup.object().shape({
    user: yup.object().shape({
      familyName: yup.string().required('Required'),
      givenName: yup.string().required('Required'),
      email: yup.string().required('Required'),
      // phone_number: yup.number().required('Required'),
    }),
  });

  return (
    <NavBar title={t('edit_profile')} {...{LeftButton, handleLeftNavButton}}>
      <Loader {...{loading}} />
      <Formik
        // enableReinitialize
        initialValues={initialValues}
        onSubmit={(values) => {
          handleChangeProfile(values);
        }}
        validationSchema={validationSchema}>
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          errors,
          touched,
          dirty,
          isValid,
        }) => {
          return (
            <>
              <ScrollView>
                <View style={styles.infoContainer}>
                  <View style={styles.imageContainer}>
                    {profileImage ? (
                      <Image
                        source={{uri: profileImage.path}}
                        style={[styles.image]}
                      />
                    ) : (
                      <ImageWithFallBack
                        type="user"
                        style={[styles.image]}
                        source={user._id + '/' + user.image}
                      />
                    )}
                    <Text
                      style={
                        styles.text
                      }>{`${userInfo.first_name} ${userInfo.last_name}`}</Text>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: height * 0.01,
                      }}
                      onPress={handleAddImage}>
                      <View style={styles.infoWrap}>
                        <Text
                          style={[styles.changeText, themes.TEXT_TITLE_GREY]}>
                          {t('change_image')}
                        </Text>
                      </View>
                      <Feather
                        name="chevron-right"
                        size={17.5}
                        style={[styles.right, themes.TEXT_TITLE_GREY]}
                      />
                    </TouchableOpacity>
                  </View>
                  <View>
                    <View style={styles.inputWrap}>
                      <Text style={styles.title}>{t('first_name')}</Text>
                      <TextInput
                        style={[
                          themes.GREEN_BOARDER,
                          styles.textInput,
                          themes.SHADOW_DEFAULT,
                        ]}
                        value={values.user.givenName}
                        onChangeText={handleChange('user.givenName')}
                        onBlur={handleBlur('user.givenName')}
                      />
                      {errors &&
                        errors.user &&
                        errors.user.givenName &&
                        touched &&
                        touched.user &&
                        touched.user.givenName && (
                          <Text style={{color: 'red'}}>
                            {/* {errors.user.givenName} */}
                            Require.
                          </Text>
                        )}
                    </View>
                    <View style={[styles.inputWrap]}>
                      <Text style={styles.title}>{t('last_name')}</Text>
                      <TextInput
                        style={[
                          themes.GREEN_BOARDER,
                          styles.textInput,
                          themes.SHADOW_DEFAULT,
                        ]}
                        value={values.user.familyName}
                        onChangeText={handleChange('user.familyName')}
                        onBlur={handleBlur('user.familyName')}
                      />
                      {errors &&
                        errors.user &&
                        errors.user.familyName &&
                        touched &&
                        touched.user &&
                        touched.user.familyName && (
                          <Text style={{color: 'red'}}>
                            {/* {errors.user.familyName} */}
                            Require.
                          </Text>
                        )}
                    </View>
                    <View style={[styles.inputWrap]}>
                      <Text style={styles.title}>{t('phone_number')}</Text>
                      <View
                        style={[
                          themes.GREEN_BOARDER,
                          styles.phoneWrap,
                          themes.BACKGROUND_WHITE_WRAP,
                          themes.SHADOW_DEFAULT,
                        ]}>
                        <View
                          style={[styles.phoneLeft, themes.GREEN_BACKGROUND]}>
                          <View style={styles.malaysiaFlag}>
                            <Image
                              source={require('../../../assets/images/malaysia_flag.png')}
                              style={{height: '100%', width: '100%'}}
                            />
                          </View>
                          <Text style={styles.phone60}>+60</Text>
                        </View>
                        <View style={styles.phoneContainer}>
                          <TextInput
                            style={[styles.phoneRight, {color: 'grey'}]}
                            value={values.user.phone_number}
                            onChangeText={handleChange('user.phone_number')}
                            onBlur={handleBlur('user.phone_number')}
                            keyboardType={'numeric'}
                            editable={false}
                          />
                        </View>
                      </View>
                      {errors && errors.user && errors.user.phone_number && (
                        <Text style={{color: 'red'}}>
                          {/* {errors.user.phone_number} */}
                          Require.
                        </Text>
                      )}
                    </View>
                    <View style={styles.inputWrap}>
                      <Text style={styles.title}>{t('email_address')}</Text>
                      <TextInput
                        style={[
                          themes.GREEN_BOARDER,
                          styles.textInput,
                          themes.SHADOW_DEFAULT,
                        ]}
                        value={values.user.email}
                        onChangeText={handleChange('user.email')}
                        onBlur={handleBlur('user.email')}
                        keyboardType={'email-address'}
                      />
                      {errors && errors.user && errors.user.email && (
                        <Text style={{color: 'red'}}>
                          Require.
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </ScrollView>

              {(dirty || edited) && (
                <TouchableOpacity
                  onPress={
                    isValid
                      ? () => handleSubmit()
                      : () =>
                          Alert.alert(t('error'), t('incomplete_form_alert'))
                  }>
                  <Text
                    style={[
                      styles.button,
                      themes.BUTTON_TEXT_WHITE,
                      themes.GREEN_BACKGROUND,
                      themes.GREEN_BOARDER,
                    ]}>
                    {t('save_changes')}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          );
        }}
      </Formik>
    </NavBar>
  );
};

const {height, width} =
  Platform.OS === 'ios' ? Dimensions.get('screen') : Dimensions.get('window');

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: width * 0.03,
  },
  image: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: (width * 0.35) / 2,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginVertical: width * 0.03,
    borderColor: 'white',
  },
  infoWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: RFValue(15),
    textAlign: 'center',
    justifyContent: 'center',
    marginVertical: width * 0.0001,
    // backgroundColor: 'pink'
  },
  changeText: {
    fontSize: RFValue(13),
    textAlign: 'center',
  },
  right: {
    justifyContent: 'center',
    marginTop: height * 0.003,
  },
  infoContainer: {
    margin: 15,
  },
  textInput: {
    borderRadius: 10,
    fontSize: RFValue(13),
    paddingHorizontal: width * 0.03,
    height: '100%',

    backgroundColor: 'white',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: width * 0.02,
    fontSize: RFValue(13),
  },
  inputWrap: {
    marginBottom: width * 0.15,
    height: width * 0.12,
  },
  phoneWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    height: '100%',
  },
  phoneLeft: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: '100%',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    alignItems: 'center',
    flex: 0.3,
  },
  phone60: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: RFValue(15),
  },
  malaysiaFlag: {
    width: width * 0.1,
    height: width * 0.05,
  },
  phoneContainer: {
    flex: 0.7,
  },
  phoneRight: {
    justifyContent: 'center',
    fontSize: RFValue(13),
    fontWeight: 'bold',
    height: '100%',
    textAlign: 'left',
    alignContent: 'center',
    paddingLeft: width * 0.05,
  },
  button: {
    width: width * 0.7,
    height: width * 0.13,
    alignSelf: 'center',
    textAlign: 'center',
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 1,

    fontSize: RFValue(14),
    ...Platform.select({
      ios: {
        alignItems: 'center',
        lineHeight: width * 0.12,
        height: width * 0.12,
        marginBottom: width * 0.07,
      },
      android: {
        textAlignVertical: 'center',
        marginBottom: width * 0.04,
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
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
