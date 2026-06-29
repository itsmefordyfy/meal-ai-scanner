import type { FoodAnalysisResult, SavedMeal } from '@/lib/types/food';

export function createSavedMeal(
  result: FoodAnalysisResult,
  imageUri: string,
): SavedMeal {
  return {
    ...result,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    imageUri,
    savedAt: new Date().toISOString(),
  };
}
