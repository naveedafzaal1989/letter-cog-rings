import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CalendarCheck, Cog, Medal, Play } from 'lucide-react-native';
import { BentoTile } from '../components/BentoTile';
import { GearPrimerOverlay } from '../components/GearPrimerOverlay';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatCard } from '../components/StatCard';
import { TokenBadge } from '../components/TokenBadge';
import { PLATES } from '../constants/plates';
import { TOTAL_MACHINES } from '../constants/config';
import { theme } from '../constants/theme';
import { machineNoInRoom, roomForMachine } from '../constants/rooms';
import type { Progress } from '../hooks/useProgress';
import { SCREEN_H } from '../utils/geometry';

type Props = {
  progress: Progress;
  parRate: number;
  onStart: () => void;
  onPlates: () => void;
};

const GRID_H = SCREEN_H - 116 - 32 - 26 - 8 - 46 - 36;
const START_H = Math.max(142, Math.min(176, Math.round(GRID_H * 0.44)));
const STAT_H = Math.max(82, Math.min(96, Math.round(GRID_H * 0.24)));
const ROW_H = Math.max(90, Math.min(108, Math.round(GRID_H * 0.27)));

const TILE_ORDER = [0, 1, 2, 3];

export function MenuScreen({ progress, parRate, onStart, onPlates }: Props) {
  const [primerOpen, setPrimerOpen] = useState(false);

  const room = useMemo(
    () => roomForMachine(progress.machineIndex),
    [progress.machineIndex],
  );
  const machineNo = machineNoInRoom(progress.machineIndex);
  const solved = progress.solvedIds.length;

  // Staggered mount - opacity + translateY only, so native driver is safe.
  const anims = useRef(TILE_ORDER.map(() => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(
      70,
      anims.map(value =>
        Animated.timing(value, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [anims]);

  const tileStyle = (index: number) => ({
    opacity: anims[index],
    transform: [
      {
        translateY: anims[index].interpolate({
          inputRange: [0, 1],
          outputRange: [18, 0],
        }),
      },
    ],
  });

  return (
    <ScreenBackground variant="menu">
      <View style={styles.root}>
        <ScreenHeader
          align="left"
          title="LETTER COG"
          subtitle="WORKSHOP"
          leftSlot={
            <LinearGradient
              colors={theme.gradients.hub}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.8, y: 1 }}
              style={styles.brandMark}>
              <Cog size={20} color={theme.colors.bg.deep} strokeWidth={2.2} />
            </LinearGradient>
          }
          rightSlot={<TokenBadge tokens={progress.tokens} />}
        />

        <View style={styles.body}>
          {/* hint sits ABOVE the CTA block, never under it (rule #19) */}
          <Text style={styles.tagline}>TURN THE RINGS · LIGHT EVERY SPOKE</Text>

          <Animated.View style={tileStyle(0)} pointerEvents="box-none">
            <BentoTile height={START_H} borderColor={theme.colors.ui.hairlineStrong}>
              <View style={styles.startSprite} pointerEvents="none">
                <Cog size={92} color={theme.colors.ui.hairlineStrong} strokeWidth={1.4} />
              </View>
              <View style={styles.startInner}>
                <Text style={styles.roomLine} numberOfLines={1}>
                  {'ROOM ' + String(room.id) + ' · ' + room.name}
                </Text>
                <Text style={styles.machineLine} numberOfLines={1}>
                  {'MACHINE ' +
                    String(machineNo) +
                    ' · ' +
                    String(progress.machineIndex + 1) +
                    ' / ' +
                    String(TOTAL_MACHINES)}
                </Text>
                <View style={styles.ctaWrap}>
                  <PrimaryButton label="START MACHINE" Icon={Play} onPress={onStart} />
                </View>
              </View>
            </BentoTile>
          </Animated.View>

          <Animated.View style={tileStyle(1)} pointerEvents="box-none">
            {solved > 0 ? (
              <View style={styles.statRow}>
                <View style={styles.statSlot}>
                  <StatCard
                    value={solved}
                    label="SOLVED"
                    valueColor={theme.colors.accent.verdigris}
                  />
                </View>
                <View style={styles.statSlot}>
                  <StatCard
                    value={String(parRate) + '%'}
                    label="PAR RATE"
                    valueColor={theme.colors.brass.light}
                  />
                </View>
              </View>
            ) : (
              <BentoTile height={STAT_H}>
                <View style={styles.hintCard}>
                  <Text style={styles.hintHead}>PUZZLE 1 OF 150 IS WAITING</Text>
                  <Text style={styles.hintBody}>
                    Every spoke of the machine must spell a real word.
                  </Text>
                </View>
              </BentoTile>
            )}
          </Animated.View>

          <Animated.View style={[styles.rowTiles, tileStyle(2)]} pointerEvents="box-none">
            <BentoTile height={ROW_H} style={styles.dailySlot}>
              <View style={styles.tileInner}>
                <View style={styles.tileHead}>
                  <CalendarCheck
                    size={22}
                    color={theme.colors.accent.verdigris}
                    strokeWidth={2.4}
                  />
                  <Text style={styles.tileLabel}>DAILY MACHINE</Text>
                </View>
                <Text style={styles.tileValue}>
                  {'STREAK ' + String(progress.dailyStreak)}
                </Text>
                <View style={styles.dotStrip}>
                  {[0, 1, 2, 3, 4, 5, 6].map(day => (
                    <View
                      key={'day-' + String(day)}
                      style={[
                        styles.dayDot,
                        day < progress.dailyStreak ? styles.dayDotOn : null,
                      ]}
                    />
                  ))}
                </View>
              </View>
            </BentoTile>

            <BentoTile
              height={ROW_H}
              style={styles.platesSlot}
              onPress={onPlates}
              label="Open the plate collection">
              <View style={styles.tileInner}>
                <View style={styles.tileHead}>
                  <Medal size={22} color={theme.colors.brass.light} strokeWidth={2.4} />
                  <Text style={styles.tileLabel}>PLATES</Text>
                </View>
                <Text style={styles.tileValue}>
                  {String(progress.ownedPlates.length) +
                    ' / ' +
                    String(PLATES.length)}
                </Text>
                <Text style={styles.tileSub}>COSMETIC ONLY</Text>
              </View>
            </BentoTile>
          </Animated.View>

          <Animated.View style={tileStyle(3)} pointerEvents="box-none">
            <SecondaryButton
              label="GEAR PRIMER"
              height={46}
              onPress={() => setPrimerOpen(true)}
            />
          </Animated.View>
        </View>
      </View>

      <GearPrimerOverlay visible={primerOpen} onClose={() => setPrimerOpen(false)} />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  brandMark: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, padding: 16, gap: 12 },
  tagline: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.muted,
    marginBottom: -4,
  },
  startInner: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 108,
    justifyContent: 'center',
  },
  // positive offsets only, so the sprite never pokes out of the rounded tile
  startSprite: {
    position: 'absolute',
    right: 12,
    top: 16,
    width: 92,
    height: 92,
    opacity: 0.95,
  },
  roomLine: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.muted,
  },
  machineLine: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  ctaWrap: { marginTop: 14, paddingRight: 0 },
  statRow: { flexDirection: 'row', gap: 12 },
  statSlot: { flex: 1 },
  hintCard: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  hintHead: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: theme.colors.brass.light,
  },
  hintBody: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: theme.colors.text.muted,
  },
  rowTiles: { flexDirection: 'row', gap: 12 },
  dailySlot: { flex: 1.3 },
  platesSlot: { flex: 1 },
  tileInner: { flex: 1, padding: 12, justifyContent: 'center' },
  tileHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tileLabel: {
    fontSize: 10,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.text.secondary,
  },
  tileValue: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  tileSub: {
    marginTop: 4,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.text.faint,
  },
  dotStrip: { flexDirection: 'row', gap: 6, marginTop: 8 },
  dayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(245,235,216,0.14)',
  },
  dayDotOn: { backgroundColor: theme.colors.accent.verdigris },
});
