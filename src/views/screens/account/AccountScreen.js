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

import Feather from 'react-native-vector-icons/Feather';

//icons
import savedplace from 'assets/icons/a-savedplace.png';
import favorites from 'assets/icons/a-favorites.png';
import language from 'assets/icons/a-language.png';
import signout from 'assets/icons/a-logout.png';
import giveusfeedback from 'assets/icons/a-giveusfeedback.png';
import help from 'assets/icons/a-help.png';
import privacypolicy from 'assets/icons/a-privacypolicy.png';
import termsofuse from 'assets/icons/a-termsandconditions.png';
import mapicon from 'assets/icons/mapicon.png';

import {signOut} from 'states/redux/ActionCreators/auth';
import {connect} from 'react-redux';
import ImageWithFallBack from '../component/ImageFallBack';
import {getVersion} from 'react-native-device-info';

import notificationIcon from '../../../assets/notification1.png';
import activityIcon from '../../../assets/activity1.png';
import walletIcon from '../../../assets/wallet1.png';

import userPic from '../../../assets/images/Fallback-user.jpg';
import redDot from '../../../assets/dot.png';

const defaultUserInfo = {
  userInfo: {
    user: {
      email: '',
      familyName: '',
      givenName: '',
      name: '',
      photo: null,
      id: '',
    },
  },
};
const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  signOut: (accessToken) => dispatch(signOut(accessToken)),
});

