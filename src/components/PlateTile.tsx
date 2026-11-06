import React, { memo, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Cog, Lock } from 'lucide-react-native';
import { theme } from '../constants/theme';
import type { Plate } from '../constants/plates';
import { usePressScale } from '../hooks/usePressScale';

type Props = {
  plate: Plate;
  size: number;
  owned: boolean;
  affordable: boolean;
  onBuy: (plate: Plate) => void;
};

function PlateTileBase({ plate, size, owned, affordable, onBuy }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.94);
  const flash = useRef(new Animated.Value(0)).current;
  const wasOwned = useRef(owned);

  useEffect(() => {
    if (owned && !wasOwned.current) {
      wasOwned.current = true;
      flash.setValue(1);
      Animated.timing(flash, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [owned, flash]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        owned ? plate.name + ' plate owned' : 'Buy the ' + plate.name + ' plate'
      }
      onPress={() => onBuy(plate)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={owned || !affordable}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={{ width: size, height: size }}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.tile,
          {
            width: size,
            height: size,
            borderColor: owned
              ? 'rgba(95,201,179,0.55)'
              : theme.colors.ui.hairline,
            transform: [{ scale }],
          },
        ]}>
        <LinearGradient
          colors={
            owned
              ? [theme.colors.brass.shimmer, theme.colors.brass.primary, theme.colors.brass.dark]
              : [theme.colors.bg.alt, theme.colors.bg.tertiary]
          }
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={[styles.sprite, owned ? null : styles.spriteLocked]}>
          <Cog
            size={26}
            color={owned ? theme.colors.bg.deep : theme.colors.text.faint}
            strokeWidth={2.2}
          />
        </LinearGradient>
        <Text
          style={[styles.name, owned ? styles.nameOwned : null]}
          numberOfLines={1}>
          {plate.name}
        </Text>
        {owned ? (
          <Text style={styles.ownedTag}>{'✓ OWNED'}</Text>
        ) : (
          <View style={styles.costRow}>
            {affordable ? (
              <Cog size={14} color={theme.colors.text.faint} strokeWidth={2.4} />
            ) : (
              <Lock size={14} color={theme.colors.text.faint} strokeWidth={2.4} />
            )}
            <Text style={styles.cost}>{String(plate.cost)}</Text>
          </View>
        )}
        <Animated.View pointerEvents="none" style={[styles.flash, { opacity: flash }]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
    overflow: 'hidden',
  },
  sprite: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spriteLocked: { opacity: 0.45 },
  name: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: theme.colors.text.faint,
  },
  nameOwned: { color: theme.colors.text.secondary },
  ownedTag: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.accent.verdigris,
  },
  costRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cost: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    color: theme.colors.text.faint,
    fontVariant: ['tabular-nums'],
  },
  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(95,201,179,0.35)',
  },
});

export const PlateTile = memo(PlateTileBase);
