import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  Text,
  Modal,
  SafeAreaView,
  TextInput,
} from 'react-native';
import {RFValue, getStatusBarHeight} from 'styles/ResponsiveFont';
import DateTimePicker from '@react-native-community/datetimepicker';
import Feather from 'react-native-vector-icons/Feather';
import deliverIcon from '../../../../assets/icons/delivery.png';
import selfpickup from '../../../../assets/icons/selfpickup.png';

import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';
import {formatDate} from '../../../../utils/helper';

const ChangeDeliveryOption = ({
  modalVisible,
  setModalVisible,
  title,
  subMessage,
  TimeButtonGroup,
  ButtonGroup,
  navigation,
  showTimeModal,
  setTimeModalShow,
  handleDeliverButton,
  handleScheduleButton,
  handleModalChevronLeftButton,
  date,
  formattedDate,
  onChange,
  showTimePicker,
  setShowTimePicker,
  deliveryMethod,
  setDeliveryMethod,
}) => {
  const {t, i18n} = useTranslation();
  // const [showTimeModal, setTimeModalShow] = useState(false);

  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');
  const minDate = Date.now() + 60 * 60 * 1000; // an hour from now

  const showMode = (currentMode) => {
    setShowTimePicker(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  // const handleDeliverButton = () => {
  //   setTimeModalShow(false);
  // };

  // const handleScheduleButton = () => {
  //   setTimeModalShow(false);
  // };

  return (
    <>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        {modalVisible ? (
          <StatusBar backgroundColor={'#70707090'} barStyle="light-content" />
        ) : null}
        <View style={styles.blur}>
          {!showTimeModal ? (
            <View style={styles.popUpContainer}>
              <View style={styles.titleWrap}>
                <View style={styles.width} />
                <Text style={styles.text}>{title}</Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}
                  style={styles.width}>
                  <Feather
                    name="x-circle"
                    size={30}
                    style={styles.closeButton}
                  />
                </TouchableOpacity>
              </View>

              <View style={[themes.GREEN_BUTTON, styles.rowWrap]}>
                <Text style={themes.EDIT_WHITE_TEXT}>
                  {t('select_order_type')}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.wrapper}
                onPress={() => setDeliveryMethod('rider')}>
                <Image source={deliverIcon} style={styles.image} />
                <Text
                  style={[
                    styles.deliverytypeText,
                    themes.NORMAL_TEXT_BLACK_BOLD,
                  ]}>
                  {t('delivery')}
                </Text>
                {deliveryMethod === 'rider' && (
                  <Text style={[themes.EDIT_GREEN_TEXT, styles.statusText]}>
                    ✓
                  </Text>
                )}
              </TouchableOpacity>
              <View
                style={[themes.GREEN_BOARDER_BOTTOM, styles.borderBottom]}
              />
              <TouchableOpacity
                style={styles.wrapper}
                onPress={() => setDeliveryMethod('self_pick_up')}>
                <Image source={selfpickup} style={styles.image} />
                <Text
                  style={[
                    themes.NORMAL_TEXT_BLACK_BOLD,
                    styles.deliverytypeText,
                  ]}>
                  {t('self_pickup')}
                  {/* {t('delivery_now')} (28 mins) */}
                </Text>
                {deliveryMethod === 'self_pick_up' && (
                  <Text style={[themes.EDIT_GREEN_TEXT, styles.statusText]}>
                    ✓
                  </Text>
                )}
              </TouchableOpacity>
              {deliveryMethod === 'rider' && (
                <>
                  <View style={[themes.GREEN_BUTTON, styles.rowWrap]}>
                    <Text style={themes.EDIT_WHITE_TEXT}>
                      {t('select_delivery_time')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setTimeModalShow(true);
                      handleDeliverButton;
                    }}>
                    <View style={[styles.totalWrap]}>
                      <Text
                        style={[
                          themes.NORMAL_TEXT_BLACK_BOLD,
                          styles.deliverynowText,
                        ]}>
                        {date > minDate
                          ? `${t('delivery_time')} : ${formatDate({
                              timeStamp: date,
                              type: 'MMM DD, h:mm a',
                            })}`
                          : `${t('delivery_now')} ${t('30_mins')}`}
                      </Text>
                      <Feather
                        name="chevron-right"
                        size={25}
                        style={[styles.right, themes.TEXT_TITLE_GREY]}
                      />
                    </View>
                  </TouchableOpacity>
                </>
              )}

              {/* {chooseTime ? <DeliveryTime /> : <DeliveryOption />} */}

              <Text style={styles.subText}>{subMessage}</Text>
              {ButtonGroup && <ButtonGroup />}
            </View>
          ) : (
            <View style={styles.popUpContainer}>
              <View style={styles.titleWrap}>
                <TouchableOpacity
                  style={styles.width}
                  onPress={handleModalChevronLeftButton}>
                  <Feather
                    name="chevron-left"
                    size={30}
                    style={styles.closeButton}
                  />
                </TouchableOpacity>

                <Text style={styles.text}>{t('select_delivery_time')}</Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}
                  style={styles.width}>
                  <Feather
                    name="x-circle"
                    size={30}
                    style={styles.closeButton}
                  />
                </TouchableOpacity>
              </View>

              <View style={[themes.GREEN_BUTTON, styles.selecttimerowWrap]}>
                <Text style={[themes.EDIT_WHITE_TEXT, styles.timeText]}>
                  {formattedDate}
                </Text>
              </View>
              {Platform.OS === 'android' ? (
                <>
                  <TouchableOpacity
                    style={[themes.GREEN_BOARDER, styles.textInput]}
                    onPress={showDatepicker}>
                    <Text
                      style={[themes.EDIT_GREEN_TEXT, styles.chooseTimeText]}>
                      {t('choose_date')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[themes.GREEN_BOARDER, styles.textInput]}
                    onPress={showTimepicker}>
                    <Text
                      style={[themes.EDIT_GREEN_TEXT, styles.chooseTimeText]}>
                      {t('choose_time')}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <DateTimePicker
                  textColor={'black'}
                  value={date}
                  minimumDate={new Date(minDate)}
                  is24Hour={true}
                  display="spinner"
                  mode="datetime"
                  minuteInterval={30}
                  onChange={onChange}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  minimumDate={new Date(minDate)}
                  value={date}
                  is24Hour={true}
                  mode={mode}
                  minuteInterval={30}
                  onChange={onChange}
                />
              )}
              {TimeButtonGroup && <TimeButtonGroup />}
            </View>
          )}
        </View>
      </Modal>
    </>
  );
};

