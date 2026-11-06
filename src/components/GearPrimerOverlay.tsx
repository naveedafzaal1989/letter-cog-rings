import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Cog, ScrollText } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { SCREEN_W } from '../utils/geometry';
import { BrassSurface } from './BrassSurface';
import { PrimaryButton } from './PrimaryButton';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const LINES: Array<[string, string]> = [
  ['TURN A RING', 'Pick R1-R3 in the bar, then use the two rotate keys.'],
  ['GEARED RINGS', 'A ring with a dot drags its partner the opposite way.'],
  ['LIGHT THE SPOKES', 'A spoke glows green when it spells a real word.'],
];

/** The how-to-play card. An overlay, not a screen state. */
function GearPrimerOverlayBase({ visible, onClose }: Props) {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.scrim}>
      <BrassSurface radius={theme.radius.xl} style={styles.card}>
        <View style={styles.titleRow}>
          <ScrollText size={26} color={theme.colors.brass.light} strokeWidth={2.2} />
          <Text style={styles.title}>GEAR PRIMER</Text>
        </View>

        {LINES.map(([head, body]) => (
          <View key={head} style={styles.line}>
            <View style={styles.iconWrap}>
              <Cog size={20} color={theme.colors.brass.primary} strokeWidth={2.4} />
            </View>
            <View style={styles.lineText}>
              <Text style={styles.lineHead}>{head}</Text>
              <Text style={styles.lineBody}>{body}</Text>
            </View>
          </View>
        ))}

        <View style={styles.cta}>
          <PrimaryButton label="GOT IT" onPress={onClose} height={48} />
        </View>
      </BrassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.ui.scrim,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 40,
    paddingHorizontal: 28,
  },
  card: { width: SCREEN_W - 56, padding: 18, gap: 14 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: 1.8,
    color: theme.colors.text.primary,
  },
  line: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(184,134,59,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineText: { flex: 1 },
  lineHead: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: theme.colors.brass.light,
  },
  lineBody: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
    color: theme.colors.text.muted,
  },
  cta: { marginTop: 2 },
});

export const GearPrimerOverlay = memo(GearPrimerOverlayBase);
