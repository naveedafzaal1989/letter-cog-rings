/**
 * Asset re-export.
 *
 * The Codex asset job produced NO PNGs for this build, so there is nothing to
 * require here. Every glyph/background is drawn with lucide icons,
 * react-native-svg and gradients instead. Do not add a require() back unless
 * the matching file really exists under assets/.
 */
export const assets = {};

export type AssetKey = keyof typeof assets;
