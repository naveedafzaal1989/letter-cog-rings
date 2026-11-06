import React, { memo, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Line } from 'react-native-svg';
import { Cog } from 'lucide-react-native';
import { NOTCH_SNAP_MS } from '../constants/config';
import { theme } from '../constants/theme';
import type { Machine } from '../game/types';
import { mod } from '../game/validate';
import {
  DISC,
  HUB_R,
  R_OUT,
  angleDelta,
  notchAngleDeg,
  polarToXY,
  ringFromTouch,
  ringGeometry,
  touchAngleDeg,
} from '../utils/geometry';

const DEG_RANGE = 36000;
const MACHINE_BOX = DISC + 24;

type Props = {
  machine: Machine;
  offsets: number[];
  selectedRing: number;
  validSpokes: number[];
  hintRing: number;
  locked: boolean;
  onNotch: (ringIndex: number, dir: 1 | -1) => void;
  onSelectRing: (ringIndex: number) => void;
};

function shortestDelta(from: number, to: number, size: number): number {
  const raw = mod(to - from, size);
  return raw > size / 2 ? raw - size : raw;
}

function RingMachineBase({
  machine,
  offsets,
  selectedRing,
  validSpokes,
  hintRing,
  locked,
  onNotch,
  onSelectRing,
}: Props) {
  const { ringCount, notchCount, rings, spokes, geared } = machine;
  const geo = useMemo(() => ringGeometry(ringCount), [ringCount]);
  const step = 360 / notchCount;

  // One Animated.Value per ring, in degrees, kept unwrapped so a 7 -> 0 turn
  // rotates by one notch instead of winding back seven.
  const anims = useRef<Animated.Value[]>(
    machine.startOffsets.map(o => new Animated.Value(-o * (360 / notchCount))),
  ).current;
  const unwrapped = useRef<number[]>(machine.startOffsets.slice());
  const prevOffsets = useRef<number[]>(machine.startOffsets.slice());

  useEffect(() => {
    const animations: Animated.CompositeAnimation[] = [];
    for (let i = 0; i < ringCount; i++) {
      const delta = shortestDelta(prevOffsets.current[i], offsets[i], notchCount);
      if (delta === 0) {
        continue;
      }
      unwrapped.current[i] += delta;
      animations.push(
        Animated.timing(anims[i], {
          toValue: -unwrapped.current[i] * step,
          duration: NOTCH_SNAP_MS,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      );
    }
    prevOffsets.current = offsets.slice();
    if (animations.length > 0) {
      Animated.parallel(animations).start();
    }
  }, [offsets, anims, notchCount, ringCount, step]);

  // Hint pulse on the suspect ring.
  const hintPulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (hintRing < 0) {
      hintPulse.setValue(0);
      return;
    }
    Animated.loop(
      Animated.sequence([
        Animated.timing(hintPulse, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(hintPulse, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 3 },
    ).start();
  }, [hintRing, hintPulse]);

  // Stable refs, so the PanResponder is created exactly once (rule #8).
  const lockedRef = useRef(locked);
  const notchRef = useRef(onNotch);
  const selectRef = useRef(onSelectRing);
  const ringCountRef = useRef(ringCount);
  const stepRef = useRef(step);
  lockedRef.current = locked;
  notchRef.current = onNotch;
  selectRef.current = onSelectRing;
  ringCountRef.current = ringCount;
  stepRef.current = step;

  const dragRing = useRef(-1);
  const lastAngle = useRef(0);
  const accum = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !lockedRef.current,
      onMoveShouldSetPanResponder: () => !lockedRef.current,
      onPanResponderGrant: evt => {
        const x = evt.nativeEvent.locationX;
        const y = evt.nativeEvent.locationY;
        const ring = ringFromTouch(x, y, ringCountRef.current);
        dragRing.current = ring;
        accum.current = 0;
        lastAngle.current = touchAngleDeg(x, y);
        if (ring >= 0) {
          selectRef.current(ring);
        }
      },
      onPanResponderMove: evt => {
        if (lockedRef.current || dragRing.current < 0) {
          return;
        }
        const x = evt.nativeEvent.locationX;
        const y = evt.nativeEvent.locationY;
        const angle = touchAngleDeg(x, y);
        accum.current += angleDelta(lastAngle.current, angle);
        lastAngle.current = angle;
        while (Math.abs(accum.current) >= stepRef.current) {
          const dir: 1 | -1 = accum.current > 0 ? 1 : -1;
          // A clockwise drag must carry the letters clockwise, which is a
          // NEGATIVE offset step.
          notchRef.current(dragRing.current, dir === 1 ? -1 : 1);
          accum.current -= dir * stepRef.current;
        }
      },
      onPanResponderRelease: () => {
        dragRing.current = -1;
        accum.current = 0;
      },
      onPanResponderTerminate: () => {
        dragRing.current = -1;
        accum.current = 0;
      },
    }),
  ).current;

  const solvedCount = validSpokes.length;

  return (
    <View style={styles.frame}>
      <LinearGradient
        colors={theme.gradients.plate}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.plate}>
        <View style={styles.disc}>
          <Svg width={DISC} height={DISC}>
            {rings.map((_, i) => {
              const midR = geo.mid(i);
              const isSelected = i === selectedRing;
              return (
                <React.Fragment key={'band-' + String(i)}>
                  <Circle
                    cx={R_OUT}
                    cy={R_OUT}
                    r={midR}
                    stroke={isSelected ? '#A8752F' : theme.colors.brass.dark}
                    strokeWidth={Math.max(2, geo.band - 2)}
                    fill="none"
                  />
                  <Circle
                    cx={R_OUT}
                    cy={R_OUT}
                    r={midR}
                    stroke={theme.colors.brass.primary}
                    strokeOpacity={0.45}
                    strokeWidth={Math.max(1, geo.band / 3)}
                    fill="none"
                  />
                  <Circle
                    cx={R_OUT}
                    cy={R_OUT}
                    r={midR + geo.band / 2}
                    stroke={
                      isSelected ? theme.colors.brass.light : 'rgba(0,0,0,0.45)'
                    }
                    strokeWidth={isSelected ? 2.5 : 1}
                    fill="none"
                  />
                </React.Fragment>
              );
            })}

            {Array.from({ length: notchCount }).map((_, n) => {
              const outer = polarToXY(R_OUT - 1, notchAngleDeg(n, notchCount));
              const inner = polarToXY(R_OUT - 8, notchAngleDeg(n, notchCount));
              return (
                <Line
                  key={'tick-' + String(n)}
                  x1={inner.x}
                  y1={inner.y}
                  x2={outer.x}
                  y2={outer.y}
                  stroke="rgba(245,235,216,0.22)"
                  strokeWidth={3}
                />
              );
            })}

            {spokes.map(spoke => {
              const active = validSpokes.indexOf(spoke) !== -1;
              const a = notchAngleDeg(spoke, notchCount);
              const p1 = polarToXY(HUB_R, a);
              const p2 = polarToXY(R_OUT, a);
              return (
                <React.Fragment key={'spoke-' + String(spoke)}>
                  {active ? (
                    <Line
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke="rgba(95,201,179,0.30)"
                      strokeWidth={9}
                      strokeLinecap="round"
                    />
                  ) : null}
                  <Line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={
                      active
                        ? theme.colors.accent.verdigris
                        : 'rgba(245,235,216,0.16)'
                    }
                    strokeWidth={active ? 3 : 2}
                    strokeLinecap="round"
                  />
                </React.Fragment>
              );
            })}
          </Svg>

          {rings.map((ringLetters, i) => {
            const rotate = anims[i].interpolate({
              inputRange: [-DEG_RANGE, DEG_RANGE],
              outputRange: [String(-DEG_RANGE) + 'deg', String(DEG_RANGE) + 'deg'],
            });
            const counterRotate = anims[i].interpolate({
              inputRange: [-DEG_RANGE, DEG_RANGE],
              outputRange: [String(DEG_RANGE) + 'deg', String(-DEG_RANGE) + 'deg'],
            });
            const fontSize = Math.max(
              11,
              Math.min(17, Math.round(geo.chip * 0.52)),
            );
            return (
              <Animated.View
                key={'letters-' + String(i)}
                pointerEvents="none"
                style={[styles.layer, { transform: [{ rotate }] }]}>
                {ringLetters.map((letter, k) => {
                  const pos = polarToXY(geo.mid(i), notchAngleDeg(k, notchCount));
                  const physical = mod(k - offsets[i], notchCount);
                  const isValid = validSpokes.indexOf(physical) !== -1;
                  return (
                    <Animated.View
                      key={'chip-' + String(i) + '-' + String(k)}
                      style={[
                        styles.chip,
                        {
                          width: geo.chip,
                          height: geo.chip,
                          left: pos.x - geo.chip / 2,
                          top: pos.y - geo.chip / 2,
                          backgroundColor: isValid
                            ? 'rgba(95,201,179,0.16)'
                            : 'rgba(26,22,17,0.60)',
                          borderColor: isValid
                            ? 'rgba(95,201,179,0.55)'
                            : theme.colors.ui.glassBorder,
                          transform: [{ rotate: counterRotate }],
                        },
                      ]}>
                      <Text
                        style={[
                          styles.letter,
                          {
                            fontSize,
                            lineHeight: fontSize + 3,
                            color: isValid
                              ? theme.colors.accent.verdigris
                              : theme.colors.text.primary,
                          },
                        ]}>
                        {letter}
                      </Text>
                    </Animated.View>
                  );
                })}
              </Animated.View>
            );
          })}

          <View
            style={[styles.hubWrap, { left: R_OUT - HUB_R, top: R_OUT - HUB_R }]}
            pointerEvents="none">
            <LinearGradient
              colors={theme.gradients.hub}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.8, y: 1 }}
              style={[
                styles.hub,
                { width: HUB_R * 2, height: HUB_R * 2, borderRadius: HUB_R },
              ]}>
              <Text style={styles.hubText}>
                {String(solvedCount) + '/' + String(spokes.length)}
              </Text>
            </LinearGradient>
          </View>

          {hintRing >= 0 ? (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.hintRing,
                {
                  width: geo.mid(hintRing) * 2 + geo.band,
                  height: geo.mid(hintRing) * 2 + geo.band,
                  borderRadius: geo.mid(hintRing) + geo.band / 2,
                  left: R_OUT - geo.mid(hintRing) - geo.band / 2,
                  top: R_OUT - geo.mid(hintRing) - geo.band / 2,
                  opacity: hintPulse,
                },
              ]}
            />
          ) : null}

          {geared.length > 0 ? (
            <View style={styles.gearMark} accessibilityLabel="geared rings">
              <Cog size={22} color={theme.colors.brass.light} strokeWidth={2.2} />
            </View>
          ) : null}

          <View style={styles.capture} {...panResponder.panHandlers} />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { alignItems: 'center', justifyContent: 'center' },
  plate: {
    padding: 10,
    borderWidth: 2,
    borderColor: 'rgba(184,134,59,0.50)',
    borderRadius: MACHINE_BOX / 2,
    ...theme.shadows.deep,
  },
  disc: {
    width: DISC,
    height: DISC,
    borderRadius: DISC / 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(10,8,6,0.55)',
  },
  layer: { position: 'absolute', width: DISC, height: DISC },
  chip: {
    position: 'absolute',
    borderRadius: 7,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  hubWrap: { position: 'absolute' },
  hub: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245,235,216,0.22)',
  },
  hubText: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '800',
    color: theme.colors.text.onBrass,
    fontVariant: ['tabular-nums'],
  },
  hintRing: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: theme.colors.accent.verdigris,
  },
  // positive offsets only - the sprite must never poke out of the rounded disc
  gearMark: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    width: 22,
    height: 22,
    opacity: 0.9,
  },
  capture: { ...StyleSheet.absoluteFillObject },
});

export const RingMachine = memo(RingMachineBase);
