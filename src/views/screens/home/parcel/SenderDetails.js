import React, {useContext, useEffect, useState} from 'react';
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
  Alert,
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';

import NavBar, {LeftButton} from '../../component/NavBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ParcelOrderContext} from 'states/context/parcelOrder.context';
import {Formik} from 'formik';
import * as Yup from 'yup';

const SenderDetails = ({navigation, route}) => {
  const {parcelOrder, dispatchParcelOrder} = useContext(ParcelOrderContext);
  const {t, i18n} = useTranslation();
  const [initialValues, setInitialValues] = useState({
    itemName: parcelOrder.itemName,
    sender: parcelOrder.sender,
  });

  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const alertMessage = () => {
    Alert.alert(
      t('address_change'),
      t('back_address'),
      [
        {
          text: 'No',
        },
        {
          text: 'Yes',
          onPress: () => handleLeftNavButton(),
        },
      ],
      {cancellable: false},
    );
  };

  const navigateToReceiverDetails = (values) => {
    dispatchParcelOrder({type: 'SET_SENDER', payload: values});
    navigation.navigate('ReceiverDetails');
  };

  useEffect(() => {
    if (route.params?.address) {
      setInitialValues({
        itemName: parcelOrder.itemName,
        sender: parcelOrder.sender,
      });
    }
  }, [route.params]);

  const SenderSchema = Yup.object().shape({
    itemName: Yup.string().required(t('parcel_item')),
    sender: Yup.object().shape({
      name: Yup.string().required(t('sender_name')),
      contact: Yup.string()
        .matches(/^(01)[0-46-9]*[0-9]{7,8}$/, t('invalid_contact'))
        .required(t('phone_title')),
      full_address: Yup.string().required('Required'),
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
          validationSchema={SenderSchema}
          initialValues={initialValues}
          onSubmit={(values) => {
            navigateToReceiverDetails(values);
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
              <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS == 'ios' ? 0 : -1000}
                style={{flex: 1}}>
                <ScrollView>
                  <View>
                    <FormInput
                      onPress={() => {
                        setFieldError('itemName', '');
                      }}
                      onChangeValue={(value) => {
                        setFieldValue('itemName', value, false);
                      }}
                      title={t('parcel_item')}
                      value={values.itemName}
                      error={errors.itemName}
                      placeholder={t('name')}
                    />
                    <Text
                      style={[
                        themes.NORMAL_TEXT_BLACK_BOLD,
                        styles.headerTitle,
                      ]}>
                      {t('sender_detail')}
                    </Text>
                    <FormInput
                      onPress={() => {
                        setFieldError('sender.name', '');
                      }}
                      onChangeValue={(value) => {
                        setFieldValue('sender.name', value, false);
                      }}
                      title={t('sender_name')}
                      value={values.sender.name}
                      error={errors.sender?.name}
                      placeholder={t('name')}
                    />
                    <FormInput
                      onPress={() => {
                        setFieldError('sender.contact', '');
                      }}
                      onChangeValue={(value) => {
                        setFieldValue('sender.contact', value, false);
                      }}
                      title={t('phone_title')}
                      value={values.sender.contact}
                      error={errors.sender?.contact}
                      placeholder={t('phone_number')}
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
                        <TextInput
                          placeholderTextColor="#C0C0C0"
                          onPress={alertMessage}
                          style={[
                            themes.NORMAL_TEXT_BLACK_BOLD,
                            themes.GREEN_BOARDER_BOTTOM,
                            errors.sender?.full_address
                              ? styles.errorViewInput
                              : styles.viewInput,
                          ]}
                          editable={false}
                          autoCorrect={false}
                          defaultValue={
                            errors.sender?.full_address
                              ? t('unit') + ' *'
                              : values.sender.unit_no
                          }
                          onChangeText={(text) => {
                            return (values.sender.unit = text);
                          }}
                          placeholder={t('unit')}
                        />
                        <TextInput
                          placeholderTextColor="#C0C0C0"
                          onPress={alertMessage}
                          style={[
                            themes.NORMAL_TEXT_BLACK_BOLD,
                            themes.GREEN_BOARDER_BOTTOM,
                            errors.sender?.full_address
                              ? styles.errorViewInput
                              : styles.viewInput,
                          ]}
                          editable={false}
                          autoCorrect={false}
                          defaultValue={
                            errors.sender?.full_address
                              ? t('block') + ' *'
                              : values.sender.block
                          }
                          onChangeText={(text) => {
                            return (values.sender.block = text);
                          }}
                          placeholder={t('block')}
                        />
                        <TextInput
                          placeholderTextColor="#C0C0C0"
                          onPress={alertMessage}
                          style={[
                            themes.NORMAL_TEXT_BLACK_BOLD,
                            themes.GREEN_BOARDER_BOTTOM,
                            errors.sender?.full_address
                              ? styles.errorViewInput
                              : styles.viewInput,
                          ]}
                          editable={false}
                          autoCorrect={false}
                          defaultValue={
                            errors.sender?.full_address
                              ? t('level') + ' *'
                              : values.sender.level
                          }
                          onChangeText={(text) => {
                            return (values.sender.level = text);
                          }}
                          placeholder={t('level')}
                        />
                        <View
                          style={[
                            themes.GREEN_BOARDER_BOTTOM,
                            styles.addressInput,
                          ]}>
                          <TextInput
                            placeholderTextColor="#C0C0C0"
                            onPress={alertMessage}
                            multiline={true}
                            style={[
                              themes.NORMAL_TEXT_BLACK_BOLD,
                              errors.sender?.full_address
                                ? styles.errorAddressText
                                : styles.addressText,
                            ]}
                            editable={false}
                            autoCorrect={false}
                            defaultValue={
                              errors.sender?.full_address
                                ? t('address') + ' *'
                                : values.sender.full_address
                            }
                            placeholder={t('address')}
                            numberOfLines={3}
                          />
                        </View>
                        <TextInput
                          placeholderTextColor="#C0C0C0"
                          onPress={alertMessage}
                          style={[
                            themes.NORMAL_TEXT_BLACK_BOLD,
                            themes.GREEN_BOARDER_BOTTOM,
                            errors.sender?.full_address
                              ? styles.errorViewInput
                              : styles.viewInput,
                          ]}
                          editable={false}
                          autoCorrect={false}
                          defaultValue={
                            errors.sender?.full_address
                              ? t('postal_code') + ' *'
                              : values.sender.postcode == '0'
                              ? null
                              : values.sender.postcode
                          }
                          onChangeText={(text) => {
                            return (values.sender.postcode = text);
                          }}
                          placeholder={t('postal_code')}
                        />
                      </View>
                    </View>
                  </View>
                </ScrollView>
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={[themes.GREEN_BUTTON, styles.continueButton]}>
                  <Text style={[themes.EDIT_WHITE_TEXT, styles.buttonText]}>
                    {t('continue')}
                  </Text>
                </TouchableOpacity>
              </KeyboardAvoidingView>
            );
          }}
        </Formik>
      </NavBar>
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
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
  errorTextInput: {
    color: '#BB1E10',
    fontSize: RFValue(13),
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
  },
  textInput: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
  },
  headerTitle: {
    marginHorizontal: width * 0.05,
    marginTop: height * 0.02,
    fontSize: RFValue(13),
  },
  viewInput: {
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
  errorAddressText: {
    color: '#BB1E10',
    width: width * 0.8,
    paddingHorizontal: width * 0.04,
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
    height: width * 0.9,
  },
});

export default SenderDetails;

/* */
