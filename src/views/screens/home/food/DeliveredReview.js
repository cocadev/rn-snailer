import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  Animated,
} from 'react-native';

import {RFValue, getStatusBarHeight} from 'styles/ResponsiveFont';
import {Rating, AirbnbRating} from 'react-native-elements';

import NavBar, {LeftButton} from '../../component/NavBar';

import AntDesign from 'react-native-vector-icons/AntDesign';
import rateRider from '../../../../assets/images/rateriderimage.png';

import {themes} from 'utils/themeProvider';
import {useTranslation} from 'react-i18next';

import {
  createReview,
  changeReview,
  getReviewOfOrder,
} from '../../../../services/review';
import {ScrollView} from 'react-native-gesture-handler';

const DeliveredReview = ({navigation, route}) => {
  const {order_id, viewOnly} = route.params;
  const [riderScore, setRiderScore] = useState(0);
  const [storeScore, setStoreScore] = useState(0);
  const [riderDescription, setRiderDescription] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [review, setReview] = useState(null);
  const {t, i18n} = useTranslation();

  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const handleChangeReview = async () => {
    try {
      const success = await changeReview({
        review_id: review.review_id,
        riderScore,
        storeScore,
        riderDescription,
        storeDescription,
        t,
      });
      if (success) {
        navigation.navigate('DeliveredReviewSubmitted', {viewOnly});
      }
    } catch (err) {
      console.log('DeliveredReview -> handleChangeReview err:', err);
    }
  };

  const handleSubmitReview = async () => {
    try {
      const success = await createReview({
        order_id,
        riderScore,
        storeScore,
        riderDescription,
        storeDescription,
        t,
      });
      if (success) {
        navigation.navigate('DeliveredReviewSubmitted', {viewOnly});
      }
    } catch (err) {
      console.log('DeliveredReview -> handleSubmitReview err:', err);
    }
  };

  const handleGetReview = async () => {
    try {
      const results = await getReviewOfOrder({order_id, t});
      setReview(results.length > 0 ? results[0] : null);
      setRiderScore(results.length > 0 ? results[0].rider_rating.score : 0);
      setStoreScore(results.length > 0 ? results[0].branch_rating.score : 0);
      setRiderDescription(
        results.length > 0 ? results[0].rider_rating.description : '',
      );
      setStoreDescription(
        results.length > 0 ? results[0].branch_rating.description : '',
      );
    } catch (err) {
      console.log('DeliveredReview -> handelGetReview err:', err);
    }
  };

  useEffect(() => {
    handleGetReview();
  }, []);

  return (
    <NavBar title={t('rating')} {...{LeftButton, handleLeftNavButton}}>
      <ScrollView>
        <View style={styles.riderImageWrap}>
          <Image source={rateRider} style={styles.rateriderImage} />
        </View>
        <View style={[themes.BACKGROUND_WHITE_WRAP]}>
          <View style={styles.choiceContainer}>
            <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.title]}>
              {t('rate_your_rider')}
            </Text>
            <AirbnbRating
              type="custom"
              count={5}
              reviews={[
                t('poor'),
                t('bad'),
                t('average'),
                t('good'),
                t('perfect'),
              ]}
              defaultRating={riderScore || 0}
              size={40}
              ratingColor="#F7B500"
              onFinishRating={(value) => {
                setRiderScore(value);
              }}
            />
            <TextInput
              style={[themes.GREEN_BOARDER, styles.textInput]}
              placeholder={t('share_your_compliments')}
              value={riderDescription}
              onChangeText={(text) => {
                setRiderDescription(text);
              }}
            />
          </View>
        </View>
        <View
          style={[themes.BACKGROUND_WHITE_WRAP, {marginTop: height * 0.02}]}>
          <View style={styles.choiceContainer}>
            <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.title]}>
              {t('rate_the_store')}
            </Text>
            <AirbnbRating
              type="custom"
              count={5}
              reviews={[
                t('poor'),
                t('bad'),
                t('average'),
                t('good'),
                t('perfect'),
              ]}
              defaultRating={storeScore || 0}
              size={40}
              ratingColor="#F7B500"
              onFinishRating={(value) => {
                setStoreScore(value);
              }}
            />
            <TextInput
              style={[themes.GREEN_BOARDER, styles.textInput]}
              placeholder={t('share_your_compliments')}
              value={storeDescription}
              onChangeText={(text) => {
                setStoreDescription(text);
              }}
            />
          </View>
        </View>
        <View style={{marginTop: height * 0.02}}>
          {riderScore > 0 && storeScore > 0 ? (
            <TouchableOpacity
              onPress={review ? handleChangeReview : handleSubmitReview}>
              <Text style={[themes.GREEN_BUTTON, styles.button]}>
                {t('submit')}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              <Text style={[themes.GREY_BUTTON, styles.button]}>
                {t('submit')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </NavBar>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  ratingStarWrap: {
    flexDirection: 'row',
    marginHorizontal: width * 0.05,
    marginVertical: Platform.OS === 'ios' ? height * 0.005 : height * 0.02,
    alignSelf: 'center',
  },
  starIcon: {
    marginHorizontal: width * 0.02,
  },
  ratingText: {
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
    textAlign: 'center',
    fontSize: RFValue(20),
  },
  riderImageWrap: {
    alignSelf: 'center',
    marginTop: height * 0.01,
  },
  rateriderImage: {
    width: width * 0.5,
    height: height * 0.2,
  },
  choiceContainer: {
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.02,
  },
  title: {
    fontSize: RFValue(16),
    width: width * 0.65,
  },
  smallText: {
    fontSize: RFValue(10),
    textAlign: 'right',
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
  button: {
    width: width * 0.7,
    height: width * 0.13,
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: Platform.OS === 'ios' ? height * 0.03 : height * 0.035,
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

export default DeliveredReview;

{
  /* <View style={styles.ratingStarWrap}>
          <AntDesign
            name="star"
            size={30}
            style={[themes.ICON_COLOR_DARKGREY, styles.starIcon]}
          />
          <AntDesign
            name="star"
            size={30}
            style={[themes.ICON_COLOR_DARKGREY, styles.starIcon]}
          />
          <AntDesign
            name="star"
            size={30}
            style={[themes.ICON_COLOR_DARKGREY, styles.starIcon]}
          />
          <AntDesign
            name="star"
            size={30}
            style={[themes.ICON_COLOR_DARKGREY, styles.starIcon]}
          />
          {filled ? (
            <AntDesign
              name="star"
              size={30}
              style={[themes.ICON_COLOR_LIGHTYELLOW, styles.starIcon]}
            />
          ) : (
            <AntDesign
              name="star"
              size={30}
              style={[themes.ICON_COLOR_DARKGREY, styles.starIcon]}
            />
          )}
        </View>
        <Text style={[themes.NORMAL_TEXT_BLACK_BOLD, styles.ratingText]}>Perfect!</Text> */
}
