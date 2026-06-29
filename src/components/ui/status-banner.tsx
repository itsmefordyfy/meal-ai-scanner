import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type StatusBannerProps = {
  message: string;
  tone?: 'error' | 'warning' | 'info';
};

export function StatusBanner({ message, tone = 'info' }: StatusBannerProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = toneStyles[tone];

  return (
    <ThemedView
      style={[
        styles.banner,
        {
          backgroundColor: isDark ? colors.backgroundDark : colors.background,
          borderColor: isDark ? colors.borderDark : colors.border,
        },
      ]}>
      <ThemedText type="small" style={{ color: isDark ? colors.textDark : colors.text }}>
        {message}
      </ThemedText>
    </ThemedView>
  );
}

const toneStyles = {
  error: {
    background: Brand.dangerLight,
    backgroundDark: Brand.dangerLightDark,
    border: '#FECACA',
    borderDark: '#7F1D1D',
    text: '#991B1B',
    textDark: '#FCA5A5',
  },
  warning: {
    background: Brand.carbsLight,
    backgroundDark: Brand.carbsLightDark,
    border: '#FDE68A',
    borderDark: '#78350F',
    text: '#92400E',
    textDark: '#FCD34D',
  },
  info: {
    background: Brand.proteinLight,
    backgroundDark: Brand.proteinLightDark,
    border: '#BFDBFE',
    borderDark: '#1E3A8A',
    text: '#1E40AF',
    textDark: '#93C5FD',
  },
} as const;

const styles = StyleSheet.create({
  banner: {
    borderRadius: 12,
    borderWidth: 1,
    padding: Spacing.three,
  },
});
