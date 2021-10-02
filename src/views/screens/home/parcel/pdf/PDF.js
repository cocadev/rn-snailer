import {Platform, PermissionsAndroid} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {findCityAndState} from '../pdf/postcode';
import {formatDate} from '../../../../../utils/helper';
import {Image} from 'react-native';
import FileViewer from 'react-native-file-viewer';

const detail = ({
  weight,
  order_id,
  tracking_no,
  sender,
  receiver,
  courier_name,
  item_name,
  parcel_type,
  qrcode,
  barcode,
  city,
}) =>
  `<!doctype html>
  <html>
  
  <head>
      <script type="text/javascript" src="jquery.min.js"></script>
      <script type="text/javascript" src="qrcode.min.js"></script>
  </head>
  
  <body>
      <div class="invoice-box">
          <div class="invoice-border">
              <table cellpadding="0" cellspacing="0">
                  <tr class=top>
                      <td class="logo">
                          <!-- <img src="./logo.png"> -->
                          <img src="https://www.thesnailer.com/CompanyIdentity/SnailerLogo.png">
                      </td>
                      <td class="barcode">
                          <img src="${barcode}" width="250" height="25" />
                      </td>
                  </tr>
              </table>
              <div class="parcel-detail">
                  <table>
                      <tr>
                          <td>
                              <div class="left-col">
                                  <div class=detail-container>
                                      <div class="order-detail">
                                          <div>
                                              <div class=title>
                                                  Order Detail
                                              </div>
                                          </div>
                                          <div class="input-container">
                                              <div class=input-detail>
                                                  <div>
                                                      Ship by date: 
                                                  </div>
                                                  <div>
                                                      Weight: ${(
                                                        weight / 1000
                                                      ).toFixed(2)} KG
                                                  </div>
                                                  <div>
                                                      Order ID: <span style="color:#468c64">${order_id}</span>
                                                  </div>
                                                  <div>
                                                      Tracking No: <span style="color:#468c64">${tracking_no}</span>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
  
                                  <div class=detail-container>
                                      <div class="sender-detail">
                                          <div class=title>
                                              Sender Detail
                                          </div>
                                          <div class="input-container">
                                              <div class="input-detail">
                                                  <div>
                                                      Name: ${sender.name}
                                                  </div>
                                                  <div>
                                                      Phone: ${sender.contact}
                                                  </div>
                                                  <div>
                                                      Address: ${
                                                        sender.full_address
                                                      }
                                                  </div>
                                                  <div>
                                                      Postcode: ${
                                                        sender.postcode
                                                      }
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
  
                                  <div class=detail-container>
                                      <div class="receiver-detail">
                                          <div class=title>
                                              Receiver Detail
                                          </div>
                                          <div class="input-container">
                                              <div class="input-detail">
                                                  <div>
                                                      Name: ${receiver.name}
                                                  </div>
                                                  <div>
                                                      Phone: ${receiver.contact}
                                                  </div>
                                                  <div>
                                                      Address: ${
                                                        receiver.full_address
                                                      }
                                                  </div>
                                                  <div>
                                                      Postcode: ${
                                                        receiver.postcode
                                                      }
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
  
                                  <div class=detail-container>
                                      <div class="pod">
  
                                          <div class=title>
                                              POD
                                          </div>
                                          <div class="input-container">
                                              <div class="input-detail">
                                                  <div>
                                                      Name:
                                                  </div>
                                                  <div>
                                                      IC:
                                                  </div>
                                                  <div>
                                                      Signature:
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </td>
                          <td>
                              <div class="right-col">
                                  <div class=detail-container>
                                      <div class="order-detail-courier">
                                          <div class=title>
                                              Order Detail (Courier)
                                          </div>
                                          <div class="input-container">
                                              <div class="input-detail">
                                                  <div>
                                                      Courier service:
                                                      <div style="font-size: 16px;">${courier_name}</div>
                                                  </div>
                                                  <div>
                                                      Parcel Name:
                                                      <div>${item_name}</div>
                                                  </div>
                                                  <div>
                                                      Type: ${parcel_type}
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
  
                                  <div class=detail-container>
                                      <div class="parcel-info">
                                          <div class=parcel-info-title>
                                          ${city}
                                          </div>
                                          <div class="input-container">
                                              <div class="parcel-input-detail">
                                                  <div
                                                      style="font-size: 30px; padding-bottom: 100px; letter-spacing: 1px;">
                                                      ${receiver.postcode}
                                                  </div>
                                                  <div style="padding-bottom: 50px;">
                                                  <img src="data:image/png;base64, ${qrcode}" style="width:50%;" />
                                                  </div>
                                                  <div>
  
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </td>
                      </tr>
                  </table>
              </div>
          </div>
      </div>
  </body>
  
  <style>
      .invoice-box {
          max-width: 550px;
          margin: auto;
          padding: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, .15);
          font-size: 10px;
          line-height: 24px;
          font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
          color: #000;
          font-weight: bold;
      }
  
      .invoice-border {
          border: 3px solid #468c64;
      }
  
      .invoice-border table {
          padding-left: 20px;
      }
  
      .invoice-border table tr td.barcode {
          padding-top: 20px;
          padding-left: 100px;
          float: right;
      }
  
      .logo img {
          padding-top: 10px;
          padding-left: 10px;
          width: 100%;
          max-width: 100px;
      }
  
      .detail-container {
          padding: 3px;
      }
  
      .order-detail {
          border: 1px solid #468c64;
          border-radius: 5px;
          width: 280px;
      }
  
      .sender-detail {
          border: 1px solid #468c64;
          border-radius: 5px;
          width: 280px;
          height: 209.5px;
      }
  
      .receiver-detail {
          border: 1px solid #468c64;
          border-radius: 5px;
          width: 280px;
          height: 209.5px;
      }
  
      .pod {
          border: 1px solid #468c64;
          border-radius: 5px;
          width: 280px;
      }
  
      .order-detail-courier {
          border: 1px solid #468c64;
          border-radius: 5px;
          width: 180px;
      }
  
      .parcel-info {
          border: 1px solid #468c64;
          border-radius: 5px;
          width: 180px;
          height: 519px;
      }
  
      .parcel-info-title {
          color: #000;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
          padding-top: 4px;
          padding-bottom: 4px;
          font-size: 16px;
          text-align: center;
          border-bottom: 1px solid #468c64;
      }
  
      .title {
          color: #000;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
          padding-left: 10px;
          padding-top: 2px;
          padding-bottom: 2px;
          font-size: 14px;
          border-bottom: 1px solid #468c64;
      }
  
      /* .parcel-detail .left-col {
          padding-left: 7px;
       } */
  
      /* .parcel-detail .right-col {
          position: absolute;
          top: 125px;
          right: 400px;
      } */
  
      .input-container {
          padding-top: 5px;
          padding-bottom: 5px;
      }
  
      .input-detail {
          padding-left: 10px;
          display: inline-block;
      }
  
      .parcel-input-detail {
          padding: 20px;
          text-align: center;
      }
  </style>
  
  </html>`;

export default createPDF = async ({
  weight,
  order_id,
  tracking_no,
  sender,
  receiver,
  courier_name,
  item_name,
  parcel_type,
  qrcode,
  barcode,
  t,
}) => {
  const cityState = findCityAndState(receiver.postcode.toString());

  let options = {
    html: detail({
      weight,
      order_id,
      tracking_no,
      sender,
      receiver,
      courier_name,
      item_name,
      parcel_type,
      qrcode,
      barcode,
      city: cityState.city,
    }),
    fileName: `${order_id}`,
    directory: 'Documents',
  };

  let file = null;
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        file = await RNHTMLtoPDF.convert(options);
        alert(t('file_saved') + file.filePath);
      } else {
        alert(t('storage_permission_required'));
      }
    } else {
      file = await RNHTMLtoPDF.convert(options);
      alert(t('file_saved') + file.filePath);
    }
    if (file) {
      try {
        const response = await FileViewer.open(file.filePath);
      } catch (error) {
        console.log('🚀 ~ error', error);
      }
    }
  } catch (err) {
    console.log('PDF -> error', err);
  }

  return file;
};
