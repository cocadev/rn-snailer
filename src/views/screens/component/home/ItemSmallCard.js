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
import {
  formatCurrency,
  formatCurrencyWithNoCurrency,
} from '../../../../utils/helper';
import {BASE_URL_IMAGE} from '../../../../../config';

const ItemSmallCard = ({
  good,
  food,
  type,
  item_id,
  item_image,
  item_name,
  item_price,
  item_quantity,
  item_avaibility = true,
  handleSmallItemCard,
}) => {
  const {t, i18n} = useTranslation();

  return (
    <>
      <TouchableOpacity
        style={[
          themes.GREEN_BOARDER,
          styles.itemContainer,
          !item_avaibility && {opacity: 0.5},
          item_quantity === 0 && {opacity: 0.5},
        ]}
        disabled={
          (item_avaibility ? false : true) ||
          (item_quantity !== 0 ? false : true)
        }
        onPress={() => handleSmallItemCard(food || good)}>
        <View style={[themes.GREEN_BOARDER_BOTTOM, styles.itemImage]}>
          <View style={{height: '120%', width: '100%'}}>
            <ImageWithFallBack
              type={type}
              source={item_image ? item_image : null}
              style={styles.itemImageSize}
            />
          </View>
        </View>
        <View style={styles.itemTextContainer}>
          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]} numberOfLines={2} >
            {item_name}
          </Text>
          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.priceText]}>
            {type === 'food'
              ? `${t('RM')} ${formatCurrencyWithNoCurrency(item_price)}`
              : item_price.minPrice !== item_price.maxPrice
              ? `${t('RM')} ${formatCurrencyWithNoCurrency(
                  item_price.minPrice,
                )} - ${t('RM')} ${formatCurrencyWithNoCurrency(
                  item_price.maxPrice,
                )}`
              : `${t('RM')} ${formatCurrencyWithNoCurrency(
                  item_price.minPrice,
                )}`}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  backgroundSpace: {
    padding: width * 0.05,
    marginTop: height * 0.002,
  },
  itemContainer: {
    borderRadius: 25,
    width: width * 0.9,
    height: Platform.OS === 'ios' ? width * 0.32 : width * 0.3,
    overflow: 'hidden',
    marginVertical: height * 0.02,
    marginRight: width * 0.05,
    borderWidth: 1,
  },
  itemImage: {
    flex: 1,
    width: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTextContainer: {
    width: width,
    marginLeft: 150,
    marginTop: -115,
    flex: 0.5,
    
  },
  itemImageSize: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  priceText: {
    width: width,
    flex: 0.5,
  },
});

export default ItemSmallCard;
