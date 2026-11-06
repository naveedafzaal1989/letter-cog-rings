import { SOLVER_STATE_CAP } from '../constants/config';
import type { Machine } from './types';
import { applyTurn, isSolved, mod } from './validate';

function encode(offsets: number[], notchCount: number): number {
  let code = 0;
  for (let i = offsets.length - 1; i >= 0; i--) {
    code = code * notchCount + offsets[i];
  }
  return code;
}

function decode(code: number, ringCount: number, notchCount: number): number[] {
  const out: number[] = [];
  let rest = code;
  for (let i = 0; i < ringCount; i++) {
    out.push(rest % notchCount);
    rest = Math.floor(rest / notchCount);
  }
  return out;
}

export type SolverAnswer = {
  /** Minimum turns from `from` to any fully valid state, or -1 when unknown. */
  distance: number;
  /** Ring to turn first on a shortest path, or -1. */
  firstRing: number;
  /** Direction of that first turn. */
  firstDir: 1 | -1;
};

/**
 * Breadth-first search over the offset vectors. The space is
 * notchCount ^ ringCount (<= 100k here) so a full sweep is cheap and runs
 * once per machine at build time, and again when the player asks for a hint.
 */
export function solveFrom(machine: Machine, from: number[]): SolverAnswer {
  const { ringCount, notchCount } = machine;
  const total = Math.pow(notchCount, ringCount);
  if (total > SOLVER_STATE_CAP) {
    return fallback(machine, from);
  }

  const visited = new Uint8Array(total);
  const startCode = encode(from, notchCount);

  if (isSolved(machine, from)) {
    return { distance: 0, firstRing: -1, firstDir: 1 };
  }

  let frontier: number[] = [startCode];
  // For every reached state, remember the first move that led into its branch.
  const firstMove = new Int16Array(total).fill(-1);
  visited[startCode] = 1;
  let depth = 0;

  while (frontier.length > 0 && depth < 64) {
    depth += 1;
    const next: number[] = [];
    for (const code of frontier) {
      const offsets = decode(code, ringCount, notchCount);
      for (let ring = 0; ring < ringCount; ring++) {
        for (const dir of [1, -1] as const) {
          const moved = applyTurn(
            offsets,
            machine.geared,
            notchCount,
            ring,
            dir,
          );
          const movedCode = encode(moved, notchCount);
          if (visited[movedCode]) {
            continue;
          }
          visited[movedCode] = 1;
          firstMove[movedCode] =
            code === startCode ? ring * 2 + (dir === 1 ? 0 : 1) : firstMove[code];
          if (isSolved(machine, moved)) {
            const packed = firstMove[movedCode];
            return {
              distance: depth,
              firstRing: packed >= 0 ? Math.floor(packed / 2) : -1,
              firstDir: packed >= 0 && packed % 2 === 1 ? -1 : 1,
            };
          }
          next.push(movedCode);
        }
      }
    }
    frontier = next;
  }

  return fallback(machine, from);
}

/** Cheap estimate used when the state space is too wide for a full sweep. */
function fallback(machine: Machine, from: number[]): SolverAnswer {
  let worstRing = 0;
  let worstDistance = -1;
  let total = 0;
  for (let i = 0; i < from.length; i++) {
    const raw = mod(from[i], machine.notchCount);
    const distance = Math.min(raw, machine.notchCount - raw);
    total += distance;
    if (distance > worstDistance) {
      worstDistance = distance;
      worstRing = i;
    }
  }
  const raw = mod(from[worstRing], machine.notchCount);
  return {
    distance: Math.max(total, 1),
    firstRing: worstRing,
    firstDir: raw <= machine.notchCount / 2 ? -1 : 1,
  };
}
