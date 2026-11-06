export const CASINO_GOLD = {
  name: 'casino-gold',

  colors: {
    bg: {
      primary: '#0B0B0F',
      secondary: '#141418',
      tertiary: '#1C1C24',
      accent: '#1E1A14',        // warm dark with a gold tint
    },
    gold: {
      primary: '#D4AF37',       // real gold, not yellow
      light: '#F5D77A',
      dark: '#A67C00',
      shimmer: '#FFE4A0',
    },
    text: {
      primary: '#F5F0E8',       // warm white
      secondary: '#8A8078',
      accent: '#D4AF37',
      muted: '#5A5550',
    },
    status: {
      win: '#4ADE80',
      lose: '#F87171',
      jackpot: '#FFD700',
    },
    ui: {
      border: '#2A2520',
      divider: '#221E18',
      overlay: 'rgba(0, 0, 0, 0.8)',
      glass: 'rgba(20, 20, 24, 0.9)',
    },
  },

  gradients: {
    primary: ['#D4AF37', '#A67C00'],
    surface: ['#141418', '#1C1C24'],
    button: ['#D4AF37', '#F5D77A', '#D4AF37'],   // shimmer effect
    reward: ['#FFD700', '#D4AF37'],
    header: ['#0B0B0F', '#1E1A14'],
    luxury: ['#1C1C24', '#141418', '#0B0B0F'],   // deep dark
  },

  typography: {
    hero: { fontSize: 42, fontWeight: '300' as const, letterSpacing: 4 },  // thin, elegant
    title: { fontSize: 24, fontWeight: '600' as const, letterSpacing: 2 },
    subtitle: { fontSize: 16, fontWeight: '400' as const, letterSpacing: 1 },
    body: { fontSize: 14, fontWeight: '400' as const, letterSpacing: 0.5 },
    caption: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 1.5 },
    button: { fontSize: 14, fontWeight: '600' as const, letterSpacing: 3, textTransform: 'uppercase' as const },
    score: { fontSize: 38, fontWeight: '700' as const, letterSpacing: 0 },
  },

  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 36, xxl: 56 },

  radius: {
    sm: 4,         // casino = stricter
    md: 8,
    lg: 12,
    xl: 16,
    pill: 100,
  },

  shadows: {
    card: {
      shadowColor: '#D4AF37',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    button: {
      shadowColor: '#D4AF37',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
  },

  animation: {
    spring: { tension: 80, friction: 10 },     // slower, more elegant
    bounce: { tension: 100, friction: 8 },
    smooth: { duration: 400 },
    slow: { duration: 800 },
  },
};

// ============================================================
// CYBERPUNK — purple/blue, glitches, the future
// ============================================================
