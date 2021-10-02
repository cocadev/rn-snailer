import React, {useState, useContext, useEffect} from 'react';
import {StyleSheet, View, Dimensions, ScrollView} from 'react-native';

import {Loader} from '../../component/Loader';
import {RFValue} from 'styles/ResponsiveFont';
import {useTranslation} from 'react-i18next';

import NavBar, {LeftButton, RightButton} from '../../component/NavBar';
import ParcelOrderForm from '../../component/parcel/ParcelOrderForm';
import {getParcelByID} from '../../../../services/parcel';
import createPDF from './pdf/PDF';
import QRCode from 'react-native-qrcode-svg';
import {formatDate} from '../../../../utils/helper';
import {findCityAndState} from './pdf/postcode';
import { Alert } from 'react-native';

const ParcelOrderDetail = ({navigation, route}) => {
  const [qrCodeRef, setRef] = useState();
  const {t, i18n} = useTranslation();
  const order_id = route.params?.order_id;
  const noPrice = route.params?.noPrice || false;
  const [order, setOrder] = useState(
    route.params?.viewOrder ? route.params?.viewOrder : null,
  );
  const [loading, setLoading] = useState(false);
  const [rightButtonStatus, setRightButton] = useState('none');
  const [senderState, setSenderState] = useState();
  const [receiverState, setReceiverState] = useState();

  const handleLeftNavButton = () => {
    route.params?.origin
      ? navigation.goBack()
      : navigation.navigate('HomePage');
  };

  const handleGetOrder = async () => {
    try {
      setLoading(true);
      const results = await getParcelByID({parcelID: order_id, t});
      if (results) {
        setOrder(results);

        let senderCityState = findCityAndState(
          results.sender.postcode.toString(),
        );
        setSenderState(senderCityState.state);
        let receiverCityState = findCityAndState(
          results.receiver.postcode.toString(),
        );
        setReceiverState(receiverCityState.state);

        if (results.status != 'cancelled_by_payment_system') {
          setRightButton('PDF');
        }
      }
    } catch (err) {
      console.log(
        'ParcelOrderDetail -> handleGetOrder err',
        JSON.stringify(err),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePDF = () => {
    setLoading(true);
    var barcodeData =
      'http://bwipjs-api.metafloor.com/?bcid=code128&text=' + order_id;

    qrCodeRef.toDataURL(async (qrData) => {
      let file = await createPDF({
        weight: order.weight,
        order_id: order._id,
        tracking_no: order.tracking_no,
        sender: order.sender,
        receiver: order.receiver,
        courier_name: order.courier_name,
        item_name: order.title,
        parcel_type: order.parcel_type,
        qrcode: qrData,
        barcode: barcodeData,
        t,
      });

      if (file) {
        setLoading(false);
      }
    });
  };

  const generateQRcode = () => {
    return (
      <QRCode
        getRef={(ref) => {
          setRef(ref);
        }}
        value={order_id}
        size={200}
        bgColor="#FFFFFF"
        fgColor="#000000"
        style={styles.qrCode}
      />
    );
  };

  const handleRightNavButton = () => {
    handleCreatePDF();
  };

  useEffect(() => {
    if (order_id) {
      handleGetOrder();
    }
  }, []);

  const navigateToTrackingDetail = () => {
    if(!order.status.match("cancel"))
      navigation.navigate('TrackingDetail', {trackingNo: order.tracking_no});
    else
      Alert.alert(t('reminder'), t('cancelled_parcel'));
  };

  return (
    <>
      <Loader {...{loading}} />
      <NavBar
        title={t('order_detail')}
        {...{
          LeftButton,
          handleLeftNavButton,
          RightButton: RightButton({
            button: rightButtonStatus,
            handleRightNavButton,
          }),
        }}>
        <View style={{flex: 1}}>
          <ScrollView scrollIndicatorInsets={{right: 1}}>
            <View style={{marginBottom: height * 0.15}}>
              {order ? (
                <>
                  <ParcelOrderForm
                    navigateToTrackingDetail={navigateToTrackingDetail}
                    // title={t(
                    //   'Please show this QR code when rider took your order',
                    // )}
                    order_id={order_id}
                    status={order.status}
                    waybill={order.tracking_no}
                    package_name={order.title}
                    weight={order.weight}
                    receiver_name={order.receiver.name}
                    receiver_phone={order.receiver.contact}
                    receiver_address={order.receiver.full_address}
                    receiver_state={receiverState}
                    sender_name={order.sender.name}
                    sender_phone={order.sender.contact}
                    sender_address={order.sender.full_address}
                    sender_state={senderState}
                    total={order.amount.total}
                    remark={order.rider_remark}
                    update_time={formatDate({
                      timeStamp: order.update_time,
                      type: 'DD/MM/YY, HH:mm',
                    })}
                    noPrice={noPrice}
                    delivery
                    qrCode={generateQRcode()}
                  />
                </>
              ) : null}
            </View>
          </ScrollView>
        </View>
      </NavBar>
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  reportButton: {
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
});

export default ParcelOrderDetail;
