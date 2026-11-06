import React, { memo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Droplet, RotateCcw, RotateCw, Undo2 } from 'lucide-react-native';
import { theme } from '../constants/theme';
import type { GearPair } from '../game/types';
import { usePressScale } from '../hooks/usePressScale';
import { IconButton } from './IconButton';
import { RingSelector } from './RingSelector';

type Props = {
  ringCount: number;
  selectedRing: number;
  gearedPairs: GearPair[];
  hints: number;
  canUndo: boolean;
  disabled: boolean;
  onSelectRing: (index: number) => void;
  onRotate: (dir: 1 | -1) => void;
  onUndo: () => void;
  onHint: () => void;
};

function HintButton({
  hints,
  disabled,
  onPress,
}: {
  hints: number;
  disabled: boolean;
  onPress: () => void;
}) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.92);
  const out = hints <= 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Use an oil can hint"
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled || out}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.hintPress, out ? styles.hintOut : null]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.hintFill, { transform: [{ scale }] }]}>
        <View style={styles.center}>
          <Droplet size={24} color={theme.colors.accent.verdigris} strokeWidth={2.4} />
        </View>
      </Animated.View>
      <View style={styles.badge} pointerEvents="none">
        <Text style={styles.badgeText}>{String(hints)}</Text>
      </View>
    </Pressable>
  );
}

/** G2 floating controls: a brass bar hovering over the machine. */
function FloatingControlBarBase({
  ringCount,
  selectedRing,
  gearedPairs,
  hints,
  canUndo,
  disabled,
  onSelectRing,
  onRotate,
  onUndo,
  onHint,
}: Props) {
  return (
    <View style={styles.bar} pointerEvents="box-none">
      <RingSelector
        count={ringCount}
        selected={selectedRing}
        gearedPairs={gearedPairs}
        onSelect={onSelectRing}
      />
      <View style={styles.controls}>
        <IconButton
          Icon={Undo2}
          label="Undo the last turn"
          size={52}
          tone="neutral"
          disabled={disabled || !canUndo}
          onPress={onUndo}
        />
        <IconButton
          Icon={RotateCcw}
          label="Turn the selected ring counter clockwise"
          size={60}
          tone="brass"
          disabled={disabled}
          onPress={() => onRotate(-1)}
        />
        <IconButton
          Icon={RotateCw}
          label="Turn the selected ring clockwise"
          size={60}
          tone="brass"
          disabled={disabled}
          onPress={() => onRotate(1)}
        />
        <HintButton hints={hints} disabled={disabled} onPress={onHint} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: theme.radius.xxl,
    backgroundColor: 'rgba(26,22,17,0.94)',
    borderWidth: 1,
    borderColor: 'rgba(184,134,59,0.45)',
    gap: 12,
    ...theme.shadows.deep,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  center: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintPress: { width: 52, height: 52, borderRadius: 14 },
  hintOut: { opacity: 0.4 },
  hintFill: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(95,201,179,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(95,201,179,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: theme.colors.accent.verdigris,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    color: theme.colors.bg.deep,
  },
});

export const FloatingControlBar = memo(FloatingControlBarBase);
