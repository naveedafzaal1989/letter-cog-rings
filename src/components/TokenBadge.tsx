import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Cog } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { useCountUp } from '../hooks/useCountUp';

type Props = { tokens: number };

/** Cog-token pill with a count-up and a pop on every change. */
function TokenBadgeBase({ tokens }: Props) {
  const shown = useCountUp(tokens, 700);
  const scale = useRef(new Animated.Value(1)).current;
  const previous = useRef(tokens);

  useEffect(() => {
    if (previous.current === tokens) {
      return;
    }
    previous.current = tokens;
    scale.setValue(1.18);
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.animation.pop.tension,
      friction: theme.animation.pop.friction,
      useNativeDriver: true,
    }).start();
  }, [tokens, scale]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.pill, { transform: [{ scale }] }]}>
      <View style={styles.row}>
        <Cog size={18} color={theme.colors.brass.primary} strokeWidth={2.4} />
        <Text style={styles.value}>{shown}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bg.tertiary,
    borderWidth: 1,
    borderColor: 'rgba(184,134,59,0.40)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  value: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '800',
    color: theme.colors.brass.light,
    fontVariant: ['tabular-nums'],
  },
});

export const TokenBadge = memo(TokenBadgeBase);
