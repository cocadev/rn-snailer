import React from 'react';
import {StyleSheet, View, Dimensions, TouchableOpacity} from 'react-native';

import {RFValue} from 'styles/ResponsiveFont';

import {TabView} from 'react-native-tab-view';
import Animated from 'react-native-reanimated';

import NavBar, {LeftButton} from '../component/NavBar';
import ActivityScreen from '../activity/ActivityScreen';
import HistoryScreen from '../activity/HistoryScreen';

import {useTranslation} from 'react-i18next';

const ActivityList = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const handleLeftNavButton = () => {
    navigation.goBack();
  };

  const [index, setIndex] = React.useState(
    route.params?.focusTab ? route.params.focusTab : 0,
  );
  const [routes] = React.useState([
    {key: 'first', title: 'activity'},
    {key: 'second', title: 'history'},
  ]);

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'first':
        return <ActivityScreen navigation={navigation} />;
      case 'second':
        return <HistoryScreen navigation={navigation} />;
    }
  };

  const renderTabBar = (props) => {
    return <TabBar {...props} />;
  };

  const TabBar = ({navigationState, jumpTo}) => {
    const {t, i18n} = useTranslation();
    

    const page = navigationState.index;
    return (
      
        <View style={styles.tabBar}>
        {navigationState.routes.map((route, i) => {
          return (
            <TouchableOpacity
              activeOpacity={0.75}
              style={page === i ? styles.selectedTabItem : styles.tabItem}
              onPress={() => {
                jumpTo(route.key);
              }}
              key={i}>
              <View style={styles.textWrapper}>
                <Animated.Text
                  style={
                    page === i ? styles.selectedTabTitle : styles.tabTitle
                  }>
                  {t(route.title)}
                </Animated.Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <NavBar title={index === 1 ? t('history') : t('activity')}
    {...{LeftButton, handleLeftNavButton}}>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        lazy={true}
      />
    </NavBar>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
  },
  tabItem: {
    height: height * 0.07,
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0,
    shadowRadius: 2,
    elevation: 5,
  },
  selectedTabItem: {
    height: height * 0.07,
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1.5,
    borderColor: '#468c64',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0,
    shadowRadius: 2,
    elevation: 5,
  },
  selectedTabTitle: {
    color: '#468c64',
    fontSize: RFValue(14),
    fontWeight: 'bold',
  },
  tabTitle: {
    color: '#4f4f4f',
    fontSize: RFValue(14),
    fontWeight: 'bold',
    opacity: 0.5,
  },
  textWrapper: {
    width: width / 2,
    height: height * 0.04,
    borderLeftWidth: 0.3,
    borderRightWidth: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#cfcfcf',
  },
});

export default ActivityList;
