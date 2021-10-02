import React, {useState} from 'react';
import {Text, View, Platform, UIManager, LayoutAnimation} from 'react-native';

export const MultiColumnList = ({
  data,
  extraData,
  initialDataLength,
  RenderItem,
  showMoreTextStyle,
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

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}>
        {data
          .filter((item, index) => {
            if (showMore) return true;
            return index < initialDataLength;
          })
          .map((item, index) => (
            <RenderItem key={item.id || index} {...{item, extraData}} />
          ))}
      </View>
      {data.length > initialDataLength && (
        <Text onPress={handleToggleShowMore} style={showMoreTextStyle}>
          {showMore ? 'Show less' : 'Show more'}
        </Text>
      )}
    </>
  );
};

const collapseDuration = 250;
const springDamping = 0.7;
