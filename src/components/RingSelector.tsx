import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import type { GearPair } from '../game/types';
import { isGeared } from '../game/validate';

type Props = {
  count: number;
  selected: number;
  gearedPairs: GearPair[];
  onSelect: (index: number) => void;
};

/** R1..Rn pill row. A verdigris dot marks a ring that drags a partner along. */
function RingSelectorBase({ count, selected, gearedPairs, onSelect }: Props) {
  const items: number[] = [];
  for (let i = 0; i < count; i++) {
    items.push(i);
  }

  return (
    <View style={styles.row}>
      {items.map(index => {
        const active = index === selected;
        const geared = isGeared(gearedPairs, index);
        return (
          <Pressable
            key={'ring-pill-' + String(index)}
            accessibilityRole="button"
            accessibilityLabel={'Select ring ' + String(index + 1)}
            onPress={() => onSelect(index)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={[styles.pill, active ? styles.pillActive : null]}>
            <Text
              style={[styles.label, active ? styles.labelActive : null]}
              numberOfLines={1}>
              {'R' + String(index + 1)}
            </Text>
            {geared ? <View style={styles.gearDot} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%' },
  pill: {
    flex: 1,
    height: 36,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(245,235,216,0.05)',
    borderWidth: 1,
    borderColor: theme.colors.ui.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: 'rgba(184,134,59,0.24)',
    borderColor: theme.colors.brass.primary,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.text.faint,
  },
  labelActive: { color: theme.colors.brass.light },
  gearDot: {
    position: 'absolute',
    top: 5,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.accent.verdigris,
  },
});

export const RingSelector = memo(RingSelectorBase);