export const MiddleButton = ({onPress, buttonText}) => {
  return (
    <>
      <TouchableOpacity style={styles.middleButton} onPress={onPress}>
        <Text style={styles.middleButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    </>
  );
};

export const LeftRightButton = ({
  handleDeliverButton,
  handleScheduleButton,
  navigation,
  t,
}) => {
  return (
    <>
      <View style={styles.leftRightButtonWrap}>
        <TouchableOpacity
          style={styles.leftRightButton}
          onPress={handleDeliverButton}>
          <Text style={styles.middleButtonText}>{t('deliver_now')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.leftRightButton}
          onPress={handleScheduleButton}>
          <Text style={styles.middleButtonText}>{t('schedule')}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const {height, width} = Dimensions.get('window');
const statusBarHeight = getStatusBarHeight();

const styles = StyleSheet.create({
  popUpContainer: {
    width: width * 0.95,
    backgroundColor: '#FFFFFF',
    borderColor: '#00000029',
    borderWidth: 1,
    paddingLeft: width * 0.05,
    paddingRight: width * 0.05,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.02,
    borderRadius: 20,
    justifyContent: 'center',
    position: 'absolute',
    top: Platform.OS === 'ios' ? height * 0.3 : height * 0.2,
    left: width * 0.02,
    right: width * 0.02,
  },
  titleWrap: {
    flexDirection: 'row',
    paddingBottom: height * 0.02,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    // alignItems: 'flex-end',
  },
  width: {
    width: width * 0.1,
  },
  text: {
    fontWeight: 'bold',
    fontSize: RFValue(20),
    textAlign: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  middleButton: {
    width: width * 0.6,
    backgroundColor: '#468c64',
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: width * 0.02,
    ...Platform.select({
      ios: {
        alignItems: 'center',
        lineHeight: width * 0.12,
        height: width * 0.12,
      },
      android: {
        textAlignVertical: 'center',
        height: width * 0.13,
      },
      default: {
        alignItems: 'center',
        textAlignVertical: 'center',
      },
    }),
  },
  middleButtonText: {
    fontSize: RFValue(14),
    color: 'white',
    fontWeight: 'bold',
  },
  subText: {
    fontWeight: 'bold',
    fontSize: RFValue(14),
    marginBottom: height * 0.005,
    textAlign: 'left',
    color: '#707070',
  },
  rowWrap: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.01,
    borderRadius: 10,
    alignContent: 'center',
    height: Platform.OS === 'ios' ? height * 0.04 : height * 0.055,
  },
  wrapper: {
    flexDirection: 'row',
    marginHorizontal: width * 0.08,
    marginVertical: width * 0.03,
  },
  deliverytypeText: {
    marginLeft: width * 0.05,
    marginRight: width * 0.01,
    width: width * 0.5,
    alignSelf: 'center',
    fontSize: RFValue(13),
  },
  deliverynowText: {
    alignSelf: 'center',
    fontSize: RFValue(13),
  },
  image: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  statusText: {
    alignSelf: 'center',
    fontSize: RFValue(13),
    position: 'absolute',
    right: width * 0.02,
  },
  borderBottom: {
    borderBottomWidth: 0.5,
  },
  totalWrap: {
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    backgroundColor: 'white',
    padding: width * 0.03,
    marginVertical: height * 0.015,
    flexDirection: 'row',
    alignItems: 'center',
    height: Platform.OS === 'ios' ? height * 0.06 : height * 0.08,
  },
  right: {
    position: 'absolute',
    right: width * 0.05,
  },
  blur: {
    width: width,
    height: height + statusBarHeight,
    backgroundColor: '#70707090',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selecttimerowWrap: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.01,
    borderRadius: 10,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: Platform.OS === 'ios' ? height * 0.05 : height * 0.07,
  },
  timeText: {
    fontSize: RFValue(13),
  },
  pickerInput: {
    borderWidth: 1.2,
    borderRadius: 5,
    fontSize: RFValue(13),
    marginHorizontal: width * 0.03,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.6,
    elevation: 4,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        paddingHorizontal: width * 0.02,
        marginVertical: height * 0.02,

        height: height * 0.05,
      },
      android: {
        height: height * 0.07,
        marginVertical: height * 0.03,
      },
    }),
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    height: width * 0.12,
    fontSize: RFValue(13),
    paddingHorizontal: width * 0.03,
    marginTop: height * 0.02,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chooseTimeText: {
    fontWeight: 'bold',
    fontSize: RFValue(13),
  },
  leftRightButton: {
    width: width * 0.38,
    backgroundColor: '#468c64',
    borderRadius: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: width * 0.02,
    ...Platform.select({
      ios: {
        alignItems: 'center',
        lineHeight: width * 0.12,
        height: width * 0.1,
      },
      android: {
        textAlignVertical: 'center',
        height: width * 0.12,
      },
      default: {
        alignItems: 'center',
        textAlignVertical: 'center',
      },
    }),
  },
  leftRightButtonWrap: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: height * 0.02,
  },
});

export default ChangeDeliveryOption;
