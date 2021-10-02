import React, {useState,  useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  RefreshControl,
  ScrollView
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';
import Collapsible from 'react-native-collapsible';

import Feather from 'react-native-vector-icons/Feather';
import OrderItem, {TextStatus} from '../component/home/OrderItem';
import {getOrderHistory} from '../../../services/order';
import { formatDate } from '../../../utils/helper';

const HistoryScreen = ({navigation}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [foods, setFoods] = useState([]);
  const [goods, setGoods] = useState([]);
  const [moves, setMoves] = useState([]);
  const [collapseFood, setCollapseFood] = useState(false);
  const [collapseGoods, setCollapseGoods] = useState(false);
  const [collapseMove, setCollapseMove] = useState(false);
  const {t, i18n} = useTranslation();

  const handleViewHistory = async (order_id, type) => {
    const viewOrder =
      type === 'food'
        ? foods.find((food) => {
            return food.order_id === order_id;
          })
        : goods.find((good) => {
            return good.order_id === order_id;
          });
    navigation.navigate('ProductDetail', {
      origin: 'ActivityList',
      viewOnly: true,
      viewOrder,
    });
  };

  const handleViewMoveHistory = (order_id) => {
    const viewOrder = moves.find((move) => {
      return move.order_id === order_id;
    });
    navigation.navigate('MoveOrderDetail', {
      origin: 'ActivityList',
      viewOnly: true,
      order_id,
    });
  };

  useEffect(() => {
    handleGetHistory();
  }, []);

  const handleGetHistory = async () => {
    try {
      const food = await getOrderHistory({type: 'food', t});
      setFoods(food.filter((f, index) => index < 3));
      const good = await getOrderHistory({type: 'goods', t});
      setGoods(good.filter((g, index) => index < 3));
      const move = await getOrderHistory({type: 'move', t});
      setMoves(move.filter((m, index) => index < 3));
    } catch (err) {
      console.log('HistoryScreen -> handleGetHistory err:', err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setCollapseFood(true);
    setCollapseGoods(true);
    setCollapseMove(true);
    try {
      handleGetHistory();
    } catch (err) {
      console.log('HistoryScreen -> onRefresh ', err);
    } finally {
      setRefreshing(false);
    }
  };

  const navigateToOrder = (type) => {
    navigation.navigate('Order', {type});
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Food
        {...{
          foods,
          handleViewHistory,
          collapseFood,
          setCollapseFood,
          navigateToOrder,
        }}
      />
      <Grocery
        {...{
          goods,
          handleViewHistory,
          collapseGoods,
          setCollapseGoods,
          navigateToOrder,
        }}
      />
      <Move
        {...{
          moves,
          handleViewMoveHistory,
          collapseMove,
          setCollapseMove,
          navigateToOrder,
        }}
      />
    </ScrollView>
  );
};

const Food = ({
  foods,
  handleViewHistory,
  collapseFood,
  setCollapseFood,
  navigateToOrder,
}) => {
  const {t, i18n} = useTranslation();

  return (
    <>
      <View style={[themes.BACKGROUND_WHITE_WRAP, styles.preciseLocationWrap]}>
        <View style={styles.column2}>
          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>{t('FOOD')}</Text>
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
            <>
              {foods &&
                foods.length > 0 &&
                foods.map((food, index) => {
                  return (
                    <OrderItem
                      key={index}
                      type="food"
                      order_name={food.branch_name}
                      onPress={() => handleViewHistory(food.order_id, 'food')}
                      subTitle={food.location.address}
                      {...{
                        TextStatus: TextStatus({
                          color: 'History',
                          order_time: food.create_time,
                        }),
                      }}
                    />
                  );
                })}
              <TouchableOpacity
                style={{alignItems: 'center'}}
                onPress={() => navigateToOrder('food')}>
                <Text
                  style={[
                    styles.text,
                    themes.EDIT_GREEN_TEXT,
                    {marginTop: height * 0.02},
                  ]}>
                  {t('see_all')}
                </Text>
              </TouchableOpacity>
            </>
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
  handleViewHistory,
  collapseGoods,
  setCollapseGoods,
  navigateToOrder,
}) => {
  const {t, i18n} = useTranslation();

  return (
    <>
      <View style={[themes.BACKGROUND_WHITE_WRAP, styles.preciseLocationWrap]}>
        <View style={styles.column2}>
          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>{t('GROCERY')}</Text>
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
            <>
              {goods &&
                goods.length > 0 &&
                goods.map((good, index) => {
                  return (
                    <OrderItem
                      key={index}
                      type="grocery"
                      order_name={good.branch_name}
                      onPress={() => handleViewHistory(good.order_id, 'goods')}
                      subTitle={good.location.address}
                      {...{
                        TextStatus: TextStatus({
                          color: 'History',
                          order_time: good.create_time,
                        }),
                      }}
                    />
                  );
                })}
              <TouchableOpacity
                style={{alignItems: 'center'}}
                onPress={() => navigateToOrder('goods')}>
                <Text
                  style={[
                    styles.text,
                    themes.EDIT_GREEN_TEXT,
                    {marginTop: height * 0.02},
                  ]}>
                  {t('see_all')}
                </Text>
              </TouchableOpacity>
            </>
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
  handleViewMoveHistory,
  collapseMove,
  setCollapseMove,
  navigateToOrder,
}) => {
  const {t, i18n} = useTranslation();

  return (
    <>
      <View style={[themes.BACKGROUND_WHITE_WRAP, styles.preciseLocationWrap]}>
        <View style={styles.column2}>
          <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>{t('MOVE')}</Text>
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
            <>
              {moves &&
                moves.length > 0 &&
                moves.map((move, index) => {
                  return (
                    <OrderItem
                      key={index}
                      type="rider"
                      order_name={formatDate({timeStamp: move.delivery_time, type: 'DD MMMM YYYY, h:mm a'})}
                      onPress={() => handleViewMoveHistory(move.order_id)}
                      subTitle={move.move_orders.destinations[0].address}
                      {...{
                        TextStatus: TextStatus({
                          color: 'History',
                          order_time: move.create_time,
                        }),
                      }}
                    />
                  );
                })}
              <TouchableOpacity
                style={{alignItems: 'center'}}
                onPress={() => navigateToOrder('move')}>
                <Text
                  style={[
                    styles.text,
                    themes.EDIT_GREEN_TEXT,
                    {marginTop: height * 0.02},
                  ]}>
                  {t('see_all')}
                </Text>
              </TouchableOpacity>
            </>
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

export default HistoryScreen;
