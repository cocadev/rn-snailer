import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
  Text,
  ScrollView,
  TouchableNativeFeedback,
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';

import SubNavBar, {LeftButton, Title} from '../component/SubNavBar';
import ItemSmallCard from '../component/home/ItemSmallCard';
import ChangeOptionModal, {
  MiddleButton,
  LeftRightButton,
} from '../component/popup/ChangeDeliveryOption';

import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

//context
import {BasketContext} from 'states/context/basket.context';
import {BranchContext} from '../../../states/context/branch.context';
import ImageWithFallBack from '../component/ImageFallBack';

import {getFoodCatalogue, getGoodsCatalogue} from '../../../services/branch';
import {
  formatCurrency,
  formatCurrencyWithNoCurrency,
} from '../../../utils/helper';

const BranchDetail = ({navigation, route}) => {
  const {basket} = useContext(BasketContext);
  const {branch: branchContext} = useContext(BranchContext);
  const [scroll, setScroll] = useState(React.createRef());
  const [arr, setArr] = useState([]);
  const [category, setCategory] = useState(null);
  const branch = branchContext.selectedBranch;
  const type = route.params?.type;

  useEffect(() => {
    const handleGetFoodCatalogue = async () => {
      try {
        const food = await getFoodCatalogue({
          t,
          branch_id: branch.branch_id || branch._id,
        });
        setCategory(food);
      } catch (err) {
        console.log('BranchDetail -> getFoodCatalogue err', err);
      }
    };

    const handleGetGoodsCatalogue = async () => {
      try {
        const goods = await getGoodsCatalogue({
          t,
          branch_id: branch.branch_id || branch._id,
        });
        setCategory(goods);
      } catch (err) {
        console.log('BranchDetail -> getGoodsCatalogue err', err);
      }
    };

    if (type === 'food') {
      handleGetFoodCatalogue();
    } else if (type === 'goods') {
      handleGetGoodsCatalogue();
    }
  }, []);

  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const handleSmallItemCard = (item) => {
    navigation.navigate('PlaceOrder', {
      store_id: category.store_id,
      branch_id: branch.branch_id || branch._id,
      item: item,
      type: type,
    });
  };

  const {t, i18n} = useTranslation();

  const [modalVisible, setModalVisible] = useState(false);

  const navigateToChangeOptionModal = () => {
    setModalVisible((prev) => !prev);
    //navigation.navigate('MessageModal');
  };

  const handleModalButton = () => {
    setModalVisible((prev) => !prev);
  };

  const modalMessage = t('change_option');
  const food = true;

  const ButtonGroup = () => {
    return MiddleButton({
      onPress: handleModalButton,
      buttonText: t('continue'),
    });
  };

  const TimeButtonGroup = () => {
    return LeftRightButton({handleDeliverButton, handleScheduleButton});
  };

  const [showTimeModal, setTimeModalShow] = useState(false);

  const handleDeliverButton = () => {
    setTimeModalShow(false);
    setModalVisible(false);
  };
  const handleScheduleButton = () => {
    setTimeModalShow(false);
    setModalVisible(false);
  };
  const handleModalChevronLeftButton = () => {
    setTimeModalShow(false);
  };
  const [yOffset, setYOffset] = useState(0);

  const handleOnScroll = (event) => {
    setYOffset(event.nativeEvent.contentOffset.y);
  };

  const getMinMaxPrice = (item) => {
    if (item && item.variations) {
      const min = item.variations.reduce((prev, curr) => {
        return curr.price < prev.price ? curr : prev;
      });

      const max = item.variations.reduce((prev, curr) => {
        return curr.price > prev.price ? curr : prev;
      });

      return {
        minPrice: min.price,
        maxPrice: max.price,
      };
    }
  };

  return (
    <>
      <SubNavBar
        {...{
          LeftButton,
          handleLeftNavButton,
          Title: Title({
            textAlign: 'Center',
            title: branch.branch_name,
          }),
          // RightButton: RightButton({button: 'Favorite'}),
        }}>
        <ScrollView
          ref={scroll}
          onScroll={handleOnScroll}
          scrollEventThrottle={16}>
          <ImageWithFallBack
            // type={type === 'food' ? 'food' : 'grocery'}
            type={'store'}
            style={styles.imageSize}
            source={branch.store_id + '/' + branch.image}
          />
          <View style={[themes.BACKGROUND_WHITE_WRAP, styles.container]}>
            <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.title]}>
              {branch.branch_name}
            </Text>
            {/* <Text style={[themes.TEXT_TITLE_GREY, styles.subTitle]}>
              In-Store Prices, Non-Halal
            </Text> */}
            <View style={styles.subRow}>
              <View style={styles.subRowCol1}>
                <Entypo
                  name="star"
                  size={18}
                  style={themes.ICON_COLOR_YELLOW}
                />
                <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.subText]}>
                  {branch.rating.toFixed(1)}
                </Text>
              </View>
              <View style={styles.subRowCol2}>
                <MaterialCommunityIcons
                  name="clock-time-four-outline"
                  size={20}
                  style={themes.ICON_COLOR}
                />
                <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.subText]}>
                  {branch.distance.toFixed(2)} km
                </Text>
              </View>
              <View style={styles.subRowCol3}>
                <MaterialCommunityIcons
                  name="motorbike"
                  size={20}
                  style={themes.ICON_COLOR}
                />
                <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.subText]}>
                  {t('RM')} {formatCurrencyWithNoCurrency(branch.rider_fee)}
                </Text>
              </View>
            </View>
          </View>

          <View style={{height: height * 0.002}} />
          {/* <View style={[themes.BACKGROUND_WHITE_WRAP, styles.backgroundWrap]}>
            <View style={styles.mapWrap}>
              <Image source={delivery} style={styles.iconSize} />
            </View>
            <View style={styles.deliveryInfoWrap}>
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>
                {t('delivery')}
              </Text>
              <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.normalText]}>
                {t('delivery_now')} (28 mins)
              </Text>
            </View>
            <TouchableOpacity
              style={styles.changeOptionButton}
              onPress={navigateToChangeOptionModal}>
              <Text style={[themes.EDIT_GREEN_TEXT]}>
                {t('change_options')}
              </Text>
            </TouchableOpacity>
          </View> */}

          {branch.small_order_fee && (
            <>
              <View style={{height: height * 0.002}} />
              <View
                style={[themes.BACKGROUND_WHITE_WRAP, styles.backgroundSpace]}>
                <View style={styles.offerWrap}>
                  {/* <Feather name="tag" size={15} style={themes.ICON_COLOR} /> */}
                  {/* <Image source={promotion} />
              <Text
                style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.discountText]}>
                30% {t('%off')}
              </Text> */}
                </View>
                <View style={[themes.BUTTON_LIGHTGREY, styles.smallNotif]}>
                  <Text style={themes.NORMAL_TEXT_BLACK_BOLD}>
                    {type == 'food'
                      ? `${t('discount_alert1')} ${formatCurrencyWithNoCurrency(
                          branch.small_order_fee,
                        )} ${t('discount_alert2')}`
                      : `${t('discount_alert3')} ${formatCurrencyWithNoCurrency(
                          branch.small_order_fee,
                        )} ${t('discount_alert4')}`}
                  </Text>
                </View>
              </View>
            </>
          )}

          <View style={{height: height * 0.002}} />
          <View style={[themes.BACKGROUND_WHITE_WRAP, styles.backgroundSpace]}>
            <Text style={[themes.NORMAL_TEXT_BLACK_BOLD]}>{t('category')}</Text>

            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <View style={{flexDirection: 'row'}}>
                {category &&
                  category.catalogues &&
                  category.catalogues.length > 0 &&
                  category.catalogues.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.popularWrap}
                        onPress={() => {
                          scroll.current.scrollTo({
                            x: 0,
                            y: arr[index],
                            animated: true,
                          });
                        }}>
                        <Text style={themes.TEXT_TITLE_GREY}>
                          {item.collection_name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
              </View>
            </ScrollView>
          </View>
          {category &&
            category.catalogues &&
            category.catalogues.length > 0 &&
            category.catalogues.map((item, index) => {
              if (
                (type === 'food' && item.foods.length > 0) ||
                (type === 'goods' && item.goods.length > 0)
              ) {
                return (
                  <View
                    style={[
                      themes.BACKGROUND_WHITE_WRAP,
                      styles.backgroundSpace,
                      styles.categorySpace,
                    ]}
                    key={index}
                    onLayout={(event) => {
                      const layout = event.nativeEvent.layout;
                      setArr((prev) => {
                        const arrSort = [...prev, layout.y];
                        return arrSort.sort((a, b) => {
                          return a - b;
                        });
                      });
                    }}>
                    <Text style={[themes.TEXT_TITLE_GREY]}>
                      {item.collection_name}
                    </Text>
                    <ScrollView
                      // horizontal={true}
                      showsHorizontalScrollIndicator={false}>
                      <View style={styles.row}>
                        {type === 'food'
                          ? item.foods.map((food, index2) => {
                              return (
                                <View key={index2}>
                                  <ItemSmallCard
                                    type="food"
                                    item_id={food._id}
                                    item_image={food._id + '/' + food.images[0]}
                                    item_name={food.name}
                                    item_price={food.price}
                                    item_avaibility={food.available}
                                    handleSmallItemCard={() =>
                                      handleSmallItemCard(food)
                                    }
                                  />
                                </View>
                              );
                            })
                          : item.goods.map((good, val2) => {
                              const price = getMinMaxPrice(good);

                              return (
                                <View key={val2}>
                                  <ItemSmallCard
                                    type="grocery"
                                    item_id={good._id}
                                    item_image={good._id + '/' + good.images}
                                    item_name={good.name}
                                    item_price={price}
                                    item_quantity={good.quantity}
                                    handleSmallItemCard={() =>
                                      handleSmallItemCard(good)
                                    }
                                  />
                                </View>
                              );
                            })}
                      </View>
                    </ScrollView>
                  </View>
                );
              }
            })}
          <View style={{height: width * 0.2}} />
        </ScrollView>

        {yOffset === 0 ? (
          <></>
        ) : (
          <FloatIcon
            order={basket}
            onPress={() => scroll.current.scrollTo({})}
          />
        )}

        <ItemButton {...{navigation, basket, type}} />
      </SubNavBar>

      <ChangeOptionModal
        {...{
          title: modalMessage,
          navigation,
          modalVisible,
          setModalVisible,
          showTimeModal,
          setTimeModalShow,
          handleDeliverButton,
          handleScheduleButton,
          ButtonGroup,
          TimeButtonGroup,
          handleModalChevronLeftButton,
        }}
      />
    </>
  );
};

