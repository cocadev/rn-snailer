import React from 'react';
import {Dimensions, View, StyleSheet, ActivityIndicator} from 'react-native';

export const Loader = ({loading}) => (
  <>
    {loading && (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#468c64" style={styles.loader} />
      </View>
    )}
  </>
);

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: width,
    height: height,
    alignSelf: 'center',
    zIndex: 100,
  },
  loader: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
  },
});
