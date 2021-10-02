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
  TextInput,
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';
import {TabView} from 'react-native-tab-view';
import {useTranslation} from 'react-i18next';
import {themes} from 'utils/themeProvider';

import NavBar, {LeftButton} from '../../component/NavBar';
import Octicons from 'react-native-vector-icons/Octicons';
import {ScrollView} from 'react-native-gesture-handler';

const AddCard = ({navigation}) => {
  const {t, i18n} = useTranslation();

  const handleLeftNavButton = () => {
    navigation.goBack();
  };
  const navigateToPaymentScreen = () => {
    navigation.navigate('PaymentScreen');
  };

  const save = true;

  return (
    <NavBar title={t('add_card')} {...{LeftButton, handleLeftNavButton}}>
      <View style={styles.titleWrap}>
        <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
          {t('card_number')}
        </Text>
      </View>
      <View style={styles.cardDetailInputWrap}>
        <View style={styles.column1}>
          <Octicons
            name="credit-card"
            size={30}
            color="#B2B2B2"
            style={styles.icon}
          />
        </View>
        <View style={styles.column2}>
          <TextInput placeholder={t('card_number')} style={[styles.textInput]} />
        </View>
      </View>
      <View style={styles.cardPeriodDetailWrap}>
        <View style={styles.cardColumn1}>
          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>{t('valid_till')}</Text>
          <View style={[themes.GREY_BOARDER_BOTTOM, styles.smallInputWrap]}>
            <TextInput placeholder={t('MM/YY')} style={styles.cardtextInput} />
          </View>
        </View>
        <View style={styles.cardColumn2}>
          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>{t('cvv')}</Text>
          <View style={[themes.GREY_BOARDER_BOTTOM, styles.smallInputWrap]}>
            <TextInput placeholder={t('cvv')} style={styles.cardtextInput} />
          </View>
        </View>
      </View>
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <Text style={[themes.TEXT_TITLE_GREY, styles.linkCardAlert]}>
          {t('link_card_alert')}
        </Text>
        <Text style={[themes.TEXT_TITLE_GREY, styles.linkCardAlert]}>
          {t('link_card_alert2')}
          <Text style={[themes.EDIT_GREEN_TEXT, styles.linkCardAlert]}>
            {' '}
            {t('terms&conditions')}
          </Text>
        </Text>

        {save ? (
          <TouchableOpacity onPress={navigateToPaymentScreen}>
            <Text style={[themes.GREEN_BUTTON, styles.button]}>
              {t('save')}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            <Text style={[themes.GREY_BUTTON, styles.button]}>{t('save')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </NavBar>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  titleWrap: {
    marginHorizontal: width * 0.055,
    marginVertical: height * 0.022,
  },
  cardDetailInputWrap: {
    marginHorizontal: width * 0.06,
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  cardPeriodDetailWrap: {
    marginVertical: height * 0.05,
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  column1: {
    width: width * 0.2,
    alignItems: 'center',
    alignSelf: 'center',
  },
  column2: {
    width: width * 0.7,
    alignItems: 'center',
  },
  cardColumn1: {
    width: width * 0.41,
    flexDirection: 'column',
  },
  cardColumn2: {
    width: width * 0.41,
    flexDirection: 'column',
  },
  textInput: {
    fontSize: RFValue(14),
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    width: width * 0.6,
    color: '#707070',
  },
  cardtextInput: {
    fontSize: Platform.OS === 'ios' ? RFValue(13) : RFValue(12),
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },

  smallInputWrap: {
    borderBottomWidth: 1,
    marginTop: Platform.OS === 'ios' ? height * 0.01 : 0,
    paddingBottom: Platform.OS === 'ios' ? height * 0.005 : 0,
    marginRight: width * 0.05,
  },
  button: {
    width: width * 0.8,
    height: width * 0.13,
    alignSelf: 'center',
    textAlign: 'center',
    // marginTop: Platform.OS === 'ios' ? height * 0.245 : height * 0.1,
    marginBottom: height * 0.03,
    marginTop: width * 0.03,
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
  linkCardAlert: {
    marginHorizontal: width * 0.1,
    fontSize: RFValue(10),
  },
});

export default AddCard;
