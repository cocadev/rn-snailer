import {WS_BASE_URL} from '../../config';

class WSS {
  static init(
    _updateOrderStatus,
    _riderAcceptedOrder,
    _syncRiderLocationSuccess,
  ) {
    if (!this.ws) {
      this.ws = new WebSocket(WS_BASE_URL, '', {
        headers: {
          //Authorization: token,
        },
      });
    }

    this.ws.onopen = () => {
      // console.log('opening');
      //TEST
      // this.ws.send(
      //   JSON.stringify({
      //     event: 'SEND_MESSAGE',
      //     payload: 'SENT SUCCESSFULLY ! :D HALO ',
      //   }),
      // );
    };

    this.ws.onmessage = async ({data}) => {
      // console.log('WSS -> this.ws.onmessage -> data', data);

      try {
        const {
          event,
          payload: {order_id, status, longitude, latitude, rider},
        } = JSON.parse(data);
        // console.log('WSS -> this.ws.onmessage -> order_id', order_id);
        // console.log('WSS -> this.ws.onmessage -> event', event);

        switch (event) {
          case 'UPDATE_ORDER_STATUS':
            await _updateOrderStatus({order_id, status});
            break;
          case 'UPDATE_ORDER_RIDER_INFO':
            // console.log('updating rider info');
            await _riderAcceptedOrder({
              order_id,
              status,
              rider,
            });
            break;
          case 'UPDATE_ORDER_RIDER_LOCATION':
            // console.log('updating location');
            await _syncRiderLocationSuccess({order_id, longitude, latitude});
            break;
          default:
            // console.log('default');
        }
      } catch (error) {
        console.log('ws event error', JSON.stringify(error, null, 2));
      }
    };

    this.ws.onerror = (e) => {
      // an error occurred
      // console.log('WSS error: ', e.message);
    };

    this.ws.onclose = (e) => {
      // console.log('closing');
      this.ws = null;
      setTimeout(() => {
        if (!this.ws) {
          WSS.init(
            _updateOrderStatus,
            _riderAcceptedOrder,
            _syncRiderLocationSuccess,
          );
        }
      }, 5000);
    };
  }

  static closeWSS() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export default WSS;
