/**
 * Compact offline dictionary. Only uppercase A-Z words of length 3, 4 and 5 -
 * exactly the lengths a machine can have rings.
 */

const WORDS_3 = [
  'ARC', 'ARM', 'ART', 'AXE', 'BAG', 'BAR', 'BAT', 'BED', 'BEE', 'BIN',
  'BIT', 'BOW', 'BOX', 'BUS', 'CAB', 'CAM', 'CAP', 'CAR', 'CAT', 'COG',
  'COT', 'COW', 'CUB', 'CUP', 'CUT', 'DAM', 'DAY', 'DEN', 'DIG', 'DIM',
  'DIP', 'DOG', 'DOT', 'DRY', 'EAR', 'EGG', 'ELM', 'END', 'EYE', 'FAN',
  'FAR', 'FEW', 'FIG', 'FIN', 'FIR', 'FIT', 'FIX', 'FLY', 'FOG', 'FOX',
  'FUN', 'FUR', 'GAP', 'GAS', 'GEL', 'GEM', 'GUM', 'GUN', 'GUT', 'HAM',
  'HAT', 'HAY', 'HEN', 'HIP', 'HIT', 'HOE', 'HUB', 'HUE', 'HUT', 'ICE',
  'INK', 'IVY', 'JAM', 'JAR', 'JAW', 'JET', 'JOB', 'JOG', 'JOY', 'KEG',
  'KEY', 'KID', 'KIT', 'LAB', 'LAP', 'LAW', 'LEG', 'LID', 'LIP', 'LOG',
  'LOT', 'LOW', 'MAN', 'MAP', 'MAT', 'MIX', 'MOP', 'MUD', 'NAP', 'NET',
  'NOD', 'NUT', 'OAK', 'OAR', 'OIL', 'ONE', 'OWL', 'PAD', 'PAN', 'PAW',
  'PEG', 'PEN', 'PIE', 'PIN', 'PIP', 'PIT', 'POD', 'POT', 'RAG', 'RAM',
  'RAT', 'RAY', 'RIB', 'RIM', 'RIP', 'ROD', 'ROW', 'RUB', 'RUG', 'RUN',
  'SAW', 'SEA', 'SET', 'SIP', 'SIR', 'SIT', 'SKY', 'SON', 'SUN', 'TAG',
  'TAN', 'TAP', 'TAR', 'TEA', 'TIE', 'TIN', 'TIP', 'TOE', 'TON', 'TOP',
  'TOY', 'TUB', 'TUG', 'URN', 'VAN', 'VET', 'WAR', 'WAX', 'WEB', 'WIG',
  'WIN', 'YAK', 'ZIP', 'ZOO',
];

const WORDS_4 = [
  'ARCH', 'BAND', 'BANK', 'BARN', 'BEAM', 'BELL', 'BELT', 'BIRD', 'BLUE',
  'BOAT', 'BOLT', 'BONE', 'BOOK', 'BOOT', 'CAGE', 'CAKE', 'CARD', 'CART',
  'CASE', 'CAST', 'CHIP', 'CLAW', 'CLIP', 'COAL', 'COAT', 'COIL', 'COIN',
  'COLD', 'CORD', 'CORE', 'CORK', 'CROW', 'CUBE', 'DARK', 'DEAL', 'DECK',
  'DESK', 'DIAL', 'DISC', 'DISK', 'DOME', 'DOOR', 'DRUM', 'DUST', 'EAST',
  'EDGE', 'FACE', 'FADE', 'FARM', 'FILE', 'FILM', 'FIRE', 'FISH', 'FLAG',
  'FLAT', 'FOAM', 'FORK', 'FORM', 'FUEL', 'GATE', 'GEAR', 'GIFT', 'GLOW',
  'GOLD', 'GRIP', 'HALL', 'HAND', 'HARD', 'HEAT', 'HILL', 'HOLE', 'HOOK',
  'HORN', 'IRON', 'JUMP', 'KEEP', 'KEYS', 'KING', 'KNOB', 'LAMP', 'LAND',
  'LEAF', 'LENS', 'LIFT', 'LINE', 'LINK', 'LOCK', 'LOOM', 'LOOP', 'MAIL',
  'MAST', 'MESH', 'MILL', 'MIND', 'MINE', 'MOON', 'NAIL', 'NECK', 'NEST',
  'NODE', 'NOTE', 'OPEN', 'OVEN', 'PAGE', 'PAIR', 'PALM', 'PATH', 'PIPE',
  'PLAN', 'POLE', 'PORT', 'PULL', 'PUMP', 'RACK', 'RAIL', 'RAIN', 'RING',
  'ROAD', 'ROCK', 'ROLL', 'ROOF', 'ROOM', 'ROPE', 'RUST', 'SAIL', 'SALT',
  'SAND', 'SEAL', 'SEAT', 'SHED', 'SHIP', 'SHOP', 'SIGN', 'SILK', 'SLOT',
  'SNOW', 'SOAP', 'SOIL', 'SPIN', 'STAR', 'STEM', 'STEP', 'STOP', 'TANK',
  'TAPE', 'TEAM', 'TIDE', 'TILE', 'TIME', 'TOOL', 'TOWN', 'TRAY', 'TREE',
  'TUBE', 'TURN', 'VANE', 'VASE', 'VENT', 'VINE', 'WALL', 'WAVE', 'WELL',
  'WIND', 'WING', 'WIRE', 'WOOD', 'WOOL', 'WORK', 'YARD', 'ZINC',
];

const WORDS_5 = [
  'ANVIL', 'BENCH', 'BOLTS', 'BRACE', 'BRASS', 'CABLE', 'CHAIN', 'CHUTE',
  'CLAMP', 'CLOCK', 'CRAFT', 'CRANK', 'DRILL', 'DRIVE', 'FLAME', 'FORGE',
  'FRAME', 'GAUGE', 'GEARS', 'GLASS', 'GRIND', 'HINGE', 'LATCH', 'LATHE',
  'LEVER', 'LIGHT', 'METAL', 'MOTOR', 'MOUNT', 'PINCH', 'PIVOT', 'PLANE',
  'PLATE', 'PRESS', 'PRISM', 'PULSE', 'QUILL', 'RIVET', 'ROTOR', 'ROUND',
  'SCREW', 'SHAFT', 'SHEET', 'SHINE', 'SOLID', 'SPARK', 'SPOKE', 'SPOOL',
  'SPOUT', 'STACK', 'STAND', 'STEAM', 'STEEL', 'STOCK', 'STONE', 'STOVE',
  'STRAP', 'TABLE', 'TIMER', 'TOOTH', 'TORCH', 'TOWER', 'TRACK', 'TRAIN',
  'TRUSS', 'TUBES', 'VALVE', 'WATCH', 'WHEEL', 'WHIRL', 'WIDTH', 'WINCH',
  'WORKS',
];

export const WORDS_BY_LENGTH: Record<number, string[]> = {
  3: WORDS_3,
  4: WORDS_4,
  5: WORDS_5,
};

const LOOKUP: Set<string> = new Set([...WORDS_3, ...WORDS_4, ...WORDS_5]);

export function isWord(candidate: string): boolean {
  return LOOKUP.has(candidate);
}

/** Letter pool weighted towards letters that actually start/fill English words. */
export const LETTER_POOL =
  'AAAAABBCCDDEEEEEFGGHHIIIIKLLLMMNNNOOOOPPRRRRSSSSTTTTUUVWY';
