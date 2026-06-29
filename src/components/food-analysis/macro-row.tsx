import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { FoodMacros } from '@/lib/types/food';

type MacroRowProps = {
  macros: FoodMacros;
  compact?: boolean;
};

const macroConfig = [
  { key: 'protein' as const, label: 'Protein', color: Brand.protein, light: Brand.proteinLight, lightDark: Brand.proteinLightDark },
  { key: 'carbs' as const, label: 'Carbs', color: Brand.carbs, light: Brand.carbsLight, lightDark: Brand.carbsLightDark },
  { key: 'fat' as const, label: 'Fat', color: Brand.fat, light: Brand.fatLight, lightDark: Brand.fatLightDark },
];

export function MacroRow({ macros, compact = false }: MacroRowProps) {
  return (
    <ThemedView style={styles.row}>
      {macroConfig.map(({ key, label, color, light, lightDark }) => (
        <MacroItem
          key={key}
          label={label}
          value={`${macros[key]}g`}
          color={color}
          backgroundColor={light}
          backgroundColorDark={lightDark}
          compact={compact}
        />
      ))}
    </ThemedView>
  );
}

function MacroItem({
  label,
  value,
  color,
  backgroundColor,
  backgroundColorDark,
  compact,
}: {
  label: string;
  value: string;
  color: string;
  backgroundColor: string;
  backgroundColorDark: string;
  compact?: boolean;
}) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <ThemedView
      style={[
        styles.item,
        compact && styles.itemCompact,
        { backgroundColor: isDark ? backgroundColorDark : backgroundColor },
      ]}>
      <ThemedText type="small" style={[styles.label, { color }]}>
        {label}
      </ThemedText>
      <ThemedText type="smallBold" style={styles.value}>
        {value}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  item: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    alignItems: 'center',
    gap: 2,
  },
  itemCompact: {
    paddingVertical: Spacing.one,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  value: {
    fontSize: 15,
  },
});
