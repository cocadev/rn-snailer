import React, {useState, useContext, Fragment} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  Text,
  Modal,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import {RFValue, getStatusBarHeight} from 'styles/ResponsiveFont';

import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';

import Feather from 'react-native-vector-icons/Feather';
import ItemCard from '../home/ItemCard';

const AddNoteModal = ({
  modalVisible,
  setModalVisible,
  message,
  noteText,
  onPress,
  onChange,
  note,
  ButtonColor,
}) => {
  const {t, i18n} = useTranslation();
  return (
    <Modal animationType="fade" transparent={true} visible={modalVisible}>
      {modalVisible ? (
        <StatusBar backgroundColor={'#70707090'} barStyle="light-content" />
      ) : null}

      {/* <View > */}
      <KeyboardAvoidingView
        //style={{flex: 1}}
        style={styles.blur}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
        <View style={styles.popUpContainer}>
          <View style={styles.titleWrap}>
            <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.text]}>
              {message}
            </Text>
          </View>
          {/* <View style={styles.titlecontainer}>
            <Text style={styles.quantityTitle}>{message}</Text>
            <TouchableOpacity>
              <Feather name="x-circle" size={30} style={styles.closeButton} />
            </TouchableOpacity>
          </View> */}
          <TextInput
            style={[styles.textInput, themes.GREEN_BOARDER]}
            numberOfLines={4}
            multiline={true}
            fontWeight="bold"
            placeholder={noteText}
            placeholderTextColor="#B2B2B2"
            value={note}
            onChangeText={onChange}
          />
          {ButtonColor && ButtonColor}
          <CustomButton
            text={t('OK')}
            onPress={() => setModalVisible(!modalVisible)}
          />
        </View>
      </KeyboardAvoidingView>
      {/* </View> */}
    </Modal>
  );
};

const CustomButton = ({text, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.customButtonContainer, themes.GREEN_BUTTON]}>
        <Text style={[themes.BUTTON_TEXT_WHITE, styles.fontSize16]}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const ButtonColor = ({color, onPress, content}) => {
  let additionalStyle;
  switch (color) {
    case 'RED':
      additionalStyle = themes.BUTTON_RED;
      break;
    case 'GREEN':
      additionalStyle = themes.BUTTON_GREEN;
      break;
    default:
      additionalStyle = themes.BUTTON_GREY;
  }
  return (
    <TouchableOpacity
      style={[styles.buttonreport, themes.SHADOW_DEFAULT, additionalStyle]}
      onPress={onPress}>
      <Text style={styles.buttonreporttext}>{content}</Text>
    </TouchableOpacity>
  );
};

const {height, width} = Dimensions.get('window');
const statusBarHeight = getStatusBarHeight();

const styles = StyleSheet.create({
  popUpContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    // position: 'absolute',
    // top: Platform.OS === 'ios' ? height * 0.3 : height * 0.25,
    // bottom: Platform.OS === 'ios' ? height * 0.32 : height * 0.25,
    // left: width * 0.02,
    // right: width * 0.02,
    overflow: 'hidden',
    paddingLeft: width * 0.05,
    paddingRight: width * 0.05,
    paddingVertical: width * 0.05,
    width: width * 0.9,
  },
  blur: {
    width: width,
    height: height + statusBarHeight,
    backgroundColor: '#70707090',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: RFValue(18),
    textAlign: 'center',
    justifyContent: 'center',
  },
  titleWrap: {},
  closeButton: {
    alignSelf: 'flex-end',
    // alignItems: 'flex-end',
  },
  width: {
    width: width * 0.1,
  },
  titlecontainer: {
    flexDirection: 'row',
    height: height * 0.08,
    alignSelf: 'center',
  },
  quantityTitle: {
    alignSelf: 'center',
    width: width * 0.9,
    paddingLeft: width * 0.06,
    fontSize: RFValue(25),
    fontWeight: 'bold',
    color: 'black',
    marginBottom: height * 0.01,
    textAlign: 'center',
  },
  textInput: {
    borderRadius: 15,
    height: Platform.OS === 'ios' ? height * 0.15 : height * 0.2,
    paddingHorizontal: width * 0.03,
    paddingTop: width * 0.03,
    //marginBottom: Platform.OS === 'ios' ? height * 0.01 : height * 0.03,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    marginVertical: width * 0.05,
  },
  buttonreport: {
    width: width * 0.7,
    height: width * 0.12,
    alignSelf: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 15,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        alignItems: 'center',
        lineHeight: width * 0.12,
        marginTop: width * 0.05,
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
  buttonreporttext: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: RFValue(14),
    alignSelf: 'center',
    textAlign: 'center',
  },
  customButtonContainer: {
    width: '100%',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    height: width * 0.11,
  },
  fontSize16: {
    fontSize: RFValue(16),
  },
});

export default AddNoteModal;
