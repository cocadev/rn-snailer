import React from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {themes} from 'utils/themeProvider';
import {CustomFont as Text} from 'styles/CustomFont';
import {RFValue, getStatusBarHeight} from 'styles/ResponsiveFont';

import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import list from '../../../assets/icons/list.png';

const SubNavBar = ({
  children,
  title,
  Title,
  subTitle,
  SubTitle,
  LeftButton,
  handleLeftNavButton,
  RightButton,
  handleRightNavButton,
  progress,
  button,
  handleChangeLocation,
}) => {
  const title_length = SubTitle ? SubTitle.length : 20;
  return (
    <>
      <LinearGradient
        colors={['#BBDB9C', '#468c64']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={{flex: 0}}>
        <StatusBar
          backgroundColor={'transparent'}
          translucent={true}
          barStyle="light-content"
          height
        />
      </LinearGradient>
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
          <TouchableOpacity onPress={handleChangeLocation}>
            <View style={styles.titleContainer}>
              {Title && Title}
              {SubTitle && SubTitle}
            </View>
          </TouchableOpacity>
          {RightButton ? RightButton : <View style={styles.backButton} />}
          {progress && (
            <View style={[styles.progressBar, {width: width * progress}]} />
          )}
        </View>
        {children}
      </View>
    </>
  );
};

export const Title = ({textAlign, title}) => {
  switch (textAlign) {
    case 'Center':
      return (
        <Text style={styles.pageTitle} numberOfLines={1}>
          {title}
        </Text>
      );
    case 'Left':
      return (
        <Text style={styles.pageTitleLeft} numberOfLines={1}>
          {title}
        </Text>
      );
    default:
      return <></>;
  }
};

export const SubTitle = ({icon, subTitle}) => {
  switch (icon) {
    case 'Location':
      return (
        <View style={{flexDirection: 'row'}}>
          <Ionicons
            name="ios-location-sharp"
            color="white"
            style={styles.locationIcon}
          />
          <Text style={styles.pageSubTitle} numberOfLines={1}>
            {subTitle}
          </Text>
        </View>
      );
    case 'Distance':
      return (
        <Text style={styles.pageSubTitleDistance} numberOfLines={1}>
          {subTitle}
        </Text>
      );
    default:
      return <></>;
  }
};

export const LeftButton = ({handleLeftNavButton}) => {
  // TO DO QR CODE ICON
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
  return (
    <>
      <TouchableOpacity style={styles.backButton} onPress={handleLeftNavButton}>
        <Ionicons name="chevron-back-outline" size={30} color="white" />
      </TouchableOpacity>
    </>
  );
};

export const RightButton = ({
  button,
  handleFavoriteButton,
  handleHistoryButton,
}) => {
  switch (button) {
    case 'Favorite':
      return (
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoriteButton}>
          <Feather name="heart" size={32} color="white" />
        </TouchableOpacity>
      );
    case 'History':
      return (
        <TouchableOpacity onPress={handleHistoryButton}>
          <MaterialCommunityIcons
            name="clipboard-list-outline"
            size={32}
            color="white"
            style={styles.historyButton}
          />
          {/* <Image source={list} style={styles.historyButton} /> */}
        </TouchableOpacity>
      );
    case 'Both':
      return (
        <>
          <View style={{flexDirection: 'row', alignContent: 'center'}}>
            <TouchableOpacity onPress={handleFavoriteButton}>
              <Feather name="heart" size={32} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleHistoryButton}>
              {/* <Image source={list} style={styles.historyButton}  /> */}
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                size={32}
                color="white"
                style={styles.historyButton}
              />
            </TouchableOpacity>
          </View>
        </>
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
  },
  titleContainer: {
    width: width * 0.6,
    flexDirection: 'column',
  },
  pageTitle: {
    color: 'white',
    alignSelf: 'center',
    textAlign: 'left',
    fontSize: RFValue(15),
    fontWeight: 'bold',
  },
  pageTitleLeft: {
    color: 'white',
    alignSelf: 'flex-start',
    textAlign: 'left',
    fontSize: RFValue(15),
    fontWeight: 'bold',
  },
  pageSubTitle: {
    color: 'white',
    alignSelf: 'flex-start',
    textAlign: 'left',
    fontSize: Platform.OS === 'ios' ? RFValue(13) : RFValue(11),
    fontWeight: 'bold',
    paddingTop: Platform.OS === 'ios' ? width * 0.005 : 0,
  },
  pageSubTitleDistance: {
    color: 'white',
    textAlign: 'center',
    fontSize: Platform.OS === 'ios' ? RFValue(13) : RFValue(11),
    fontWeight: 'bold',
    paddingTop: Platform.OS === 'ios' ? width * 0.005 : 0,
  },
  backButton: {
    width: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: width * 0.03,
  },
  favoriteButton: {
    width: height * 0.05,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginRight: width * 0.03,
  },
  historyButton: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginHorizontal: width * 0.03,
  },
  progressBar: {
    height: height * 0.005,
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    position: 'absolute',
    bottom: 0,
  },
  locationIcon: {
    alignItems: 'center',
    alignSelf: 'center',
    fontSize: Platform.OS === 'ios' ? RFValue(13) : RFValue(11),
    paddingTop: Platform.OS === 'ios' ? width * 0.005 : 0,
    marginRight: width * 0.005,
  },
});

export default SubNavBar;
