import { Image } from 'expo-image';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { MacroRow } from '@/components/food-analysis/macro-row';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';
import type { ConfidenceLevel, SavedMeal } from '@/lib/types/food';

type SavedMealDetailModalProps = {
  meal: SavedMeal | null;
  visible: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
};

export function SavedMealDetailModal({
  meal,
  visible,
  onClose,
  onRemove,
}: SavedMealDetailModalProps) {
  const theme = useTheme();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  if (!meal) {
    return null;
  }

  const handleRemove = () => {
    onRemove(meal.id);
    onClose();
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close meal details" />
        <View style={[styles.sheet, { backgroundColor: theme.background, borderColor: theme.border }]}>
          <View style={[styles.handle, { backgroundColor: theme.backgroundSelected }]} />

          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Image source={{ uri: meal.imageUri }} style={styles.image} contentFit="cover" />

            <ThemedView style={styles.header}>
              <ThemedText style={styles.title}>{meal.foodName}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Saved {formatSavedAt(meal.savedAt)}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.statsRow}>
              <StatCard
                label="Calories"
                value={`${meal.calories}`}
                unit="kcal"
                accent={Brand.primary}
                background={isDark ? Brand.primaryLightDark : Brand.primaryLight}
              />
              <StatCard
                label="Confidence"
                value={confidenceLabel(meal.confidence)}
                accent={Brand.carbs}
                background={isDark ? Brand.carbsLightDark : Brand.carbsLight}
              />
            </ThemedView>

            <ThemedView style={styles.macrosSection}>
              <ThemedText type="smallBold" style={styles.sectionLabel}>
                Macronutrients
              </ThemedText>
              <MacroRow macros={meal.macros} />
            </ThemedView>

            {meal.notes ? (
              <ThemedView
                style={[
                  styles.notesBox,
                  {
                    backgroundColor: isDark ? theme.backgroundElement : theme.background,
                    borderColor: theme.border,
                  },
                ]}>
                <ThemedText type="smallBold" style={styles.sectionLabel}>
                  Notes
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {meal.notes}
                </ThemedText>
              </ThemedView>
            ) : null}

            <View style={styles.actions}>
              <PrimaryButton label="Close" variant="secondary" onPress={onClose} />
              <PrimaryButton label="Remove meal" variant="danger" onPress={handleRemove} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function StatCard({
  label,
  value,
  unit,
  accent,
  background,
}: {
  label: string;
  value: string;
  unit?: string;
  accent: string;
  background: string;
}) {
  return (
    <ThemedView style={[styles.statCard, { backgroundColor: background }]}>
      <ThemedText style={[styles.statLabel, { color: accent }]}>{label}</ThemedText>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      {unit ? (
        <ThemedText style={[styles.statUnit, { color: accent }]}>{unit}</ThemedText>
      ) : null}
    </ThemedView>
  );
}

function formatSavedAt(savedAt: string): string {
  const date = new Date(savedAt);
  if (Number.isNaN(date.getTime())) {
    return savedAt;
  }
  return date.toLocaleString();
}

function confidenceLabel(confidence: ConfidenceLevel): string {
  switch (confidence) {
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    default:
      return 'Low';
  }
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
  },
  sheet: {
    maxHeight: '92%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    overflow: 'hidden',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 999,
    marginTop: Spacing.two,
    marginBottom: Spacing.one,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.four,
    paddingBottom: Spacing.five,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: Spacing.four,
  },
  header: {
    gap: Spacing.one,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: Spacing.three,
    gap: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 32,
  },
  statUnit: {
    fontSize: 12,
    fontWeight: '600',
  },
  macrosSection: {
    gap: Spacing.two,
  },
  sectionLabel: {
    fontSize: 15,
  },
  notesBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  actions: {
    gap: Spacing.two,
  },
});
