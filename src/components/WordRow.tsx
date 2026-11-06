import React, { memo } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  word: string;
  index: number;
  progress: Animated.Value;
};

/** One solved word on the result screen. */
function WordRowBase({ word, progress }: Props) {
  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.row, { opacity: progress, transform: [{ translateY }] }]}>
      <View style={styles.dot} />
      <Text style={styles.word} numberOfLines={1}>
        {word}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.accent.verdigris,
  },
  word: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: 3,
    color: theme.colors.text.primary,
  },
});

export const WordRow = memo(WordRowBase);
