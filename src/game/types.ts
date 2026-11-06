export type GearPair = [number, number];

export type Machine = {
  id: number;
  roomId: number;
  roomName: string;
  roomBadge: string;
  ringCount: number;
  notchCount: number;
  /** rings[0] is the INNERMOST ring; each entry holds notchCount letters. */
  rings: string[][];
  /** Marked spoke indices - these must all spell a word to power the machine. */
  spokes: number[];
  geared: GearPair[];
  startOffsets: number[];
  targetWords: string[];
  par: number;
};

export type SolveResult = {
  words: string[];
  bonusWords: string[];
  turns: number;
  par: number;
  tokensEarned: number;
  verdict: 'under' | 'on' | 'over';
};
