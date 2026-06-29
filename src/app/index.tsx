import { ActivityIndicator, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FoodResultForm } from '@/components/food-analysis/food-result-form';
import { PhotoPreview } from '@/components/food-analysis/photo-preview';
import { SavedMealsList } from '@/components/food-analysis/saved-meals-list';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBanner } from '@/components/ui/status-banner';
import { SurfaceCard } from '@/components/ui/surface-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, MaxContentWidth, Spacing } from '@/constants/theme';
import { useFoodAnalysisScreen } from '@/hooks/use-food-analysis-screen';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const theme = useTheme();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + Spacing.three,
  };

  const {
    phase,
    imageUri,
    draft,
    errorMessage,
    savedMeals,
    isAnalyzing,
    pickAndAnalyze,
    setDraft,
    saveMeal,
    removeMeal,
    resetFlow,
  } = useFoodAnalysisScreen();

  const showIdlePlaceholder = !imageUri && !isAnalyzing;

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
    ios: {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.hero}>
          <ThemedView
            style={[
              styles.heroBadge,
              { backgroundColor: isDark ? Brand.primaryLightDark : Brand.primaryLight },
            ]}>
            <ThemedText style={styles.heroBadgeText}>Rovexa</ThemedText>
          </ThemedView>
          <ThemedText style={styles.heroTitle}>Meal scan</ThemedText>
          <ThemedText style={styles.heroSubtitle} themeColor="textSecondary">
            Snap a photo, get calories and macros, then save meals locally on your device.
          </ThemedText>
        </ThemedView>

        <SurfaceCard>
          {showIdlePlaceholder ? (
            <ThemedView
              style={[
                styles.placeholder,
                {
                  borderColor: isDark ? Brand.primaryLightDark : Brand.primary,
                  backgroundColor: isDark ? Brand.primaryLightDark : '#F0FDF4',
                },
              ]}>
              <ThemedText style={styles.placeholderEmoji}>📷</ThemedText>
              <ThemedText type="smallBold" style={styles.placeholderTitle}>
                Ready to scan
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.placeholderCopy}>
                Choose a meal photo from your library to analyze it with AI.
              </ThemedText>
            </ThemedView>
          ) : null}

          {imageUri ? <PhotoPreview uri={imageUri} label={phase === 'review' ? 'Your meal' : undefined} /> : null}

          {isAnalyzing ? (
            <ThemedView style={styles.loading}>
              <ActivityIndicator size="large" color={Brand.primary} />
              <ThemedText type="smallBold" style={{ color: Brand.primaryDark }}>
                Analyzing your meal...
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Estimating calories and macros
              </ThemedText>
            </ThemedView>
          ) : null}

          {errorMessage ? (
            <StatusBanner
              tone={phase === 'error' ? 'error' : 'warning'}
              message={errorMessage}
            />
          ) : null}

          {phase === 'review' && draft ? (
            <FoodResultForm value={draft} onChange={setDraft} />
          ) : null}

          <View style={styles.actions}>
            {phase === 'review' ? (
              <>
                <PrimaryButton label="Save meal" onPress={saveMeal} />
                <PrimaryButton label="Discard" variant="secondary" onPress={resetFlow} />
              </>
            ) : (
              <PrimaryButton
                label={phase === 'error' ? 'Try another photo' : 'Pick photo from library'}
                onPress={pickAndAnalyze}
                disabled={isAnalyzing}
              />
            )}
          </View>
        </SurfaceCard>

        <ThemedView style={styles.section}>
          <SectionHeader
            title="Saved meals"
            subtitle="Tap a meal to view full details"
            count={savedMeals.length}
          />
          <SavedMealsList meals={savedMeals} onRemoveMeal={removeMeal} />
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
    gap: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
  },
  hero: {
    gap: Spacing.two,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: Spacing.two,
    paddingVertical: 6,
  },
  heroBadgeText: {
    color: Brand.primaryDark,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 520,
  },
  placeholder: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: Spacing.four,
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.two,
  },
  placeholderEmoji: {
    fontSize: 36,
  },
  placeholderTitle: {
    fontSize: 16,
  },
  placeholderCopy: {
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  section: {
    gap: Spacing.three,
  },
  loading: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
  },
  actions: {
    gap: Spacing.two,
  },
});
