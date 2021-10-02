import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  Modal,
  TextInput,
  Text,
  Switch,
} from 'react-native';
import {RFPercentage, RFValue} from 'styles/ResponsiveFont';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';

import CardImage from '../../../assets/images/paymentVisa.png';
import MessageModal, {LeftRightButton} from '../component/popup/DeleteConfirmationModal'

import NavBar, {LeftButton} from '../component/NavBar';

const CardDetail = ({navigation}) => {
  const handleLeftNavButton = () => {
    navigation.goBack();
  };
  const {t, i18n} = useTranslation();

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const [modalVisible, setModalVisible] = useState(false);

  const navigateToDeleteConfirmationScreen = () => {
    setModalVisible((prev) => !prev);
  };
  const modalMessage = t('delete_message');
  const modalSubMessage = t('delete_confirmation_message');
  const ButtonGroup = () => {
    const left = {
      text: t('no'),
      onPress: navigateToDeleteConfirmationScreen
    };
    const right = {
      text: t('yes'),
      onPress: handleLeftNavButton

    };
    return LeftRightButton({left, right});
  };

  return (
    <>
    <NavBar title={t('detail')} {...{LeftButton, handleLeftNavButton}}>
      <View style={styles.container}>
        <View style={[styles.cardWrap, themes.BACKGROUND_WHITE_WRAP]}>
          <View style={styles.rowWrap}>
            <Image source={CardImage} style={styles.imageSize} />
            {isEnabled ? (
              <View style={[themes.GREEN_BOARDER, styles.column2]}>
                <Text style={themes.EDIT_GREEN_TEXT}>{t('primary')}</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.cardNumWrap}>
            <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.cardNum]}>
              **** **** **** 4444
            </Text>
          </View>
          <View style={styles.cardDetailWrap}>
            <Text style={[themes.TEXT_TITLE_GREY]}>{t('expiry_date')}</Text>
            <Text style={[themes.TEXT_TITLE_GREY, styles.cardDetailText]}>
              11-2022
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.primaryRowWrap}>
        <Text style={themes.NORMAL_TEXT_BLACK_BOLD}>{t('set_as_primary')}</Text>
        <Switch
          trackColor={{false: '#D11A2A', true: '#468c64'}}
          thumbColor="#FFF"
          ios_backgroundColor="#BB1E10"
          onValueChange={toggleSwitch}
          value={isEnabled}
          style={{transform: [{scaleX: 0.75}, {scaleY: 0.75}]}}
        />
      </View>

      <View style={styles.buttonWrap}>
      <Text style={[themes.TEXT_TITLE_GREY, styles.alertText]}>
          {t('set_card_primary_alert')}
        </Text>
        <TouchableOpacity onPress={navigateToDeleteConfirmationScreen}>
          <Text style={[themes.RED_BUTTON, styles.button]}>{t('delete')}</Text>
        </TouchableOpacity>
      </View>
    </NavBar>
    <MessageModal
    {...{
      message: modalMessage,
      subMessage: modalSubMessage,
      navigation,
      modalVisible,
      setModalVisible,
      ButtonGroup,
    }}
  />
  </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  buttonWrap: {
    flex: 1,
    justifyContent: 'flex-end',
    marginVertical: height * 0.03,
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
  cardWrap: {
    borderRadius: 20,
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
  },
  imageSize: {
    width: width * 0.2,
    height: height * 0.08,
  },
  rowWrap: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column2: {
    borderRadius: 20,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.005,
    position: 'absolute',
    right: width * 0.05,
    top: height * 0.03,
    borderWidth: 1,
  },
  cardNumWrap: {
    marginHorizontal: width * 0.08,
    marginVertical: height * 0.01,
  },
  cardNum: {
    fontSize: RFValue(20),
  },
  cardDetailWrap: {
    marginVertical: height * 0.03,
    marginHorizontal: width * 0.08,
  },
  cardDetailText: {
    paddingTop: height * 0.008,
  },
  primaryRowWrap: {
    flexDirection: 'row',
    marginVertical: height * 0.02,
    marginHorizontal: width * 0.08,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alertText: {
    marginHorizontal: width * 0.08,
  },
});

export default CardDetail;
