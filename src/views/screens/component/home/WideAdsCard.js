import React from 'react';
import {StyleSheet, View, Dimensions, TouchableOpacity} from 'react-native';

import ImageWithFallBack from '../ImageFallBack';

const WideAdsCard = ({image, onPress}) => {
  return (
    <View style={styles.adsWrap}>
      <TouchableOpacity onPress={onPress}>
        <View>
          <ImageWithFallBack source={image} type="banner" style={styles.ads} />
        </View>
      </TouchableOpacity>
    </View>
  );
};
const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: width * 0.03,
    marginVertical: width * 0.02,
  },
  item: {
    marginVertical: 5,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    flexDirection: 'column',
    paddingBottom: height * 0.015,
    width: width * 0.45,
  },
  infoWrapper: {
    marginHorizontal: width * 0.035,
    justifyContent: 'flex-start',
  },
  ads: {
    width: width - width * 0.05,
    height: height * 0.23,
    alignSelf: 'center',
    resizeMode: 'cover',
  },
  timedesc: {
    marginLeft: width * 0.018,
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    marginTop: width * 0.03,
  },
  wrap: {
    flexDirection: 'row',
    marginTop: height * 0.02,
    alignItems: 'center',
  },
  adsWrap: {
    width: width - width * 0.05,
    height: height * 0.23,
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    marginVertical: width * 0.03,
    overflow: 'hidden',
    marginHorizontal: width * 0.01,
  },
});

export default WideAdsCard;
