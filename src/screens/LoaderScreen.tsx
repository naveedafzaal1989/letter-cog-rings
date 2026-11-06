import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Line } from 'react-native-svg';
import { Cog } from 'lucide-react-native';
import { ScreenBackground } from '../components/ScreenBackground';
import { LOADER_DURATION_MS, LOADER_FADE_MS } from '../constants/config';
import { theme } from '../constants/theme';

const BAR_W = 190;
const RING = 236;

type Props = { onDone: () => void };

export function LoaderScreen({ onDone }: Props) {
  const fade = useRef(new Animated.Value(1)).current;
  const medallion = useRef(new Animated.Value(0)).current;
  const titleIn = useRef(new Animated.Value(0)).current;
  const subtitleIn = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.45)).current;
  // width is NOT native-driver safe - the one documented exception.
  const barWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(medallion, {
        toValue: 1,
        tension: theme.animation.hero.tension,
        friction: theme.animation.hero.friction,
        useNativeDriver: true,
      }),
      Animated.timing(titleIn, {
        toValue: 1,
        duration: 420,
        delay: 320,
        useNativeDriver: true,
      }),
      Animated.timing(subtitleIn, {
        toValue: 1,
        duration: 420,
        delay: 520,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 14000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.45,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.timing(barWidth, {
      toValue: BAR_W,
      duration: LOADER_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: LOADER_FADE_MS,
        useNativeDriver: true,
      }).start(() => onDone());
    }, LOADER_DURATION_MS);

    return () => clearTimeout(timer);
  }, [barWidth, fade, medallion, onDone, pulse, spin, subtitleIn, titleIn]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const titleY = titleIn.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 0],
  });

  return (
    <ScreenBackground variant="loader">
      <Animated.View style={[styles.root, { opacity: fade }]}>
        <View style={styles.center}>
          <View style={styles.glow} pointerEvents="none" />

          <Animated.View
            pointerEvents="none"
            style={[styles.ring, { transform: [{ rotate }] }]}>
            <Svg width={RING} height={RING}>
              <Circle
                cx={RING / 2}
                cy={RING / 2}
                r={RING / 2 - 4}
                stroke="rgba(184,134,59,0.30)"
                strokeWidth={2}
                fill="none"
              />
              {Array.from({ length: 20 }).map((_, i) => {
                const rad = ((360 / 20) * i * Math.PI) / 180;
                const r0 = RING / 2 - 14;
                const r1 = RING / 2 - 2;
                return (
                  <Line
                    key={'t' + String(i)}
                    x1={RING / 2 + Math.cos(rad) * r0}
                    y1={RING / 2 + Math.sin(rad) * r0}
                    x2={RING / 2 + Math.cos(rad) * r1}
                    y2={RING / 2 + Math.sin(rad) * r1}
                    stroke="rgba(184,134,59,0.34)"
                    strokeWidth={6}
                  />
                );
              })}
            </Svg>
          </Animated.View>

          <Animated.View
            pointerEvents="none"
            style={[
              styles.medallion,
              { opacity: medallion, transform: [{ scale: medallion }] },
            ]}>
            <LinearGradient
              colors={theme.gradients.hub}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.8, y: 1 }}
              style={styles.logo}>
              <Cog size={86} color={theme.colors.bg.deep} strokeWidth={1.8} />
            </LinearGradient>
          </Animated.View>
        </View>

        <Animated.Text
          style={[
            styles.title,
            { opacity: titleIn, transform: [{ translateY: titleY }] },
          ]}>
          LETTER COG RINGS
        </Animated.Text>
        <Animated.Text style={[styles.subtitle, { opacity: subtitleIn }]}>
          RESTORE THE CLOCKWORK WORKSHOP
        </Animated.Text>

        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFillWrap, { width: barWidth }]}>
            <LinearGradient
              colors={['#8A6327', '#B8863B', '#E0B261']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.barFill}
            />
          </Animated.View>
        </View>

        <Animated.Text style={[styles.caption, { opacity: pulse }]}>
          WINDING THE MAINSPRING...
        </Animated.Text>
      </Animated.View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  center: {
    width: RING,
    height: RING,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(184,134,59,0.10)',
  },
  ring: { position: 'absolute', width: RING, height: RING },
  medallion: {
    width: 196,
    height: 196,
    borderRadius: 98,
    backgroundColor: '#241E17',
    borderWidth: 2,
    borderColor: 'rgba(184,134,59,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#B8863B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 26,
    elevation: 14,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 40,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '800',
    letterSpacing: 3.5,
    textAlign: 'center',
    color: theme.colors.text.primary,
    textShadowColor: 'rgba(184,134,59,0.55)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 2.2,
    color: theme.colors.text.muted,
  },
  barTrack: {
    marginTop: 34,
    width: BAR_W,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(245,235,216,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(184,134,59,0.25)',
    overflow: 'hidden',
  },
  barFillWrap: { height: '100%' },
  barFill: { flex: 1 },
  caption: {
    marginTop: 12,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.faint,
  },
});
