import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Auth} from 'states/redux/reducers/auth';
import {Setting} from 'states/redux/reducers/setting';
import {Order} from 'states/redux/reducers/order';
import {Fcm} from 'states/redux/reducers/notification'

import thunk from 'redux-thunk';
import logger from 'redux-logger';
import {
  createMigrate,
  persistStore,
  persistCombineReducers,
} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

//import * as Keychain from 'react-native-keychain';

const migrations = {
  // 0: (state) => {
  //   // migration clear out device state
  //   return {
  // 	...state,
  // 	device: undefined
  //   }
  // },
  1: (state) => {
    // migration to keep only device state
    return {};
  },
};

const config = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  migrate: createMigrate(migrations, {debug: false}),
};

const store = createStore(
  persistCombineReducers(config, {
    auth: Auth,
    setting: Setting,
    order: Order,
    fcm: Fcm,
  }),
  applyMiddleware(
    thunk,
    //logger
  ),
);

export const persistor = persistStore(store);
//persistor.purge();

export default store;
