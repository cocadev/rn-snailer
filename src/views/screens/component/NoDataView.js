import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    View,
    Image,
  } from 'react-native';
  import React from 'react';
  import {RFValue} from 'styles/ResponsiveFont';
  import {useTranslation} from 'react-i18next';
  import {themes} from 'utils/themeProvider';
  
  export const NoDataView = ({buttonText, buttonOnPress, title, subTitle}) => {
    const {t, i18n} = useTranslation();
  
    return (
      <View style={styles.nodataWrap}>
        <Image source={require('../../../assets/images/nodataview.png')} />
        <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.titleText]}>
          {title ? title : t('no_data_available')}
        </Text>
        <Text style={[themes.TEXT_TITLE_GREY, styles.text]}>
          {subTitle ? subTitle : t('no_data_explain')}
        </Text>
        {buttonText && (
          <TouchableOpacity
            style={[
              styles.middleButton,
              themes.SHADOW_DEFAULT,
              themes.BUTTON_GREEN,
            ]}
            onPress={buttonOnPress}>
            <Text style={styles.middleButtonText}>{buttonText}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  const {height, width} = Dimensions.get('window');
  
  const styles = StyleSheet.create({
    nodataWrap: {
      alignItems: 'center',
      marginBottom: width * 0.3,
      paddingHorizontal: width * 0.04,
    },
    middleButton: {
      height: height * 0.05,
      width: width * 0.5,
      backgroundColor: '#0E9F4A',
      borderRadius: 20,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      marginTop: width * 0.02,
    },
    titleText: {
      marginBottom: width * 0.02,
      fontSize: RFValue(15),
    },
    text: {
      fontSize: RFValue(13),
    },
  });
  