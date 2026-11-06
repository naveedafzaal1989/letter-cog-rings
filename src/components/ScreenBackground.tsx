import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../constants/theme';
import { SCREEN_W } from '../utils/geometry';
import { GearDecor } from './GearDecor';

export type BackgroundVariant = 'loader' | 'menu' | 'game' | 'result' | 'plates';

type Props = {
  variant: BackgroundVariant;
  children: React.ReactNode;
};

const GRADIENTS: Record<BackgroundVariant, string[]> = {
  loader: theme.gradients.loader,
  menu: theme.gradients.menu,
  game: theme.gradients.game,
  result: theme.gradients.result,
  plates: theme.gradients.plates,
};

const ENDS: Record<BackgroundVariant, { x: number; y: number }> = {
  loader: { x: 0.9, y: 1 },
  menu: { x: 0.6, y: 1 },
  game: { x: 0.4, y: 1 },
  result: { x: 0.5, y: 1 },
  plates: { x: 0.7, y: 1 },
};

/** The opaque base every screen sits on - replaces the AI background image. */
const BASE = ['#2A241C', '#1F1B16', '#100D0A'];

/**
 * The single background of the whole app: one painted base, one gradient per
 * screen. This is what guarantees every screen reads differently.
 */
function ScreenBackgroundBase({ variant, children }: Props) {
  return (
    <LinearGradient
      colors={BASE}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 0.85, y: 1 }}
      style={styles.fill}>
      <LinearGradient
        colors={GRADIENTS[variant]}
        start={{ x: variant === 'loader' ? 0.1 : 0, y: 0 }}
        end={ENDS[variant]}
        style={styles.fill}>
        <View style={styles.decor} pointerEvents="none">
          {variant === 'loader' ? (
            <>
              <GearDecor size={300} left={SCREEN_W / 2 - 150} top={150} teeth={18} />
              <GearDecor size={190} left={SCREEN_W / 2 - 95} top={205} teeth={12} />
            </>
          ) : (
            <>
              <GearDecor size={320} left={SCREEN_W - 120} top={90} teeth={20} />
              <GearDecor size={220} left={-90} top={420} teeth={14} />
            </>
          )}
        </View>
        {children}
      </LinearGradient>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  decor: { ...StyleSheet.absoluteFillObject },
});

export const ScreenBackground = memo(ScreenBackgroundBase);
