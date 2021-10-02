import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';

import NavBar, {LeftButton} from '../../component/NavBar';
import {ParcelOrderContext} from 'states/context/parcelOrder.context';
import {createParcel} from '../../../../services/parcel';
import {Formik} from 'formik';
import * as Yup from 'yup';

const ReceiverDetails = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {parcelOrder, dispatchParcelOrder} = useContext(ParcelOrderContext);
  const [initialValues, setInitialValues] = useState({
    receiver: parcelOrder.receiver,
  });

  const handleConfirmOrder = async (values) => {
    try {
      const response = await createParcel({
        parcelTitle: parcelOrder.itemName,
        parcelType: parcelOrder.type,
        parcelWeight: parseInt(parcelOrder.dimension.weight),
        courierID: parcelOrder.courierId,
        riderRemark: parcelOrder.remark,
        dimension: {
          height: parseInt(parcelOrder.dimension.height),
          width: parseInt(parcelOrder.dimension.width),
          depth: parseInt(parcelOrder.dimension.length),
        },
        sender: {
          ...parcelOrder.sender,
          postcode: parcelOrder.sender.postcode.toString(),
        },
        receiver: {
          ...values.receiver,
          postcode: values.receiver.postcode.toString(),
        },
        promoCode: parcelOrder.promoCode,
        paymentMethod: 'cash',
        previewBool: true,
        pin: '',
        t,
      });
      if (response) {
        dispatchParcelOrder({type: 'SET_TOTAL', payload: response});
        navigation.navigate('ParcelOrder');
      }
    } catch (err) {
      console.log('ReceiverDetail -> handleConfirmOrder err:', err);
    }
  };

  const handleChangeLocation = (values) => {
    navigation.navigate('ChoosePlace', {
      savedplace: false,
      parcel: 'receiver',
      receiverEmail: values.receiver?.email ? values.receiver.email : '',
      onGoBack: ({receiverInput}) => {
        setInitialValues({receiver: receiverInput});
      },
    });
  };

  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const ReceiverSchema = Yup.object().shape({
    receiver: Yup.object().shape({
      name: Yup.string().required(t('receiver_name')),
      contact: Yup.string()
        .matches(/^(01)[0-46-9]*[0-9]{7,8}$/, t('invalid_contact'))
        .required(t('phone_title')),
      email: Yup.string().required(t('email')),
      full_address: Yup.string().required('Required'),
      postcode: Yup.string().notOneOf(['0']).required('Required'),
    }),
  });

  const FormInput = ({
    title,
    placeholder,
    value,
    error,
    onChangeValue,
    onPress,
  }) => {
    return (
      <View
        style={[
          themes.GREEN_BOARDER,
          themes.SHADOW_DEFAULT,
          themes.BACKGROUND_WHITE_WRAP,
          styles.wrapContainer,
        ]}>
        <View style={[themes.GREEN_BUTTON, styles.titleView]}>
          <Text style={[themes.EDIT_WHITE_TEXT, styles.titleText]}>
            {title}
          </Text>
        </View>
        <View>
          <TextInput
            placeholderTextColor="#C0C0C0"
            onFocus={onPress}
            onChangeText={(text) => {
              if (!error) {
                onChangeValue(text);
              }
            }}
            autoCapitalize={title == t('email') ? 'none' : 'words'}
            placeholder={placeholder}
            defaultValue={error ? error + ' *' : value}
            autoCorrect={false}
            style={[
              themes.NORMAL_TEXT_BLACK_BOLD,
              error ? styles.errorTextInput : styles.textInput,
            ]}
          />
        </View>
      </View>
    );
  };

  return (
    <>
      <NavBar
        title={t('delivery')}
        {...{
          LeftButton,
          handleLeftNavButton,
        }}>
        <Formik
          enableReinitialize
          validationSchema={ReceiverSchema}
          initialValues={initialValues}
          onSubmit={(values) => {
            dispatchParcelOrder({type: 'SET_RECEIVER', payload: values});
            handleConfirmOrder(values);
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldError,
            setFieldValue,
            values,
            errors,
            touched,
            dirty,
          }) => {
            return (
              <>
                <KeyboardAvoidingView
                  behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                  keyboardVerticalOffset={Platform.OS == 'ios' ? 0 : -1000}
                  style={{flex: 1}}>
                  <ScrollView>
                    <View>
                      <Text
                        style={[
                          themes.NORMAL_TEXT_BLACK_BOLD,
                          styles.headerTitle,
                        ]}>
                        {t('receiver_detail')}
                      </Text>
                      <FormInput
                        onPress={() => {
                          setFieldError('receiver.name', '');
                        }}
                        onChangeValue={(value) => {
                          setFieldValue('receiver.name', value, false);
                        }}
                        title={t('receiver_name')}
                        value={values.receiver.name}
                        error={errors.receiver?.name}
                        placeholder={t('name')}
                      />
                      <FormInput
                        onPress={() => {
                          setFieldError('receiver.contact', '');
                        }}
                        onChangeValue={(value) => {
                          setFieldValue('receiver.contact', value, false);
                        }}
                        title={t('phone_title')}
                        value={values.receiver.contact}
                        error={errors.receiver?.contact}
                        placeholder={t('phone_number')}
                      />
                      <FormInput
                        onPress={() => {
                          setFieldError('receiver.email', '');
                        }}
                        onChangeValue={(value) => {
                          setFieldValue('receiver.email', value, false);
                        }}
                        title={t('email')}
                        value={values.receiver.email}
                        error={errors.receiver?.email}
                        placeholder={t('email')}
                      />
                      <View
                        style={[
                          themes.GREEN_BOARDER,
                          themes.SHADOW_DEFAULT,
                          themes.BACKGROUND_WHITE_WRAP,
                          styles.wrapAddressContainer,
                        ]}>
                        <View style={[themes.GREEN_BUTTON, styles.titleView]}>
                          <Text
                            style={[themes.EDIT_WHITE_TEXT, styles.titleText]}>
                            {t('address')}
                          </Text>
                        </View>
                        <View>
                          <TouchableOpacity
                            style={[
                              themes.GREEN_BOARDER_BOTTOM,
                              styles.addressInput,
                            ]}
                            onPress={() => handleChangeLocation(values)}>
                            <View>
                              <TextInput
                                placeholderTextColor="#C0C0C0"
                                onFocus={() =>
                                  setFieldError('receiver.full_address', '')
                                }
                                onChangeText={(text) => {
                                  setFieldValue(
                                    'receiver.full_address',
                                    text,
                                    false,
                                  );
                                }}
                                multiline={true}
                                style={[
                                  errors.receiver?.full_address
                                    ? themes.EDIT_RED_TEXT
                                    : themes.NORMAL_TEXT_BLACK_BOLD,
                                  styles.addressText,
                                ]}
                                autoCorrect={false}
                                defaultValue={
                                  errors.receiver?.full_address
                                    ? t('address') + ' *'
                                    : values.receiver.full_address
                                }
                                placeholder={t('address')}
                                numberOfLines={3}
                              />
                            </View>
                            <Ionicons
                              name="chevron-forward-outline"
                              size={22}
                              color="black"
                            />
                          </TouchableOpacity>

                          <TextInput
                            placeholderTextColor="#C0C0C0"
                            onFocus={() =>
                              setFieldError('receiver.postcode', '')
                            }
                            style={[
                              themes.NORMAL_TEXT_BLACK_BOLD,
                              themes.GREEN_BOARDER_BOTTOM,
                              errors.receiver?.postcode
                                ? styles.errorViewInput
                                : styles.viewInput,
                            ]}
                            autoCorrect={false}
                            defaultValue={
                              errors.receiver?.postcode
                                ? t('postal_code') + ' *'
                                : values.receiver.postcode == '0'
                                ? null
                                : values.receiver.postcode
                            }
                            onChangeText={(text) => {
                              return (values.receiver.postcode = text);
                            }}
                            placeholder={t('postal_code')}
                          />
                        </View>
                      </View>
                    </View>
                  </ScrollView>
                  <TouchableOpacity
                    onPress={() => {
                      if (values.receiver.email.match('.@'))
                        handleSubmit();
                      else setFieldError('receiver.email', t('invalid_email'));
                    }}
                    style={[themes.GREEN_BUTTON, styles.continueButton]}>
                    <Text style={[themes.EDIT_WHITE_TEXT, styles.buttonText]}>
                      {t('continue')}
                    </Text>
                  </TouchableOpacity>
                </KeyboardAvoidingView>
              </>
            );
          }}
        </Formik>
      </NavBar>
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  headerTitle: {
    marginHorizontal: width * 0.05,
    marginTop: height * 0.02,
    fontSize: RFValue(13),
  },
  wrapContainer: {
    borderRadius: 15,
    width: width * 0.9,
    height: width * 0.2,
    marginHorizontal: width * 0.05,
    marginTop: height * 0.02,
    borderWidth: 1,
  },
  titleView: {
    paddingVertical: width * 0.005,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  titleText: {
    fontSize: RFValue(13),
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
  },
  textInput: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
  },
  errorTextInput: {
    color: '#BB1E10',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
  },
  wrapAddressContainer: {
    borderRadius: 15,
    width: width * 0.9,
    marginHorizontal: width * 0.05,
    marginTop: height * 0.02,
    marginBottom: height * 0.15,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        height: width * 0.7,
      },
      default: {
        height: width * 1,
      },
    }),
  },
  viewInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    ...Platform.select({
      ios: {
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.015,
      },
      android: {
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.01,
      },
    }),
  },
  errorViewInput: {
    color: '#BB1E10',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    ...Platform.select({
      ios: {
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.015,
      },
      android: {
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.01,
      },
    }),
  },
  continueButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    height: width * 0.125,
    width: width * 0.75,
    bottom: width * 0.1,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: RFValue(14),
  },
  wrapAddressContainer: {
    borderRadius: 15,
    width: width * 0.9,
    marginHorizontal: width * 0.05,
    marginTop: height * 0.02,
    marginBottom: height * 0.15,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        height: width * 0.6,
      },
      default: {
        height: width * 0.6,
      },
    }),
  },
  addressInput: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        height: height * 0.1,
        paddingRight: width * 0.03,
        paddingVertical: height * 0.005,
      },
      android: {
        height: height * 0.15,
        paddingRight: width * 0.03,
        paddingVertical: height * 0.001,
      },
    }),
  },
  addressText: {
    width: width * 0.8,
    paddingHorizontal: width * 0.04,
  },
});

export default ReceiverDetails;
