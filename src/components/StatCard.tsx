import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { BrassSurface } from './BrassSurface';

type Props = {
  value?: string | number;
  label: string;
  valueColor: string;
};

/**
 * One stat pill. No raster icon by design - an accent dot carries the
 * semantics, so every pill in a row is pixel-identical in shape.
 * Returns null when there is nothing to show (no empty skeleton boxes).
 */
function StatCardBase({ value, label, valueColor }: Props) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  return (
    <BrassSurface
      radius={theme.radius.lg}
      colors={[theme.colors.bg.tertiary, theme.colors.bg.secondary]}
      borderColor={valueColor + '55'}
      style={styles.card}>
      <View style={[styles.dot, { backgroundColor: valueColor }]} />
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </BrassSurface>
  );
}

const styles = StyleSheet.create({
  // width:'100%' - never flex:1 inside a flex:1 slot (rule #19a)
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.muted,
  },
});

export const StatCard = memo(StatCardBase);
