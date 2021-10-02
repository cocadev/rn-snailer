import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {useTranslation} from 'react-i18next';

import NavBar, {LeftButton} from '../../component/NavBar';
import {NoDataView} from '../../component/NoDataView';
import {getParcelWithinRange} from '../../../../services/parcel';
import OrderItem, {TextStatus} from '../../component/home/OrderItem';
import {formatDate} from '../../../../utils/helper';
import {ORDER_STATUS} from '../../../../utils/enum';
const ParcelOrderHistoryList = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [orderHistory, setOrderHistory] = useState([]);
  const [noMoreData, setNoMoreData] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const skip = useRef();
  const handleLeftNavButton = () => {
    navigation.goBack();
  };
  const handleGetOrder = async (skip) => {
    try {
      setLoadMoreLoading(true);
      const order = await getParcelWithinRange({t, skip: skip});
      setOrderHistory((prev) => [...prev, ...order]);
      if (order.length < 10) setNoMoreData(true);
    } catch {
    } finally {
      setLoadMoreLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    skip.current = 0;
    handleGetOrder(skip.current);
  }, []);

  const handleLoadMore = () => {
    skip.current += 10;
    if (!noMoreData) {
      handleGetOrder(skip.current);
    }
  };

  const handleRefresh = () => {
    skip.current = 0;
    setRefreshing(true);
    setNoMoreData(false);
    setOrderHistory([]);
    handleGetOrder(skip.current);
  };

  const navigateToOrderDetail = (item) => {
    navigation.navigate('ParcelOrderDetail', {
      origin: 'ActivityList',
      viewOnly: true,
      order_id: item._id,
    });
  };
  const renderStatus = (status, status_text) => {
    if (status === ORDER_STATUS.HANDLED_BY_ADMIN)
      return t('Pass to Snailer Team');
    else if (status === ORDER_STATUS.HANDLED_BY_THIRD_PARTY_COURIER_SERVICE)
      return t('Pass to Snailer Partner');
    else if (
      status === ORDER_STATUS.CANCELLED_BY_PAYMENT_SYSTEM ||
      status === ORDER_STATUS.CANCELLED_BY_PLATFORM
    )
      return t('cancelled');
    return status_text;
  };

  return (
    <NavBar title={t('parcel_order')} {...{LeftButton, handleLeftNavButton}}>
      <View style={{flex: 1, marginBottom: height * 0.05}}>
        {orderHistory && orderHistory.length > 0 ? (
          <FlatList
            data={orderHistory}
            keyExtractor={(item, index) => index.toString()}
            onRefresh={handleRefresh}
            refreshing={refreshing}
            onEndReachedThreshold={0.3}
            onEndReached={handleLoadMore}
            renderItem={({item, val}) => {
              return (
                <>
                  <OrderItem
                    type="rider"
                    order_name={formatDate({
                      timeStamp: item.create_time,
                      type: 'DD MMMM yyyy, H:mm A',
                    })}
                    subTitle={renderStatus(item.status, item.status_text)}
                    {...{
                      TextStatus: TextStatus({
                        color: 'History',
                        order_time: item.update_time,
                      }),
                    }}
                    onPress={() => navigateToOrderDetail(item)}
                    key={val}
                  />
                </>
              );
            }}
            ListFooterComponent={() => {
              if (loadMoreLoading)
                return (
                  <View>
                    <ActivityIndicator />
                  </View>
                );
              else return null;
            }}
          />
        ) : (
          <NoDataView />
        )}
      </View>
    </NavBar>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({});

export default ParcelOrderHistoryList;
