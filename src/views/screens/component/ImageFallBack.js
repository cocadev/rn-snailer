import React, {useState} from 'react';
import {
  BASE_URL_IMAGE,
  BASE_URL_IMAGE_PRODUCT,
  BASE_URL_IMAGE_STORE,
  BASE_URL_IMAGE_USER,
} from '../../../../config';
import {Platform} from 'react-native';

import FastImage from 'react-native-fast-image';

const ImageWithFallBack = ({source, style, type}) => {
  let defaultImage;
  let baseImageUrl;
  switch (type) {
    case 'user':
      baseImageUrl = BASE_URL_IMAGE_USER + '/consumer/';
      defaultImage = require('../../../assets/images/Fallback-user.jpg');
      break;
    case 'rider':
      baseImageUrl = BASE_URL_IMAGE_USER + '/rider/';
      defaultImage = require('../../../assets/images/Fallback-rider.jpg');
      break;
    case 'store':
      baseImageUrl = BASE_URL_IMAGE_STORE + '/';
      defaultImage = require('../../../assets/images/logo.png');
      break;
    case 'food':
      baseImageUrl = BASE_URL_IMAGE_PRODUCT + '/';
      defaultImage = require('../../../assets/images/Fallback-food.jpg');
      break;
    case 'grocery':
      baseImageUrl = BASE_URL_IMAGE_PRODUCT + '/';
      defaultImage = require('../../../assets/images/Fallback-grocery.jpg');
      break;
    case 'notification':
      baseImageUrl = BASE_URL_IMAGE + '/notification/';
      defaultImage = require('../../../assets/images/logo.png');
      break;
    case 'banner':
      baseImageUrl = BASE_URL_IMAGE + '/banner/';
      defaultImage = require('../../../assets/images/logo.png');
      break;
    case 'feed':
      baseImageUrl = BASE_URL_IMAGE + '/activity-feed/';
      defaultImage = require('../../../assets/images/logo.png');
      break;
    case 'move_order':
      baseImageUrl = BASE_URL_IMAGE + `/order/`;
      defaultImage = require('../../../assets/images/logo.png');
      break;
    case 'parcel_price':
      baseImageUrl = BASE_URL_IMAGE + `/parcel-price/`;
      defaultImage = require('../../../assets/images/logo.png');
      break;
    case 'parcel':
      baseImageUrl = BASE_URL_IMAGE + `/parcel/`;
      defaultImage = require('../../../assets/images/logo.png');
      break;
    default:
      defaultImage = require('../../../assets/images/logo.png');
  }
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <FastImage source={defaultImage} style={style} />}
      <FastImage
        style={[style, loaded ? {} : {width: 0, height: 0}]}
        source={{
          uri: baseImageUrl + source,
          priority: FastImage.priority.normal,
        }}
        onLoadStart={() => {
          // android issue https://github.com/DylanVann/react-native-fast-image/issues/529
          if (Platform.OS !== 'ios') {
            setTimeout(() => {
              setLoaded(true);
            }, 1000);
          }
        }}
        onLoadEnd={() => {
          setLoaded(true);
        }}
      />
    </>
  );
};
export default ImageWithFallBack;
