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
  TextInput,
  Animated,
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';
import {SearchBar} from 'react-native-elements';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';
import ImageWithFallBack from '../ImageFallBack';

//icons
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

const ItemCard = ({
  food,
  item_image,
  item_name,
  item_category,
  item_rating,
  item_eta,
  item_distance,
  item_price,
  item_discount,
  onPress,
}) => {
  const {t, i18n} = useTranslation();
  //import address context
  //   geolib.getDistance(c.coords, {
  //     latitude: 51.525,
  //     longitude: 7.4575,
  // }),
  return (
    <>
      {/* <TouchableOpacity style={{flex: 1}} onPress={onPress}> */}
      <TouchableOpacity
        style={[themes.SHADOW_DEFAULT, styles.cardWrapper]}
        onPress={onPress}>
        <View style={styles.column1}>
          <ImageWithFallBack
            type={food ? 'food' : 'grocery'}
            style={styles.imageSize}
            source={item_image}
          />
        </View>
        <View style={styles.column2}>
          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]} numberOfLines={1}>
            {item_name}
          </Text>
          <Text style={[themes.TEXT_TITLE_GREY, styles.text]}>
            {item_category}
          </Text>
          <View style={styles.subRow}>
            <View style={styles.subRowCol1}>
              <Entypo name="star" size={15} style={themes.ICON_COLOR_YELLOW} />
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.subText]}>
                {item_rating}
              </Text>
            </View>
            <View style={styles.subRowCol2}>
              <MaterialCommunityIcons
                name="clock-time-four-outline"
                size={15}
                style={themes.ICON_COLOR}
              />
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.subText]}>
                {item_eta} • {item_distance}
              </Text>
            </View>
          </View>
          <View style={styles.bottomRow}>
            <View style={styles.flexRow}>
              <MaterialCommunityIcons
                name="motorbike"
                size={15}
                style={themes.ICON_COLOR}
              />
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.subText]}>
                {item_price}
              </Text>
            </View>
            <View style={styles.flexRow}>
              <Feather name="tag" size={15} style={themes.ICON_COLOR} />
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.subText]}>
                {item_discount}% {t('%off')}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  cardWrapper: {
    marginVertical: Platform.OS === 'ios' ? height * 0.008 : height * 0.012,
    // marginBottom: Platform.OS === 'ios' ? height * 0.02 : height * 0.012,

    marginHorizontal: width * 0.03,
    // paddingVertical: height * 0.01,
    borderRadius: 15,
    // paddingHorizontal: width * 0.03,
    // paddingVertical: height * 0.015,
    backgroundColor: '#FFFFFF',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.5,
    // shadowRadius: 1.41,
    // elevation: 4,
    flexDirection: 'row',
  },
  imageSize: {
    width: width * 0.35,
    height: Platform.OS === 'ios' ? height * 0.17 : height * 0.21,
    resizeMode: 'cover',
    overflow: 'hidden',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  column1: {
    width: width * 0.35,
  },
  column2: {
    width: width * 0.55,
    paddingLeft: width * 0.03,
    paddingTop: height * 0.015,
  },
  text: {
    fontSize: RFValue(10),
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.008,
  },
  subText: {
    fontSize: RFValue(9),
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
  iconSize: {
    width: width * 0.02,
    height: width * 0.02,
  },
  flexRow: {
    flexDirection: 'row',
    paddingVertical: height * 0.003,
  },
  bottomRow: {
    paddingTop: height * 0.015,
  },
});

export default ItemCard;
