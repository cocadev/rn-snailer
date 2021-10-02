import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';

import {RFValue} from 'styles/ResponsiveFont';
import NavBar, {LeftButton} from '../component/NavBar';
import {useTranslation} from 'react-i18next';
import OrderItem, {TextStatus} from '../component/home/OrderItem';
import {getOrderHistory} from 'services/order';
import {selectOrderToView} from '../../../states/redux/ActionCreators/order';
import {Loader} from '../component/Loader';
//images
import {NoDataView} from '../component/NoDataView';
import { formatDate } from '../../../utils/helper';

const Order = ({navigation, route, _selectOrderToView}) => {
  const {t, i18n} = useTranslation();
  const [orderHistory, setOrderHistory] = useState([]);
  const [noMoreData, setNoMoreData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const type = route.params?.type ? route.params.type : 'food';
  const skip = useRef();
  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const navigateToOrderDetail = (item) => {
    _selectOrderToView({order: item});
    type === 'move'
      ? navigation.navigate('MoveOrderDetail', {
          origin: 'Order',
          viewOnly: true,
          order_id: item._id,
        })
      : navigation.navigate('ProductDetail', {
          origin: 'Order',
          viewOnly: true,
          viewOrder: item,
        });
  };

  const handleGetOrderHistory = async (type) => {
    skip.current = 0;
    try {
      const order = await getOrderHistory({type, skip: 0, t});
      setOrderHistory(order);
      if (order.length < 10) {
        setNoMoreData(true);
      }
    } catch (err) {
      console.log('Order -> handleGetOrderHistory err', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleGetMoreOrderHistory = async ({type, skip}) => {
    try {
      setLoadMoreLoading(true);
      const order = await getOrderHistory({type, skip, t});
      setOrderHistory((prev) => [...prev, ...order]);
      if (order.length < 10) {
        setNoMoreData(true);
      }
    } catch (err) {
      console.log('Order -> handleGetMoreOrderHistory err', err);
    } finally {
      setLoadMoreLoading(false);
    }
  };

  const handleLoadMore = () => {
    skip.current += 10;
    if (!noMoreData) {
      handleGetMoreOrderHistory({type, skip: skip.current});
    }
  };

  const handleRefresh = () => {
    skip.current = 0;
    setRefreshing(true);
    setNoMoreData(false);
    handleGetOrderHistory(type);
  };

  useEffect(() => {
    setLoading(true);
    handleGetOrderHistory(type);
  }, []);

  return (
    <NavBar
      title={
        type === 'food'
          ? t('food_orders')
          : type === 'goods'
          ? t('grocery_orders')
          : t('move_orders')
      }
      {...{LeftButton, handleLeftNavButton}}>
      <View style={{flex: 1, marginBottom: height * 0.05}}>
        {loading ? (
          <Loader {...{loading}} />
        ) : orderHistory && orderHistory.length > 0 ? (
          <FlatList
            data={orderHistory}
            keyExtractor={(item, index) => item._id}
            refreshing={loading}
            onRefresh={handleRefresh}
            refreshing={refreshing}
            onEndReachedThreshold={0.3}
            onEndReached={handleLoadMore}
            ListFooterComponent={() => {
              if (loadMoreLoading)
                return (
                  <View>
                    <ActivityIndicator />
                  </View>
                );
              else return null;
            }}
            renderItem={({item, val}) => {
              return (
                <OrderItem
                  order_name={
                    type === 'move'
                      ? formatDate({timeStamp: item.delivery_time, type: 'DD MMMM YYYY, h:mm a'})
                      : item.branch_name
                  }
                  subTitle={item.location?.address}
                  {...{
                    TextStatus: TextStatus({
                      color: 'History',
                      order_time: item.create_time,
                      t: t,
                    }),
                  }}
                  onPress={() => navigateToOrderDetail(item)}
                  key={val}
                  type={
                    type === 'food'
                      ? 'food'
                      : type === 'goods'
                      ? 'grocery'
                      : 'rider'
                  }
                />
              );
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

const styles = StyleSheet.create({
  loadMoreContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  wrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 25,
    backgroundColor: 'white',
    marginHorizontal: width * 0.03,
    marginVertical: width * 0.015,
    padding: width * 0.03,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  text: {
    marginLeft: width * 0.03,
    marginRight: width * 0.01,
    alignSelf: 'center',
    fontSize: RFValue(13),
  },
  primarytext: {
    marginRight: width * 0.01,
    fontSize: RFValue(13),
  },
  primaryWrap: {
    flexDirection: 'column',
    marginLeft: width * 0.03,
  },
  image: {
    width: 30,
    height: 30,
    marginLeft: width * 0.03,
    marginRight: width * 0.01,
    alignSelf: 'center',
  },
  button: {
    width: width * 0.8,
    height: width * 0.13,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: width * 0.03,
    marginBottom: width * 0.02,
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 1,
    fontWeight: 'bold',
    fontSize: RFValue(14),
    ...Platform.select({
      ios: {
        alignItems: 'center',
        lineHeight: width * 0.12,
        height: width * 0.12,
      },
      android: {
        textAlignVertical: 'center',
      },
      default: {
        alignItems: 'center',
        textAlignVertical: 'center',
      },
    }),
  },
  nodataWrap: {
    alignItems: 'center',
    marginBottom: width * 0.2,
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
    _selectOrderToView: ({order}) => dispatch(selectOrderToView(order)),
  };
};

export default connect(null, mapDispatchToProps)(Order);
