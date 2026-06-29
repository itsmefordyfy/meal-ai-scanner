import { StyleSheet } from 'react-native';

import { MacroRow } from '@/components/food-analysis/macro-row';
import { ThemedTextInput } from '@/components/ui/themed-text-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StatusBanner } from '@/components/ui/status-banner';
import { Brand, Spacing } from '@/constants/theme';
import type { ConfidenceLevel, FoodAnalysisResult } from '@/lib/types/food';

type FoodResultFormProps = {
  value: FoodAnalysisResult;
  onChange: (value: FoodAnalysisResult) => void;
};

export function FoodResultForm({ value, onChange }: FoodResultFormProps) {
  const updateField = <K extends keyof FoodAnalysisResult>(key: K, fieldValue: FoodAnalysisResult[K]) => {
    onChange({ ...value, [key]: fieldValue });
  };

  const updateMacro = (key: keyof FoodAnalysisResult['macros'], text: string) => {
    const parsed = Number.parseInt(text.replace(/[^\d]/g, ''), 10);
    onChange({
      ...value,
      macros: {
        ...value.macros,
        [key]: Number.isFinite(parsed) ? parsed : 0,
      },
    });
  };

  return (
    <ThemedView style={[styles.container, styles.reviewCard]}>
      <ThemedView style={styles.header}>
        <ThemedText type="smallBold" style={styles.title}>
          Review & edit
        </ThemedText>
        <ThemedView style={[styles.confidencePill, confidenceStyle(value.confidence)]}>
          <ThemedText style={styles.confidenceText}>
            {confidenceLabel(value.confidence)}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {value.confidence !== 'high' && (
        <StatusBanner
          tone={value.confidence === 'low' ? 'warning' : 'info'}
          message={
            value.notes ??
            `${confidenceLabel(value.confidence)} estimate — adjust values before saving.`
          }
        />
      )}

      <ThemedTextInput
        label="Food name"
        value={value.foodName}
        onChangeText={(text) => updateField('foodName', text)}
        placeholder="e.g. Grilled chicken salad"
      />

      <ThemedTextInput
        label="Calories (kcal)"
        value={String(value.calories)}
        onChangeText={(text) => {
          const parsed = Number.parseInt(text.replace(/[^\d]/g, ''), 10);
          updateField('calories', Number.isFinite(parsed) ? parsed : 0);
        }}
        keyboardType="number-pad"
        placeholder="0"
      />

      <ThemedView style={styles.macrosSection}>
        <ThemedText type="smallBold">Macros (grams)</ThemedText>
        <ThemedView style={styles.macroInputs}>
          <ThemedTextInput
            label="Protein"
            value={String(value.macros.protein)}
            onChangeText={(text) => updateMacro('protein', text)}
            keyboardType="number-pad"
          />
          <ThemedTextInput
            label="Carbs"
            value={String(value.macros.carbs)}
            onChangeText={(text) => updateMacro('carbs', text)}
            keyboardType="number-pad"
          />
          <ThemedTextInput
            label="Fat"
            value={String(value.macros.fat)}
            onChangeText={(text) => updateMacro('fat', text)}
            keyboardType="number-pad"
          />
        </ThemedView>
        <MacroRow macros={value.macros} />
      </ThemedView>
    </ThemedView>
  );
}

function confidenceLabel(confidence: ConfidenceLevel): string {
  switch (confidence) {
    case 'high':
      return 'High confidence';
    case 'medium':
      return 'Medium confidence';
    default:
      return 'Low confidence';
  }
}

function confidenceStyle(confidence: ConfidenceLevel) {
  switch (confidence) {
    case 'high':
      return { backgroundColor: Brand.primaryLight };
    case 'medium':
      return { backgroundColor: Brand.carbsLight };
    default:
      return { backgroundColor: Brand.dangerLight };
  }
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  reviewCard: {
    paddingTop: Spacing.two,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.35)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  title: {
    fontSize: 18,
    flex: 1,
  },
  confidencePill: {
    borderRadius: 999,
    paddingHorizontal: Spacing.two,
    paddingVertical: 6,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '700',
    color: Brand.primaryDark,
  },
  macrosSection: {
    gap: Spacing.two,
  },
  macroInputs: {
    gap: Spacing.two,
  },
});
