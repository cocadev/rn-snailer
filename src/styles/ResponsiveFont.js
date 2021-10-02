import {Platform, StatusBar, Dimensions} from 'react-native';

export const isIphoneX = () => {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 896 ||
      dimen.width === 896)
  );
};

export const ifIphoneX = (iphoneXStyle, regularStyle) => {
  if (isIphoneX()) {
    return iphoneXStyle;
  }
  return regularStyle;
};

export const getStatusBarHeight = safe => {
  return Platform.select({
    ios: ifIphoneX(safe ? 44 : 30, 20),
    android: StatusBar.currentHeight,
    default: 0,
  });
};

export const getSafeAreaViewHeight = safe => {
  return Platform.select({
    ios: ifIphoneX(safe ? 44 + 34 : 30, 20),
    android: StatusBar.currentHeight,
    default: 0,
  });
};

export const getSafeAreaViewTopHeight = safe => {
  return Platform.select({
    ios: ifIphoneX(safe ? 44 : 0, 0),
    android: StatusBar.currentHeight,
    default: 0,
  });
};

export const getSafeAreaViewBottomHeight = safe => {
  return Platform.select({
    ios: ifIphoneX(safe ? 34 : 30, 20),
    android: 0,
    default: 0,
  });
};

export const STATUS_BAR_HEIGHT = getStatusBarHeight();
export const SAFEAREAVIEW_HEIGHT = getSafeAreaViewHeight();
export const SAFEAREAVIEW_TOP_HEIGHT = getSafeAreaViewTopHeight();
export const SAFEAREAVIEW_BOTTOM_HEIGHT = getSafeAreaViewBottomHeight();

export const getBottomSpace = () => {
  return isIphoneX() ? 34 : 0;
};

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export const height = isIphoneX()
  ? deviceHeight - 78 // iPhone X style SafeAreaView size in portrait
  : Platform.OS === 'android'
  ? deviceHeight - StatusBar.currentHeight
  : deviceHeight - 20;

export const width = deviceWidth;

export const RFPercentage = percent => {
  const heightPercent = (percent * deviceHeight) / 100;
  return Math.round(heightPercent);
};

// export const RFValue = (fontSize) => {
//   // guideline height for standard 5" device screen
//   const standardScreenHeight = 680;
//   const heightPercent = (fontSize * deviceHeight) / standardScreenHeight;
//   return Math.round(heightPercent);
// }

export const RFValue = fontSize => {
  // guideline height for standard 5" device screen
  const standardScreenWidth = 350;
  const widthPercent = (fontSize * deviceWidth) / standardScreenWidth;
  return Math.round(widthPercent);
};
