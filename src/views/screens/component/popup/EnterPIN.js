import React, {useState, useContext, Fragment} from 'react';
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
} from 'react-native';
import {RFValue, getStatusBarHeight} from 'styles/ResponsiveFont';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import Feather from 'react-native-vector-icons/Feather';
import deliverIcon from '../../../../assets/icons/delivery.png';
import selfpickup from '../../../../assets/icons/selfpickup.png';

import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';
import {TextInput} from 'react-native-gesture-handler';

const CELL_COUNT = 6;

const EnterPIN = ({
  title,
  subMessage,
  PINmodalVisible,
  PINButtonGroup,
  onPress,
  PINsetModalVisible,
  pin,
  setPin,
}) => {
  const {t, i18n} = useTranslation();
  const [enableMask, setEnableMask] = useState(true);
  const ref = useBlurOnFulfill({pin, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: pin,
    setValue: setPin,
  });
  const toggleMask = () => setEnableMask((f) => !f);

  const renderCell = ({index, symbol, isFocused}) => {
    let textChild = null;

    if (symbol) {
      textChild = enableMask ? '•' : symbol;
    } else if (isFocused) {
      textChild = <Cursor />;
    }

    return (
      <Text
        key={index}
        style={[
          themes.GREEN_BOARDER,
          styles.textInputStyle,
          isFocused && styles.focusCell,
        ]}
        onLayout={getCellOnLayoutHandler(index)}>
        {textChild}
      </Text>
    );
  };

  return (
    <>
      <Modal animationType="slide" transparent={true} visible={PINmodalVisible}>
        {PINmodalVisible ? (
          <StatusBar backgroundColor={'#70707090'} barStyle="light-content" />
        ) : null}
        <View style={styles.blur}>
          <View style={styles.popUpContainer}>
            <View style={styles.titleWrap}>
              <View style={styles.width} />
              {/* <Text style={styles.text}>{title}</Text> */}
              <TouchableOpacity
                onPress={() => {
                  PINsetModalVisible(!PINmodalVisible);
                  setPin('');
                }}
                style={styles.width}>
                <Feather name="x-circle" size={30} style={styles.closeButton} />
              </TouchableOpacity>
            </View>
            <Text style={styles.text}>{title}</Text>
            <CodeField
              ref={ref}
              {...props}
              value={pin}
              onChangeText={setPin}
              cellCount={CELL_COUNT}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={renderCell}
            />
            <Text
              style={[themes.EDIT_GREEN_TEXT, styles.subText]}
              onPress={toggleMask}>
              {enableMask ? t('show_pin') : t('hide_pin')}
            </Text>
            {PINButtonGroup && <PINButtonGroup />}
          </View>
        </View>
      </Modal>
    </>
  );
};

export const PINMiddleButton = ({onPress, buttonText, entered}) => {
  return (
    <>
      {entered ? (
        <TouchableOpacity onPress={onPress}>
          <Text style={[themes.GREEN_BUTTON, styles.button]}>{buttonText}</Text>
        </TouchableOpacity>
      ) : (
        <Text style={[themes.GREY_BUTTON, styles.button]}>{buttonText}</Text>
      )}
      {/* <TouchableOpacity style={styles.middleButton} onPress={onPress}>
        <Text style={styles.middleButtonText}>{buttonText}</Text>
      </TouchableOpacity> */}
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
    top: Platform.OS === 'ios' ? height * 0.33 : height * 0.3,
    left: width * 0.02,
    right: width * 0.02,
  },
  titleWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
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
    marginBottom: height * 0.02,
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
    fontSize: RFValue(15),
    marginVertical: height * 0.015,
    textAlign: 'center',
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
  textInputStyle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: Platform.OS === 'ios' ? RFValue(15) : RFValue(20),
    textAlign: 'center',
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: width * 0.01,
    paddingVertical: height * 0.01,
    width: Platform.OS === 'ios' ? width * 0.11 : width * 0.12,
    height: Platform.OS === 'ios' ? width * 0.11 : width * 0.12,
    marginVertical: height * 0.01,
  },
  PINwrap: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: Platform.OS === 'ios' ? height * 0.015 : height * 0.018,
  },
  button: {
    width: width * 0.7,
    height: width * 0.13,
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: width * 0.02,
    overflow: 'hidden',
    borderRadius: 25,
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
});

export default EnterPIN;
