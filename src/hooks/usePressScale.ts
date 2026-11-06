import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { theme } from '../constants/theme';

/**
 * Press feedback for the Pressable-OUTSIDE / Animated.View-INSIDE pattern.
 * Only `transform` is animated, so the native driver is safe.
 */
export function usePressScale(pressedScale: number = 0.95) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: pressedScale,
      tension: theme.animation.ui.tension,
      friction: theme.animation.ui.friction,
      useNativeDriver: true,
    }).start();
  }, [pressedScale, scale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.animation.ui.tension,
      friction: theme.animation.ui.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}
