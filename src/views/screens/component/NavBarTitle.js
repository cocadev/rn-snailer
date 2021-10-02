import React from 'react';
import {
  View,
  Image,
  StatusBar,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {themes} from 'utils/themeProvider';
import {CustomFont as Text} from 'styles/CustomFont';
import {RFValue, getStatusBarHeight} from 'styles/ResponsiveFont';
//import { SearchBar } from 'react-native-elements';

import AccountScreen from '../account/AccountScreen';
import HomeScreen from '../../navigations/home'
import {useTranslation} from 'react-i18next';

import ImageWithFallBack from '../component/ImageFallBack';
import {connect} from 'react-redux';
import { useNavigation } from '@react-navigation/native'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


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

const NavbarTitle = ({children, navigation, user}) => {

  const navigateToProfile = () => {
    navigation.navigate(AccountScreen);
  };

  const navigateToTopUp = () => {
    navigation.navigate('TopUpAmount');
  };

  const {t, i18n} = useTranslation();
  const Stack = createStackNavigator();

  return (
    <>
      <StatusBar backgroundColor={'transparent'} translucent={true} barStyle="light-content" />
      <View style={styles.backgroundContainer}>
        <View style={[themes.GREEN_BACKGROUND, styles.linearGradientNavBar]}>
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{`HI, ${user.first_name} ${user.last_name}`}</Text>
              <Text style={styles.subTitle}>{t('welcome_to_snailer')}</Text>
            </View>
            <View style={styles.imageContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('AccountScreen')}>
                <ImageWithFallBack type="user" style={styles.userImage} source={user._id + '/' + user.image}/>
              </TouchableOpacity>
            </View>
          </View>
          {/* <View style={styles.searchBarContainer}>
            <Searchbar style={styles.searchBar} placeholder="Search"/>
          </View> */}
        </View>
        {children}
      </View>
    </>
  );
};

const {height, width} = Dimensions.get('screen');
const statusBarHeight = getStatusBarHeight();

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
    height: height * 0.18,
    // SearchBar
    // height: height * 0.24,
    paddingTop: statusBarHeight,
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
  subTitle: {
    color: 'white',
    alignItems: 'flex-start',
    fontSize: 15,
    marginTop: 10,
  },
  imageContainer:{
    marginBottom: 15,
    marginRight: 15,
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
  searchBarContainer: {
    flex: 0.65,
  },
  searchBar: {
    width: width - 20,
    borderRadius: 25,
  },
});

export default connect(mapStateToProps)(NavbarTitle);