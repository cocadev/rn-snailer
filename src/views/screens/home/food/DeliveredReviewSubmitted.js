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
  Animated,
} from 'react-native';

import {RFValue, getStatusBarHeight} from 'styles/ResponsiveFont';

import NavBar, {LeftButton} from '../../component/NavBar';

import AntDesign from 'react-native-vector-icons/AntDesign';
import rateRider from '../../../../assets/images/rateriderimage.png';

import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';

const DeliveredReviewSubmitted = ({navigation, route}) => {
  const viewOnly = route.params?.viewOnly ? true : false;
  const {t, i18n} = useTranslation();

  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const handleOkButton = () => {
    viewOnly
      ? navigation.navigate('ProductDetail')
      : navigation.popToTop();
  };

  const filled = true;

  return (
    <>
      <NavBar title={t('rating')} {...{LeftButton, handleLeftNavButton}}>
        <View style={styles.riderImageWrap}>
          <Image source={rateRider} style={styles.rateriderImage} />
        </View>
        <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.ratingText]}>
          {t('rating_submit_successfully')}
        </Text>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <TouchableOpacity onPress={handleOkButton}>
            <Text style={[themes.GREEN_BUTTON, styles.button]}>
              {t('okay')}
            </Text>
          </TouchableOpacity>
        </View>
      </NavBar>
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  riderImageWrap: {
    alignSelf: 'center',
    marginTop: height * 0.01,
  },
  rateriderImage: {
    width: width * 0.7,
    height: height * 0.35,
  },
  ratingText: {
    fontSize: RFValue(20),
    textAlign: 'center',
    marginHorizontal: width * 0.05,
    marginVertical: Platform.OS === 'ios' ? height * 0.01 : height * 0.02,
  },
  button: {
    width: width * 0.7,
    height: width * 0.13,
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: Platform.OS === 'ios' ? height * 0.04 : height * 0.035,
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

export default DeliveredReviewSubmitted;
