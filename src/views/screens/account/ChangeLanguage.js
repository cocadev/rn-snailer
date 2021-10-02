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
  ScrollView,
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';
import {useTranslation} from 'react-i18next';
import {themes} from 'utils/themeProvider';
import RNPickerSelect from 'react-native-picker-select';
import Feather from 'react-native-vector-icons/Feather';
import NavBar, {LeftButton} from '../component/NavBar';
import {connect} from 'react-redux';
import {changeLanguage} from 'states/redux/ActionCreators/setting';

const ChangeLanguage = ({navigation, language, changeLanguageRedux}) => {
  const {t, i18n} = useTranslation();
  const [status, setStatus] = useState('nochanges');
  const [selection, setSelection] = useState(
    language === 'en' ? 'English' : language === 'cn' ? 'Chinese' : 'Malay',
  );
  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const handleSetSelection = (value) => {
    setStatus('changed');
    setSelection(value);
  };

  const handelSaveButton = () => {
    //change language when user click save button
    switch (selection) {
      case 'English':
        changeLanguageRedux('en');
        i18n.changeLanguage('en');
        break;
      case 'Chinese':
        changeLanguageRedux('cn');
        i18n.changeLanguage('cn');
        break;
      case 'Malay':
        changeLanguageRedux('bm');
        i18n.changeLanguage('bm');
        break;
    }
    setStatus('saved');
  };

  const SaveButton = () => {
    let additionalStyle;
    let context;
    let onPress;
    switch (status) {
      case 'changed':
        additionalStyle = themes.BUTTON_GREEN;
        context = t('save_changes');
        onPress = handelSaveButton;
        break;
      case 'nochanges':
        additionalStyle = themes.BUTTON_GREY;
        context = t('save_changes');
        break;
      case 'saved':
        additionalStyle = themes.BUTTON_GREY;
        context = t('saved');
        break;
      default:
        break;
    }
    return (
      
      <TouchableOpacity
        onPress={onPress}
        disabled={onPress ? false : true}
        style={[
          styles.buttonreport,
          themes.SHADOW_DEFAULT,
          themes.BUTTON_GREEN,
        ]}>
        <Text style={styles.buttonreporttext}>{t('save_changes')}</Text>
      </TouchableOpacity>
    );
  };

  const Picker = () => {
    return (
      <View style={styles.container}>
        <View style={[styles.pickerInput, themes.SHADOW_DEFAULT]}>
          <RNPickerSelect
            placeholder={{}}
            items={[
              {label: t('english'), value: 'English'},
              {label: t('chinese'), value: 'Chinese'},
              {label: t('malay'), value: 'Malay'},
            ]}
            value={selection}
            onValueChange={(value) => handleSetSelection(value)}
            style={{
              inputIOS: {
                color: 'black',
                fontWeight: 'bold',
                paddingLeft: width * 0.02,
                fontSize: RFValue(14),
              },
              inputAndroid: {
                color: 'black',
                fontWeight: 'bold',
                marginLeft: width * 0.015,
                fontSize: RFValue(14),
              },
            }}
          />

          {Platform.OS === 'ios' &&
            (handleSetSelection ? (
              <>
                <Feather
                  name="chevron-down"
                  color="#707070"
                  size={25}
                  style={styles.iconstyle}
                />
              </>
            ) : (
              <Feather
                name="chevron-up"
                color="#707070"
                size={25}
                style={styles.iconstyle}
              />
            ))}
        </View>
      </View>
    );
  };

  return (
    <NavBar title={t('change_language')} {...{LeftButton, handleLeftNavButton}}>
      <Picker />
      <SaveButton status="nochanges" />
    </NavBar>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginHorizontal: width * 0.05,
    marginVertical: width * 0.05,
  },
  dataContainer: {
    marginBottom: width * 0.08,
  },
  sectionTitle: {
    marginBottom: width * 0.01,
    paddingLeft: width * 0.04,
    fontSize: RFValue(14),
  },
  nodataWrap: {
    alignItems: 'center',
    marginBottom: width * 0.2,
  },
  titleText: {
    marginBottom: width * 0.02,
    fontSize: RFValue(15),
  },
  text: {
    fontSize: RFValue(13),
  },
  pickerInput: {
    borderRadius: 10,
    height: height * 0.06,
    width: width * 0.9,
    fontSize: RFValue(14),
    fontWeight: 'bold',
    borderColor: '#468c64',
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: height * 0.01,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        paddingHorizontal: width * 0.02,
      },
    }),
  },
  textInput: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
  },
  iconstyle: {
    position: 'absolute',
    right: 20,
  },
  buttonreport: {
    position: 'absolute',
    width: width * 0.7,
    bottom: height * 0.05,
    height: width * 0.12,
    alignSelf: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 15,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        alignItems: 'center',
        lineHeight: width * 0.12,
        marginVertical: width * 0.05,
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
  buttonreporttext: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: RFValue(14),
    alignSelf: 'center',
    textAlign: 'center',
  },
});

const mapStateToProps = (state) => {
  const {setting} = state;
  let language;
  switch (setting.lng) {
    case 'en':
      language = 'english';
      break;
    case 'cn':
      language = 'chinese';
      break;
    case 'bm':
      language = 'malay';
      break;
    default:
      break;
  }
  return {language: setting.lng};
};
const mapDispatchToProps = (dispatch) => ({
  changeLanguageRedux: (lng) => dispatch(changeLanguage(lng)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangeLanguage);
