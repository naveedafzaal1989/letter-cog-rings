import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { Cog, Home, RotateCw, Wind } from 'lucide-react-native';
import { BrassSurface } from '../components/BrassSurface';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatCard } from '../components/StatCard';
import { WordRow } from '../components/WordRow';
import { TokenBadge } from '../components/TokenBadge';
import { theme } from '../constants/theme';
import type { SolveResult } from '../game/types';

type Props = {
  result: SolveResult;
  tokens: number;
  onPlayAgain: () => void;
  onMenu: () => void;
};

const VERDICT_COPY = {
  under: 'UNDER PAR · +3 COG TOKENS',
  on: 'ON PAR · +2 COG TOKENS',
  over: 'OVER PAR · +1 COG TOKEN',
};

export function MachineRunningScreen({
  result,
  tokens,
  onPlayAgain,
  onMenu,
}: Props) {
  const headline = useRef(new Animated.Value(0)).current;
  const hero = useRef(new Animated.Value(0)).current;
  const rowAnims = useRef(
    result.words.map(() => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    Animated.spring(headline, {
      toValue: 1,
      tension: 52,
      friction: 7,
      useNativeDriver: true,
    }).start();

    Animated.stagger(
      90,
      rowAnims.map(value =>
        Animated.timing(value, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
      ),
    ).start();

    Animated.loop(
      Animated.timing(hero, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [headline, hero, rowAnims]);

  const verdictColor =
    result.verdict === 'under'
      ? theme.colors.accent.verdigris
      : result.verdict === 'on'
      ? theme.colors.brass.light
      : theme.colors.accent.warning;

  const heroSpin = hero.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const headlineScale = headline.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  const bonusChips = useMemo(() => result.bonusWords.slice(0, 8), [result]);

  return (
    <ScreenBackground variant="result">
      <View style={styles.root}>
        <ScreenHeader
          title="MACHINE REPORT"
          subtitle={'PAR ' + String(result.par)}
          leftSlot={
            <View style={styles.headerGlyph}>
              <Cog size={26} color={theme.colors.brass.light} strokeWidth={2.2} />
            </View>
          }
          rightSlot={<TokenBadge tokens={tokens} />}
        />

        <View style={styles.body}>
          {/* decor stays OUTSIDE the headline box - never across the letters */}
          <View style={styles.headlineRow}>
            <View style={styles.puff}>
              <Wind size={30} color={theme.colors.accent.verdigris} strokeWidth={2} />
            </View>
            <Animated.Text
              style={[
                styles.headline,
                { opacity: headline, transform: [{ scale: headlineScale }] },
              ]}>
              MACHINE RUNNING
            </Animated.Text>
            <View style={styles.puff}>
              <Wind size={30} color={theme.colors.accent.verdigris} strokeWidth={2} />
            </View>
          </View>

          <View style={styles.heroWrap}>
            <View style={styles.medallion}>
              <Animated.View
                style={[styles.hero, { transform: [{ rotate: heroSpin }] }]}>
                <Cog size={92} color={theme.colors.brass.light} strokeWidth={1.6} />
              </Animated.View>
            </View>
          </View>

          <BrassSurface
            radius={theme.radius.xl}
            colors={[theme.colors.bg.tertiary, theme.colors.bg.secondary]}
            style={styles.wordPanel}>
            <Text style={styles.panelLabel}>SPOKES POWERED</Text>
            {result.words.map((word, index) => (
              <WordRow
                key={word + String(index)}
                word={word}
                index={index}
                progress={rowAnims[index]}
              />
            ))}
          </BrassSurface>

          <View style={styles.statRow}>
            <View style={styles.statSlot}>
              <StatCard
                value={result.turns}
                label="TURNS"
                valueColor={theme.colors.brass.light}
              />
            </View>
            <View style={styles.statSlot}>
              <StatCard
                value={result.par}
                label="PAR"
                valueColor={theme.colors.text.secondary}
              />
            </View>
            <View style={styles.statSlot}>
              <StatCard
                value={result.bonusWords.length}
                label="BONUS"
                valueColor={theme.colors.accent.verdigris}
              />
            </View>
          </View>

          <Text style={[styles.verdict, { color: verdictColor }]} numberOfLines={1}>
            {VERDICT_COPY[result.verdict]}
          </Text>

          {bonusChips.length > 0 ? (
            <View style={styles.chipRow}>
              {bonusChips.map(word => (
                <View key={'chip-' + word} style={styles.chip}>
                  <Text style={styles.chipText}>{word}</Text>
                </View>
              ))}
            </View>
          ) : null}

          <View style={styles.ctas}>
            <PrimaryButton label="SOLVE AGAIN" Icon={RotateCw} onPress={onPlayAgain} />
            <SecondaryButton label="WORKSHOP ROOMS" Icon={Home} onPress={onMenu} />
          </View>
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerGlyph: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 24 },
  headlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  puff: {
    width: 44,
    height: 44,
    opacity: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: 2.4,
    textAlign: 'center',
    color: theme.colors.accent.verdigris,
    textShadowColor: 'rgba(95,201,179,0.50)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  heroWrap: { alignItems: 'center', marginTop: 10 },
  medallion: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 2,
    borderColor: 'rgba(184,134,59,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: { width: 96, height: 96, alignItems: 'center', justifyContent: 'center' },
  wordPanel: { marginTop: 14, padding: 14 },
  panelLabel: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.text.faint,
    marginBottom: 6,
  },
  statRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  statSlot: { flex: 1 },
  verdict: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.4,
    textAlign: 'center',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    justifyContent: 'center',
  },
  chip: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(95,201,179,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(95,201,179,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.accent.verdigris,
  },
  ctas: { marginTop: 'auto', gap: 10, paddingTop: 14 },
});
