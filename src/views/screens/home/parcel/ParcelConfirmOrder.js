import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  ScrollView,
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';

import NavBar, {LeftButton, RightButton} from '../../component/NavBar';
import ParcelOrderForm from '../../component/parcel/ParcelOrderForm';

import Cash from '../../../../assets/icons/payment-cash.png';
import Online from '../../../../assets/icons/payment-onlinebanking.png';
import Wallet from '../../../../assets/icons/payment-snailerwallet.png';
import {ParcelOrderContext} from 'states/context/parcelOrder.context';
import createPDF from './pdf/PDF';
import QRCode from 'react-native-qrcode-svg';
import {Loader} from '../../component/Loader';
import {formatDate} from '../../../../utils/helper';
import {findCityAndState} from './pdf/postcode';

const ParcelConfirmOrder = ({navigation, route}) => {
  const [qrCodeRef, setRef] = useState();
  const {parcelOrder, dispatchParcelOrder} = useContext(ParcelOrderContext);
  const {parcel, detail} = route.params;
  const {t, i18n} = useTranslation();
  const [loading, setLoading] = useState(false);
  const senderState = parcelOrder?.sender?.postcode
    ? findCityAndState(parcelOrder.sender.postcode)
    : null;
  const receiverState = parcelOrder?.receiver?.postcode
    ? findCityAndState(parcelOrder.receiver.postcode)
    : null;

  const handleLeftNavButton = () => {
    navigateToParcelScreen();
  };

  const navigateToParcelScreen = () => {
    dispatchParcelOrder({type: 'CLEAR_ALL'});
    navigation.navigate('ParcelScreen');
  };

  const navigateToTrackingDetail = () => {
    navigation.navigate('TrackingDetail', {trackingNo: parcel.tracking_no});
  };

  const handleCreatePDF = () => {
    setLoading(true);
    var barcodeData =
      'http://bwipjs-api.metafloor.com/?bcid=code128&text=' + parcel._id;

    qrCodeRef.toDataURL(async (qrData) => {
      let file = await createPDF({
        weight: parcel.parcel_orders.weight,
        order_id: parcel._id,
        tracking_no: parcel.tracking_no,
        sender: parcel.parcel_orders.sender,
        receiver: parcel.parcel_orders.receiver,
        courier_name: parcel.parcel_orders.courier_name,
        item_name: parcel.parcel_orders.title,
        parcel_type: parcel.parcel_orders.parcel_type,
        qrcode: qrData,
        barcode: barcodeData,
        t,
      });

      if (file) {
        setLoading(false);
      }
    });
  };

  const handleRightNavButton = () => {
    handleCreatePDF();
  };

  const generateQRcode = () => {
    return (
      <QRCode
        getRef={(ref) => {
          setRef(ref);
        }}
        value={parcel._id}
        size={200}
        bgColor="#FFFFFF"
        fgColor="#000000"
        style={styles.qrCode}
      />
    );
  };

  return (
    <>
      <NavBar
        title={t('confirm_order')}
        {...{
          LeftButton,
          handleLeftNavButton,
          RightButton: RightButton({button: 'PDF', handleRightNavButton}),
        }}>
        <Loader {...{loading}} />
        <ScrollView>
          <ParcelOrderForm
            navigateToTrackingDetail={navigateToTrackingDetail}
            order_id={parcel._id}
            status={parcel.status}
            waybill={parcel.tracking_no}
            package_name={parcel.parcel_orders.title}
            weight={parcel.parcel_orders.weight}
            receiver_name={parcel.parcel_orders.receiver.name}
            receiver_phone={parcel.parcel_orders.receiver.contact}
            receiver_address={parcel.parcel_orders.receiver.full_address}
            receiver_state={receiverState?.state}
            sender_name={parcel.parcel_orders.sender.name}
            sender_phone={parcel.parcel_orders.sender.contact}
            sender_address={parcel.parcel_orders.sender.full_address}
            sender_state={senderState?.state}
            total={parcel.amount.total}
            remark={parcel.parcel_orders.rider_remark}
            update_time={formatDate({
              timeStamp: parcel.update_time,
              type: 'DD/MM/YY, HH:mm',
            })}
            qrCode={generateQRcode()}
          />
          {parcelOrder.promoCode == '' ? null : (
            <>
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.headerTitle]}>
                {t('promo_code')}
              </Text>
              <View style={[themes.BACKGROUND_WHITE_WRAP]}>
                <TextInput
                  style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.textInput]}
                  autoCorrect={false}
                  defaultValue={parcelOrder.promoCode}
                />
              </View>
            </>
          )}

          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.headerTitle]}>
            {t('payment_details')}
          </Text>
          <View style={[themes.BACKGROUND_WHITE_WRAP, styles.paymentContainer]}>
            <Image
              source={
                parcel.payment_method == 'cash'
                  ? Cash
                  : parcel.payment_method == 'wallet'
                  ? Wallet
                  : Online
              }
            />
            <Text style={[themes.EDIT_GREEN_TEXT, styles.textStyle]}>
              {parcel.payment_method == 'cash'
                ? t('cash')
                : parcel.payment_method == 'wallet'
                ? t('wallet')
                : t('online')}
            </Text>
          </View>
        </ScrollView>
        <TouchableOpacity
          onPress={navigateToParcelScreen}
          style={[themes.GREEN_BUTTON, styles.continueButton]}>
          <Text style={[themes.EDIT_WHITE_TEXT, styles.buttonText]}>
            {t('continue')}
          </Text>
        </TouchableOpacity>
      </NavBar>
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  continueButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    height: width * 0.125,
    width: width * 0.75,
    bottom: width * 0.1,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: RFValue(14),
  },
  headerTitle: {
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
    fontSize: RFValue(13),
  },
  paymentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: height * 0.15,
  },
  textStyle: {
    alignSelf: 'center',
    paddingHorizontal: width * 0.01,
  },
  textInput: {
    fontSize: RFValue(12),
    textAlign: 'justify',
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
  },
});

export default ParcelConfirmOrder;
