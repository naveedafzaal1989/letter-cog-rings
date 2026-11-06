import { PLATE_COSTS } from './config';

export type Plate = {
  id: string;
  name: string;
  cost: number;
};

/** 12 cosmetic machine plates. Bought with cog tokens only - no real money. */
export const PLATES: Plate[] = [
  { id: 'p01', name: 'APPRENTICE', cost: PLATE_COSTS[0] },
  { id: 'p02', name: 'OIL AND RAG', cost: PLATE_COSTS[0] },
  { id: 'p03', name: 'FIRST NOTCH', cost: PLATE_COSTS[0] },
  { id: 'p04', name: 'TOOTH COUNT', cost: PLATE_COSTS[0] },
  { id: 'p05', name: 'BRASS HAND', cost: PLATE_COSTS[1] },
  { id: 'p06', name: 'TRUE BALANCE', cost: PLATE_COSTS[1] },
  { id: 'p07', name: 'SILENT GEAR', cost: PLATE_COSTS[1] },
  { id: 'p08', name: 'STEAM RISEN', cost: PLATE_COSTS[1] },
  { id: 'p09', name: 'MASTER KEY', cost: PLATE_COSTS[2] },
  { id: 'p10', name: 'GRAND WHEEL', cost: PLATE_COSTS[2] },
  { id: 'p11', name: 'TOURBILLON', cost: PLATE_COSTS[2] },
  { id: 'p12', name: 'CLOCKMAKER', cost: PLATE_COSTS[2] },
];
