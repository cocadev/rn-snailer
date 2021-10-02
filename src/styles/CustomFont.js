import React from 'react';
import {Text, TextInput as RNTextInput} from 'react-native';

export const CustomFont = props => (
  <Text {...props} style={[{fontFamily: 'Ubuntu-Regular'}, props.style]}>
    {props.children}
  </Text>
);

export const CustomFontInput = props => {
  return (
    <RNTextInput
      {...props}
      style={[{fontFamily: 'Ubuntu-Regular'}, props.style]}>
      {props.children}
    </RNTextInput>
  );
};
