import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { theme } from '../constants/theme';

type Props = { word: string | null };

/** Slide-down pill shown when an unmarked spoke turns into a real word. */
function BonusToastBase({ word }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: word ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [word, progress]);

  if (!word) {
    return null;
  }

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-28, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.toast, { opacity: progress, transform: [{ translateY }] }]}>
      <Text style={styles.text} numberOfLines={1}>
        {'BONUS · ' + word + ' · +2'}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 8,
    alignSelf: 'center',
    paddingHorizontal: 16,
    height: 34,
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(95,201,179,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(95,201,179,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  text: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.accent.verdigris,
  },
});

export const BonusToast = memo(BonusToastBase);
