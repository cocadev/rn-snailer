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
import {themes} from 'utils/themeProvider';

//icons
import Feather from 'react-native-vector-icons/Feather';
import { formatDate } from '../../../../utils/helper';

const OrderItem = ({type, order_name, onPress, subTitle, TextStatus}) => {
  return (
    <>
      <TouchableOpacity style={styles.bigWrapContainer} onPress={onPress}>
        <View style={styles.ItemWrap}>
          <View style={styles.column1}>
            <ImageType {...{type}} />
          </View>
          <View style={styles.column2}>
            <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]} numberOfLines={1}>
              {order_name}
            </Text>
            {subTitle && (
              <Text
                style={[themes.TEXT_TITLE_GREY, styles.smallText]}
                numberOfLines={1}>
                {subTitle}
              </Text>
            )}
          </View>
          {TextStatus && TextStatus}
        </View>
      </TouchableOpacity>
    </>
  );
};

const ImageType = ({type}) => {
  let image;
  switch (type) {
    case 'food':
      image = require('../../../../assets/images/Fallback-food.jpg');
      break;
    case 'grocery':
      image = require('../../../../assets/images/Fallback-grocery.jpg');
      break;
    case 'rider':
      image = require('../../../../assets/images/Fallback-rider.jpg');
      break;
    case 'notification':
      image = require('../../../../assets/images/Fallback-notification.png');
      break;
  }
  return (
    <Image
      source={image}
      style={styles.imageSize}
    />
  );
};

export const TextStatus = ({color, order_time, context}) => {
  switch (color) {
    case 'Ongoing':
      return (
        <View style={styles.column3}>
          <Text
            style={[themes.EDIT_ORANGE_TEXT, styles.smallText3]}
            numberOfLines={1}>
            {context}
          </Text>
        </View>
      );
    case 'Reserved':
      return (
        <View style={styles.column3}>
          <Text
            style={[themes.EDIT_GREEN_TEXT, styles.smallText3]}
            numberOfLines={1}>
            {context}
          </Text>
        </View>
      );
    case 'History':
      return (
        <View style={styles.column3}>
          <Text
            style={[themes.TEXT_TITLE_GREY, styles.smallText2]}
            numberOfLines={1}>
            {formatDate({timeStamp: order_time, type: 'MMM DD, H:mm'})}
          </Text>
        </View>
      );
    case 'Right':
      return (
        <View style={styles.column3extend}>
          <Text
            style={[themes.TEXT_TITLE_GREY, styles.smallText3]}
            numberOfLines={1}>
            <Feather
              name="chevron-right"
              size={25}
              style={themes.ICON_COLOR_BLACK}
            />
          </Text>
        </View>
      );
  }
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  ItemWrap: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.015,
    flexDirection: 'row',
  },
  bigWrapContainer: {
    marginHorizontal: width * 0.03,
    marginBottom: Platform.OS === 'ios' ? height * 0.0025 : height * 0.004,
    marginTop: height * 0.02,
    backgroundColor: 'white',
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.27,
    shadowRadius: 2,
    elevation: 4,
  },
  imageSize: {
    width: width * 0.1,
    height: width * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 250,
  },
  column1: {
    width: width * 0.08,
    alignItems: 'center',
    alignSelf: 'center',
  },
  column2: {
    width: width * 0.5,
    flexDirection: 'column',
    marginLeft: width * 0.035,
  },
  column3: {
    width: width * 0.23,
    marginRight: width * 0.01,

    alignItems: 'flex-end',
    alignSelf: 'flex-start',
  },
  column3extend: {
    width: width * 0.23,
    marginRight: width * 0.01,

    alignItems: 'flex-end',
    alignSelf: 'center',
  },
  smallText: {
    fontSize: RFValue(10),
    paddingTop: height * 0.008,
  },
  smallText2: {
    fontSize: RFValue(10),
  },
  smallText3: {
    fontSize: RFValue(12),
  },
});

export default OrderItem;
