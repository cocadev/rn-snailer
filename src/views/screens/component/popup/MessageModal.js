import React, {useState, useContext} from 'react';
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
} from 'react-native';
import {RFValue, getStatusBarHeight} from 'styles/ResponsiveFont';

const MessageModal = ({message, modalVisible, ButtonGroup, subMessage}) => {
  return (
    <>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        {modalVisible ? (
          <StatusBar backgroundColor={'#70707090'} barStyle="light-content" />
        ) : null}
        <View style={styles.blur}>
          <View style={styles.popUpContainer}>
            <Text style={styles.text}>{message}</Text>
            {subMessage ? (
              <Text style={styles.subText}>{subMessage}</Text>
            ) : (
              <></>
            )}
            {ButtonGroup && <ButtonGroup />}
          </View>
        </View>
      </Modal>
    </>
  );
};

export const MiddleButton = ({onPress, buttonText}) => {
  return (
    <>
      <TouchableOpacity style={styles.middleButton} onPress={onPress}>
        <Text style={styles.middleButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    </>
  );
};
export const LeftRightButton = ({left, right}) => {
  //TODO huimi change style
  return (
    <>
      <TouchableOpacity style={styles.middleButton} onPress={left.onPress}>
        <Text style={styles.middleButtonText}>{left.text}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.middleButton} onPress={right.onPress}>
        <Text style={styles.middleButtonText}>{right.text}</Text>
      </TouchableOpacity>
    </>
  );
};
export const UpDownButton = ({up, down}) => {
  //TODO huimi change style
  return (
    <>
      <TouchableOpacity style={styles.middleButton} onPress={up.onPress}>
        <Text style={styles.middleButtonText}>{up.text}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.middleButton} onPress={down.onPress}>
        <Text style={styles.middleButtonText}>{down.text}</Text>
      </TouchableOpacity>
    </>
  );
};

const {height, width} = Dimensions.get('window');
const statusBarHeight = getStatusBarHeight();

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  popUpContainer: {
    backgroundColor: '#FFFFFF',
    borderColor: '#00000029',
    borderWidth: 1,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.025,
    borderRadius: 20,
    justifyContent: 'center',
    position: 'absolute',
    top: height * 0.38,
    left: width * 0.1,
    right: width * 0.1,
  },
  text: {
    fontWeight: 'bold',
    fontSize: RFValue(14),
    lineHeight: RFValue(20),
    paddingBottom: height * 0.015,
    textAlign: 'left',
  },
  middleButton: {
    height: Platform.OS === 'ios' ? height * 0.05 : height * 0.06,
    width: width * 0.7,
    backgroundColor: '#468c64',
    borderRadius: 15,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: width * 0.02,
  },
  middleButtonText: {
    fontSize: RFValue(14),
    color: 'white',
    fontWeight: 'bold',
  },
  subText: {
    fontWeight: 'bold',
    fontSize: RFValue(12),
    marginBottom: height * 0.02,
    textAlign: 'left',
    color: '#707070',
  },
  blur: {
    width: width,
    height: height + statusBarHeight,
    backgroundColor: '#70707090',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MessageModal;
