import React, { memo } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

type Props = {
  /** Either a lucide icon or a PNG glyph - both render at the same size. */
  Icon?: LucideIcon;
  image?: ImageSourcePropType;
  onPress: () => void;
  label: string;
  size?: number;
  tone?: 'neutral' | 'accent' | 'brass';
  disabled?: boolean;
  iconSize?: number;
};

const TONES = {
  neutral: {
    backgroundColor: theme.colors.ui.glass,
    borderColor: theme.colors.ui.hairline,
    color: theme.colors.text.secondary,
  },
  brass: {
    backgroundColor: theme.colors.bg.secondary,
    borderColor: theme.colors.ui.hairlineStrong,
    color: theme.colors.brass.light,
  },
  accent: {
    backgroundColor: 'rgba(95,201,179,0.12)',
    borderColor: 'rgba(95,201,179,0.45)',
    color: theme.colors.accent.verdigris,
  },
};

function IconButtonBase({
  Icon,
  image,
  onPress,
  label,
  size = 52,
  tone = 'neutral',
  disabled = false,
  iconSize = 24,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.92);
  const palette = TONES[tone];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[
        styles.press,
        { width: size, height: size },
        disabled ? styles.disabled : null,
      ]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.fill,
          {
            width: size,
            height: size,
            backgroundColor: palette.backgroundColor,
            borderColor: palette.borderColor,
            transform: [{ scale }],
          },
        ]}>
        <View style={styles.center}>
          {image ? (
            <Image
              source={image}
              style={{ width: iconSize, height: iconSize }}
              resizeMode="contain"
            />
          ) : Icon ? (
            <Icon size={iconSize} color={palette.color} strokeWidth={2.4} />
          ) : null}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { borderRadius: 14 },
  disabled: { opacity: 0.35 },
  fill: {
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const IconButton = memo(IconButtonBase);
