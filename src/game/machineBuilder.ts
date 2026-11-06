import { roomForMachine } from '../constants/rooms';
import { LETTER_POOL, WORDS_BY_LENGTH } from './dictionary';
import { solveFrom } from './solver';
import type { GearPair, Machine } from './types';
import { applyTurn, isSolved, mod } from './validate';

/** Deterministic PRNG - a machine id always rebuilds the same machine. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next(): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickSpokes(
  rng: () => number,
  notchCount: number,
  count: number,
): number[] {
  const chosen: number[] = [];
  let guard = 0;
  while (chosen.length < count && guard < 200) {
    guard += 1;
    const candidate = Math.floor(rng() * notchCount);
    const tooClose = chosen.some(
      s =>
        Math.min(
          mod(s - candidate, notchCount),
          mod(candidate - s, notchCount),
        ) < 2,
    );
    if (!tooClose) {
      chosen.push(candidate);
    }
  }
  while (chosen.length < count) {
    const candidate = chosen.length * 2;
    if (chosen.indexOf(candidate) === -1) {
      chosen.push(candidate);
    } else {
      chosen.push(mod(candidate + 1, notchCount));
    }
  }
  return chosen.sort((a, b) => a - b);
}

function buildGearPairs(
  rng: () => number,
  ringCount: number,
  pairCount: number,
): GearPair[] {
  const pool: number[] = [];
  for (let i = 0; i < ringCount; i++) {
    pool.push(i);
  }
  const pairs: GearPair[] = [];
  for (let p = 0; p < pairCount && pool.length >= 2; p++) {
    const ai = Math.floor(rng() * pool.length);
    const a = pool.splice(ai, 1)[0];
    const bi = Math.floor(rng() * pool.length);
    const b = pool.splice(bi, 1)[0];
    pairs.push([a, b]);
  }
  return pairs;
}

const CACHE = new Map<number, Machine>();

export function buildMachine(id: number): Machine {
  const cached = CACHE.get(id);
  if (cached) {
    return cached;
  }

  const room = roomForMachine(id);
  const rng = mulberry32(0x9e3779b9 ^ ((id + 1) * 2654435761));
  const ringCount = room.ringCount;
  const notchCount = ringCount <= 4 ? 8 : 10;
  const spokeCount = ringCount === 3 ? 2 : 3;

  const spokes = pickSpokes(rng, notchCount, spokeCount);

  // 1. Lay the target words into the marked spokes in the SOLVED orientation.
  const pool = WORDS_BY_LENGTH[ringCount];
  const targetWords: string[] = [];
  let guard = 0;
  while (targetWords.length < spokeCount && guard < 400) {
    guard += 1;
    const word = pool[Math.floor(rng() * pool.length)];
    if (targetWords.indexOf(word) === -1) {
      targetWords.push(word);
    }
  }

  const rings: string[][] = [];
  for (let i = 0; i < ringCount; i++) {
    rings.push(new Array(notchCount).fill(''));
  }
  spokes.forEach((spoke, k) => {
    const word = targetWords[k];
    for (let i = 0; i < ringCount; i++) {
      rings[i][spoke] = word.charAt(i);
    }
  });

  // 2. Fill every remaining notch with a weighted-random letter.
  for (let i = 0; i < ringCount; i++) {
    for (let n = 0; n < notchCount; n++) {
      if (rings[i][n] === '') {
        rings[i][n] = LETTER_POOL.charAt(
          Math.floor(rng() * LETTER_POOL.length),
        );
      }
    }
  }

  // 3. Geared pairs - none in the first two rooms, then one, then two.
  const pairCount = room.id <= 2 ? 0 : room.id <= 7 ? 1 : 2;
  const geared = buildGearPairs(rng, ringCount, pairCount);

  const base: Machine = {
    id,
    roomId: room.id,
    roomName: room.name,
    roomBadge: room.badge,
    ringCount,
    notchCount,
    rings,
    spokes,
    geared,
    startOffsets: new Array(ringCount).fill(0),
    targetWords,
    par: 1,
  };

  // 4. Scramble THROUGH the gear rules, so the puzzle is solvable by design.
  //    The very first machine is a one-notch tutorial.
  const scrambleTurns =
    id === 0 ? 1 : Math.min(2 + id, 4 * ringCount);
  let offsets = new Array(ringCount).fill(0);
  let attempts = 0;
  do {
    offsets = new Array(ringCount).fill(0);
    for (let t = 0; t < scrambleTurns; t++) {
      const ring = id === 0 ? 0 : Math.floor(rng() * ringCount);
      const dir: 1 | -1 = id === 0 ? 1 : rng() < 0.5 ? 1 : -1;
      offsets = applyTurn(offsets, geared, notchCount, ring, dir);
    }
    attempts += 1;
  } while (isSolved({ ...base, startOffsets: offsets }, offsets) && attempts < 12);

  base.startOffsets = offsets;
  base.par = Math.max(1, solveFrom(base, offsets).distance);

  CACHE.set(id, base);
  return base;
}

