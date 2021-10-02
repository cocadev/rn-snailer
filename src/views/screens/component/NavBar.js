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

const Navbar = ({
  children,
  title,
  Title,
  subTitle,
  LeftButton,
  handleLeftNavButton,
  RightButton,
  handleRightNavButton,
  progress,
  button,
}) => {
  return (
    <>
      <StatusBar
        backgroundColor={'transparent'}
        translucent={true}
        barStyle="light-content"
      />

      <View style={styles.backgroundContainer}>
        {/* <LinearGradient
          colors={['#BBDB9C', '#468c64']}
          start={{x: 1, y: 0}}
          end={{x: 0, y: 0}}
          style={styles.linearGradientNavBar}> */}
        <View style={[themes.GREEN_BACKGROUND, styles.linearGradientNavBar]}>
          {LeftButton ? (
            <LeftButton handleLeftNavButton={handleLeftNavButton} />
          ) : (
            <View style={styles.backButton} />
          )}
          <View style={styles.titleContainer}>
            {title ? (
              <Text style={styles.pageTitle} numberOfLines={1}>
                {title}
              </Text>
            ) : (
              <Title />
            )}
            {subTitle && (
              <Text style={styles.pageSubTitle} numberOfLines={1}>
                {subTitle}
              </Text>
            )}
          </View>
          {RightButton ? RightButton : <View style={styles.backButton} />}
          {/* {RightButton ? (
            <RightButton handleRightNavButton={handleRightNavButton} />
          ) : (
            
          )} */}
          {progress ? (
            <View style={[styles.progressBar, {width: width * progress}]} />
          ) : (
            <></>
          )}
        </View>
        {children}
      </View>
    </>
  );
};

export const LeftButton = ({handleLeftNavButton}) => {
  return (
    // TO QR CODE ICON
    // switch (button) {
    //   case 'scan':
    //     return (
    //       <TouchableOpacity
    //         style={styles.backButton}
    //         onPress={handleLeftNavButton}>
    //         <Image source={ScanQRCode} />
    //         <Text style={{color: 'white'}}>PAY</Text>
    //       </TouchableOpacity>
    //     );
    //   default:
    //     return <View style={styles.backButton}></View>;
    // }
    <>
      <TouchableOpacity style={styles.backButton} onPress={handleLeftNavButton}>
        <Ionicons name="chevron-back-outline" size={30} color="white" />
      </TouchableOpacity>
    </>
  );
};

export const RightButton = ({handleRightNavButton, button}) => {
  switch (button) {
    case 'ADD':
      return (
        <TouchableOpacity
          style={styles.plusButton}
          onPress={handleRightNavButton}>
          <Feather name="plus" size={32} color="white" />
        </TouchableOpacity>
      );
    case 'Setting':
      return (
        <TouchableOpacity
          style={styles.plusButton}
          onPress={handleRightNavButton}>
          <Ionicons name="settings-outline" size={27} color="white" />
        </TouchableOpacity>
      );
    case 'Delete':
      return (
        <TouchableOpacity
          style={styles.plusButton}
          onPress={handleRightNavButton}>
          <Ionicons name="md-trash-outline" size={27} color="white" />
        </TouchableOpacity>
      );
    case 'History':
      return (
        <TouchableOpacity
          style={styles.plusButton}
          onPress={handleRightNavButton}>
          <MaterialCommunityIcons
            name="clipboard-list-outline"
            size={32}
            color="white"
          />
        </TouchableOpacity>
      );
      case 'Scan':
        return (
          <TouchableOpacity
            style={styles.plusButton}
            onPress={handleRightNavButton}>
            <Image source={ScanQRCode}/>
          </TouchableOpacity>
        );
      case 'PDF':
        return (
          <TouchableOpacity
            style={styles.plusButton}
            onPress={handleRightNavButton}>
            <Image source={Download}/>
          </TouchableOpacity>
        );
    default:
      return <View style={styles.backButton}></View>;
  }
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
    top: 0,
    width: width,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: height * 0.1,
    paddingTop: statusBarHeight,
    textAlign: 'center',
    paddingTop: height * 0.04,
  },
  titleContainer: {
    width: width * 0.6,
  },
  pageTitle: {
    color: 'white',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: Platform.OS === 'ios' ? RFValue(18) : RFValue(20),
    fontWeight: 'bold',
    alignItems: 'center',
    ...Platform.select({
      android: {
        flex: 1,
      },
    }),
  },
  pageSubTitle: {
    color: 'white',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: RFValue(15),
    fontWeight: 'bold',
  },
  backButton: {
    width: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: width * 0.03,
  },
  plusButton: {
    width: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.02,
  },
  progressBar: {
    height: height * 0.005,
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    position: 'absolute',
    bottom: 0,
  },
  // scanButton: {
  //   width: height * 0.05,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginRight: width * 0.02,
  //   flexDirection: 'column',
  // },
});

export default Navbar;
