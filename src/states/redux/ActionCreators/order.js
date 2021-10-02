import * as ActionTypes from 'states/redux/ActionTypes';
import WSS from 'services/websocket';

export const createNewOrderSuccess = ({order_id}) => async (
  dispatch,
  getState,
) => {
  // console.log('createNewOrderSuccess -> order_id', order_id);
};

export const updateOrderStatus = ({order_id, status}) => async (
  dispatch,
  getState,
) => {
  // console.log('updateOrderStatus -> ', order_id, status);
  dispatch({
    type: ActionTypes.UPDATE_ORDER_STATUS,
    payload: {
      order_id,
      status,
    },
  });
};

export const branchAcceptedOrder = ({order_id}) => async (
  dispatch,
  getState,
) => {
  // console.log('branchAcceptedOrder -> order_id', order_id);
};

export const riderAcceptedOrder = ({order_id, status, rider}) => async (
  dispatch,
  getState,
) => {
  // console.log('riderAcceptedOrder -> ', order_id, status, rider);
  dispatch({
    type: ActionTypes.UPDATE_ORDER_RIDER_INFO,
    payload: {
      order_id,
      status,
      rider,
    },
  });
};

export const syncRiderLocationSuccess = ({
  order_id,
  longitude,
  latitude,
}) => async (dispatch, getState) => {
  // console.log('syncRiderLocationSuccess -> ', order_id, longitude, latitude);
  dispatch({
    type: ActionTypes.UPDATE_ORDER_RIDER_LOCATION,
    payload: {
      order_id,
      longitude,
      latitude,
    },
  });
};

export const saveOrderToRedux = ({order}) => async (dispatch) => {
  dispatch({type: ActionTypes.SAVE_ORDER_TO_REDUX, payload: order});
};

export const saveAllOrdersToRedux = ({order}) => async (dispatch) => {
  dispatch({type: ActionTypes.SAVE_ALL_ORDERS_TO_REDUX, payload: order});
};

export const selectOrderToView = ({order_id}) => async (dispatch) => {
  dispatch({type: ActionTypes.SELECT_ORDER_TO_VIEW, payload: order_id});
};

export const clearLatestOrder = () => async (dispatch) => {
  dispatch({type: ActionTypes.CLEAR_LATEST_ORDER});
};
