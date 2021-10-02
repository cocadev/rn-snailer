import React, {useCallback} from 'react';
import {TextInput, StyleSheet, Dimensions} from 'react-native';

const VALID_FIRST = /^[1-9]{1}$/;
const VALID_NEXT = /^[0-9]{1}$/;

const PriceCurrency = ({
  className = '',
  max = Number.MAX_SAFE_INTEGER,
  onValueChange,
  style = {},
  value,
  onBlur,
  placeholder,
}) => {
  const valueAbsTrunc = Math.trunc(Math.abs(value));
  if (
    value !== valueAbsTrunc ||
    !Number.isFinite(value) ||
    Number.isNaN(value)
  ) {
  }

  const handleKeyPress = useCallback(
    (e) => {
      const key = e.nativeEvent.key;
      const keyCode = '';
      if (
        (value === 0 && !VALID_FIRST.test(key)) ||
        (value !== 0 && !VALID_NEXT.test(key) && key !== 'Backspace')
      ) {
        return;
      }

      const valueString = value.toString();
      let nextValue;
      if (key !== 'Backspace') {
        const nextValueString = value === 0 ? key : `${valueString}${key}`;
        nextValue = Number.parseInt(nextValueString, 10);
      } else {
        const nextValueString = valueString.slice(0, -1);
        nextValue =
          nextValueString === '' ? 0 : Number.parseInt(nextValueString, 10);
      }
      if (nextValue > max) {
        return;
      }
      onValueChange(nextValue);
    },
    [max, onValueChange, value],
  );

  const handleChange = useCallback(() => {
    // DUMMY TO AVOID REACT WARNING
  }, []);

  const valueDisplay = (value / 100).toFixed(2);

  return (
    <TextInput
      className={className}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
      style={style}
      value={valueDisplay}
      maxLength={valueDisplay.length}
      onBlur={onBlur}
      // keyboardType="numeric"
      placeholder={placeholder}
    />
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  priceTextInput: {
    width: width * 0.6,
    paddingHorizontal: width * 0.03,
    backgroundColor: 'white',
    height: height * 0.12,
  },
});

export default PriceCurrency;
