import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  align?: 'center' | 'left';
};

/**
 * The one header used by every screen with a header. Screens only swap
 * leftSlot / title / rightSlot, so padding and surface never drift apart.
 */
function ScreenHeaderBase({
  title,
  subtitle,
  leftSlot,
  rightSlot,
  align = 'center',
}: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.side}>{leftSlot}</View>
      <View
        style={[
          styles.middle,
          align === 'left' ? styles.middleLeft : styles.middleCenter,
        ]}>
        <Text
          style={[styles.title, align === 'left' ? styles.textLeft : null]}
          numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[styles.subtitle, align === 'left' ? styles.textLeft : null]}
            numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.sideRight}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 44, // rule #6 - clears the status bar
    height: 116,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: theme.colors.ui.headerSurface,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(184,134,59,0.22)',
  },
  side: { minWidth: 52, alignItems: 'flex-start', justifyContent: 'center' },
  sideRight: { minWidth: 52, alignItems: 'flex-end', justifyContent: 'center' },
  middle: { flex: 1, paddingHorizontal: 10, justifyContent: 'center' },
  middleCenter: { alignItems: 'center' },
  middleLeft: { alignItems: 'flex-start' },
  title: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.8,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 3,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  textLeft: { textAlign: 'left' },
});

export const ScreenHeader = memo(ScreenHeaderBase);
