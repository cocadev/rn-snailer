import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {
  getOnGoingFoodOrder,
  getOnGoingGoodsOrder,
  getOnGoingMoveOrder,
} from '../../../services/order';

import {RFValue} from 'styles/ResponsiveFont';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';
import Collapsible from 'react-native-collapsible';

import Feather from 'react-native-vector-icons/Feather';
import OrderItem, {TextStatus} from '../component/home/OrderItem';

import {
  selectOrderToView,
  saveAllOrdersToRedux,
} from '../../../states/redux/ActionCreators/order';
import { formatDate } from '../../../utils/helper';

const ActivityScreen = ({
  navigation,
  _selectOrderToView,
  _saveAllOrdersToRedux,
  order,
  allOrders,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [foods, setFoods] = useState([]);
  const [goods, setGoods] = useState([]);
  const [moves, setMoves] = useState([]);
  const [collapseFood, setCollapseFood] = useState(false);
  const [collapseGoods, setCollapseGoods] = useState(false);
  const [collapseMove, setCollapseMove] = useState(false);
  const {t, i18n} = useTranslation();
  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const handleViewOngoingActivity = async (order_id) => {
    const viewOrder = allOrders.order.find((ele) => {
      return ele.order_id === order_id;
    });
    if (viewOrder) {
      if (viewOrder.self_pick_up) {
        navigation.navigate('ProductDetail', {
          origin: 'ActivityList',
          viewOnly: true,
          viewOrder,
        });
      } else {
        _selectOrderToView({order_id});
        navigation.navigate('MapDeliveryScreen', {origin: 'ActivityList'});
      }
    } else {
      alert(t('alert_error_orderjs_9'));
    }
  };

  const handleViewOngoingMove = (order_id) => {
    _selectOrderToView({order_id});
    if (order.order_id !== '') {
      navigation.navigate('MoveOrderDetail', {
        origin: 'ActivityList',
        viewOnly: true,
        order_id,
      });
    } else {
      alert(t('alert_error_orderjs_9'));
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      onRefresh();
    });

    return unsubscribe;
  }, []);

  const getFoodOrder = async () => {
    let count = 0;
    let result = [];
    while (true) {
      let food = await getOnGoingFoodOrder({t, skip: count});
      if (Array.isArray(food)) {
        result = [...result, ...food];
      } else {
        break;
      }
      if (food.length < 10) break;
      count += 10;
    }
    setFoods(result);
    return result;
  };

  const getGoodsOrder = async () => {
    let count = 0;
    let result = [];

    while (true) {
      let good = await getOnGoingGoodsOrder({t, skip: count});
      if (Array.isArray(good)) {
        result = [...result, ...good];
      } else {
        break;
      }
      if (good.length < 10) break;
      count += 10;
    }
    setGoods(result);
    return result;
  };

  const getMoveOrder = async () => {
    let count = 0;
    let result = [];
    while (true) {
      let move = await getOnGoingMoveOrder({t, skip: count});
      if (Array.isArray(move)) {
        result = [...result, ...move];
      } else {
        break;
      }
      if (move.length < 10) break;
      count += 10;
    }
    setMoves(result);
    return result;
  };

  const handleGetOngoingOrder = async () => {
    try {
      const result = await Promise.all([
        getFoodOrder(),
        getGoodsOrder(),
        getMoveOrder(),
      ]);
      if (result && result?.length > 0)
        _saveAllOrdersToRedux({
          order: [...result[0], ...result[1], ...result[2]],
        });
    } catch (err) {
      console.log('ActivityScreen -> handleGetOngoingOrder err:', err);
    }
  };

  const onRefresh = async () => {
    setFoods((foods) => []);
    setMoves((moves) => []);
    setGoods((goods) => []);
    setRefreshing(true);
    try {
      handleGetOngoingOrder();
      setCollapseFood(true);
      setCollapseGoods(true);
      setCollapseMove(true);
    } catch (err) {
      console.log('ActivityScreen -> onRefresh ', err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
      <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        <Food
          {...{foods, handleViewOngoingActivity, collapseFood, setCollapseFood}}
        />
        <Grocery
          {...{goods, handleViewOngoingActivity, collapseGoods, setCollapseGoods}}
        />
        <Move
          {...{moves, handleViewOngoingMove, collapseMove, setCollapseMove}}
        />
      </ScrollView>
    
  );
};

const Food = ({
  foods,
  handleViewOngoingActivity,
  collapseFood,
  setCollapseFood,
}) => {
  const {t, i18n} = useTranslation();
  
  return (
    <>
      <View style={[themes.BACKGROUND_WHITE_WRAP, styles.preciseLocationWrap]}>
        <View style={styles.column2}>
          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>
            {`${t('FOOD')} (${foods.length})`}
          </Text>
        </View>
        <View style={styles.collapseCol}>
          <TouchableOpacity
            onPress={() => {
              setCollapseFood(!collapseFood);
            }}>
            {collapseFood ? (
              <Feather
                name="chevron-down"
                size={30}
                style={[themes.ICON_COLOR_BLACK]}
              />
            ) : (
              <Feather
                name="chevron-up"
                size={30}
                style={[themes.ICON_COLOR_BLACK]}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={
          collapseFood
            ? [themes.BACKGROUND_WHITE_WRAP, styles.orderWrapExpanded]
            : [themes.BACKGROUND_WHITE_WRAP, styles.orderWrap]
        }>
        <Collapsible collapsed={collapseFood}>
          {foods.length > 0 ? (
            foods &&
            foods.map((food, index) => {
              return (
                <OrderItem
                  key={food.order_id}
                  type={'food'}
                  order_name={food.branch_name}
                  onPress={() => handleViewOngoingActivity(food.order_id)}
                  subTitle={food.location.address}
                  {...{
                    TextStatus: TextStatus({color: 'Ongoing'}),
                  }}
                />
              );
            })
          ) : (
            <View style={styles.nodataWrap}>
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.titleText]}>
                {t('no_data_available')}
              </Text>
              <Text style={[themes.TEXT_TITLE_GREY, styles.text]}>
                {t('no_data_explain')}
              </Text>
            </View>
          )}
        </Collapsible>
      </View>
    </>
  );
};

const Grocery = ({
  goods,
  handleViewOngoingActivity,
  collapseGoods,
  setCollapseGoods,
}) => {
  const {t, i18n} = useTranslation();

  return (
    <>
      <View style={[themes.BACKGROUND_WHITE_WRAP, styles.preciseLocationWrap]}>
        <View style={styles.column2}>
          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>
            {`${t('GROCERY')} (${goods.length})`}
          </Text>
        </View>
        <View style={styles.collapseCol}>
          <TouchableOpacity
            onPress={() => {
              setCollapseGoods(!collapseGoods);
            }}>
            {collapseGoods ? (
              <Feather
                name="chevron-down"
                size={30}
                style={[themes.ICON_COLOR_BLACK]}
              />
            ) : (
              <Feather
                name="chevron-up"
                size={30}
                style={[themes.ICON_COLOR_BLACK]}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={
          collapseGoods
            ? [themes.BACKGROUND_WHITE_WRAP, styles.orderWrapExpanded]
            : [themes.BACKGROUND_WHITE_WRAP, styles.orderWrap]
        }>
        <Collapsible collapsed={collapseGoods}>
          {goods.length > 0 ? (
            goods &&
            goods.map((good, index) => {
              return (
                <OrderItem
                  key={good.order_id}
                  type="grocery"
                  order_name={good.branch_name}
                  onPress={() => handleViewOngoingActivity(good.order_id)}
                  subTitle={good.location.address}
                  {...{
                    TextStatus: TextStatus({color: 'Ongoing'}),
                  }}
                />
              );
            })
          ) : (
            <View style={styles.nodataWrap}>
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.titleText]}>
                {t('no_data_available')}
              </Text>
              <Text style={[themes.TEXT_TITLE_GREY, styles.text]}>
                {t('no_data_explain')}
              </Text>
            </View>
          )}
        </Collapsible>
      </View>
    </>
  );
};

const Move = ({
  moves,
  handleViewOngoingMove,
  collapseMove,
  setCollapseMove,
}) => {
  const {t, i18n} = useTranslation();

  return (
    <>
      <View style={[themes.BACKGROUND_WHITE_WRAP, styles.preciseLocationWrap]}>
        <View style={styles.column2}>
          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>
            {`${t('MOVE')} (${moves.length})`}
          </Text>
        </View>
        <View style={styles.collapseCol}>
          <TouchableOpacity
            onPress={() => {
              setCollapseMove(!collapseMove);
            }}>
            {collapseMove ? (
              <Feather
                name="chevron-down"
                size={30}
                style={[themes.ICON_COLOR_BLACK]}
              />
            ) : (
              <Feather
                name="chevron-up"
                size={30}
                style={[themes.ICON_COLOR_BLACK]}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={
          collapseMove
            ? [themes.BACKGROUND_WHITE_WRAP, styles.orderWrapExpanded]
            : [themes.BACKGROUND_WHITE_WRAP, styles.orderWrap]
        }>
        <Collapsible collapsed={collapseMove}>
          {moves.length > 0 ? (
            moves &&
            moves.map((move, index) => {
              return (
                <OrderItem
                  key={move.order_id}
                  type="rider"
                  order_name={formatDate({timeStamp: move.delivery_time, type: 'DD MMMM YYYY, h:mm a'})}
                  onPress={() => handleViewOngoingMove(move.order_id)}
                  subTitle={move.move_orders.destinations[0].address}
                  {...{
                    TextStatus: TextStatus({color: 'Ongoing'}),
                  }}
                />
              );
            })
          ) : (
            <View style={styles.nodataWrap}>
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.titleText]}>
                {t('no_data_available')}
              </Text>
              <Text style={[themes.TEXT_TITLE_GREY, styles.text]}>
                {t('no_data_explain')}
              </Text>
            </View>
          )}
        </Collapsible>
      </View>
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginTop: height * 0.01,
  },
  // categoryWrap: {
  //   paddingHorizontal: width * 0.05,
  //   paddingVertical: height * 0.03
  // },
  preciseLocationWrap: {
    marginTop: height * 0.002,
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.02,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column2: {
    width: width * 0.7,
    alignSelf: 'center',
  },
  smallText: {
    fontSize: RFValue(10),
    paddingTop: width * 0.001,
  },
  collapseCol: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  orderWrap: {
    paddingBottom: height * 0.02,
    marginTop: height * 0.002,
  },
  orderWrapExpanded: {
    marginTop: height * 0.002,
  },
  nodataWrap: {
    alignItems: 'center',
    marginVertical: width * 0.15,
    paddingHorizontal: width * 0.04,
  },
  titleText: {
    marginBottom: width * 0.02,
    fontSize: RFValue(15),
  },
  text: {
    fontSize: RFValue(13),
  },
});

const mapStateToProps = (state) => {
  return {
    order: state.order.latest_order,
    allOrders: state.order,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    _selectOrderToView: ({order_id}) => dispatch(selectOrderToView({order_id})),
    _saveAllOrdersToRedux: ({order}) => dispatch(saveAllOrdersToRedux({order})),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityScreen);
