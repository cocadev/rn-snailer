import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
  Text,
} from 'react-native';
import {connect} from 'react-redux';
import {RFPercentage, RFValue} from 'styles/ResponsiveFont';
import {themes} from 'utils/themeProvider';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {useTranslation} from 'react-i18next';

import NavBar, {LeftButton} from '../../component/NavBar';

import {createPin} from '../../../../services/pin';
import {updatePinRedux} from '../../../../states/redux/ActionCreators/auth';

const CELL_COUNT = 6;

const ConfirmPIN = ({navigation, route, mobile, _updatePin}) => {
  const {t, i18n} = useTranslation();
  const [enableMask, setEnableMask] = useState(true);
  const [enableMaskConfirm, setEnableMaskConfirm] = useState(true);
  const [newPIN, setNewPIN] = useState('');
  const [confirmPIN, setConfirmPIN] = useState('');
  const [PIN, setPIN] = useState(route.params?.pin);
  const change = route.params?.change ? true : false;
  const reset = route.params?.reset ? true : false;

  const handleLeftNavButton = () => {
    navigation.goBack();
  };


  const handleCreatePIN = async () => {
    if (PIN !== confirmPIN) {
      alert(t('incorrect_confirmation_pin'));
    } else {
      try {
        const success = await createPin({
          pin: PIN,
          confirm_pin: confirmPIN,
          t,
        });

        if (success) {
          _updatePin();
          navigation.navigate('PINSuccess');
        }
      } catch (err) {
        console.log('ConfirmPIN -> handleCreatePIN err', err);
      }
    }
  };

  const handleChangePIN = async () => {
    if (newPIN !== confirmPIN) {
      alert(t('incorrect_confirmation_pin'));
    } else {
      navigation.navigate('OtpScreen', {
        change: true,
        pin: {
          old_pin: PIN,
          new_pin: newPIN,
          confirm_pin: confirmPIN,
        },
      });
    }
  };

  const handleResetPIN = async () => {
    if (newPIN !== confirmPIN) {
      alert(t('incorrect_confirmation_pin'));
    } else {
      navigation.navigate('OtpScreen', {
        reset: true,
        pin: newPIN,
      });
    }
  };

  const ref = useBlurOnFulfill({value: newPIN, cellCount: CELL_COUNT});
  const refConfirm = useBlurOnFulfill({
    value: confirmPIN,
    cellCount: CELL_COUNT,
  });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: newPIN,
    setValue: setNewPIN,
  });

  const [propsConfirm, getCellOnLayoutHandlerConfirm] = useClearByFocusCell({
    value: confirmPIN,
    setValue: setConfirmPIN,
  });

  const toggleMask = () => setEnableMask((f) => !f);
  const toggleMaskConfirm = () => setEnableMaskConfirm((f) => !f);

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

  const renderCellConfirm = ({index, symbol, isFocused}) => {
    let textChild = null;

    if (symbol) {
      textChild = enableMaskConfirm ? '•' : symbol;
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
        onLayout={getCellOnLayoutHandlerConfirm(index)}>
        {textChild}
      </Text>
    );
  };

  return (
    <NavBar
      title={
        change ? t('change_pin') : reset ? t('reset_pin') : t('set_up_a_pin')
      }
      {...{LeftButton, handleLeftNavButton}}>
      <View style={styles.container}>
        {(change || reset) && (
          <>
            <Text style={styles.text}>{t('enter_new_pin')}</Text>
            <View style={[styles.PINWrap, {marginBottom: height * 0.05}]}>
              <CodeField
                ref={ref}
                {...props}
                value={newPIN}
                onChangeText={setNewPIN}
                cellCount={CELL_COUNT}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={renderCell}
              />

              <Text
                style={[themes.EDIT_GREEN_TEXT, styles.subText]}
                onPress={toggleMask}>
                {reset
                  ? enableMask
                    ? t('show_otp')
                    : t('hide_otp')
                  : enableMask
                  ? t('show_pin')
                  : t('hide_pin')}
              </Text>
            </View>
          </>
        )}

        <Text style={styles.text}>{t('confirm_your_pin')}</Text>
        <View style={styles.PINWrap}>
          <CodeField
            ref={refConfirm}
            {...propsConfirm}
            value={confirmPIN}
            onChangeText={setConfirmPIN}
            cellCount={CELL_COUNT}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={renderCellConfirm}
          />

          <Text
            style={[themes.EDIT_GREEN_TEXT, styles.subText]}
            onPress={toggleMaskConfirm}>
            {enableMaskConfirm ? t('show_pin') : t('hide_pin')}
          </Text>
        </View>

        <TouchableOpacity
          onPress={
            change ? handleChangePIN : reset ? handleResetPIN : handleCreatePIN
          }>
          {change || reset ? (
            newPIN.length === 6 && confirmPIN.length === 6 ? (
              <Text style={[themes.GREEN_BUTTON, styles.button]}>
                {t('next')}
              </Text>
            ) : (
              <Text style={[themes.GREY_BUTTON, styles.button]}>
                {t('next')}
              </Text>
            )
          ) : confirmPIN.length === 6 ? (
            <Text style={[themes.GREEN_BUTTON, styles.button]}>
              {t('next')}
            </Text>
          ) : (
            <Text style={[themes.GREY_BUTTON, styles.button]}>{t('next')}</Text>
          )}
        </TouchableOpacity>
      </View>
    </NavBar>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginTop: height * 0.04,
  },
  text: {
    fontWeight: 'bold',
    fontSize: RFValue(20),
    textAlign: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    paddingBottom: height * 0.01,
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
  subText: {
    fontWeight: 'bold',
    fontSize: RFValue(15),
    marginTop: height * 0.03,
    textAlign: 'center',
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
  },
  PINWrap: {
    marginHorizontal: width * 0.1,
    marginVertical: height * 0.02,
    justifyContent: 'space-between',
  },
});

const mapStateToProps = (state) => {
  return {
    mobile: state.auth.user.mobile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    _updatePin: () => dispatch(updatePinRedux()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmPIN);
