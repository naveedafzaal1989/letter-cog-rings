/**
 * CASINO_GOLD preset, re-tinted to the brief's brushed brass / verdigris.
 * `name` stays exactly the preset value.
 */
export const theme = {
  name: 'casino-gold',

  colors: {
    bg: {
      deep: '#15120E',
      primary: '#1F1B16',
      secondary: '#241E17',
      tertiary: '#2A241C',
      alt: '#4A3F30',
    },
    brass: {
      primary: '#B8863B',
      light: '#E0B261',
      dark: '#8A6327',
      shimmer: '#F2D9A4',
    },
    accent: {
      verdigris: '#5FC9B3',
      verdigrisSoft: 'rgba(95,201,179,0.14)',
      warning: '#C96A4A',
    },
    text: {
      primary: '#F5EBD8',
      secondary: '#C9B894',
      muted: '#A8997F',
      faint: '#7E7059',
      onBrass: '#1F1B16',
    },
    ui: {
      hairline: 'rgba(184,134,59,0.30)',
      hairlineStrong: 'rgba(184,134,59,0.55)',
      bevel: 'rgba(245,235,216,0.10)',
      shade: 'rgba(0,0,0,0.40)',
      glass: 'rgba(245,235,216,0.06)',
      glassBorder: 'rgba(245,235,216,0.12)',
      headerSurface: 'rgba(0,0,0,0.32)',
      scrim: 'rgba(10,8,6,0.88)',
    },
  },

  gradients: {
    brass: ['#E0B261', '#B8863B', '#8A6327'],
    brassSoft: ['#3A2F22', '#241E17'],
    plate: ['#2E261C', '#1A1611'],
    hub: ['#B8863B', '#6E4F20'],
    loader: ['rgba(10,8,6,0.94)', 'rgba(21,18,14,0.88)', 'rgba(10,8,6,0.96)'],
    menu: ['rgba(21,18,14,0.62)', 'rgba(31,27,22,0.80)', 'rgba(16,13,10,0.92)'],
    game: ['rgba(16,13,10,0.86)', 'rgba(31,27,22,0.72)', 'rgba(16,13,10,0.92)'],
    result: ['rgba(95,201,179,0.14)', 'rgba(31,27,22,0.86)', 'rgba(16,13,10,0.95)'],
    plates: ['rgba(31,27,22,0.70)', 'rgba(21,18,14,0.88)', 'rgba(16,13,10,0.94)'],
  },

  typography: {
    hero: { fontSize: 30, fontWeight: '800' as const, letterSpacing: 3.5 },
    title: { fontSize: 26, fontWeight: '800' as const, letterSpacing: 2.4 },
    section: { fontSize: 15, fontWeight: '800' as const, letterSpacing: 1.8 },
    letter: { fontSize: 17, fontWeight: '800' as const, letterSpacing: 0.5 },
    body: { fontSize: 13, fontWeight: '600' as const, letterSpacing: 0.3 },
    caption: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1.8 },
    micro: { fontSize: 10, fontWeight: '700' as const, letterSpacing: 1.6 },
  },

  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 36 },

  radius: { sm: 8, md: 10, lg: 12, xl: 16, xxl: 18, pill: 100 },

  shadows: {
    card: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.55,
      shadowRadius: 18,
      elevation: 10,
    },
    deep: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.6,
      shadowRadius: 24,
      elevation: 12,
    },
    brass: {
      shadowColor: '#B8863B',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.45,
      shadowRadius: 16,
      elevation: 8,
    },
  },

  animation: {
    ui: { tension: 320, friction: 12 },
    hero: { tension: 48, friction: 8 },
    pop: { tension: 180, friction: 6 },
    fade: 320,
  },
};

export type Theme = typeof theme;
