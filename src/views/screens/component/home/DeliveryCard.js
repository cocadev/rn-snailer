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
  Linking,
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';

import Entypo from 'react-native-vector-icons/Entypo';

import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';

const DeliveryCard = ({
  rider_name,
  rider_phone,
  rider_car,
  rider_etatime,
  rider_etamin,
  create_time,
}) => {
  const {t, i18n} = useTranslation();

  const handleRedirect = async () => {
    try {
      await Linking.openURL(`whatsapp://send?&phone=+60${rider_phone}`);
    } catch (error) {
      if (Platform.OS === 'ios') {
        Linking.openURL(
          'https://apps.apple.com/lb/app/whatsapp-messenger/id310633997',
        );
      } else {
        Linking.openURL(
          'https://play.google.com/store/apps/details?id=com.whatsapp&hl',
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <View style={styles.infoWrapper}>
          <Text style={styles.infoTitle}>
            {t('rider_name')}: &nbsp;
            <Text style={styles.infoText}>{rider_name}</Text>
          </Text>
          <TouchableOpacity onPress={handleRedirect}>
            <Text style={styles.infoTitle}>
              {t('phone_number')}: &nbsp;
              <Text style={styles.infoText}>
                {rider_phone !== '' && `+60${rider_phone}`}
              </Text>
            </Text>
          </TouchableOpacity>

          {/* <Text style={styles.infoTitle}>
            {t('vehicle_model')}: &nbsp;
              <Text style={styles.infoText}>{rider_car}</Text>
          </Text>
          <Text style={styles.infoTitle}>
            {t('rating')}: &nbsp;
              <Text style={styles.infoText}>
                <Entypo name="star" size={15} style={themes.ICON_COLOR_YELLOW} />
                <Entypo name="star" size={15} style={themes.ICON_COLOR_YELLOW} />
                <Entypo name="star" size={15} style={themes.ICON_COLOR_YELLOW} />
                <Entypo name="star" size={15} style={themes.ICON_COLOR_YELLOW} />
                <Entypo name="star" size={15} style={themes.ICON_COLOR_YELLOW} />

              </Text>
          </Text> */}
        </View>

        <View style={styles.rightColumn}>
          <Text style={styles.etaTitle}>{t('order_time')}</Text>
          <View style={styles.line}></View>
          <View style={styles.etaTextWrap}>
            <Text style={styles.etaText}>{create_time}</Text>
            {/* <Text style={styles.etaText}>({rider_etamin})</Text> */}
          </View>
        </View>
      </View>
    </View>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  item: {
    marginTop: Platform.OS === 'ios' ? height * 0.02 : height * 0.025,
    marginBottom: Platform.OS === 'ios' ? height * 0.01 : height * 0.03,
    marginHorizontal: width * 0.04,
    // marginHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    flexDirection: 'row',
  },
  infoWrapper: {
    paddingVertical: width * 0.03,
    paddingLeft: width * 0.045,
    width: '70%',
    justifyContent: 'center',
  },
  infoTitle: {
    fontSize: RFValue(13),
    color: '#707070',
    fontWeight: 'bold',
    textAlign: 'left',
    paddingVertical: Platform.OS === 'ios' ? width * 0.025 : width * 0.02,
  },
  infoText: {
    fontSize: RFValue(13),
    color: 'black',
    fontWeight: 'bold',
    paddingTop: width * 0.03,
  },
  rightColumn: {
    backgroundColor: '#468c64',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    width: '30%',
    textAlignVertical: 'center',
    justifyContent: 'center',
  },
  etaTitle: {
    color: 'white',
    marginLeft: 10,
    marginRight: 10,
    fontWeight: 'bold',
    fontSize: RFValue(14),
    textAlign: 'center',
    // borderBottomColor: 'white',
    // borderBottomWidth: 2,
    paddingBottom: height * 0.008,
  },
  etaText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: RFValue(12),
    textAlign: 'center',
  },
  etaTextWrap: {
    flexDirection: 'column',
    marginTop: height * 0.01,
  },
  line: {
    height: height * 0.001,
    borderBottomColor: 'white',
    borderBottomWidth: 2,
    marginHorizontal: width * 0.02,
  },
});

export default DeliveryCard;
