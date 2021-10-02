import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  Text,
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';

import {useTranslation} from 'react-i18next';
import {themes} from 'utils/themeProvider';
import ImageWithFallBack from '../ImageFallBack';

import bookicon from '../../../../assets/icons/book.png';
import promotion from '../../../../assets/icons/promotion.png';

//icons
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {formatCurrency, formatCurrencyWithNoCurrency} from '../../../../utils/helper';

const AdsCard = ({
  type,
  item_name,
  item_description,
  item,
  is_open = true,
  handleAdsCard,
  branch,
  item_image,
  rating,
  distance,
  rider_fee,
  display_info = false,
}) => {
  const {t, i18n} = useTranslation();

  return (
    <TouchableOpacity
      style={[styles.item, themes.SHADOW_DEFAULT, !is_open && {opacity: 0.5}]}
      disabled={is_open ? false : true}
      onPress={() => handleAdsCard(item)}>
      <View style={styles.imageWrapper}>
        <ImageWithFallBack
          type={type}
          style={styles.image}
          source={item_image}
        />
      </View>
      <View style={styles.infoWrapper}>
        <Text style={styles.text} numberOfLines={2}>
          {item_name}
        </Text>
        {display_info && (
          <>
            <View style={styles.subRow}>
              <View style={styles.subRowCol1}>
                <Entypo
                  name="star"
                  size={20}
                  style={themes.ICON_COLOR_YELLOW}
                />
                <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.subText]}>
                  {rating ? rating.toFixed(1) : '0.0'}
                </Text>
              </View>
              <View style={styles.subRowCol2}>
                <MaterialCommunityIcons
                  name="clock-time-four-outline"
                  size={20}
                  style={themes.ICON_COLOR}
                />
                <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.subText]}>
                  {distance ? distance.toFixed(2) : '0.00'} km
                </Text>
              </View>
            </View>
            <View style={styles.flexRow}>
              <MaterialCommunityIcons
                name="motorbike"
                size={20}
                style={themes.ICON_COLOR}
              />
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.subText]}>
                {`${t('RM')} ${formatCurrencyWithNoCurrency(rider_fee)}`}
              </Text>
            </View>
          </>
        )}
        {item_description && (
          <View style={styles.wrap}>
            <Image
              source={type === 'food' ? bookicon : promotion}
              style={themes.GREEN_TINTCOLOR}
            />
            <Text style={[styles.timedesc, themes.TEXT_TITLE_GREY]}>
              {item_description.length > 15
                ? item_description.toString().substring(0, 15) + '...'
                : item_description}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  item: {
    marginVertical: height * 0.01,
    // marginRight: width * 0.04,
    marginHorizontal: width * 0.02,
    borderRadius: 20,
    backgroundColor: 'white',
    flexDirection: 'column',
    width: width * 0.45,
    // paddingBottom: Platform.OS === 'ios' ? height * 0.01 : height * 0.015,
    height: Platform.OS === 'ios' ? width * 0.7 : width * 0.7,
  },
  infoWrapper: {
    marginHorizontal: width * 0.02,
    justifyContent: 'space-between',

    height: Platform.OS === 'ios' ? width * 0.22 : width * 0.24,
  },
  imageWrapper: {
    width: width * 0.45,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    height: width * 0.4,
    width: width * 0.45,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  image: {
    resizeMode: 'cover',
    width: width * 0.45,
    height: width * 0.45,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subText: {
    fontSize: RFValue(11),
    paddingLeft: width * 0.01,
  },
  subRowCol1: {
    width: width * 0.15,
    flexDirection: 'row',
    marginVertical: height * 0.005,
    alignItems: 'center',
  },
  subRowCol2: {
    width: width * 0.3,
    flexDirection: 'row',
    marginVertical: height * 0.008,
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.003,
  },
  bottomRow: {
    paddingTop: height * 0.015,
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
    alignItems: 'center',
  },
});

export default AdsCard;
