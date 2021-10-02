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
  ScrollView,
} from 'react-native';
import {RFValue} from 'styles/ResponsiveFont';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';

import NavBar, {LeftButton} from '../../component/NavBar';
import {MoveOrderContext} from 'states/context/moveOrder.context';

const MoveUpdateInfo = ({navigation}) => {
  const {moveOrder, dispatchMoveOrder} = useContext(MoveOrderContext);
  const {t, i18n} = useTranslation();

  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const [name, setName] = useState(
    moveOrder.contact.name === undefined ? '' : moveOrder.contact.name,
  );
  const [phoneNumber, setPhoneNumber] = useState(
    moveOrder.contact.phone_number === undefined
      ? ''
      : moveOrder.contact.phone_number,
  );

  const onHandleUpdateInfo = () => {
    if (name === '' || phoneNumber === '') {
      alert('name_phone_warning');
    } else {
      dispatchMoveOrder({
        type: 'CHANGE_CONTACT_INFO',
        payload: {name: name, phone_number: phoneNumber},
      });
      setTimeout(() => {
        navigation.goBack();
      }, 300);
    }
  };

  const update = true;

  return (
    <>
      <NavBar
        title={t('update_contact_info')}
        {...{LeftButton, handleLeftNavButton}}>
        <View style={[themes.BACKGROUND_WHITE_WRAP, styles.infoWrap]}>
          <View style={styles.titleWrap}>
            <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
              {t('name')}
            </Text>
          </View>
          <TextInput
            style={[
              themes.GREEN_BOARDER,
              styles.textInput,
              themes.SHADOW_DEFAULT,
            ]}
            value={name}
            onChangeText={(value) => setName(value)}
          />
        </View>
        <View style={{height: height * 0.002}} />
        <View style={[themes.BACKGROUND_WHITE_WRAP, styles.infoWrap]}>
          <View style={styles.titleWrap}>
            <Text style={[styles.text, themes.NORMAL_TEXT_BLACK_BOLD]}>
              {t('phone_number')}
            </Text>
          </View>
          <TextInput
            style={[
              themes.GREEN_BOARDER,
              styles.textInput,
              themes.SHADOW_DEFAULT,
            ]}
            value={phoneNumber}
            onChangeText={(value) => setPhoneNumber(value)}
          />
        </View>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <TouchableOpacity onPress={onHandleUpdateInfo}>
            <Text style={[themes.GREEN_BUTTON, styles.button]}>
              {t('update')}
            </Text>
          </TouchableOpacity>
        </View>
      </NavBar>
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  titleWrap: {
    justifyContent: 'space-between',
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
    flexDirection: 'row',
  },
  text: {
    fontSize: RFValue(13),
  },
  textInput: {
    marginHorizontal: width * 0.05,
    borderWidth: 1,
    borderRadius: 10,
    height: width * 0.12,
    fontSize: RFValue(13),
    paddingHorizontal: width * 0.03,
    backgroundColor: 'white',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: width * 0.01,
    fontSize: RFValue(13),
  },
  inputWrap: {
    marginBottom: width * 0.06,
  },
  infoWrap: {
    paddingBottom: height * 0.02,
  },
  button: {
    width: width * 0.7,
    height: width * 0.13,
    alignSelf: 'center',
    textAlign: 'center',
    // marginTop: Platform.OS === 'ios' ? height * 0.245 : height * 0.1,
    marginBottom: height * 0.03,
    marginTop: width * 0.03,
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 1,
    fontWeight: 'bold',
    fontSize: RFValue(14),
    ...Platform.select({
      ios: {
        alignItems: 'center',
        lineHeight: width * 0.12,
        height: width * 0.12,
      },
      android: {
        textAlignVertical: 'center',
      },
      default: {
        alignItems: 'center',
        textAlignVertical: 'center',
      },
    }),
  },
});

export default MoveUpdateInfo;
