import React, { memo } from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../constants/theme';

type Props = {
  children?: React.ReactNode;
  radius?: number;
  raised?: boolean;
  style?: StyleProp<ViewStyle>;
  colors?: string[];
  borderColor?: string;
};

/**
 * The skeuomorphic card: gradient fill, 1px bevel highlight on top,
 * a shade line at the bottom and a brass hairline border.
 */
function BrassSurfaceBase({
  children,
  radius = theme.radius.xl,
  raised = true,
  style,
  colors,
  borderColor,
}: Props) {
  return (
    <LinearGradient
      colors={colors ?? theme.gradients.brassSoft}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={[
        styles.base,
        {
          borderRadius: radius,
          borderColor: borderColor ?? theme.colors.ui.hairline,
        },
        raised ? theme.shadows.card : null,
        style,
      ]}>
      <View
        pointerEvents="none"
        style={[styles.bevel, { borderTopLeftRadius: radius, borderTopRightRadius: radius }]}
      />
      {children}
      <View
        pointerEvents="none"
        style={[
          styles.shade,
          { borderBottomLeftRadius: radius, borderBottomRightRadius: radius },
        ]}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  bevel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: theme.colors.ui.bevel,
  },
  shade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: theme.colors.ui.shade,
  },
});

export const BrassSurface = memo(BrassSurfaceBase);