const AccountScreen = ({navigation, route, signOut, user}) => {
  const {t, i18n} = useTranslation();

  const handleLogOut = async () => {
    try {
      await signOut();
    } catch (e) {
      console.log('handleLogOut -> e', e);
    }
  };

  const navigateToSavedPlace = () => {
    navigation.navigate('ChoosePlace', {savedplace: true});
  };

  const navigateToChangeLanguage = () => {
    navigation.navigate('ChangeLanguage');
  };

  const navigateToActivity = () => {
    navigation.navigate('ActivityScreen');
  };

  const navigateToNotification = () => {
    navigation.navigate('NotificationScreen');
  };

  const navigateToWallet = () => {
    navigation.navigate('PaymentScreen');
  };

  return (
      <View style={styles.backgroundContainer}>
        <View style={[themes.GREEN_BACKGROUND, styles.linearGradientNavBar]}>
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{`HI, ${user.first_name} ${user.last_name}`}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                <View style={styles.infoWrap}>
                  <Text style={styles.subTitle}>{t('edit_profile')}</Text>
                  <Feather name="chevron-right" size={17} style={[styles.right, themes.TEXT_TITLE_GREY]}/>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('HomePage')}>
                {/* <ImageWithFallBack type="user" style={styles.userImage} source={user._id + '/' + user.image}/> */}
                <Image style={styles.userImage} source={userPic}/>
                <Image style={styles.redDot} source={redDot}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <ScrollView>
        <View style={styles.menubar}>
          <TouchableOpacity
            style={styles.iconWrap}
            onPress={navigateToActivity}>
            <Image source={activityIcon} style={styles.imageStyle} />
            <Text style={[styles.textWrap, themes.EDIT_BLACK_TEXT]}>
              {t('activity')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconWrap}
            onPress={navigateToNotification}>
            <Image source={notificationIcon} style={styles.imageStyle} />
            <Text style={[styles.textWrap, themes.EDIT_BLACK_TEXT]}>
              {t('notification')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconWrap}
            onPress={navigateToWallet}>
            <Image source={walletIcon} style={styles.imageStyle} />
            <Text style={[styles.textWrap, themes.EDIT_BLACK_TEXT]}>
              {t('Wallet')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sectionWrapper}>
          <Text style={[styles.category, themes.EDIT_GREEN_TEXT]}>
            {t('my_account')}
          </Text>
          <TouchableOpacity
            style={styles.itemWrapper}
            onPress={navigateToSavedPlace}>
            <View style={styles.iconWrapper}>
              <Image source={savedplace} style={styles.icon} />
            </View>
            <View style={styles.itemContainer}>
              <Text style={[styles.item, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('saved_place')}
              </Text>
              <View style={styles.arrowWrapper}>
                <Feather name="chevron-right" size={20} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemWrapper}
            onPress={navigateToChangeLanguage}>
            <View style={styles.iconWrapper}>
              <Image source={language} style={styles.icon} />
            </View>
            <View style={styles.itemContainer}>
              <Text style={[styles.item, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('my_language')}
              </Text>
              <View style={styles.arrowWrapper}>
                <Feather name="chevron-right" size={20} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        

        <View style={styles.sectionWrapper}>
          <Text style={[styles.category, themes.EDIT_GREEN_TEXT]}>
            {t('support')}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Help')}
            style={styles.itemWrapper}>
            <View style={styles.iconWrapper}>
              <Image source={help} style={styles.icon} />
            </View>
            <View style={styles.itemContainer}>
              <Text style={[styles.item, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('help')}
              </Text>
              <View style={styles.arrowWrapper}>
                <Feather name="chevron-right" size={20} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('PrivacyPolicy')}
            style={styles.itemWrapper}>
            <View style={styles.iconWrapper}>
              <Image source={privacypolicy} style={styles.icon} />
            </View>
            <View style={styles.itemContainer}>
              <Text style={[styles.item, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('privacy_policy')}
              </Text>
              <View style={styles.arrowWrapper}>
                <Feather name="chevron-right" size={20} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemWrapper}
            onPress={() => navigation.navigate('TermsOfUse')}>
            <View style={styles.iconWrapper}>
              <Image source={termsofuse} style={styles.icon} />
            </View>
            <View style={styles.itemContainer}>
              <Text style={[styles.item, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('terms_of_use')}
              </Text>
              <View style={styles.arrowWrapper}>
                <Feather name="chevron-right" size={20} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemWrapper}
            onPress={() => navigation.navigate('LocateUs')}>
            <View style={styles.iconWrapper}>
              <Image source={mapicon} style={styles.icon} />
            </View>
            <View style={styles.itemContainer}>
              <Text style={[styles.item, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('locate_us')}
              </Text>
              <View style={styles.arrowWrapper}>
                <Feather name="chevron-right" size={20} />
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.itemWrapper}>
            <View style={styles.iconWrapper}></View>
            <View style={styles.itemContainer}>
              <Text style={[styles.item, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {`${t('version')}: V${getVersion()}`}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.sectionWrapper}>
          <TouchableOpacity style={styles.itemWrapper} onPress={handleLogOut}>
            <View style={styles.iconWrapper}>
              <Image source={signout} style={styles.icon} />
            </View>
            <View style={styles.itemContainer}>
              <Text style={[styles.item, themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('sign_out')}
              </Text>
              <View style={styles.arrowWrapper}>
                <Feather name="chevron-right" size={20} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </View>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    height: null,
    backgroundColor: '#F5F5F5',
  },
  linearGradientNavBar: {
    width: width,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: height * 0.17,
    // SearchBar
    // height: height * 0.24,
    //paddingTop: statusBarHeight,
    textAlign: 'center',
    paddingTop: height * 0.04,
    borderRadius: 25,
  },
  titleRow: {
    width: width,
    flexDirection: 'row',
    flex: 1,
  },
  titleContainer: {
    marginTop: 10,
    marginLeft: 10,
    flex: 1,
  },
  title: {
    color: 'white',
    alignItems: 'flex-start',
    fontSize: 25,
  },
  infoWrap: {
    width: 120,
  },
  subTitle: {
    color: 'white',
    alignItems: 'flex-start',
    fontSize: 15,
    marginTop: 10,
  },
  right: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  userImage: {
    width: 75,
    height: 75,
    borderRadius: 100,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginVertical: width * 0.03,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
  },
  menubar: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: height * 0.005,
    justifyContent: 'space-between',
  },
  iconWrap: {
    marginVertical: height * 0.025,
    marginHorizontal: width * 0.025,
    alignItems: 'center',
    borderRadius: 20,
    // backgroundColor: '#468c64'
  },
  imageStyle: {
    width: 62,
    height: 62,
  },
  sectionWrapper: {
    alignSelf: 'center',
    width: width * 0.95,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: height * 0.005},
    shadowOpacity: 0,
    shadowRadius: 2,
    elevation: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: height * 0.02,
    paddingVertical: height * 0.03,
  },







  





  
  
  textWrap: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: height * 0.006,
    width: width * 0.25,
  },
  
  
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginVertical: width * 0.03,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
  },
  text: {
    fontWeight: 'bold',
    fontSize: RFValue(15),
    textAlign: 'center',
    marginVertical: width * 0.02,
  },
  changeText: {
    fontWeight: 'bold',
    fontSize: RFValue(13),
    textAlign: 'center',
    marginBottom: width * 0.01,
  },
  
  
  category: {
    fontSize: RFValue(15),
    marginLeft: width * 0.05,
    marginBottom: height * 0.01,
    textTransform: 'uppercase',
  },
  itemWrapper: {
    width: width * 0.9,
    height: height * 0.06,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: width * 0.15,
    height: height * 0.07,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowWrapper: {
    width: width * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: width * 0.055,
    resizeMode: 'contain',
    tintColor: '#468c64',
  },
  itemContainer: {
    height: height * 0.06,
    width: width * 0.75,
    alignSelf: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    borderColor: '#CFCFCF',
    justifyContent: 'space-between',
  },
  item: {
    fontSize: RFValue(14),
    color: '#4F4F4F',
  },
  loginID: {
    color: '#828282',
    fontSize: RFValue(14),
  },
  
  
  titleRow: {
    width: width,
    flexDirection: 'row',
    flex: 1,
  },
  
  imageContainer:{
    marginBottom: 15,
    marginRight: 15,
  },
  redDot: {
    position: 'absolute',
    top: 10,
    right: 0,
    width: 20,
    height: 20,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountScreen);
