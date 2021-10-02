import React, {useContext} from 'react';
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
import NavBar, {LeftButton} from '../../component/NavBar';
import ParcelBox from '../../../../assets/images/delivery-box.png';
import {ParcelOrderContext} from 'states/context/parcelOrder.context';

const CalculateWeight = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const {parcelOrder, dispatchParcelOrder} = useContext(ParcelOrderContext);
  var dimensionState = {
    length: '0',
    width: '0',
    height: '0',
  };

  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const handleCalculateWeight = () => {
    dispatchParcelOrder({
      type: 'SET_DIMENSION',
      payload: {
        weight: (((dimensionState.length *
          dimensionState.width *
          dimensionState.height) /
          5000) *
          1000),
        length: dimensionState.length * 10,
        width: dimensionState.width * 10,
        height: dimensionState.height * 10,
      },
    });
    navigation.navigate('ParcelDelivery', {weight: true});
  };

  const setDimension = (type, value) => {
    switch (type) {
      case t('length'):
        return (dimensionState.length = value);
      case t('width'):
        return (dimensionState.width = value);
      case t('height'):
        return (dimensionState.height = value);
      default:
        return dimensionState;
    }
  };

  const Calculate = ({measurement, unit, value}) => {
    return (
      <View
        style={[
          themes.BACKGROUND_WHITE_WRAP,
          themes.SHADOW_DEFAULT,
          styles.calculateContainer,
        ]}>
        <View style={[themes.GREEN_BACKGROUND, styles.measurementBox]}>
          <Text style={[themes.EDIT_WHITE_TEXT, styles.measurementText]}>
            {measurement}
          </Text>
        </View>
        <TextInput
          placeholderTextColor="#C0C0C0"
          keyboardType={'numeric'}
          onChangeText={(text) => {
            setDimension(measurement, parseFloat(text));
          }}
          defaultValue={value == '0' ? null : value}
          placeholder={t('0.0')}
          style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.inputBox]}
        />
        <Text style={[themes.EDIT_GREEN_TEXT, styles.unitBox]}>{unit}</Text>
      </View>
    );
  };

  return (
    <>
      <NavBar
        title={t('weight')}
        {...{
          LeftButton,
          handleLeftNavButton,
        }}>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <ScrollView>
            <View style={styles.parcelView}>
              <View>
                <Image source={ParcelBox} />
                <Text style={[themes.EDIT_GREEN_TEXT, styles.length]}>
                  {t('L')}
                </Text>
                <Text style={[themes.EDIT_GREEN_TEXT, styles.width]}>
                  {t('W')}
                </Text>
                <Text style={[themes.EDIT_GREEN_TEXT, styles.height]}>
                  {t('H')}
                </Text>
              </View>
              <View style={styles.textGroup}>
                <Text style={[themes.EDIT_GREEN_TEXT, styles.parcelText]}>
                  {t('L')}: {t('length')}
                </Text>
                <Text style={[themes.EDIT_GREEN_TEXT, styles.parcelText]}>
                  {t('W')}: {t('width')}
                </Text>
                <Text style={[themes.EDIT_GREEN_TEXT, styles.parcelText]}>
                  {t('H')}: {t('height')}
                </Text>
              </View>
            </View>
            <View
              style={[
                themes.BACKGROUND_WHITE_WRAP,
                themes.SHADOW_DEFAULT,
                styles.formulaContainer,
              ]}>
              <Text style={[themes.EDIT_GREEN_TEXT, styles.formulaText]}>
                {t('formula_title')}
              </Text>
              <View>
                <View style={[themes.GREEN_BOARDER_BOTTOM]}>
                  <Text style={[themes.EDIT_GREEN_TEXT, styles.formula]}>
                    {t('formula')}
                  </Text>
                </View>
                <View>
                  <Text style={[themes.EDIT_GREEN_TEXT, styles.formula]}>
                    {t('5000')}
                  </Text>
                </View>
              </View>
            </View>
            <Calculate
              measurement={t('length')}
              unit={t('cm')}
              value={dimensionState.length.toString()}
              autoFocusBool={false}
            />
            <Calculate
              measurement={t('width')}
              unit={t('cm')}
              value={dimensionState.width.toString()}
              autoFocusBool={false}
            />
            <Calculate
              measurement={t('height')}
              unit={t('cm')}
              value={dimensionState.height.toString()}
              autoFocusBool={false}
            />
            {/*<Calculate measurement={t('DIM Weight')} unit={t('kg')} value={state.dimWeight.toFixed(2).toString()} autoFocusBool={state.autoWeight} /> */}
            <View style={[themes.GREEN_BOARDER_BOTTOM, styles.border]} />
            <View
              style={[
                themes.BACKGROUND_WHITE_WRAP,
                themes.SHADOW_DEFAULT,
                styles.exampleContainer,
              ]}>
              <View
                style={{
                  marginVertical: width * 0.04,
                  marginHorizontal: width * 0.05,
                }}>
                <Text
                  style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.exampleText]}>
                  {t('fr_example')}
                </Text>
                <Text style={[themes.TEXT_TITLE_LIGHTGREY, styles.exampleText]}>
                  - {t('ex1')}
                </Text>
                <Text style={[themes.TEXT_TITLE_LIGHTGREY, styles.exampleText]}>
                  - {t('ex2')}
                </Text>
                <Text style={[themes.TEXT_TITLE_LIGHTGREY, styles.exampleText]}>
                  - {t('ex3')}
                </Text>
                <Text style={[themes.TEXT_TITLE_LIGHTGREY, styles.exampleText]}>
                  - {t('ex4')}
                </Text>
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity
            onPress={handleCalculateWeight}
            style={[themes.GREEN_BUTTON, styles.applyButton]}>
            <Text style={[themes.EDIT_WHITE_TEXT, styles.buttonText]}>
              {t('apply')}
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </NavBar>
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  parcelView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: width * 0.1,
  },
  length: {
    position: 'absolute',
  },
  width: {
    position: 'absolute',
    right: width * 0.325,
    bottom: width * 0.005,
  },
  height: {
    position: 'absolute',
    right: width * 0.425,
    bottom: width * 0.175,
  },
  textGroup: {
    marginLeft: width * 0.05,
    alignSelf: 'center',
  },
  parcelText: {
    marginVertical: width * 0.01,
  },
  formulaContainer: {
    flexDirection: 'row',
    borderRadius: 20,
    marginHorizontal: width * 0.05,
    marginVertical: width * 0.02,
    alignSelf: 'center',
    padding: width * 0.05,
  },
  formulaText: {
    marginVertical: width * 0.04,
    marginRight: width * 0.02,
  },
  formula: {
    alignSelf: 'center',
    marginVertical: width * 0.01,
  },
  calculateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 20,
    marginVertical: width * 0.02,
    ...Platform.select({
      ios: {
        marginHorizontal: width * 0.03,
      },
      android: {
        marginHorizontal: width * 0.05,
      },
    }),
  },
  measurementBox: {
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    paddingVertical: width * 0.05,
    width: width * 0.3,
  },
  measurementText: {
    textAlign: 'center',
  },
  inputBox: {
    width: width * 0.5,
    textAlign: 'center',
  },
  unitBox: {
    alignSelf: 'center',
    marginRight: width * 0.05,
  },
  border: {
    marginVertical: width * 0.02,
    ...Platform.select({
      ios: {
        marginHorizontal: width * 0.03,
      },
      android: {
        marginHorizontal: width * 0.05,
      },
    }),
  },
  exampleContainer: {
    borderRadius: 20,
    marginTop: width * 0.03,
    marginBottom: width * 0.4,
    ...Platform.select({
      ios: {
        marginHorizontal: width * 0.03,
      },
      android: {
        marginHorizontal: width * 0.05,
      },
    }),
  },
  exampleText: {
    marginVertical: width * 0.01,
  },
  applyButton: {
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
});

export default CalculateWeight;
