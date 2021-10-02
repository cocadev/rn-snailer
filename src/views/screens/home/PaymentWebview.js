import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, Dimensions, BackHandler} from 'react-native';
import {WebView} from 'react-native-webview';
import NavBar, {LeftButton} from '../component/NavBar';
import {useTranslation} from 'react-i18next';
import {Loader} from '../component/Loader';
import {paymentRedirectURL} from '../../../../config';
import DeleteModal, {
  LeftRightButton,
} from '../component/popup/DeleteConfirmationModal';
const PaymentWebview = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const [progress, setProgress] = useState(0);
  const [modalLoader, setModalLoader] = useState(false);
  const order_id = route.params?.order_id;
  const type = route.params?.type;
  const origin = route.params?.origin ? route.params.origin : null;
  const webRef = useRef();
  const [modalNaviVisible, setModalNaviVisible] = useState(false);

  const handleLeftNavButton = () => {
    setModalNaviVisible(true);
  };
  const stayScreen = () => {
    setModalNaviVisible((prev) => !prev);
  };

  const returnLastScreen = () => {
    navigation.navigate(origin ? origin : 'ProductDetail', {
      test: order_id,
    });
  };
  const ButtonNaviBackGroup = () => {
    const left = {
      text: t('no'),
      onPress: stayScreen,
    };
    const right = {
      text: t('yes'),
      onPress: () => {
        setModalNaviVisible(false);
        returnLastScreen();
      },
    };
    return LeftRightButton({option: 'GREEN', left, right});
  };
  const handleWebViewNavigationStateChange = (newNavState) => {
    const {url} = newNavState;
    if (
      url == `${paymentRedirectURL}/payment/response.asp` ||
      url == 'https://www.thesnailer.com/payment/response.asp'
    ) {
      returnLastScreen();
    }
  };
  useEffect(() => {
    const backAction = () => {
      handleLeftNavButton();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <NavBar
      title={t('payment')}
      {...{
        LeftButton,
        handleLeftNavButton,
        progress,
      }}>
      <DeleteModal
        {...{
          message: t('clear_filled_information_title'),
          subMessage: t('payment_cancel_warning'),
          modalVisible: modalNaviVisible,
          setModalVisible: setModalNaviVisible,
          ButtonGroup: ButtonNaviBackGroup,
        }}
      />
      <Loader loading={modalLoader} />
      <WebView
        ref={webRef}
        onLoadProgress={({nativeEvent}) => {
          setProgress(nativeEvent.progress);
        }}
        onLoadStart={({nativeEvent}) => {
          if (
            nativeEvent.url === `${paymentRedirectURL}/${type}/${order_id}` ||
            nativeEvent.url === 'https://payment.ipay88.com.my/ePayment/entry.asp' )
            console.log(nativeEvent.url)
            setModalLoader(true);
        }}
        onLoadEnd={() => {
          setModalLoader(false);
        }}
        style={{
          height: height * (1 - 0.12),
          width: width,
          opacity: 0.99,
          overflow: 'hidden',
        }}
        source={{uri: `${paymentRedirectURL}/${type}/${order_id}`}}
        onNavigationStateChange={handleWebViewNavigationStateChange}
      />
    </NavBar>
  );
};

export default PaymentWebview;

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    paddingTop: height * 0.01,
    justifyContent: 'flex-end',
  },
  backButton: {
    marginTop: height * 0.03,
    height: height * 0.065,
    width: height * 0.065,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
