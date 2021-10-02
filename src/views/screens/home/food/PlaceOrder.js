import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
  Text,
} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';
import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';

import NavBar, {LeftButton} from '../../component/NavBar';
import DeleteModal, {
  LeftRightButton,
} from '../../component/popup/DeleteConfirmationModal';
import Entypo from 'react-native-vector-icons/Entypo';
import {Formik, FieldArray} from 'formik';
import CheckBox from '@react-native-community/checkbox';

import {BasketContext} from 'states/context/basket.context';
import {SET_LISTING} from '../../../../states/context/basket.context';

import ImageWithFallBack from '../../component/ImageFallBack';
import {formatCurrency, formatCurrencyWithNoCurrency} from '../../../../utils/helper';

const PlaceOrder = ({navigation, route}) => {
  const {store_id, branch_id, item, type} = route.params;
  const orderedItem = route.params.orderedItem
    ? route.params.orderedItem
    : null;
  const {basket, dispatchBasket} = useContext(BasketContext);
  const [totalPriceChange, setTotalPriceChange] = useState(0);

  const initFood = {
    choices: item.variations
      ? item.variations.map((variation) => {
          return {
            choice_title: variation.choice_title,
            choices: [],
          };
        })
      : [],
  };

  const initGoods = {
    choices: [],
  };

  const [initialValues, setInitialValues] = useState(
    // initialise values for editing
    route.params.edit
      ? {
          choices:
            type === 'food'
              ? [...orderedItem.variations]
              : [
                  {
                    variation_name: orderedItem.variation_name,
                    price: orderedItem.unit_price,
                  },
                ],
        }
      : type === 'food' // initialise values for placing order
      ? initFood
      : initGoods,
  );

  const checkBasket = () => {
    let isMaxAmount = false;
    let totalOrderedQuantity = 0;
    let orderedQuantity = 0;

    if (route.params?.edit) {
      for (let i = 0; i < basket.order.length; i++) {
        // find the quantity for the same item but of different variations
        if (basket.order[i]._id === item._id && i !== route.params.index) {
          orderedQuantity += basket.order[i].quantity;
        }
      }

      if (orderedQuantity + quantity === item.quantity) {
        isMaxAmount = true;
      }
    } else {
      for (let i = 0; i < basket.order.length; i++) {
        if (basket.order[i]._id === item._id) {
          totalOrderedQuantity += basket.order[i].quantity;
        }
      }

      if (totalOrderedQuantity === item.quantity) {
        isMaxAmount = true;
      }
      if (totalOrderedQuantity + quantity === item.quantity) {
        isMaxAmount = true;
      }
    }

    return isMaxAmount;
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [max, setMax] = useState(10); //max item allowed to select
  const [maxAmountReached, setMaxAmountReached] = useState(checkBasket);
  const [quantity, setQuantity] = useState(
    orderedItem
      ? orderedItem.quantity
      : item.quantity === 0 || maxAmountReached
      ? 0
      : 1,
  );
  const outOfStock = item.quantity === 0;
  const {t, i18n} = useTranslation();
  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const navigateToDeleteConfirmationScreen = () => {
    setModalVisible((prev) => !prev);
  };
  const modalMessage = t('start_new_basket_confirmation');
  const modalSubMessage = t('start_new_basket_alert');
  const ButtonGroup = () => {
    const left = {
      text: t('cancel'),
      onPress: navigateToDeleteConfirmationScreen,
    };
    const right = {
      text: t('proceed'),
      onPress: handleClearAndAddToBasket,
    };
    return LeftRightButton({option: 'GREEN', left, right});
  };

  const [save, setSave] = useState(false);
  const [tempStore, setTempStore] = useState(null);

  const handleClearAndAddToBasket = () => {
    setModalVisible(false);
    dispatchBasket({type: 'CLEAR_LISTING'});
    handleAddToBasket(tempStore);
  };

  const canAddtoBasket = () => {
    let isValid = true;

    basket.order.forEach((ord) => {
      if (ord.type !== type) isValid = false;
      if (ord.branch_id !== branch_id) isValid = false;
    });

    return isValid;
  };

  const handleAddToBasket = (value) => {
    try {
      const total_price =
        type === 'food'
          ? (parseInt(item.price) + totalPriceChange) * quantity
          : totalPriceChange * quantity;

      const order = {
        store_id: store_id,
        branch_id: branch_id,
        _id: item._id,
        quantity: quantity,
        total_price: total_price,
        price: type === 'food' ? item.price : value.choices[0].price,
        name: item.name,
        description: item.description,
        variations: value.choices,
        type: type,
      };

      dispatchBasket({
        type: SET_LISTING,
        payload: {
          store_id: store_id,
          order: order,
          item: item,
          type: type,
        },
      });
      setTimeout(() => {
        navigation.goBack();
      }, 200);
    } catch (e) {
      console.log('handleAddToBasket -> e', e);
    }
  };

  const handleEditOrder = (value) => {
    try {
      const total_price =
        type === 'food'
          ? (parseInt(item.price) + totalPriceChange) * quantity
          : totalPriceChange * quantity;

      const basket = {
        ...orderedItem,
        _id: orderedItem.store_food_id,
        quantity: quantity,
        unit_price: total_price,
        variations: value.choices,
      };

      dispatchBasket({
        type: 'EDIT_ITEM',
        payload: {
          basket: basket,
          type: type,
          index: route.params.index,
        },
      });
      setTimeout(() => {
        navigation.goBack();
      }, 200);
    } catch (e) {
      console.log('handleEditOrder -> e', e);
    }
  };

  // Check if the required choices have been selected
  const checkSelectedItems = (values, variations) => {
    if (type === 'food') {
      for (let i = 0; i < values.choices.length; i++) {
        if (
          values.choices[i].choices.length !==
          parseInt(variations[i].choice_number)
        ) {
          return false;
        }
      }
      return true;
    } else {
      if (values.choices.length === 0) {
        return false;
      }
      return true;
    }
  };

  //Function for calculating summation
  const sum = (a) => {
    let total = 0;
    for (let i = 0; i < a.length; i++) {
      if (isNaN(a[i])) {
        continue;
      }
      total += parseInt(a[i]);
    }
    return total;
  };

  useEffect(() => {
    if (quantity >= item.quantity || checkBasket()) {
      setMaxAmountReached(true);
    } else {
      setMaxAmountReached(false);
    }
  }, [quantity]);

  return (
    <>
      <NavBar title={item.name} {...{LeftButton, handleLeftNavButton}}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            setTempStore(values);
            if (canAddtoBasket()) {
              handleAddToBasket(values);
            } else {
              setModalVisible(true);
            }
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            dirty,
          }) => {
            const totPriceChange = values.choices
              .map((items, val) => {
                if (type === 'food') {
                  return items.choices.map((item, val2) => item.price_change);
                } else {
                  return items.price;
                }
              })
              .flat(1);
            setTotalPriceChange(sum(totPriceChange));

            const foodIsSelected = (index1, choice) => {
              let selected = values.choices[index1].choices.findIndex((c) => {
                return c.variation_name === choice.variation_name;
              });

              return selected >= 0;
            };

            const goodsIsSelected = (variation) => {
              let selected = values.choices.findIndex((ele) => {
                return ele.variation_name === variation.variation_name;
              });

              return selected >= 0;
            };

            if (type === 'food') {
              setSave(checkSelectedItems(values, item.variations));
            } else {
              setSave(values.choices.length > 0);
            }

            return (
              <ScrollView>
                <View style={styles.container}>
                  <ImageWithFallBack
                    type={
                      route.params && route.params.type === 'food'
                        ? 'food'
                        : 'grocery'
                    }
                    style={styles.itemImageSize}
                    source={
                      item.images.length > 0
                        ? item._id + '/' + item.images[0]
                        : null
                    }
                  />
                </View>
                <View style={[themes.BACKGROUND_WHITE_WRAP]}>
                  <View style={styles.titlecontainer}>
                    <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.title]} numberOfLines={2}>
                      {item.name}
                    </Text>
                    {(type === 'food' || item.type === 'food') && (
                      <View style={{flexDirection: 'column'}}>
                        <Text
                          style={[
                            themes.NORMAL_TEXT_BLACK_BOLD,
                            styles.subtitle,
                          ]}>
                          {`${t('RM')} ${formatCurrencyWithNoCurrency(
                            item.price,
                          )}`}
                        </Text>
                        <Text
                          style={[
                            themes.TEXT_TITLE_LIGHTGREY,
                            styles.smallText,
                          ]}>
                          {t('base_price')}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.ingredientcontainer}>
                    <Text
                      style={[
                        themes.TEXT_TITLE_LIGHTGREY,
                        styles.ingredientText,
                      ]}>
                      {item.description}
                    </Text>
                  </View>
                </View>
                {type === 'food' ? (
                  <FieldArray
                    name="choices"
                    render={(arrayHelpers) => {
                      return item.variations ? (
                        item.variations.map((variation, index1) => {
                          return (
                            <View key={index1}>
                              <View style={{height: height * 0.012}} />
                              <View style={[themes.BACKGROUND_WHITE_WRAP]}>
                                <View style={styles.choiceContainer}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                    }}>
                                    <Text
                                      style={[
                                        themes.NORMAL_TEXT_BLACK_BOLD,
                                        styles.title,
                                      ]}
                                      numberOfLines={2}>
                                      {variation.choice_title}
                                    </Text>
                                    <Text
                                      style={[
                                        themes.TEXT_TITLE_LIGHTGREY,
                                        styles.smallText,
                                      ]}>
                                      {t('pick')} {variation.choice_number}
                                    </Text>
                                  </View>
                                  <FieldArray
                                    name={`choices.${index1}.choices`}
                                    render={(arrayHelpers2) =>
                                      variation.choices.map((c, index2) => {
                                        return (
                                          <TouchableOpacity
                                            style={{
                                              flexDirection: 'row',
                                              justifyContent: 'space-between',
                                            }}
                                            key={index2}
                                            onPress={() => {
                                              if (
                                                values.choices[
                                                  index1
                                                ].choices.includes(c)
                                              ) {
                                                const x = values.choices[
                                                  index1
                                                ].choices.indexOf(c);
                                                arrayHelpers2.remove(x);
                                              } else {
                                                if (
                                                  values.choices[index1].choices
                                                    .length >=
                                                  variation.choice_number
                                                ) {
                                                  values.choices[
                                                    index1
                                                  ].choices.shift();
                                                }
                                                values.choices[
                                                  index1
                                                ].choices.push(c);
                                              }
                                              setToggle(!toggle);
                                            }}>
                                            <View style={styles.radioContainer}>
                                              <CheckBox
                                                style={{
                                                  height: 20,
                                                  width: 20,
                                                }}
                                                onCheckColor={'#468c64'} //IOS PROPS FOR COLOR
                                                onTintColor={'#468c64'}
                                                tintColors={'22c639'} //ANDROID PROP FOR COLOR
                                                // disabled={foodSetDisable(
                                                //   index1,
                                                //   c,
                                                //   variation,
                                                // )}
                                                disabled={true}
                                                value={foodIsSelected(
                                                  index1,
                                                  c,
                                                )}
                                              />

                                              <Text style={styles.radioText} numberOfLines={2}>
                                                {c.variation_name}
                                              </Text>
                                            </View>
                                            <View style={styles.radioContainer}>
                                              <Text
                                                style={styles.radioPriceText}>
                                                {`+ ${t('RM')} ${formatCurrencyWithNoCurrency(
                                                  c.price_change,
                                                )}`}
                                              </Text>
                                            </View>
                                          </TouchableOpacity>
                                        );
                                      })
                                    }
                                  />
                                </View>
                              </View>
                            </View>
                          );
                        })
                      ) : (
                        <></>
                      );
                    }}
                  />
                ) : (
                  <>
                    <View style={{height: height * 0.012}} />
                    <View style={[themes.BACKGROUND_WHITE_WRAP]}>
                      <View style={styles.choiceContainer}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={[
                              themes.NORMAL_TEXT_BLACK_BOLD,
                              styles.title,
                            ]}>
                            {t('variations')}
                          </Text>
                          <Text
                            style={[
                              themes.TEXT_TITLE_LIGHTGREY,
                              styles.smallText,
                            ]}>
                            {t('pick_1')}
                          </Text>
                        </View>
                        <FieldArray
                          name="choices"
                          render={(arrayHelpers) => {
                            return (
                              item.variations &&
                              item.variations.map((variation, index1) => {
                                return (
                                  <TouchableOpacity
                                    key={index1}
                                    onPress={() => {
                                      if (values.choices.includes(variation)) {
                                        const x = values.choices.indexOf(
                                          variation,
                                        );
                                        arrayHelpers.remove(x);
                                      } else {
                                        if (values.choices.length === 1) {
                                          values.choices.shift();
                                        }
                                        values.choices.push(variation);
                                      }

                                      setToggle(!toggle);
                                    }}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                      }}>
                                      <View style={styles.radioContainer}>
                                        <CheckBox
                                          style={{
                                            height: 20,
                                            width: 20,
                                          }}
                                          onCheckColor={'#468c64'} //IOS PROPS FOR COLOR
                                          onTintColor={'#468c64'}
                                          tintColors={'22c639'} //ANDROID PROP FOR COLOR
                                          // disabled={goodsSetDisable(variation)}
                                          disabled={true}
                                          value={goodsIsSelected(variation)}
                                        />
                                        <Text style={styles.radioText} numberOfLines={2}>
                                          {variation.variation_name}
                                        </Text>
                                      </View>
                                      <View style={styles.radioContainer}>
                                        <Text style={styles.radioPriceText}>
                                          {`${t('RM')} ${formatCurrencyWithNoCurrency(
                                            variation.price,
                                          )}`}
                                        </Text>
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                );
                              })
                            );
                          }}
                        />
                      </View>
                    </View>
                  </>
                )}
                <View style={{height: height * 0.012}} />
                <View style={{marginBottom: height * 0.05}}>
                  <View style={styles.quantityRow}>
                    <TouchableOpacity
                      style={[
                        themes.RED_BOARDER,
                        themes.BACKGROUND_WHITE_WRAP,
                        styles.iconWrapper,
                      ]}
                      onPress={() => {
                        if (!outOfStock && quantity !== 0) {
                          if (quantity === 1) {
                            setQuantity(1);
                          } else {
                            setQuantity((prev) => prev - 1);
                          }
                        }
                      }}>
                      <View>
                        <Entypo
                          name="minus"
                          size={25}
                          style={themes.ICON_COLOR_RED}
                        />
                      </View>
                    </TouchableOpacity>
                    <View
                      style={[
                        themes.GREEN_BOARDER,
                        themes.BACKGROUND_WHITE_WRAP,
                        styles.quantityTextInput,
                      ]}>
                      <Text style={styles.quantityText}>{quantity}</Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        themes.GREEN_BOARDER,
                        themes.BACKGROUND_WHITE_WRAP,
                        styles.iconWrapper,
                      ]}
                      onPress={() => {
                        if (
                          maxAmountReached ||
                          outOfStock ||
                          item.available === false
                        ) {
                          setQuantity((prev) => prev);
                        } else {
                          setQuantity((prev) => prev + 1);
                        }
                      }}>
                      <View>
                        <Entypo
                          name="plus"
                          size={25}
                          style={themes.ICON_COLOR}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  {outOfStock ? (
                    <Text style={styles.errorMsg}>{t('out_of_stock')}</Text>
                  ) : maxAmountReached ? (
                    <Text style={styles.errorMsg}>{t('max_item_alert')}</Text>
                  ) : item.available === false ? (
                    <Text style={styles.errorMsg}>
                      {t('food_not_available')}
                    </Text>
                  ) : null}
                </View>
                {route.params.edit ? (
                  save && item ? (
                    <TouchableOpacity onPress={() => handleEditOrder(values)}>
                      <Text style={[themes.GREEN_BUTTON, styles.button]}>
                        {t('edit_basket')} - {t('RM')}
                        {type === 'food'
                          ? ((parseInt(item.price) + totalPriceChange) *
                              quantity) /
                            100
                          : null}
                        {type === 'goods'
                          ? (totalPriceChange * quantity) / 100
                          : null}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity>
                      <Text style={[themes.GREY_BUTTON, styles.button]}>
                        {t('edit_basket')} - {t('RM')}
                        {type === 'food'
                          ? ((parseInt(item.price) + totalPriceChange) *
                              quantity) /
                            100
                          : null}
                        {type === 'goods'
                          ? (totPriceChange * quantity) / 100
                          : null}
                      </Text>
                    </TouchableOpacity>
                  )
                ) : save &&
                  item &&
                  quantity !== 0 &&
                  item.available !== false ? (
                  <TouchableOpacity onPress={handleSubmit}>
                    <Text style={[themes.GREEN_BUTTON, styles.button]}>
                      {t('add_to_basket')} - {t('RM')}
                      {type === 'food'
                        ? ((parseInt(item.price) + totalPriceChange) *
                            quantity) /
                          100
                        : null}
                      {type === 'goods'
                        ? (totPriceChange * quantity) / 100
                        : null}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity>
                    <Text style={[themes.GREY_BUTTON, styles.button]}>
                      {t('add_to_basket')} - {t('RM')}
                      {type === 'food'
                        ? ((parseInt(item.price) + totalPriceChange) *
                            quantity) /
                          100
                        : null}
                      {type === 'goods'
                        ? (totPriceChange * quantity) / 100
                        : null}
                    </Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            );
          }}
        </Formik>
      </NavBar>

      <DeleteModal
        {...{
          message: modalMessage,
          subMessage: modalSubMessage,
          navigation,
          modalVisible,
          setModalVisible,
          ButtonGroup,
        }}
      />
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width,
    alignItems: 'center',
  },
  itemImageSize: {
    height: Platform.OS === 'ios' ? height * 0.25 : height * 0.3,
    width: width,
    resizeMode: 'contain',
  },
  titlecontainer: {
    paddingHorizontal: width * 0.08,
    paddingTop: height * 0.03,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ingredientcontainer: {
    paddingHorizontal: width * 0.08,
    paddingBottom: height * 0.03,
    paddingTop: height * 0.03,
  },
  choiceContainer: {
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.03,
  },
  title: {
    fontSize: RFValue(16),
    width: width * 0.6,
  },
  subtitle: {
    fontSize: RFValue(16),
    textAlign: 'right',
  },
  smallText: {
    fontSize: RFValue(10),
    textAlign: 'right',
  },
  ingredientText: {
    fontSize: RFValue(11),
  },

  radioContainer: {
    flexDirection: 'row',
    marginTop: height * 0.015,
    marginBottom: height * 0.008,
    // justifyContent: 'center',
  },
  radioButton: {
    width: width * 0.05,
    height: width * 0.05,
    borderRadius: width * 0.0375,
    borderWidth: 1,
    borderColor: '#468c64',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioFill: {
    width: width * 0.035,
    height: width * 0.035,
    borderRadius: width * 0.02,
    backgroundColor: '#468c64',
  },
  radioText: {
    alignSelf: 'center',
    marginLeft: width * 0.03,
    marginRight: width * 0.02,
    fontWeight: 'bold',
    fontSize: RFValue(13),
    width: width * 0.45,
  },
  radioPriceText: {
    fontWeight: 'bold',
    fontSize: RFValue(13),
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    height: width * 0.12,
    fontSize: RFValue(13),
    paddingHorizontal: width * 0.03,
    marginTop: height * 0.02,
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
  quantityRow: {
    flexDirection: 'row',
    marginHorizontal: width * 0.2,
    marginTop: height * 0.05,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorMsg: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  iconWrapper: {
    borderWidth: 1,

    width: width * 0.12,
    height: width * 0.12,
    borderRadius: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityTextInput: {
    borderWidth: 1,
    width: width * 0.2,
    height: Platform.OS === 'ios' ? height * 0.06 : height * 0.08,
    borderRadius: 10,
    marginHorizontal: width * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: RFValue(13),
    fontWeight: 'bold',
  },
  button: {
    width: width * 0.7,
    height: width * 0.13,
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: Platform.OS === 'ios' ? height * 0.04 : height * 0.035,
    overflow: 'hidden',
    borderRadius: 25,
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
});

export default PlaceOrder;
