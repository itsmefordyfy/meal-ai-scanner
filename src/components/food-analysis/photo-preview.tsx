import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Shadows, Spacing } from '@/constants/theme';

type PhotoPreviewProps = {
  uri: string;
  label?: string;
};

export function PhotoPreview({ uri, label = 'Selected photo' }: PhotoPreviewProps) {
  return (
    <ThemedView style={styles.container}>
      {label ? <ThemedText type="smallBold">{label}</ThemedText> : null}
      <ThemedView style={[styles.imageFrame, Shadows?.card]}>
        <Image source={{ uri }} style={styles.image} contentFit="cover" />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  imageFrame: {
    borderRadius: Spacing.four,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
});
