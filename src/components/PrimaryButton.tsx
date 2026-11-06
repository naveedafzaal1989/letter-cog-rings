import React, { memo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

const ICON = 24;

type Props = {
  label: string;
  onPress: () => void;
  Icon?: LucideIcon;
  disabled?: boolean;
  height?: number;
};

/**
 * h56 brass CTA. Pressable is the PARENT, the Animated.View is the child -
 * the only arrangement that keeps onPress alive on Android release builds.
 */
function PrimaryButtonBase({
  label,
  onPress,
  Icon,
  disabled = false,
  height = 56,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.95);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.press, { height }, disabled ? styles.disabled : null]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.animated, { height }, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={theme.gradients.brass}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.fill, { height }]}>
          <View style={styles.row}>
            {Icon ? (
              <Icon size={ICON} color={theme.colors.text.onBrass} strokeWidth={2.6} />
            ) : null}
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    borderRadius: 14,
    ...theme.shadows.brass,
  },
  disabled: { opacity: 0.45 },
  animated: {
    width: '100%',
    borderRadius: 14,
  },
  fill: {
    width: '100%',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245,235,216,0.28)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 16,
    lineHeight: ICON,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: theme.colors.text.onBrass,
  },
});

export const PrimaryButton = memo(PrimaryButtonBase);
