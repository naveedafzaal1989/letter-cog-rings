import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

type Props = {
  size: number;
  left: number;
  top: number;
  color?: string;
  teeth?: number;
};

/**
 * Low-opacity brass gear outline. Pure decoration, always behind content and
 * never interactive (pointerEvents none).
 */
function GearDecorBase({
  size,
  left,
  top,
  color = 'rgba(184,134,59,0.09)',
  teeth = 16,
}: Props) {
  const r = size / 2;
  const toothLines = useMemo(() => {
    const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
    for (let i = 0; i < teeth; i++) {
      const rad = ((360 / teeth) * i * Math.PI) / 180;
      lines.push({
        x1: r + Math.cos(rad) * (r - 12),
        y1: r + Math.sin(rad) * (r - 12),
        x2: r + Math.cos(rad) * (r - 1),
        y2: r + Math.sin(rad) * (r - 1),
      });
    }
    return lines;
  }, [r, teeth]);

  return (
    <View style={[styles.wrap, { width: size, height: size, left, top }]} pointerEvents="none">
      <Svg width={size} height={size}>
        <Circle cx={r} cy={r} r={r - 6} stroke={color} strokeWidth={2} fill="none" />
        <Circle cx={r} cy={r} r={r * 0.62} stroke={color} strokeWidth={2} fill="none" />
        <Circle cx={r} cy={r} r={r * 0.24} stroke={color} strokeWidth={2} fill="none" />
        {toothLines.map((line, index) => (
          <Line
            key={'tooth-' + String(index)}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={color}
            strokeWidth={5}
          />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute' },
});

export const GearDecor = memo(GearDecorBase);
