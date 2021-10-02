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

import NavBar, {LeftButton} from '../../component/NavBar';

import {ScrollView} from 'react-native-gesture-handler';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';

import {addAddress} from 'services/address';

const AddSavedPlace = ({navigation, route}) => {
  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const {t, i18n} = useTranslation();
  const [save, setSave] = useState(false);

  return (
    <NavBar
      title={t('add_to_saved_place')}
      {...{
        LeftButton,
        handleLeftNavButton,
      }}>
      <ScrollView>
        {/* <View style={[themes.BACKGROUND_WHITE_WRAP, styles.spacing]}>
          <View style={styles.container}>
            <Text style={styles.title}>{t('name')}</Text>
            <TextInput
              style={[themes.GREEN_BOARDER, styles.textInput]}
              placeholder="Eg. Gym / School"
              onChangeText={(value) => {
                setName(value);
              }}
            />
          </View>
        </View> */}
        {/* <View style={[themes.BACKGROUND_WHITE_WRAP, styles.spacing]}>
          <View style={styles.container}>
            <View>
              <Text style={[styles.title, themes.TEXT_TITLE_GREY]}>
                {t('address')}
              </Text>
              <TextInput
                style={[themes.GREY_BOARDER, styles.textInput]}
                placeholder="Eg. Gym / School"
                value={address}
                multiline
              />
            </View>
          </View>
        </View>
        <View style={[themes.BACKGROUND_WHITE_WRAP, styles.spacing]}>
          <View style={styles.container}>
            <Text style={styles.title}>{t('address_details')}</Text>
            <TextInput
              style={[themes.GREEN_BOARDER, styles.textInput]}
              placeholder="Eg. Floor, Unit number">
              <Text style={{fontWeight: 'bold'}}></Text>
            </TextInput>
          </View>
        </View> */}
        <View style={[themes.BACKGROUND_WHITE_WRAP, styles.spacing]}>
          <View style={styles.container}>
            <Text style={styles.title}>{t('note_to_driver')}</Text>
            <TextInput
              style={[themes.GREEN_BOARDER, styles.textInput]}
              placeholder="Eg. Meet me at the lobby"
            />
          </View>
        </View>
        <TouchableOpacity onPress={handleLeftNavButton}>
          {!save ? (
            <Text style={[themes.GREEN_BUTTON, styles.button]}>
              {t('save_note')}
            </Text>
          ) : (
            <Text style={[themes.GREY_BUTTON, styles.button]}>
              {t('save_note')}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </NavBar>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
  },
  spacing: {
    marginBottom: height * 0.002,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: height * 0.025,
    fontSize: RFValue(13),
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    height: width * 0.12,
    fontSize: RFValue(13),
    paddingHorizontal: width * 0.03,
    marginBottom: height * 0.02,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },

  button: {
    width: width * 0.7,
    height: width * 0.13,
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: height * 0.05,
    overflow: 'hidden',
    borderRadius: 25,
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

export default AddSavedPlace;
