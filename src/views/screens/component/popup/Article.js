import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Modal,
  Button
} from 'react-native';
import {getStatusBarHeight} from 'styles/ResponsiveFont';
import Feather from 'react-native-vector-icons/Feather';
import {themes} from 'utils/themeProvider';
import {ScrollView} from 'react-native-gesture-handler';
import ImageWithFallBack from '../ImageFallBack';

const Article = ({
  title,
  description,
  image,
  modalVisible,
  setModalVisible,
  type,
}) => {
  return (
    <>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        {modalVisible ? (
          <StatusBar backgroundColor={'#70707090'} barStyle="light-content" />
        ) : null}
          <View style={styles.blur}>
            <View style={styles.popUpContainer}>
              <TouchableWithoutFeedback>
                <View style={{flexDirection: 'row', overflow: 'hidden'}}>
                  <TouchableWithoutFeedback>
                    {type == 'notification' ? (
                      <ImageWithFallBack
                        type="notification"
                        source={image}
                        style={styles.imageSize}
                      />
                    ) : (
                      <ImageWithFallBack
                        type="feed"
                        source={image}
                        style={styles.imageSize}
                      />
                    )}
                  </TouchableWithoutFeedback>
                  <TouchableOpacity
                    onPress={() => setModalVisible(!modalVisible)}
                    style={styles.closeButton}>
                    <Feather name="x-circle" size={30} />
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback>
                <View style={[themes.BUTTON_GREEN, styles.wrap]}>
                  <Text style={[themes.EDIT_WHITE_TEXT, styles.text]}>{title}</Text>
                </View>
              </TouchableWithoutFeedback>
              <ScrollView>
                <View style={styles.row2}>
                  <Text style={{fontWeight: 'bold'}}>{description}</Text>
                </View>
              </ScrollView>
            </View>
          </View>
      </Modal>
    </>
  );
};

const {height, width} = Dimensions.get('window');
const statusBarHeight = getStatusBarHeight();

const styles = StyleSheet.create({
  popUpContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    position: 'relative',
    // left: width * 0.02,
    // right: width * 0.02,
    paddingBottom: height * 0.02,
    maxHeight: height * 0.8,
    marginHorizontal: 2
  },
  blur: {
    width: width,
    height: height,
    backgroundColor: '#70707090',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    alignItems: 'center'
  },
  closeButton: {
    position: 'absolute',
    right: width * 0.03,
    top: width * 0.03,
    zIndex: 1,
  },
  imageSize: {
    width: width,
    height: width * 0.9,
    resizeMode: 'cover',
    alignSelf: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  row2: {
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
  },
  wrap: {
    justifyContent: 'center',
    height: height * 0.04,
    paddingHorizontal: width * 0.04,
  },
});

export default Article;
