import React, {useState} from 'react';
import {StyleSheet, Dimensions, View, ActivityIndicator} from 'react-native';
import {WebView} from 'react-native-webview';
import NavBar, {LeftButton} from '../../component/NavBar';
import {useTranslation} from 'react-i18next';

const Help = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [progress, setProgress] = useState(0);

  const handleLeftNavButton = () => {
    navigation.goBack();
  };
  return (
    <NavBar
      title={t("help_center")}
      {...{LeftButton, handleLeftNavButton, progress}}>
      <WebView
        onLoadProgress={({nativeEvent}) => {
          setProgress(nativeEvent.progress);
        }}
        style={{
          height: height * (1 - 0.12),
          width: width,
          opacity: 0.99,
          overflow: 'hidden',
        }}
        source={{uri: 'https://thesnailer.com#contactus'}}
      />
    </NavBar>
  );
};

export default Help;

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    paddingTop: height * 0.01,
    justifyContent: 'flex-end',
  },
  backButton: {
    marginTop: height * 0.03,
    height: height * 0.065,
    width: height * 0.065,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIndicatorStyle: {
    flex: 1,
    position: 'absolute',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
    left: 0,
    right: 0,
    top: 10,
    bottom: 0,
    justifyContent: 'center',
  },
  container: {
    position: 'absolute',
    zIndex: 10,
    top: 0,
    left: 0,
  },
});
