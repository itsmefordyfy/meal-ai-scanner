import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

export async function imageUriToBase64(uri: string): Promise<string> {
  if (Platform.OS === 'web') {
    const response = await fetch(uri);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result !== 'string') {
          reject(new Error('Failed to read image data'));
          return;
        }
        const base64 = result.split(',')[1];
        if (!base64) {
          reject(new Error('Failed to encode image'));
          return;
        }
        resolve(base64);
      };
      reader.onerror = () => reject(new Error('Failed to read image data'));
      reader.readAsDataURL(blob);
    });
  }

  return FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
}
