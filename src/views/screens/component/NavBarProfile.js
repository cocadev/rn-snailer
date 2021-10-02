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

import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// QR CODE icon
import ScanQRCode from '../../../assets/icons/scanqrcode.png';
import Download from '../../../assets/icons/download_pdf.png';

import userIcon from '../../../assets/user-icon.png'

import ImageWithFallBack from '../component/ImageFallBack';
import {connect} from 'react-redux';
import {useTranslation} from 'react-i18next';

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

const NavbarProfile = ({
  children,
  user,
}) => {
  const {t, i18n} = useTranslation();
  return (
    <>
      <StatusBar backgroundColor={'transparent'} translucent={true} barStyle="light-content"/>
      <View style={styles.backgroundContainer}>
        <View style={[themes.GREEN_BACKGROUND, styles.linearGradientNavBar]}>
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{`${user.first_name} ${user.last_name}`}</Text>
              <TouchableOpacity>
                <View style={styles.infoWrap}>
                  <Text style={styles.subTitle}>{t('edit_profile')}</Text>
                  <Feather name="chevron-right" size={17} style={[styles.right, themes.TEXT_TITLE_GREY]}/>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
              <TouchableOpacity>
                <ImageWithFallBack type="user" style={styles.userImage} source={user._id + '/' + user.image}/>
              </TouchableOpacity>
            </View>
          </View>
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
    width,
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
    fontSize: 15,
    marginTop: 10,
  },
  infoWrap: {
    width: 120,
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
  right: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});

export default connect(mapStateToProps)(NavbarProfile);




{/* <TouchableOpacity>
  <View style={styles.infoWrap}>
    <Text style={[styles.changeText, themes.TEXT_TITLE_GREY]}>
      {t('edit_profile')}
    </Text>
  </View>
  <Feather
    name="chevron-right"
    size={25}
    style={[styles.right, themes.TEXT_TITLE_GREY]}
  />
</TouchableOpacity> */}



// subTitle: {
//   color: 'white',
//   alignSelf: 'center',
//   textAlign: 'center',
//   alignItems: 'center',
//   marginLeft: -410,
//   marginTop: 10,
//   fontSize: 12,
// },
// pageTitle: {
//   color: 'white',
//   alignSelf: 'center',
//   textAlign: 'center',
//   fontSize: Platform.OS === 'ios' ? RFValue(18) : RFValue(20),
//   fontWeight: 'bold',
//   alignItems: 'center',
//   ...Platform.select({
//     android: {
//       flex: 1,
//     },
//   }),
// },
// pageSubTitle: {
//   color: 'white',
//   alignSelf: 'center',
//   textAlign: 'center',
//   fontSize: RFValue(15),
//   fontWeight: 'bold',
// },
// backButton: {
//   width: height * 0.05,
//   justifyContent: 'center',
//   alignItems: 'center',
//   paddingLeft: width * 0.03,
// },
// plusButton: {
//   width: height * 0.05,
//   justifyContent: 'center',
//   alignItems: 'center',
//   marginRight: width * 0.02,
// },
// progressBar: {
//   height: height * 0.005,
//   backgroundColor: 'white',
//   alignSelf: 'flex-start',
//   position: 'absolute',
//   bottom: 0,
// },
// menubar: {
//   flexDirection: 'row',
//   alignSelf: 'center',
//   marginTop: height * 0.005,
//   justifyContent: 'space-between',
// },
// iconWrap: {
//   marginVertical: height * 0.025,
//   marginHorizontal: width * 0.025,
//   alignItems: 'center',
//   borderRadius: 20,
//   // backgroundColor: '#468c64'
// },
// textWrap: {
//   textAlign: 'center',
//   fontWeight: 'bold',
//   marginTop: height * 0.006,
//   width: width * 0.25,
// },
// imageStyle: {
//   width: 62,
//   height: 62,
// },

// image: {
//   width: 150,
//   height: 150,
//   borderRadius: 100,
//   resizeMode: 'cover',
//   alignSelf: 'center',
//   marginVertical: width * 0.03,
//   borderColor: 'white',
//   shadowColor: '#000',
//   shadowOffset: {
//     width: 0,
//     height: 12,
//   },
//   shadowOpacity: 0.58,
//   shadowRadius: 16.0,
// },
// infoWrap: {
//   flexDirection: 'row',
//   alignSelf: 'center',
//   justifyContent: 'center',
// },
// text: {
//   fontWeight: 'bold',
//   fontSize: RFValue(15),
//   textAlign: 'center',
//   marginVertical: width * 0.02,
// },
// changeText: {
//   fontWeight: 'bold',
//   fontSize: RFValue(13),
//   textAlign: 'center',
//   marginBottom: width * 0.01,
// },
// right: {
//   position: 'absolute',
//   right: 0,
//   bottom: 0,
// },
// sectionWrapper: {
//   alignSelf: 'center',
//   width: width * 0.95,
//   overflow: 'hidden',
//   shadowColor: '#000',
//   shadowOffset: {width: 0, height: height * 0.005},
//   shadowOpacity: 0,
//   shadowRadius: 2,
//   elevation: 10,
//   backgroundColor: 'white',
//   borderRadius: 20,
//   marginBottom: height * 0.02,
//   paddingVertical: height * 0.03,
// },
// category: {
//   fontSize: RFValue(15),
//   marginLeft: width * 0.05,
//   marginBottom: height * 0.01,
//   textTransform: 'uppercase',
// },
// itemWrapper: {
//   width: width * 0.9,
//   height: height * 0.06,
//   flexDirection: 'row',
//   alignItems: 'center',
// },
// iconWrapper: {
//   width: width * 0.15,
//   height: height * 0.07,
//   justifyContent: 'center',
//   alignItems: 'center',
// },
// arrowWrapper: {
//   width: width * 0.05,
//   justifyContent: 'center',
//   alignItems: 'center',
// },
// icon: {
//   width: width * 0.055,
//   resizeMode: 'contain',
//   tintColor: '#468c64',
// },
// itemContainer: {
//   height: height * 0.06,
//   width: width * 0.75,
//   alignSelf: 'center',
//   alignItems: 'center',
//   borderBottomWidth: 0.5,
//   flexDirection: 'row',
//   borderColor: '#CFCFCF',
//   justifyContent: 'space-between',
// },
// item: {
//   fontSize: RFValue(14),
//   color: '#4F4F4F',
// },
// loginID: {
//   color: '#828282',
//   fontSize: RFValue(14),
// },