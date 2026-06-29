import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  count?: number;
};

export function SectionHeader({ title, subtitle, count }: SectionHeaderProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <ThemedText type="smallBold" style={styles.title}>
          {title}
        </ThemedText>
        {count !== undefined ? (
          <ThemedView
            style={[
              styles.badge,
              { backgroundColor: isDark ? Brand.primaryLightDark : Brand.primaryLight },
            ]}>
            <ThemedText style={[styles.badgeText, { color: Brand.primaryDark }]}>
              {count}
            </ThemedText>
          </ThemedView>
        ) : null}
      </View>
      {subtitle ? (
        <ThemedText type="small" themeColor="textSecondary">
          {subtitle}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.half,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
  },
  badge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.two,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
