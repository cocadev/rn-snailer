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
import RNPickerSelect from 'react-native-picker-select';

import {themes} from 'utils/themeProvider';

const SelectPreciseLocation = ({title, label, modalVisible, ButtonGroup}) => {
  
  return (
    <SafeAreaView>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <StatusBar backgroundColor="#707070" barStyle="light-content" />
        <View style={styles.popUpContainer}>
          <View style={styles.titleWrap}>
            <Text style={styles.text}>{title}</Text>
          </View>
          <View
            style={{
              height: height * 0.001,
              backgroundColor: '#B2B2B2',
            }}></View>
          <View style={[themes.GREEN_BOARDER, styles.pickerInput]}>
            <RNPickerSelect
              placeholder={{}}
              items={label}
            />
          </View>

          {ButtonGroup && <ButtonGroup />}
        </View>
      </Modal>
    </SafeAreaView>
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
// export const LeftRightButton = ({left, right}) => {
//   return (
//     <>
//       <TouchableOpacity style={styles.middleButton} onPress={left.onPress}>
//         <Text style={styles.middleButtonText}>{left.text}</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.middleButton} onPress={right.onPress}>
//         <Text style={styles.middleButtonText}>{right.text}</Text>
//       </TouchableOpacity>
//     </>
//   );
// };
// export const UpDownButton = ({up, down}) => {
//   return (
//     <>
//       <TouchableOpacity style={styles.upButton} onPress={up.onPress}>
//         <Text style={styles.upButtonText}>{up.text}</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.downButton} onPress={down.onPress}>
//         <Text style={styles.downButtonText}>{down.text}</Text>
//       </TouchableOpacity>
//     </>
//   );
// };

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  popUpContainer: {
    width: width * 0.95,
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    // paddingLeft: width * 0.05,
    // paddingRight: width * 0.05,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.02,
    borderRadius: 20,
    justifyContent: 'center',
    position: 'absolute',
    bottom: height * 0.03,
    left: width * 0.02,
    right: width * 0.02,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  titleWrap: {
    flexDirection: 'row',
    paddingBottom: height * 0.02,
    alignItems: 'center',
    alignSelf: 'center',
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
  },
  text: {
    fontWeight: 'bold',
    fontSize: RFValue(20),
    textAlign: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  middleButton: {
    width: width * 0.6,
    backgroundColor: '#468c64',
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        alignItems: 'center',
        lineHeight: width * 0.12,
        height: width * 0.12,
      },
      android: {
        textAlignVertical: 'center',
        height: width * 0.13,
      },
      default: {
        alignItems: 'center',
        textAlignVertical: 'center',
      },
    }),
  },
  middleButtonText: {
    fontSize: RFValue(14),
    color: 'white',
    fontWeight: 'bold',
  },
  pickerInput: {
    borderWidth: 1.2,
    borderRadius: 5,
    fontSize: RFValue(13),
    marginHorizontal: width * 0.03,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.6,
    elevation: 4,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        paddingHorizontal: width * 0.02,
        marginVertical: height * 0.02,

        height: height * 0.05,
      },
      android: {
        height: height * 0.07,
        marginVertical: height * 0.03,
      },
    }),
  },
});

export default SelectPreciseLocation;
