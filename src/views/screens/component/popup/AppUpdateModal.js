import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Image,
  Modal,
  Linking,
  TouchableOpacity,
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';

import appicon from '../../../../assets/images/consumer_appicon.jpg';

const AppUpdateModal = ({modalVisible}) => {
  const {t, i18n} = useTranslation();
  const handleUpdateButton = async () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('https://apps.apple.com/us/app/snailer/id1540536548');
    } else {
      Linking.openURL(
        'https://play.google.com/store/apps/details?id=com.snailer_consumer',
      );
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      style={styles.container}>
      <View style={styles.overlay}>
        <View style={[styles.popUpContainer, themes.SHADOW_DEFAULT]}>
          <View style={styles.middleContainer}>
            <View style={styles.imageContainer}>
              <Image source={appicon} style={styles.image} />
            </View>
            <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.titleText]}>
              {t('version_expired_text')}
            </Text>
            <TouchableOpacity onPress={handleUpdateButton}>
              <Text style={[themes.EDIT_GREEN_TEXT, {fontSize: RFValue(16)}]}>
                {t('update_snailer')}
              </Text>
            </TouchableOpacity>
            <Text style={[themes.TEXT_TITLE_LIGHTGREY]}>
              {t('update_free')}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  popUpContainer: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFF',
    borderWidth: 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: width * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    height: height * 0.93,
  },
  overlay: {
    backgroundColor: '#70707095',
    width: width,
    height: height,
    justifyContent: 'flex-end',
  },
  imageContainer: {
    height: width * 0.3,
    width: width * 0.3,
    resizeMode: 'contain',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  titleText: {
    fontSize: RFValue(16),
    textAlign: 'center',
    lineHeight: RFValue(25),
  },
  middleContainer: {
    alignItems: 'center',
    height: height * 0.5,
    justifyContent: 'space-around',
    marginBottom: width * 0.1,
  },
});

export default AppUpdateModal;
