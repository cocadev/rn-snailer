import React, {useState} from 'react';
import {Text, View, LayoutAnimation, Platform, UIManager} from 'react-native';

export const TextCollapse = ({
  text,
  initialTextLength,
  containerStyle,
  textStyle,
  showMoreTextStyle,
  collapseType,
}) => {
  const [showMore, setShowMore] = useState(false);

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const LayoutAnimation_ = {
    duration: collapseDuration,
    create: {
      property: LayoutAnimation.Properties.scaleY,
    },
    update: {
      springDamping: springDamping,
    },
  };

  const handleToggleShowMore = () => {
    LayoutAnimation.configureNext(LayoutAnimation_);
    setShowMore(prev => !prev);
  };

  const shouldTrimmed = text.length > initialTextLength;
  const trimmedText = shouldTrimmed
    ? text.substring(0, initialTextLength) + '...'
    : text;

  return (
    <View style={{width: '100%', overflow: 'hidden'}}>
      <View style={containerStyle}>
        <Text style={textStyle} onPress={handleToggleShowMore}>
          {showMore ? text : trimmedText}
          {shouldTrimmed && (
            <Text style={showMoreTextStyle}>{showMore ? 'less' : 'more'}</Text>
          )}
        </Text>
      </View>
    </View>
  );
};

const collapseDuration = 250;
const springDamping = 0.7;

export const ShowHide = ({
  containerStyle,
  textStyle,
  showMoreTextStyle,
  children,
}) => {
  const [showMore, setShowMore] = useState(false);

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  
  const LayoutAnimation_ = {
    duration: 300,
    create: {
      type: LayoutAnimation.Types.linear,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.linear,
    },
    delete: {
      duration: 50,
      type: LayoutAnimation.Types.linear,
      property: LayoutAnimation.Properties.opacity,
    },
  };

  const handleToggleShowMore = () => {
    LayoutAnimation.configureNext(LayoutAnimation_);
    setShowMore(prev => !prev);
  };

  return (
    <View style={{width: '100%', overflow: 'hidden'}}>
      <View style={containerStyle}>
        <Text style={textStyle} onPress={handleToggleShowMore}>
          {showMore && children}
          <Text style={showMoreTextStyle}>{showMore ? 'Hide' : 'Show'}</Text>
        </Text>
      </View>
    </View>
  );
};
