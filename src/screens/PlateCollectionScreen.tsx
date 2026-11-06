import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Home } from 'lucide-react-native';
import { IconButton } from '../components/IconButton';
import { PlateTile } from '../components/PlateTile';
import { ScreenBackground } from '../components/ScreenBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { TokenBadge } from '../components/TokenBadge';
import { PLATES, Plate } from '../constants/plates';
import { theme } from '../constants/theme';
import { SCREEN_W } from '../utils/geometry';

type Props = {
  tokens: number;
  ownedPlates: string[];
  onBuy: (plate: Plate) => void;
  onBack: () => void;
};

const GAP = 12;
const TILE = Math.floor((SCREEN_W - 32 - GAP * 2) / 3);

export function PlateCollectionScreen({
  tokens,
  ownedPlates,
  onBuy,
  onBack,
}: Props) {
  const handleBuy = useCallback(
    (plate: Plate) => {
      onBuy(plate);
    },
    [onBuy],
  );

  return (
    <ScreenBackground variant="plates">
      <View style={styles.root}>
        <ScreenHeader
          title="PLATE COLLECTION"
          subtitle={String(ownedPlates.length) + ' OF ' + String(PLATES.length)}
          leftSlot={
            <IconButton
              Icon={Home}
              label="Back to the workshop"
              size={44}
              iconSize={24}
              tone="neutral"
              onPress={onBack}
            />
          }
          rightSlot={<TokenBadge tokens={tokens} />}
        />

        <View style={styles.body}>
          <Text style={styles.note}>
            COSMETIC MACHINE PLATES · COG TOKENS ONLY
          </Text>

          <View style={styles.grid}>
            {PLATES.map(plate => (
              <PlateTile
                key={plate.id}
                plate={plate}
                size={TILE}
                owned={ownedPlates.indexOf(plate.id) !== -1}
                affordable={tokens >= plate.cost}
                onBuy={handleBuy}
              />
            ))}
          </View>

          <View style={styles.footer}>
            <SecondaryButton label="BACK TO WORKSHOP" onPress={onBack} />
          </View>
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 24 },
  note: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.muted,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  footer: { marginTop: 'auto', paddingTop: 16 },
});
