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

import NavBar, {LeftButton} from '../../component/NavBar';

import SelectPreciseLocation, {
  MiddleButton,
  UpDownButton,
} from '../../component/map/SelectPreciseLocation';

import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';

const MapScreen = ({navigation}) => {
  const handleLeftNavButton = () => {
    navigation.goBack();
  };
  const {t, i18n} = useTranslation();

  const [modalVisible, setModalVisible] = useState(true);

  const handleModalButton = () => {
    navigation.goBack();
  };
  const modalMessage = t('select_a_precise_location_for_faster_delivery');
  const label = [{label: 'Home'}, {label: 'Work'}, {label: 'KL ECO CITY'}, {label: 'Mercu 1'}]
  const ButtonGroup = () => {
    return MiddleButton({onPress: handleModalButton, buttonText: t('confirm')});
  };

  return (
    <NavBar
      title="KL ECO CITY (KLEC)"
      {...{
        LeftButton,
        handleLeftNavButton,
      }}>
      <SelectPreciseLocation
        {...{
          title: modalMessage,
          label: label,
          navigation,
          modalVisible,
          setModalVisible,
          ButtonGroup,
        }}
      />
    </NavBar>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({});

export default MapScreen;
