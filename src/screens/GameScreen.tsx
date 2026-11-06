import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Home, Wind } from 'lucide-react-native';
import { BonusToast } from '../components/BonusToast';
import { FloatingControlBar } from '../components/FloatingControlBar';
import { IconButton } from '../components/IconButton';
import { RingMachine } from '../components/RingMachine';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { POWER_UP_MS } from '../constants/config';
import { theme } from '../constants/theme';
import { machineNoInRoom } from '../constants/rooms';
import type { SolveResult } from '../game/types';
import { useMachine } from '../hooks/useMachine';

type Props = {
  machineId: number;
  onBonusWord: (word: string, reward: number) => void;
  onSolved: (result: SolveResult) => void;
  onHome: () => void;
};

export function GameScreen({ machineId, onBonusWord, onSolved, onHome }: Props) {
  const {
    machine,
    offsets,
    turns,
    selectedRing,
    setSelectedRing,
    validSpokes,
    bonusWords,
    toastWord,
    hints,
    hintRing,
    hintMessage,
    canUndo,
    locked,
    status,
    turn,
    undo,
    requestHint,
    lock,
    buildResult,
  } = useMachine(machineId, onBonusWord);

  const [powering, setPowering] = useState(false);
  const poweringRef = useRef(false);
  const boardScale = useRef(new Animated.Value(0.86)).current;
  const boardOpacity = useRef(new Animated.Value(0)).current;
  const boardSpin = useRef(new Animated.Value(0)).current;
  const steam = useRef(new Animated.Value(0)).current;
  const counterPop = useRef(new Animated.Value(1)).current;

  // Board entry.
  useEffect(() => {
    Animated.parallel([
      Animated.spring(boardScale, {
        toValue: 1,
        tension: theme.animation.hero.tension,
        friction: theme.animation.hero.friction,
        useNativeDriver: true,
      }),
      Animated.timing(boardOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [boardScale, boardOpacity]);

  // Turn counter pulse.
  useEffect(() => {
    if (turns === 0) {
      return;
    }
    counterPop.setValue(1.12);
    Animated.spring(counterPop, {
      toValue: 1,
      tension: theme.animation.pop.tension,
      friction: theme.animation.pop.friction,
      useNativeDriver: true,
    }).start();
  }, [turns, counterPop]);

  // Win handoff: lock, play the 800ms power-up, then hand over to the result.
  useEffect(() => {
    // The guard is a ref, not `powering`: putting the state flag in the deps
    // would re-run this effect and its cleanup would cancel the handoff timer.
    if (status !== 'solved' || poweringRef.current) {
      return;
    }
    poweringRef.current = true;
    setPowering(true);
    lock();
    const result = buildResult();
    Animated.sequence([
      Animated.timing(boardSpin, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(steam, {
        toValue: 1,
        duration: 360,
        useNativeDriver: true,
      }),
      Animated.timing(boardOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
    const timer = setTimeout(() => onSolved(result), POWER_UP_MS);
    return () => clearTimeout(timer);
  }, [
    status,
    lock,
    buildResult,
    onSolved,
    boardSpin,
    steam,
    boardOpacity,
  ]);

  const handleRotate = useCallback(
    (dir: 1 | -1) => {
      turn(selectedRing, dir);
    },
    [turn, selectedRing],
  );

  const parColor =
    turns <= machine.par
      ? theme.colors.accent.verdigris
      : turns <= machine.par * 1.5
      ? theme.colors.brass.light
      : theme.colors.accent.warning;

  const spin = boardSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '18deg'],
  });
  const steamY = steam.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -70],
  });
  const steamOpacity = steam.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0.9, 0],
  });

  return (
    <ScreenBackground variant="game">
      <View style={styles.root}>
        <ScreenHeader
          title={'MACHINE ' + String(machineNoInRoom(machineId))}
          subtitle={'ROOM ' + machine.roomName}
          leftSlot={
            <IconButton
              Icon={Home}
              label="Back to the workshop"
              size={44}
              iconSize={22}
              tone="neutral"
              onPress={onHome}
            />
          }
          rightSlot={
            <Animated.View
              pointerEvents="none"
              style={[styles.turnPill, { transform: [{ scale: counterPop }] }]}>
              <Text style={[styles.turnText, { color: parColor }]}>
                {'TURNS ' + String(turns) + '/' + String(machine.par)}
              </Text>
            </Animated.View>
          }
        />

        <View style={styles.area}>
          <BonusToast word={toastWord} />

          <Animated.View
            pointerEvents="box-none"
            style={{
              opacity: boardOpacity,
              transform: [{ scale: boardScale }, { rotate: spin }],
            }}>
            <RingMachine
              machine={machine}
              offsets={offsets}
              selectedRing={selectedRing}
              validSpokes={validSpokes}
              hintRing={hintRing}
              locked={locked}
              onNotch={turn}
              onSelectRing={setSelectedRing}
            />
          </Animated.View>

          {powering ? (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.steamWrap,
                { opacity: steamOpacity, transform: [{ translateY: steamY }] },
              ]}>
              <View style={styles.steam}>
                <Wind size={64} color={theme.colors.brass.shimmer} strokeWidth={2} />
              </View>
            </Animated.View>
          ) : null}

          <View style={styles.statusLine} pointerEvents="none">
            <Text style={styles.statusText} numberOfLines={1}>
              {hintMessage
                ? hintMessage
                : status === 'partial'
                ? 'ONE SPOKE IS SINGING · KEEP TURNING'
                : bonusWords.length > 0
                ? 'BONUS WORDS FOUND · ' + String(bonusWords.length)
                : 'SELECT A RING · TURN IT NOTCH BY NOTCH'}
            </Text>
          </View>
        </View>

        <FloatingControlBar
          ringCount={machine.ringCount}
          selectedRing={selectedRing}
          gearedPairs={machine.geared}
          hints={hints}
          canUndo={canUndo}
          disabled={locked}
          onSelectRing={setSelectedRing}
          onRotate={handleRotate}
          onUndo={undo}
          onHint={requestHint}
        />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  area: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 170,
  },
  turnPill: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bg.tertiary,
    borderWidth: 1,
    borderColor: 'rgba(184,134,59,0.40)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  turnText: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    letterSpacing: 0.8,
    fontVariant: ['tabular-nums'],
  },
  steamWrap: { position: 'absolute', top: 40 },
  steam: { width: 96, height: 96, alignItems: 'center', justifyContent: 'center' },
  statusLine: {
    position: 'absolute',
    bottom: 172,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statusText: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.faint,
  },
});
