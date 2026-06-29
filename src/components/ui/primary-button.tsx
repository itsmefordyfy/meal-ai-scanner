import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type PrimaryButtonProps = PressableProps & {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  compact?: boolean;
};

export function PrimaryButton({
  label,
  variant = 'primary',
  compact = false,
  disabled,
  style,
  ...props
}: PrimaryButtonProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        compact && styles.compact,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && [
          styles.secondary,
          {
            borderColor: isDark ? Brand.primary : Brand.primaryDark,
            backgroundColor: isDark ? Brand.primaryLightDark : '#FFFFFF',
          },
        ],
        variant === 'ghost' && styles.ghost,
        variant === 'danger' && [
          styles.danger,
          { backgroundColor: isDark ? Brand.dangerLightDark : Brand.dangerLight },
        ],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      {...props}>
      <ThemedText
        type="smallBold"
        style={[
          variant === 'primary' && styles.primaryLabel,
          variant === 'secondary' && { color: Brand.primaryDark },
          variant === 'ghost' && { color: Brand.primaryDark },
          variant === 'danger' && { color: Brand.danger },
        ]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compact: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: 10,
  },
  primary: {
    backgroundColor: Brand.primary,
  },
  secondary: {
    borderWidth: 1.5,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    borderWidth: 0,
  },
  primaryLabel: {
    color: '#FFFFFF',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
});
