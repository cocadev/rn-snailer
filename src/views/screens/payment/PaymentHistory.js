import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Dimensions, Platform, FlatList} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';
import {useTranslation} from 'react-i18next';

import NavBar, {LeftButton} from '../component/NavBar';
import {TransactionCard} from './PaymentScreen';
import {Loader} from '../component/Loader';
import {NoDataView} from '../component/NoDataView';
import {getTransactionList} from '../../../services/payment';

const PaymentHistory = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [transactionList, setTransactionList] = useState([]);
  const [noMoreData, setNoMoreDate] = useState(false);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleLeftNavButton = () => {
    navigation.goBack();
  };
  const navigateToPaymentDetail = (item) => {
    navigation.navigate('PaymentDetail', {item});
  };

  useEffect(() => {
    setLoading(true);
    handleGetTransactionList();
  }, []);

  const handleGetTransactionList = async () => {
    try {
      const response = await getTransactionList({skip: 0});

      setTransactionList(response.transactions);
      setSkip(10);
      if (response.transactions.length < 10) {
        setNoMoreDate(true);
      }
    } catch (error) {
      console.log('PaymentHistory -> error', error);
      alert('try_again');
    } finally {
      setLoading(false);
    }
  };

  const handleGetMoreTransactionList = async () => {
    try {
      setRefreshing(true);
      const response = await getTransactionList({skip});

      setTransactionList((prev) => [...prev, ...response.transactions]);
      setSkip((prev) => prev + 10);
      if (response.transactions.length < 10) {
        setNoMoreDate(true);
      }
    } catch (error) {
      console.log('PaymentHistory -> error', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    if (!noMoreData) {
      handleGetMoreTransactionList();
    }
  };

  const handleRefresh = () => {
    setSkip(0);
    setNoMoreDate(false);
    handleGetTransactionList();
  };

  return (
    <>
      <Loader {...{loading}} />
      <NavBar
        title={t('transaction_history')}
        {...{LeftButton, handleLeftNavButton}}>
        <View style={styles.secondContainer}>
          {transactionList.length == 0 ? (
            <NoDataView />
          ) : (
            <FlatList
              scrollIndicatorInsets={{right: 1}}
              style={{paddingTop: height * 0.01}}
              data={transactionList}
              keyExtractor={(item) => item._id}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              onEndReachedThreshold={0.2}
              onEndReached={handleLoadMore}
              renderItem={({item}) => (
                <TransactionCard {...{item, navigateToPaymentDetail, t}} />
              )}
            />
          )}
        </View>
      </NavBar>
    </>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  secondContainer: {
    flex: 1,
  },
  backgroundImageContainer: {
    alignSelf: 'center',
    width: width,
    height: height * 0.35,
  },
  icon: {
    position: 'absolute',
    right: width * 0.03,
    top: height * 0.055,
  },
  bigContainer: {
    width: width,
    position: 'absolute',
    top: Platform.OS === 'ios' ? height * 0.27 : height * 0.28,
  },

  spacing: {
    marginTop: height * 0.0015,
  },
  menuRow: {
    flexDirection: 'row',
    marginHorizontal: width * 0.1,
    marginVertical: height * 0.01,
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.02,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    justifyContent: 'space-between',
  },
  iconSize: {
    width: width * 0.08,
    height: width * 0.08,
  },
  button1: {
    borderRadius: 5,
    padding: width * 0.02,
    width: width * 0.24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    marginTop: height * 0.01,
    fontWeight: 'bold',
    fontSize: RFValue(10),
  },
  text: {
    fontSize: RFValue(14),
  },
  textGreen: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    alignContent: 'center',
  },
  bottomRow: {
    justifyContent: 'space-between',
    marginHorizontal: width * 0.055,
    marginVertical: height * 0.022,
    flexDirection: 'row',
  },
  paymentWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.08,
    marginVertical: height * 0.015,
    alignItems: 'center',
  },
  column1: {
    width: width * 0.62,
    flexDirection: 'column',
  },
  column2: {
    width: width * 0.2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  column3: {
    width: width * 0.05,
  },
  subText: {
    paddingTop: height * 0.006,
    fontSize: RFValue(10),
  },
});

export default PaymentHistory;
