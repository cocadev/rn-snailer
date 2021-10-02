import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
  Text,
} from 'react-native';
import {RFValue} from 'styles/ResponsiveFont';
import {themes} from 'utils/themeProvider';
import {CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell} from 'react-native-confirmation-code-field';
import {useTranslation} from 'react-i18next';

import NavBar, {LeftButton} from '../../component/NavBar';

import {verifyPin} from '../../../../services/pin';

const CELL_COUNT = 6;

const CreatePIN = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const [enableMask, setEnableMask] = useState(true);
  const [value, setValue] = useState('');
  const change = route.params?.change ? true : false;

  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const handleVerifyPIN = async () => {
    try {
      const success = await verifyPin({pin: value, t});

      if (success) {
        navigation.navigate('ConfirmPIN', {
          pin: value,
          change,
        });
      } else {
        alert(t('incorrect_pin'));
      }
    } catch (err) {
      console.log('CreatePIN -> handleVerifyPIN err', err);
    }
  };

  const handleForgotPIN = async () => {
    navigation.navigate('ConfirmPIN', {
      reset: true,
    });
  };

  const handleNextButton = async () => {
    if (change) {
      handleVerifyPIN();
    } else {
      navigation.navigate('ConfirmPIN', {
        pin: value,
        change,
      });
    }
  };

  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const toggleMask = () => setEnableMask((f) => !f);

  const renderCell = ({index, symbol, isFocused}) => {
    let textChild = null;

    if (symbol) {
      textChild = enableMask ? '•' : symbol;
    } else if (isFocused) {
      textChild = <Cursor />;
      123456;
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
    <NavBar
      title={change ? t('change_pin') : t('set_up_a_pin')}
      {...{LeftButton, handleLeftNavButton}}>
      <View style={styles.container}>
        <Text style={styles.text}>
          {change ? t('enter_current_pin') : t('enter_your_pin')}
        </Text>
        <View style={styles.PINWrap}>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={renderCell}
          />

          {change && (
            <TouchableOpacity onPress={handleForgotPIN}>
              <Text
                style={[
                  {
                    fontSize: RFValue(14),
                    textAlign: 'right',
                    marginTop: height * 0.02,
                    color: '#707070',
                  },
                ]}>
                {t('forgot_pin')}
              </Text>
            </TouchableOpacity>
          )}

          <Text
            style={[themes.EDIT_GREEN_TEXT, styles.subText]}
            onPress={toggleMask}>
            {enableMask ? t('show_pin') : t('hide_pin')}
          </Text>
        </View>
        {value.length === 6 ? (
          <TouchableOpacity onPress={handleNextButton}>
            <Text style={[themes.GREEN_BUTTON, styles.button]}>
              {t('next')}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={[themes.GREY_BUTTON, styles.button]}>{t('next')}</Text>
        )}
      </View>
    </NavBar>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginTop: height * 0.1,
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

export default CreatePIN;
