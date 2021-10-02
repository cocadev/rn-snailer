import React, {useContext} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  Text,
  ScrollView,
} from 'react-native';
import {RFValue} from 'styles/ResponsiveFont';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';
import ImagePicker from 'react-native-image-crop-picker';
import NavBar, {LeftButton} from '../../component/NavBar';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {MoveOrderContext} from '../../../../states/context/moveOrder.context';
import {FlatList} from 'react-native-gesture-handler';

const MoveAddImage = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {moveOrder, dispatchMoveOrder} = useContext(MoveOrderContext);

  const handleLeftNavButton = () => {
    if (moveOrder.move_image.length > 5)
      alert(t('maximum_4_image_allow') + t('remove_images'));
    else navigation.goBack();
  };

  const handleAddImage = async () => {
    if (moveOrder.move_image.length >= 4) alert(t('maximum_4_image_allow'));
    else {
      try {
        const image = await ImagePicker.openPicker({
          multiple: true,
          compressImageQuality: 0.5,
          maxFiles: 4 - moveOrder.move_image.length,
        });
        dispatchMoveOrder({
          type: 'ADD_IMAGE',
          payload: image,
        });
      } catch (error) {
        console.log('handleAddImage -> error', error);
      } finally {
      }
    }
  };

  const handleAddImageCam = async () => {
    if (moveOrder.move_image.length >= 4) alert(t('maximum_4_image_allow'));
    else {
      try {
        const image = await ImagePicker.openCamera({
          cropping: true,
          compressImageQuality: 0.5,
        });
        dispatchMoveOrder({
          type: 'ADD_IMAGE',
          payload: [image],
        });
      } catch (error) {
        console.log('handleAddImage -> error', error);
      } finally {
      }
    }
  };

  const handleDeleteImage = (x) => {
    try {
      dispatchMoveOrder({
        type: 'DELETE_IMAGE',
        payload: x,
      });
    } catch (e) {
      console.log('handleDeleteImage -> e', e);
    }
  };

  return (
    <NavBar title={t('add_images')} {...{LeftButton, handleLeftNavButton}}>
      <ScrollView>
        <View
          style={[
            themes.GREEN_BOARDER,
            themes.BACKGROUND_WHITE_WRAP,
            themes.SHADOW_DEFAULT,
            styles.orderDetailWrap,
          ]}>
          <View style={[themes.GREEN_BOARDER_BOTTOM, {borderBottomWidth: 1}]}>
            <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.title]}>
              {t('images')}
            </Text>
          </View>
          <View style={{height: 8}}></View>
          <View>
            <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.subTitle]}>
              {t('upload_at_least_one_image_for_your_order')}
            </Text>
            <TouchableOpacity
              style={themes.SHADOW_DEFAULT}
              onPress={handleAddImage}>
              <Text
                style={[
                  themes.GREEN_BOARDER,
                  themes.EDIT_GREEN_TEXT,
                  styles.addImage,
                ]}>
                {t('add_images_from_library')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={themes.SHADOW_DEFAULT}
              onPress={handleAddImageCam}>
              <Text
                style={[
                  themes.GREEN_BOARDER,
                  themes.EDIT_GREEN_TEXT,
                  styles.addImage,
                ]}>
                {t('add_images_using_camera')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{}}>
            {moveOrder && (
              <FlatList
                data={moveOrder.move_image}
                keyExtractor={(item, value) => value.toString()}
                numColumns={2}
                renderItem={({item, index}) => {
                  return (
                    <View style={styles.imageWrapRow}>
                      <View style={styles.imageCol1}>
                        <Image source={{uri: item.path}} style={styles.image} />
                        <TouchableOpacity
                          style={[styles.imageRightButton, themes.BUTTON_GREEN]}
                          onPress={() => handleDeleteImage(item)}>
                          <Ionicons
                            name="close"
                            size={18}
                            style={themes.ICON_COLOR_WHITE}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }}
              />
            )}
          </View>
        </View>

        <TouchableOpacity
          style={themes.SHADOW_DEFAULT}
          onPress={handleLeftNavButton}>
          <Text style={[themes.GREEN_BUTTON, styles.nextButton]}>
            {t('next')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </NavBar>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: width * 0.03,
    paddingBottom: height * 0.01,
  },
  orderDetailWrap: {
    marginTop: height * 0.045,
    marginHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
    borderWidth: 1,
    borderRadius: 10,
  },
  subTitle: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.01,
  },
  addImage: {
    backgroundColor: 'white',
    width: width * 0.5,
    alignSelf: 'center',
    textAlign: 'center',
    borderRadius: 20,
    borderWidth: 1,
    fontSize: RFValue(12),
    fontWeight: 'bold',
    overflow: 'hidden',
    marginVertical: height * 0.015,
    ...Platform.select({
      ios: {
        alignItems: 'center',
        lineHeight: width * 0.1,
        height: width * 0.11,
      },
      android: {
        textAlignVertical: 'center',
        height: height * 0.065,
      },
      default: {
        alignItems: 'center',
        textAlignVertical: 'center',
      },
    }),
  },
  nextButton: {
    width: width * 0.6,
    alignSelf: 'center',
    textAlign: 'center',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    fontSize: RFValue(14),
    fontWeight: 'bold',
    marginVertical: height * 0.025,
    ...Platform.select({
      ios: {
        alignItems: 'center',
        lineHeight: width * 0.1,
        height: width * 0.11,
      },
      android: {
        textAlignVertical: 'center',
        height: height * 0.065,
      },
      default: {
        alignItems: 'center',
        textAlignVertical: 'center',
      },
    }),
  },
  imageWrapRow: {
    flexDirection: 'row',
    marginVertical: height * 0.02,
    marginHorizontal: width * 0.03,
    justifyContent: 'space-between',
  },
  imageCol1: {
    width: width * 0.4,
    height: width * 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width * 0.4,
    height: width * 0.4,
  },
  imageRightButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.05,
    height: width * 0.05,
    right: 0,
    top: 0,
  },
  imageWrapper: {
    resizeMode: 'contain',
    height: width * 0.4,
    width: width * 0.4,
    marginVertical: width * 0.01,
    marginHorizontal: width * 0.01,
    borderRadius: 5,
    overflow: 'hidden',
  },
});

export default MoveAddImage;
