import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { SavedMealDetailModal } from '@/components/food-analysis/saved-meal-detail-modal';
import { MacroRow } from '@/components/food-analysis/macro-row';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Shadows, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';
import type { SavedMeal } from '@/lib/types/food';

type SavedMealsListProps = {
  meals: SavedMeal[];
  onRemoveMeal: (id: string) => void;
};

export function SavedMealsList({ meals, onRemoveMeal }: SavedMealsListProps) {
  const theme = useTheme();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const [selectedMeal, setSelectedMeal] = useState<SavedMeal | null>(null);

  const handleRemoveMeal = (id: string) => {
    onRemoveMeal(id);
    if (selectedMeal?.id === id) {
      setSelectedMeal(null);
    }
  };

  if (meals.length === 0) {
    return (
      <ThemedView
        type="backgroundElement"
        style={[styles.emptyState, { borderColor: theme.border }, Shadows?.card]}>
        <ThemedView
          style={[
            styles.emptyIcon,
            { backgroundColor: isDark ? Brand.primaryLightDark : Brand.primaryLight },
          ]}>
          <ThemedText style={styles.emptyIconText}>🍽️</ThemedText>
        </ThemedView>
        <ThemedText type="smallBold">No saved meals yet</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.emptyCopy}>
          Scan a meal and save it — your history will show up here.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <ThemedView style={styles.list}>
        {meals.map((meal) => (
          <ThemedView
            key={meal.id}
            type="backgroundElement"
            style={[styles.card, { borderColor: theme.border }, Shadows?.card]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`View details for ${meal.foodName}`}
              onPress={() => setSelectedMeal(meal)}
              style={({ pressed }) => [styles.cardPressable, pressed && styles.pressed]}>
              <View style={styles.thumbnailWrap}>
                <Image source={{ uri: meal.imageUri }} style={styles.thumbnail} contentFit="cover" />
                <ThemedView style={styles.calorieBadge}>
                  <ThemedText style={styles.calorieBadgeText}>{meal.calories}</ThemedText>
                  <ThemedText style={styles.calorieBadgeUnit}>kcal</ThemedText>
                </ThemedView>
              </View>

              <ThemedView style={styles.cardContent}>
                <ThemedText type="smallBold" numberOfLines={1}>
                  {meal.foodName}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {formatSavedAt(meal.savedAt)}
                </ThemedText>
                <MacroRow macros={meal.macros} compact />
              </ThemedView>

              <ThemedText themeColor="textSecondary" style={styles.chevron}>
                ›
              </ThemedText>
            </Pressable>

            <ThemedView style={[styles.cardActions, { borderTopColor: theme.border }]}>
              <PrimaryButton
                label="Remove"
                variant="ghost"
                compact
                onPress={() => handleRemoveMeal(meal.id)}
              />
            </ThemedView>
          </ThemedView>
        ))}
      </ThemedView>

      <SavedMealDetailModal
        meal={selectedMeal}
        visible={selectedMeal !== null}
        onClose={() => setSelectedMeal(null)}
        onRemove={handleRemoveMeal}
      />
    </>
  );
}

function formatSavedAt(savedAt: string): string {
  const date = new Date(savedAt);
  if (Number.isNaN(date.getTime())) {
    return savedAt;
  }
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.three,
  },
  card: {
    borderRadius: Spacing.four,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  thumbnailWrap: {
    width: 88,
    height: 88,
    borderRadius: 14,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  calorieBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  calorieBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 16,
  },
  calorieBadgeUnit: {
    color: '#CBD5E1',
    fontSize: 9,
    fontWeight: '600',
    lineHeight: 11,
  },
  cardContent: {
    flex: 1,
    gap: Spacing.one,
  },
  chevron: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '300',
    paddingRight: Spacing.one,
  },
  cardActions: {
    borderTopWidth: 1,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    alignItems: 'flex-end',
  },
  emptyState: {
    borderRadius: Spacing.four,
    borderWidth: 1,
    padding: Spacing.five,
    alignItems: 'center',
    gap: Spacing.two,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconText: {
    fontSize: 24,
  },
  emptyCopy: {
    textAlign: 'center',
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.88,
  },
});
