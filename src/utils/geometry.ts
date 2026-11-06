import { Dimensions } from 'react-native';
import { BOARD_BORDER, BOARD_MAX_W, BOARD_PAD } from '../constants/config';

export const SCREEN_W = Dimensions.get('window').width;
export const SCREEN_H = Dimensions.get('window').height;

/** rule #4 - the frame (padding + border) is subtracted BEFORE the disc is sized. */
export const MACHINE_FRAME = BOARD_PAD + BOARD_BORDER;
/** Also capped by height so the header and the floating bar always fit. */
export const MACHINE_BOX = Math.max(
  240,
  Math.min(SCREEN_W - 32, BOARD_MAX_W, SCREEN_H - 330),
);
export const DISC = MACHINE_BOX - 2 * MACHINE_FRAME;
export const R_OUT = DISC / 2;
export const HUB_R = Math.round(R_OUT * 0.22);

export type RingGeometry = {
  band: number;
  chip: number;
  mid: (ringIndex: number) => number;
};

export function ringGeometry(ringCount: number): RingGeometry {
  const band = Math.floor((R_OUT - HUB_R) / Math.max(ringCount, 1));
  const chip = Math.max(20, Math.min(band - 8, 34));
  return {
    band,
    chip,
    mid: (ringIndex: number) => HUB_R + band * ringIndex + band / 2,
  };
}

/** Notch 0 sits at the top (12 o'clock); angles grow clockwise. */
export function notchAngleDeg(notchIndex: number, notchCount: number): number {
  return (360 / notchCount) * notchIndex;
}

export function polarToXY(radius: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: R_OUT + radius * Math.cos(rad),
    y: R_OUT + radius * Math.sin(rad),
  };
}

/** Which ring band a touch at (x, y) inside the disc belongs to, or -1. */
export function ringFromTouch(
  x: number,
  y: number,
  ringCount: number,
): number {
  const dx = x - R_OUT;
  const dy = y - R_OUT;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < HUB_R || dist > R_OUT) {
    return -1;
  }
  const { band } = ringGeometry(ringCount);
  const index = Math.floor((dist - HUB_R) / Math.max(band, 1));
  return Math.max(0, Math.min(ringCount - 1, index));
}

/** Touch angle in degrees, measured from 12 o'clock, growing clockwise. */
export function touchAngleDeg(x: number, y: number): number {
  const dx = x - R_OUT;
  const dy = y - R_OUT;
  const deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
  return (deg + 360) % 360;
}

/** Shortest signed difference between two angles, in degrees. */
export function angleDelta(from: number, to: number): number {
  let d = to - from;
  while (d > 180) {
    d -= 360;
  }
  while (d < -180) {
    d += 360;
  }
  return d;
}
