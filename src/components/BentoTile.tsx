import React, { memo } from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import { BrassSurface } from './BrassSurface';

type Props = {
  height: number;
  children: React.ReactNode;
  onPress?: () => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
  radius?: number;
  colors?: string[];
  borderColor?: string;
};

/** The Menu grid primitive. Tappable tiles keep the Pressable on the outside. */
function BentoTileBase({
  height,
  children,
  onPress,
  label,
  style,
  radius = theme.radius.xl,
  colors,
  borderColor,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.97);

  const surface = (
    <BrassSurface
      radius={radius}
      colors={colors}
      borderColor={borderColor}
      style={[styles.surface, { height }]}>
      {children}
    </BrassSurface>
  );

  if (!onPress) {
    return <View style={[styles.wrap, style]}>{surface}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={style}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.wrap, { transform: [{ scale }] }]}>
        {surface}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  surface: { width: '100%' },
});

export const BentoTile = memo(BentoTileBase);
