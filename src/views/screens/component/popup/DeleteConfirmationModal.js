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
import {themes} from 'utils/themeProvider';

const DeleteConfirmationModal = ({
  message,
  subMessage,
  modalVisible,
  ButtonGroup,
}) => {
  return (
    <>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
      {modalVisible ? (
        <StatusBar backgroundColor={'#70707090'} barStyle="light-content" />
      ) : null}
        <View style={styles.blur} >
        <View style={styles.popUpContainer}>
          <Text style={styles.text}>{message}</Text>
          <Text style={styles.subText}>{subMessage}</Text>
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
export const LeftRightButton = ({option, left, right}) => {
  switch (option) {
    case "RED":
      return (
      <View style={styles.leftrightWrap}>
        <TouchableOpacity style={[styles.leftrightbtn]} onPress={left.onPress}>
          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>{left.text}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[themes.RED_BUTTON, styles.leftrightbtn]}
          onPress={right.onPress}>
          <Text style={styles.rightButtonText}>{right.text}</Text>
        </TouchableOpacity>
      </View>
      )
      case "GREEN":
        return (
        <View style={styles.leftrightWrap}>
          <TouchableOpacity style={[styles.leftrightbtn]} onPress={left.onPress}>
            <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>{left.text}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[themes.GREEN_BUTTON, styles.leftrightbtn]}
            onPress={right.onPress}>
            <Text style={styles.rightButtonText}>{right.text}</Text>
          </TouchableOpacity>
        </View>
        )
  }

};

export const UpDownButton = ({up, down}) => {
  return (
    <>
      <TouchableOpacity style={styles.upButton} onPress={up.onPress}>
        <Text style={styles.upButtonText}>{up.text}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.downButton} onPress={down.onPress}>
        <Text style={styles.downButtonText}>{down.text}</Text>
      </TouchableOpacity>
    </>
  );
};

const {height, width} = Dimensions.get('window');
const statusBarHeight = getStatusBarHeight();

const styles = StyleSheet.create({
  popUpContainer: {
    backgroundColor: '#FFFFFF',
    borderColor: '#B2B2B2',
    borderWidth: 1,
    paddingHorizontal: width * 0.05,
    paddingVertical: Platform.OS === 'ios' ? height * 0.03 : height * 0.035,
    borderRadius: 20,
    justifyContent: 'center',
    position: 'absolute',
    top: height * 0.33,
    left: width * 0.06,
    right: width * 0.06,
  },
  text: {
    fontWeight: 'bold',
    fontSize: RFValue(18),
    textAlign: 'left',
  },
  subText: {
    fontWeight: 'bold',
    fontSize: RFValue(14),
    marginVertical: height * 0.03,
    textAlign: 'left',
    color: '#B2B2B2',
  },
  upButton: {
    backgroundColor: '#D11A2A',
    borderRadius: 30,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginVertical: height * 0.01,
    ...Platform.select({
      ios: {
        height: height * 0.05,
        width: width * 0.7,
      },
      android: {
        height: height * 0.08,
        width: width * 0.7,
      },
      default: {
        height: height * 0.04,
        width: width * 0.7,
      },
    }),
  },
  upButtonText: {
    fontSize: RFValue(14),
    color: 'white',
    fontWeight: 'bold',
  },
  downButton: {
    backgroundColor: 'white',
    borderColor: '#707070',
    borderWidth: 1,
    borderRadius: 30,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        height: height * 0.05,
        width: width * 0.7,
      },
      android: {
        height: height * 0.08,
        width: width * 0.7,
      },
      default: {
        height: height * 0.04,
        width: width * 0.7,
      },
    }),
  },
  downButtonText: {
    fontSize: RFValue(14),
    color: '#707070',
    fontWeight: 'bold',
  },
  leftrightWrap: {
    flexDirection: 'row',
  },
  leftrightbtn: {
    borderWidth: 1,
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: width * 0.35,
    height: Platform.OS === 'ios' ? height * 0.05 : height * 0.065,
    marginHorizontal: width * 0.02,
  },
  rightButtonText: {
    fontSize: RFValue(14),
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  blur: {
    width: width,
    height: height + statusBarHeight,
    backgroundColor: '#70707090',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DeleteConfirmationModal;