const FloatIcon = ({itemButton, onPress, order}) => {
  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        style={
          order && order.order && order.order.length
            ? [themes.GREEN_BOARDER, styles.iconWrapperTOP]
            : [themes.GREEN_BOARDER, styles.iconWrapper]
        }>
        <View style={styles.basketIcon}>
          <AntDesign name="up" size={35} color="#468c64" />
        </View>
      </TouchableOpacity>
    </>
  );
};

const ItemButton = ({navigation, basket, type}) => {
  const navigateToCart = () => {
    navigation.navigate('ProductDetail', {type: type});
  };

  const {t, i18n} = useTranslation();
  let numberOfItems = 0;
  basket.order.map((item, val) => {
    numberOfItems += item.quantity;
  });

  return (
    <>
      {basket && basket.order && basket.order.length ? (
        Platform.OS === 'ios' ? (
          <TouchableOpacity
            onPress={navigateToCart}
            style={[styles.buttonWrapper]}>
            <View style={[styles.button, themes.GREEN_BUTTON]}>
              <Text
                style={[
                  themes.BUTTON_TEXT_WHITE,
                  styles.fontSize14,
                  styles.buttonText,
                ]}>
                {t('view_basket')} - {numberOfItems} {t('item')}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(
              'rgba(255,255,255)',
              true,
            )}
            useForeground={true}
            onPress={navigateToCart}>
            <Text style={[themes.GREEN_BUTTON, styles.buttonAndroid]}>
              {t('view_basket')} - {numberOfItems} {t('item')}
            </Text>
          </TouchableNativeFeedback>
        )
      ) : null}
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: width - width * 0.1,
    justifyContent: 'space-between',
  },
  imageSize: {
    height: Platform.OS === 'ios' ? height * 0.25 : height * 0.3,
    width: width,
    resizeMode: 'contain',
  },
  container: {
    paddingHorizontal: width * 0.08,
    paddingTop: height * 0.03,
  },
  title: {
    fontSize: RFValue(20),
  },
  subTitle: {
    paddingTop: height * 0.01,
    fontSize: RFValue(12),
  },

  subText: {
    fontSize: RFValue(12),
    paddingLeft: width * 0.01,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.01,
    justifyContent: 'space-between',
  },
  subRowCol1: {
    // width: width * 0.15,

    flexDirection: 'row',
    marginVertical: height * 0.008,
    alignItems: 'center',
  },
  subRowCol2: {
    // width: width * 0.3,

    flexDirection: 'row',
    marginVertical: height * 0.008,
    alignItems: 'center',
  },
  subRowCol3: {
    // width: width * 0.3,

    flexDirection: 'row',
    marginVertical: height * 0.008,
    alignItems: 'center',
  },
  backgroundWrap: {
    flexDirection: 'row',
    padding: width * 0.05,
    marginTop: height * 0.002,
  },
  backgroundSpace: {
    padding: width * 0.05,
    marginTop: height * 0.002,
  },
  iconSize: {
    width: width * 0.08,
    height: width * 0.08,
  },
  deliveryInfoWrap: {
    marginLeft: width * 0.03,
    width: width * 0.5,
  },
  normalText: {
    marginTop: height * 0.01,
  },
  changeOptionButton: {
    alignSelf: 'center',
    alignItems: 'flex-end',
    width: width * 0.3,
    paddingRight: width * 0.03,
  },
  offerWrap: {
    flexDirection: 'row',
    paddingHorizontal: width * 0.03,
    alignItems: 'center',
  },
  discountText: {
    paddingLeft: width * 0.02,
    fontSize: RFValue(11),
  },
  smallNotif: {
    borderRadius: 10,
    marginHorizontal: width * 0.05,
    marginTop: height * 0.01,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.015,
  },
  popularWrap: {
    marginRight: width * 0.02,
    marginVertical: Platform.OS === 'ios' ? height * 0.008 : height * 0.01,
    paddingVertical: width * 0.018,
    paddingHorizontal: width * 0.05,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 4,
  },
  categorySpace: {
    marginTop: width * 0.025,
  },
  iconWrapper: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: 50,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: width * 0.08,
    right: width * 0.06,
    padding: width * 0.07,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  iconWrapperTOP: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: 50,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: width * 0.22,
    right: width * 0.06,
    padding: width * 0.07,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  basketIcon: {
    width: 40,
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontSize14: {
    fontSize: RFValue(14),
  },
  buttonText: {textAlign: 'center'},
  button: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    width: width,
    height: width * 0.13,
    paddingHorizontal: width * 0.05,
    marginBottom: width * 0.05,
    overflow: 'hidden',
  },
  buttonAndroid: {
    height: width * 0.13,
    width: width * 0.9,
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: height * 0.03,
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 1,
    fontWeight: 'bold',
    fontSize: RFValue(14),
    position: 'absolute',
    bottom: 0,
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
});

export default BranchDetail;
