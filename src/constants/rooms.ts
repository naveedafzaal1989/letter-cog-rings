export type Room = {
  id: number;
  name: string;
  badge: string;
  ringCount: number;
  machines: number;
};

/** 12 workshop rooms, 150 machines in total. */
export const ROOMS: Room[] = [
  { id: 1, name: 'MAINSPRING BAY', badge: 'A', ringCount: 3, machines: 10 },
  { id: 2, name: 'ESCAPEMENT ROW', badge: 'B', ringCount: 3, machines: 12 },
  { id: 3, name: 'BALANCE HALL', badge: 'C', ringCount: 3, machines: 12 },
  { id: 4, name: 'PINION LOFT', badge: 'D', ringCount: 4, machines: 12 },
  { id: 5, name: 'BARREL VAULT', badge: 'E', ringCount: 4, machines: 12 },
  { id: 6, name: 'BRASS FOUNDRY', badge: 'F', ringCount: 4, machines: 13 },
  { id: 7, name: 'LATHE GALLERY', badge: 'G', ringCount: 4, machines: 13 },
  { id: 8, name: 'STEAM CELLAR', badge: 'H', ringCount: 5, machines: 13 },
  { id: 9, name: 'GOVERNOR WING', badge: 'I', ringCount: 5, machines: 13 },
  { id: 10, name: 'CHRONOGRAPH', badge: 'J', ringCount: 5, machines: 10 },
  { id: 11, name: 'TOURBILLON', badge: 'K', ringCount: 5, machines: 10 },
  { id: 12, name: 'GRAND MOVEMENT', badge: 'L', ringCount: 5, machines: 10 },
];

/** Resolve the room that owns a zero-based machine index. */
export function roomForMachine(index: number): Room {
  let cursor = 0;
  for (const room of ROOMS) {
    if (index < cursor + room.machines) {
      return room;
    }
    cursor += room.machines;
  }
  return ROOMS[ROOMS.length - 1];
}

/** Index of the machine inside its own room (1-based, for display). */
export function machineNoInRoom(index: number): number {
  let cursor = 0;
  for (const room of ROOMS) {
    if (index < cursor + room.machines) {
      return index - cursor + 1;
    }
    cursor += room.machines;
  }
  return 1;
}
