import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
  BackHandler,
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';
import RNPickerSelect from 'react-native-picker-select';

import NavBar, {LeftButton} from '../../component/NavBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeleteModal, {
  LeftRightButton,
} from '../../component/popup/DeleteConfirmationModal';

import ImageWithFallBack from '../../component/ImageFallBack';
import {ParcelOrderContext} from 'states/context/parcelOrder.context';
import {getCourierByWeight} from '../../../../services/parcel';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {formatCurrency} from '../../../../utils/helper';
import {NoDataView} from '../../component/NoDataView';

const ParcelDelivery = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const [modalNaviVisible, setModalNaviVisible] = useState(false);
  const {parcelOrder, dispatchParcelOrder} = useContext(ParcelOrderContext);
  const [initialValues, setInitialValues] = useState({
    type: parcelOrder.type,
    courier: parcelOrder.courierId,
    full_address: parcelOrder.sender.full_address,
    weight: (parcelOrder.dimension.weight / 1000).toString(),
    remark: parcelOrder.remark,
  });
  const message = t('clear_filled_information_title');
  const subMessage = t('clear_filled_information_subtitle');

  useEffect(() => {
    const backAction = () => {
      handleLeftNavButton();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const ButtonNaviBackGroup = () => {
    const left = {
      text: t('no'),
      onPress: stayScreen,
    };
    const right = {
      text: t('yes'),
      onPress: handleClearAddressList,
    };
    return LeftRightButton({option: 'GREEN', left, right});
  };

  const stayScreen = () => {
    setModalNaviVisible((prev) => !prev);
  };

  const handleClearAddressList = () => {
    setModalNaviVisible(false);
    dispatchParcelOrder({type: 'CLEAR_ALL'});
    navigation.goBack();
  };

  useEffect(() => {
    if (route.params?.weight) {
      initialValues.full_address
        ? handleCourierWithAddress({
            location: parcelOrder.sender.location,
            full_address: parcelOrder.sender.full_address,
            dimension: parcelOrder.dimension,
          })
        : handleCourierWithDimension({
            dimension: parcelOrder.dimension,
          });
    }

    if (route.params?.address) {
      let addressObj = route.params?.address;
      handleCourierWithAddress({
        location: addressObj.payload.address.location,
        dimension: parcelOrder.dimension,
        weight: initialValues.weight,
        full_address: addressObj.payload.address.full_address,
      });
    }
  }, [route.params]);

  useEffect(() => {
    handleCourier();
  }, []);

  const handleCourierWithDimension = async ({dimension}) => {
    try {
      const dimensionIn = dimension;

      const response = await getCourierByWeight({
        dimension: dimensionIn,
        t,
      });
      if (response && response.length > 0) {
        setService(response);
        setInitialValues((prev) => ({
          ...prev,
          courier: response[0]._id,
          weight: (dimension.weight / 1000).toString(),
        }));
      }
    } catch (err) {
      console.log('ParcelOrder -> handleCourierWithDimension err:', err);
    }
  };

  const handleCourierWithAddress = async ({
    type,
    weight = false,
    dimension = false,
    full_address,
    location,
  }) => {
    try {
      const response = await getCourierByWeight({
        parcelType: type,
        weight: weight,
        dimension: dimension,
        sender_location: location,
        t,
      });
      if (response && response.length > 0) {
        setService(response);
        setInitialValues((prev) => ({
          ...prev,
          courier: response[0]._id,
          weight: weight
            ? weight
            : (parcelOrder.dimension.weight / 1000).toString(),
          full_address: full_address,
        }));
      }
    } catch (err) {
      console.log('ParcelOrder -> handleCourierWithAddress err:', err);
    }
  };

  const handleCourierWithWeight = async ({type, weight}) => {
    try {
      const response = await getCourierByWeight({
        parcelType: type,
        weight: weight,
        t,
      });
      if (response && response.length > 0) {
        setService(response);
        setInitialValues((prev) => ({
          ...prev,
          courier: response[0]._id,
          weight: weight,
        }));
      }
    } catch (err) {
      console.log('ParcelOrder -> handleCourierWithWeight err:', err);
    }
  };

  const handleCourier = async () => {
    try {
      const response = await getCourierByWeight({
        t,
      });
      if (response && response.length > 0) {
        setService(response);
        setInitialValues((prev) => ({
          ...prev,
          courier: response[0]._id,
        }));
      }
    } catch (err) {
      console.log('ParcelOrder -> handleCourier err:', err);
    }
  };

  const handleLeftNavButton = () => {
    if (
      initialValues.full_address != '' ||
      initialValues.remark != undefined ||
      initialValues.weight.match(/[1-9]/)
    ) {
      setModalNaviVisible(true);
    } else {
      navigation.goBack();
    }
  };

  const navigateToCalculateWeight = () => {
    navigation.navigate('CalculateWeight');
  };

  const handleChangeLocation = (values) => {
    navigation.navigate('ChoosePlace', {
      savedplace: false,
      parcel: 'sender',
      onGoBack: ({address, location}) => {
        handleCourierWithAddress({
          location: location,
          dimension: parcelOrder.dimension,
          weight: values.weight,
          full_address: address,
        });
      },
    });
  };

  const handleAddToParcelBasket = (values) => {
    dispatchParcelOrder({type: 'SET_TYPE_COURIER', payload: values});
    navigation.navigate('SenderDetails');
  };

  const [styleId, setStyleId] = useState(0);
  const [service, setService] = useState([]);

  const ParcelSchema = Yup.object().shape({
    full_address: Yup.string().required(t('sender_address')),
    courier: Yup.string().required(t('no_courier')),
    weight: Yup.string()
      .matches(/([1-9])/, t('parcel_weight'))
      .required(t('parcel_weight')),
  });

  const FormInput = ({
    title,
    placeholder,
    onPress,
    value,
    error,
    onChange,
    onReplaceError,
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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TextInput
            placeholderTextColor="#C0C0C0"
            onFocus={onReplaceError}
            keyboardType={title === t('parcel_weight') ? 'numeric' : 'default'}
            onEndEditing={(event) => {
              if (
                event.nativeEvent.text != '' &&
                parseFloat(event.nativeEvent.text) > 0 &&
                title == t('parcel_weight')
              ) {
                dispatchParcelOrder({
                  type: 'SET_DIMENSION',
                  payload: {
                    weight: Math.round(
                      parseFloat(event.nativeEvent.text) * 1000,
                    ),
                    width: '0.0',
                    length: '0.0',
                    height: '0.0',
                  },
                });

                if (initialValues.full_address != '')
                  handleCourierWithAddress({
                    type: initialValues.type.toLowerCase(),
                    weight: event.nativeEvent.text,
                    full_address: initialValues.full_address,
                    location: parcelOrder.sender.location,
                  });
                else
                  handleCourierWithWeight({
                    type: initialValues.type.toLowerCase(),
                    weight: event.nativeEvent.text,
                  });
              }
            }}
            onChangeText={(text) => {
              if (!error && onChange) {
                onChange(text);
              }
            }}
            placeholder={placeholder}
            defaultValue={error ? error + ' *' : value}
            style={[
              themes.NORMAL_TEXT_BLACK_BOLD,
              error ? styles.errorTextInput : styles.textInput,
            ]}
          />
          {title !== t('remark') && (
            <TouchableOpacity onPress={onPress}>
              <Text style={[themes.EDIT_GREEN_TEXT, styles.calculateButton]}>
                {t('calculate')}
              </Text>
            </TouchableOpacity>
          )}
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
          validationSchema={ParcelSchema}
          initialValues={initialValues}
          onSubmit={(values) => {
            handleAddToParcelBasket(values);
          }}>
          {({
            handleChange,
            handleBlur,
            setFieldError,
            setFieldValue,
            handleSubmit,
            values,
            errors,
            touched,
            dirty,
          }) => {
            return (
              <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}>
                <ScrollView>
                  <View
                    style={[
                      themes.GREEN_BOARDER,
                      themes.SHADOW_DEFAULT,
                      themes.BACKGROUND_WHITE_WRAP,
                      styles.wrapContainer,
                    ]}>
                    <View style={[themes.GREEN_BUTTON, styles.titleView]}>
                      <Text style={[themes.EDIT_WHITE_TEXT, styles.titleText]}>
                        {t('parcel_type')}
                      </Text>
                    </View>
                    <View style={styles.viewInput}>
                      <RNPickerSelect
                        placeholder={{}}
                        items={[
                          {label: t('parcel'), value: 'parcel'},
                          {label: 'Document', value: 'document'},
                        ]}
                        // value={selection}
                        onValueChange={(value) => {
                          values.type = value;
                        }}
                        style={{
                          inputIOS: {
                            color: 'black',
                            fontWeight: 'bold',
                            fontSize: RFValue(13),
                            width: width * 0.82,
                          },
                          inputAndroid: {
                            color: 'black',
                            fontWeight: 'bold',
                            fontSize: RFValue(13),
                            width: width * 0.835,
                            marginVertical: width * -0.03,
                            marginLeft: width * -0.015,
                          },
                        }}
                        Icon={() => {
                          return Platform.OS === 'ios' ? (
                            <Ionicons
                              name="chevron-forward-outline"
                              size={24}
                              color="black"
                            />
                          ) : (
                            <Ionicons
                              name="chevron-forward-outline"
                              size={24}
                              color="black"
                            />
                          );
                        }}
                      />
                    </View>
                  </View>
                  <View
                    style={[
                      themes.GREEN_BOARDER,
                      themes.SHADOW_DEFAULT,
                      themes.BACKGROUND_WHITE_WRAP,
                      styles.addressWrapContainer,
                    ]}>
                    <View style={[themes.GREEN_BUTTON, styles.titleView]}>
                      <Text style={[themes.EDIT_WHITE_TEXT, styles.titleText]}>
                        {t('sender_address')}
                      </Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        style={styles.addressInput}
                        onPress={() => {
                          setFieldError('full_address', '');
                          handleChangeLocation(values);
                        }}>
                        <View>
                          <TextInput
                            scrollEnabled={true}
                            multiline={true}
                            style={[
                              themes.NORMAL_TEXT_BLACK_BOLD,
                              errors.full_address
                                ? styles.errorAddressText
                                : styles.addressText,
                            ]}
                            editable={false}
                            autoCorrect={false}
                            defaultValue={
                              errors.full_address
                                ? t('address') + ' *'
                                : values.full_address
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
                    </View>
                  </View>
                  <FormInput
                    title={t('parcel_weight')}
                    placeholder={t('0.00')}
                    error={errors.weight}
                    value={values.weight == '0' ? null : values.weight}
                    onChange={(value) => {
                      setFieldError('weight', '');
                      setFieldValue('weight', value, false);
                    }}
                    onPress={() => {
                      setFieldError('weight', '');
                      navigateToCalculateWeight();
                    }}
                    onReplaceError={() => {
                      setFieldError('weight', '');
                    }}
                  />
                  <FormInput
                    title={t('remark')}
                    placeholder={t('remark')}
                    value={values.remark}
                    onChange={(value) => setFieldValue('remark', value, false)}
                  />
                  <Text
                    style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.headerTitle]}>
                    {t('choose_courier')}
                  </Text>

                  <View style={{marginBottom: height * 0.25}}>
                    {service.length > 0 ? (
                      service.map((item, i) => {
                        return (
                          <TouchableOpacity
                            key={i}
                            onPress={() => {
                              values.courier = service[i]._id;
                              setStyleId(i);
                            }}
                            style={
                              i === styleId
                                ? [
                                    themes.SHADOW_DEFAULT,
                                    themes.BACKGROUND_WHITE_WRAP,
                                    themes.GREEN_BOARDER,
                                    styles.courierContainer,
                                  ]
                                : [
                                    themes.SHADOW_DEFAULT,
                                    themes.BACKGROUND_WHITE_WRAP,
                                    styles.courierContainer,
                                  ]
                            }>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                flex: 1,
                              }}>
                              <ImageWithFallBack
                                type={'parcel_price'}
                                style={styles.imageSize}
                                source={`${item._id}/${item.courier_image}`}
                              />
                              <View style={{paddingHorizontal: width * 0.02}}>
                                <Text
                                  style={[
                                    themes.NORMAL_TEXT_BLACK_BOLD,
                                    styles.courierText,
                                  ]}>
                                  {item.courier_name}
                                </Text>
                                <Text style={styles.courierText}>
                                  {formatCurrency('myr', item.price)}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        );
                      })
                    ) : (
                      <NoDataView {...{title:'No courier service', subTitle:' '}}/>
                    )}
                  </View>
                </ScrollView>

                <TouchableOpacity
                  onPress={() => {
                    if (errors.courier || !values.courier) {
                      Alert.alert(t('warning'), t('no_courier'));
                    } else {
                      handleSubmit();
                    }
                  }}
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

      <DeleteModal
        {...{
          message: message,
          subMessage: subMessage,
          modalVisible: modalNaviVisible,
          setModalVisible: setModalNaviVisible,
          ButtonGroup: ButtonNaviBackGroup,
        }}
      />
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
  viewInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  headerTitle: {
    marginHorizontal: width * 0.075,
    marginVertical: height * 0.02,
    fontSize: RFValue(13),
  },
  courierContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    width: width * 0.9,
    height: width * 0.2,
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.01,
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
  calculateButton: {
    paddingRight: width * 0.05,
  },
  courierText: {
    width: width * 0.5,
    margin: 2,
  },
  imageSize: {
    width: width * 0.2,
    height: width * 0.1,
    borderRadius: 10,
  },
  errorAddressText: {
    color: '#BB1E10',
    width: width * 0.8,
    paddingHorizontal: width * 0.04,
    height: height * 0.01,
  },
  addressText: {
    paddingHorizontal: width * 0.04,
    ...Platform.select({
      ios: {
        width: width * 0.8,
      },
      android: {
        width: width * 0.82,
      },
    }),
  },
  addressWrapContainer: {
    borderRadius: 15,
    width: width * 0.9,
    marginHorizontal: width * 0.05,
    marginTop: height * 0.02,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        height: width * 0.3,
      },
      default: {
        height: width * 0.32,
      },
    }),
  },
  addressInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        height: height * 0.08,
        paddingRight: width * 0.03,
        paddingVertical: height * 0.005,
      },
      android: {
        height: height * 0.12,
        paddingRight: width * 0.03,
      },
    }),
  },
});

export default ParcelDelivery;
