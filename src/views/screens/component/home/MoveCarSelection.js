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
import {useTranslation} from 'react-i18next';
import {themes} from 'utils/themeProvider';


const MoveCarSelection = ({image, onPress}) => {
  const {t, i18n} = useTranslation();

  return (
    <>
      <View style={styles.itemWrap}>
        <TouchableOpacity onPress={onPress}>
          <View style={[themes.GREEN_BOARDER, styles.imageWrap]}>
            <Image source={image} style={styles.imageSize} />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};
const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
 
  itemWrap: {
    width: width * 0.2,
    height: width * 0.2,
    alignSelf: 'center',
    
  },
  imageWrap: {
    borderRadius: 250,
    backgroundColor: 'white',
    borderWidth: 1
  },
  imageSize: {
    width: width * 0.2,
    height: width * 0.2,
    resizeMode: 'contain',
    
  },

});

export default MoveCarSelection;
