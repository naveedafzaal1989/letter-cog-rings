import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BONUS_TOAST_MS,
  BONUS_TOKEN_REWARD,
  HINT_MAX,
  HINT_REGEN_MS,
  PAR_TOKENS,
} from '../constants/config';
import { buildMachine } from '../game/machineBuilder';
import { solveFrom } from '../game/solver';
import type { SolveResult } from '../game/types';
import {
  applyTurn,
  bonusSpokeWords,
  markedValidSpokes,
  readSpoke,
} from '../game/validate';

type HistoryEntry = { ring: number; dir: 1 | -1 };

export type MachineStatus = 'idle' | 'partial' | 'solved';

export function useMachine(
  machineId: number,
  onBonusWord: (word: string, reward: number) => void,
) {
  const machine = useMemo(() => buildMachine(machineId), [machineId]);

  const [offsets, setOffsets] = useState<number[]>(machine.startOffsets);
  const [turns, setTurns] = useState(0);
  const [selectedRing, setSelectedRing] = useState(0);
  const [historyLen, setHistoryLen] = useState(0);
  const [hints, setHints] = useState(HINT_MAX);
  const [hintRing, setHintRing] = useState(-1);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [bonusWords, setBonusWords] = useState<string[]>([]);
  const [toastWord, setToastWord] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  // Mutable data read inside PanResponder callbacks must live in refs.
  const historyRef = useRef<HistoryEntry[]>([]);
  const offsetsRef = useRef<number[]>(machine.startOffsets);
  const lockedRef = useRef(false);
  const bonusSeenRef = useRef<string[]>([]);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const validSpokes = useMemo(
    () => markedValidSpokes(machine, offsets),
    [machine, offsets],
  );

  const status: MachineStatus =
    validSpokes.length === machine.spokes.length
      ? 'solved'
      : validSpokes.length > 0
      ? 'partial'
      : 'idle';

  const solvedWords = useMemo(
    () =>
      machine.spokes.map(spoke =>
        readSpoke(machine.rings, offsets, machine.notchCount, spoke),
      ),
    [machine, offsets],
  );

  /** Collect any newly uncovered bonus word on an unmarked spoke. */
  const harvestBonus = useCallback(
    (next: number[]) => {
      const found = bonusSpokeWords(machine, next);
      for (const word of found) {
        if (bonusSeenRef.current.indexOf(word) !== -1) {
          continue;
        }
        bonusSeenRef.current = [...bonusSeenRef.current, word];
        setBonusWords(prev => [...prev, word]);
        onBonusWord(word, BONUS_TOKEN_REWARD);
        setToastWord(word);
        if (toastTimerRef.current) {
          clearTimeout(toastTimerRef.current);
        }
        toastTimerRef.current = setTimeout(
          () => setToastWord(null),
          BONUS_TOAST_MS,
        );
      }
    },
    [machine, onBonusWord],
  );

  const turn = useCallback(
    (ringIndex: number, dir: 1 | -1) => {
      if (lockedRef.current) {
        return;
      }
      const next = applyTurn(
        offsetsRef.current,
        machine.geared,
        machine.notchCount,
        ringIndex,
        dir,
      );
      offsetsRef.current = next;
      historyRef.current = [...historyRef.current, { ring: ringIndex, dir }];
      setOffsets(next);
      setTurns(prev => prev + 1);
      setHistoryLen(historyRef.current.length);
      setHintRing(-1);
      setHintMessage(null);
      harvestBonus(next);
    },
    [harvestBonus, machine.geared, machine.notchCount],
  );

  const undo = useCallback(() => {
    if (lockedRef.current || historyRef.current.length === 0) {
      return;
    }
    const last = historyRef.current[historyRef.current.length - 1];
    historyRef.current = historyRef.current.slice(0, -1);
    const reverted = applyTurn(
      offsetsRef.current,
      machine.geared,
      machine.notchCount,
      last.ring,
      last.dir === 1 ? -1 : 1,
    );
    offsetsRef.current = reverted;
    setOffsets(reverted);
    setTurns(prev => Math.max(0, prev - 1));
    setHistoryLen(historyRef.current.length);
  }, [machine.geared, machine.notchCount]);

  const requestHint = useCallback(() => {
    if (lockedRef.current || hints <= 0) {
      return;
    }
    const answer = solveFrom(machine, offsetsRef.current);
    const ring = answer.firstRing >= 0 ? answer.firstRing : 0;
    setHints(prev => Math.max(0, prev - 1));
    setSelectedRing(ring);
    setHintRing(ring);
    setHintMessage('RING ' + String(ring + 1) + ' IS MISPLACED');
    if (hintTimerRef.current) {
      clearTimeout(hintTimerRef.current);
    }
    hintTimerRef.current = setTimeout(() => {
      setHintRing(-1);
      setHintMessage(null);
    }, 1800);
  }, [hints, machine]);

  const lock = useCallback(() => {
    lockedRef.current = true;
    setLocked(true);
  }, []);

  const buildResult = useCallback((): SolveResult => {
    const verdict: SolveResult['verdict'] =
      turns < machine.par ? 'under' : turns === machine.par ? 'on' : 'over';
    return {
      words: machine.spokes.map(spoke =>
        readSpoke(machine.rings, offsetsRef.current, machine.notchCount, spoke),
      ),
      bonusWords: bonusSeenRef.current,
      turns,
      par: machine.par,
      tokensEarned:
        (verdict === 'under'
          ? PAR_TOKENS.under
          : verdict === 'on'
          ? PAR_TOKENS.on
          : PAR_TOKENS.over) +
        bonusSeenRef.current.length * BONUS_TOKEN_REWARD,
      verdict,
    };
  }, [machine, turns]);

  // Hint charges regenerate slowly while a puzzle is open.
  useEffect(() => {
    const timer = setInterval(() => {
      setHints(prev => (prev >= HINT_MAX ? prev : prev + 1));
    }, HINT_REGEN_MS);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
      if (hintTimerRef.current) {
        clearTimeout(hintTimerRef.current);
      }
    };
  }, []);

  return {
    machine,
    offsets,
    turns,
    selectedRing,
    setSelectedRing,
    validSpokes,
    solvedWords,
    bonusWords,
    toastWord,
    hints,
    hintRing,
    hintMessage,
    canUndo: historyLen > 0,
    locked,
    status,
    turn,
    undo,
    requestHint,
    lock,
    buildResult,
  };
}
