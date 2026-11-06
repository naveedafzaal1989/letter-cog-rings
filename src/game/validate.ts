import { isWord } from './dictionary';
import type { GearPair, Machine } from './types';

export function mod(value: number, size: number): number {
  return ((value % size) + size) % size;
}

/** Read one spoke inward -> outward under the current ring offsets. */
export function readSpoke(
  rings: string[][],
  offsets: number[],
  notchCount: number,
  spoke: number,
): string {
  let out = '';
  for (let i = 0; i < rings.length; i++) {
    out += rings[i][mod(spoke + offsets[i], notchCount)];
  }
  return out;
}

export function markedValidSpokes(
  machine: Machine,
  offsets: number[],
): number[] {
  const out: number[] = [];
  for (const spoke of machine.spokes) {
    if (isWord(readSpoke(machine.rings, offsets, machine.notchCount, spoke))) {
      out.push(spoke);
    }
  }
  return out;
}

export function isSolved(machine: Machine, offsets: number[]): boolean {
  return markedValidSpokes(machine, offsets).length === machine.spokes.length;
}

/** Valid words sitting on spokes that are NOT marked - the bonus pool. */
export function bonusSpokeWords(
  machine: Machine,
  offsets: number[],
): string[] {
  const out: string[] = [];
  for (let spoke = 0; spoke < machine.notchCount; spoke++) {
    if (machine.spokes.indexOf(spoke) !== -1) {
      continue;
    }
    const word = readSpoke(machine.rings, offsets, machine.notchCount, spoke);
    if (isWord(word) && out.indexOf(word) === -1) {
      out.push(word);
    }
  }
  return out;
}

/**
 * One notch on one ring. A geared partner counter-rotates along with it and
 * still counts as a single turn.
 */
export function applyTurn(
  offsets: number[],
  geared: GearPair[],
  notchCount: number,
  ringIndex: number,
  dir: 1 | -1,
): number[] {
  const next = offsets.slice();
  next[ringIndex] = mod(next[ringIndex] + dir, notchCount);
  for (const [a, b] of geared) {
    if (a === ringIndex) {
      next[b] = mod(next[b] - dir, notchCount);
    } else if (b === ringIndex) {
      next[a] = mod(next[a] - dir, notchCount);
    }
  }
  return next;
}

/** Rings that move (and by how much) when `ringIndex` turns by `dir`. */
export function turnDeltas(
  geared: GearPair[],
  ringIndex: number,
  dir: 1 | -1,
): Record<number, number> {
  const deltas: Record<number, number> = { [ringIndex]: dir };
  for (const [a, b] of geared) {
    if (a === ringIndex) {
      deltas[b] = -dir;
    } else if (b === ringIndex) {
      deltas[a] = -dir;
    }
  }
  return deltas;
}

export function isGeared(geared: GearPair[], ringIndex: number): boolean {
  return geared.some(([a, b]) => a === ringIndex || b === ringIndex);
}
