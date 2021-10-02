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
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';

import {TabView} from 'react-native-tab-view';
import Animated from 'react-native-reanimated';

import {ScrollView} from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import addcard from '../../../assets/icons/addcard.png';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';
import {getWalletBalance} from '../../../services/payment';
import {formatCurrency} from '../../../utils/helper';

import ImageWithFallBack from '../component/ImageFallBack';
import {connect} from 'react-redux';

import HomeInfo from './HomeInfo';

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

const Home = ({navigation, user, children}) => {
  const {t, i18n} = useTranslation();
  const [index, setIndex] = React.useState(0);
  const [balance, setBalance] = useState(0);
  const [routes] = React.useState([
    {key: 'first', title: t('payment_method')},
    {key: 'second', title: t('balance')},
  ]);

  const handleGetWalletBalance = async () => {
    const response = await getWalletBalance();
    if (response) setBalance(response.wallet_balance);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      handleGetWalletBalance();
    });

    return unsubscribe;
  }, []);

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'first':
        return <HomeInfo {...{navigation}} />;
      case 'second':
        null;
    }
  };

  const renderTabBar = (props) => {
    //return <TabBar {...props} />;
  };
  
  return (
    <View style={styles.backgroundContainer}>
      <View style={[themes.GREEN_BACKGROUND, styles.linearGradientNavBar]}>
        <View style={styles.titleRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{`HI, ${user.first_name} ${user.last_name}`}</Text>
            <Text style={styles.subTitle}>{t('welcome_to_snailer')}</Text>
          </View>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('AccountScreen')}>
              {/* <ImageWithFallBack type="user" style={styles.userImage} source={user._id + '/' + user.image}/> */}
              <Image style={styles.userImage} source={userPic}/>
              <Image style={styles.redDot} source={redDot}/>
            </TouchableOpacity>
          </View>
        </View>
        {/* <View style={styles.searchBarContainer}>
          <Searchbar style={styles.searchBar} placeholder="Search"/>
        </View> */}
      </View>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        swipeEnabled={false}
        lazy={true}
      />
    </View>
  );
};

const {height, width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
  },
  tabItem: {
    height: Platform.OS === 'ios' ? height * 0.07 : height * 0.085,
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: '#B2B2B2',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0,
    shadowRadius: 2,
    elevation: 5,
    borderLeftWidth: 0.3,
  },
  selectedTabItem: {
    height: Platform.OS === 'ios' ? height * 0.07 : height * 0.085,
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: '#B2B2B2',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0,
    shadowRadius: 2,
    elevation: 5,
    borderLeftWidth: 0.3,
  },
  selectedTabTitle: {
    color: '#468c64',
    fontSize: RFValue(13),
    fontWeight: 'bold',
    // width: width * 0.3,
  },
  tabTitle: {
    color: '#4f4f4f',
    fontSize: RFValue(14),
    fontWeight: 'bold',
    opacity: 0.5,
  },
  textWrapper: {
    width: width / 2,
    height: height * 0.04,
    // borderLeftWidth: 0.3,
    // borderRightWidth: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#cfcfcf',
    flexDirection: 'row',
  },
  image: {
    marginRight: width * 0.02,
  },
  tabWrap: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  selectedTabTitleBalance: {
    color: '#B2B2B2',
    fontSize: RFValue(13),
    fontWeight: 'bold',
  },
  selectedTabTitleBalance: {
    color: '#B2B2B2',
    fontSize: RFValue(14),
    fontWeight: 'bold',
  },
  menubar: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: height * 0.007,
  },
  iconWrap: {
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.01,
    alignItems: 'center',
  },
  textWrap: {
    textAlign: 'center',
    fontWeight: 'bold',
    width: width * 0.15,
    marginTop: height * 0.006,
  },
  imageStyle: {
    width: 50,
    height: 50,
  },
  right: {
    paddingLeft: width * 0.01,
    color: '#B2B2B2',
  },
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
    height: height * 0.16,
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
  imageContainer2:{
    marginBottom: 15,
    marginRight: 15,
    borderWidth: 1,
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
  redDot: {
    position: 'absolute',
    top: 10,
    right: 0,
    width: 20,
    height: 20,
  },
});

export default connect(mapStateToProps)(Home);
