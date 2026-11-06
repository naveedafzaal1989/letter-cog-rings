import { useCallback, useMemo, useState } from 'react';
import { PAR_TOKENS, TOTAL_MACHINES } from '../constants/config';
import type { SolveResult } from '../game/types';

export type Progress = {
  tokens: number;
  solvedIds: number[];
  ownedPlates: string[];
  bonusWords: string[];
  dailyStreak: number;
  machineIndex: number;
  parHits: number;
};

const INITIAL: Progress = {
  tokens: 0,
  solvedIds: [],
  ownedPlates: [],
  bonusWords: [],
  dailyStreak: 1,
  machineIndex: 0,
  parHits: 0,
};

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(INITIAL);

  const addTokens = useCallback((amount: number) => {
    setProgress(prev => ({ ...prev, tokens: prev.tokens + amount }));
  }, []);

  const recordBonusWord = useCallback((word: string, reward: number) => {
    setProgress(prev =>
      prev.bonusWords.indexOf(word) !== -1
        ? prev
        : {
            ...prev,
            tokens: prev.tokens + reward,
            bonusWords: [...prev.bonusWords, word],
          },
    );
  }, []);

  const completeMachine = useCallback((id: number, result: SolveResult) => {
    setProgress(prev => {
      const alreadySolved = prev.solvedIds.indexOf(id) !== -1;
      const parTokens =
        result.verdict === 'under'
          ? PAR_TOKENS.under
          : result.verdict === 'on'
          ? PAR_TOKENS.on
          : PAR_TOKENS.over;
      return {
        ...prev,
        tokens: prev.tokens + parTokens,
        solvedIds: alreadySolved ? prev.solvedIds : [...prev.solvedIds, id],
        parHits:
          result.verdict === 'over' ? prev.parHits : prev.parHits + 1,
        machineIndex: Math.min(TOTAL_MACHINES - 1, id + 1),
      };
    });
  }, []);

  const buyPlate = useCallback((plateId: string, cost: number) => {
    let bought = false;
    setProgress(prev => {
      if (prev.ownedPlates.indexOf(plateId) !== -1 || prev.tokens < cost) {
        return prev;
      }
      bought = true;
      return {
        ...prev,
        tokens: prev.tokens - cost,
        ownedPlates: [...prev.ownedPlates, plateId],
      };
    });
    return bought;
  }, []);

  const setMachineIndex = useCallback((id: number) => {
    setProgress(prev => ({ ...prev, machineIndex: id }));
  }, []);

  const parRate = useMemo(() => {
    if (progress.solvedIds.length === 0) {
      return 0;
    }
    return Math.round((progress.parHits / progress.solvedIds.length) * 100);
  }, [progress.parHits, progress.solvedIds.length]);

  return {
    progress,
    parRate,
    addTokens,
    recordBonusWord,
    completeMachine,
    buyPlate,
    setMachineIndex,
  };
}
