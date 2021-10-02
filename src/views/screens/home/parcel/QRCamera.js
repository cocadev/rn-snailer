import React, {useRef} from 'react';
import {View, Dimensions} from 'react-native';
import {StyleSheet} from 'react-native';

import {useTranslation} from 'react-i18next';
import {RNCamera} from 'react-native-camera';
import NavBar, {LeftButton} from '../../component/NavBar';

const QRCamera = ({navigation}) => {
  const once = useRef();
  once.current = true;
  const handleLeftNavButton = () => {
    navigation.goBack();
  };
  const {t, i18n} = useTranslation();

  const handleTrackByQR = async ({parcelId}) => {
    navigation.navigate('ParcelOrderDetail', {
      viewOnly: true,
      noPrice: true,
      order_id: parcelId,
    });
  };

  const handleBarCodeRead = ({type, data}) => {
    if (once.current && data) {
      handleTrackByQR({parcelId: data});
      once.current = false;
    }
  };

  const leftTop = {
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderColor: 'white',
    borderRadius: 5,
  };
  const leftBottom = {
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: 'white',
    borderRadius: 5,
  };
  const rightTop = {
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderColor: 'white',
    borderRadius: 5,
  };
  const rightBottom = {
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: 'white',
    borderRadius: 5,
  };

  return (
    <NavBar
      title={t('scan_qr')}
      {...{
        LeftButton,
        handleLeftNavButton,
      }}>
      <View style={styles.container}>
        <RNCamera
          onBarCodeRead={handleBarCodeRead}
          style={styles.container}
          cameraProps={{captureAudio: false}}
          detectedImageInEvent={true}
          captureAudio={false}
        />
        <View
          style={{
            ...StyleSheet.absoluteFill,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: width / 2,
              height: width / 2,
            }}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1, ...leftTop}} />
              <View style={{flex: 1}} />
              <View style={{flex: 1, ...rightTop}} />
            </View>
            <View style={{flex: 1}} />
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1, ...leftBottom}} />
              <View style={{flex: 1}} />
              <View style={{flex: 1, ...rightBottom}} />
            </View>
          </View>
        </View>
      </View>
    </NavBar>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
  },
});

export default QRCamera;
