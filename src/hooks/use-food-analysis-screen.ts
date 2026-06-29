import { useCallback, useState } from 'react';

import { analyzeFoodPhoto } from '@/lib/api/analyze-food';
import { createSavedMeal } from '@/lib/food/create-saved-meal';
import { pickImageFromLibrary } from '@/lib/image/pick-image';
import { imageUriToBase64 } from '@/lib/image/to-base64';
import { AnalyzeFoodError, type FoodAnalysisResult } from '@/lib/types/food';
import { useMealsStore } from '@/stores/meals-store';

type ScreenPhase = 'idle' | 'analyzing' | 'review' | 'error';

export function useFoodAnalysisScreen() {
  const addMeal = useMealsStore((state) => state.addMeal);
  const removeMeal = useMealsStore((state) => state.removeMeal);
  const savedMeals = useMealsStore((state) => state.savedMeals);

  const [phase, setPhase] = useState<ScreenPhase>('idle');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [draft, setDraft] = useState<FoodAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetFlow = useCallback(() => {
    setPhase('idle');
    setImageUri(null);
    setDraft(null);
    setErrorMessage(null);
  }, []);

  const pickAndAnalyze = useCallback(async () => {
    setErrorMessage(null);

    try {
      const picked = await pickImageFromLibrary();
      if (!picked) {
        return;
      }

      setImageUri(picked.uri);
      setPhase('analyzing');

      const imageBase64 = await imageUriToBase64(picked.uri);
      const result = await analyzeFoodPhoto({
        imageBase64,
        mimeType: picked.mimeType,
      });

      setDraft(result);
      setPhase('review');
    } catch (error) {
      if (error instanceof AnalyzeFoodError) {
        setErrorMessage(error.message);
        setPhase('error');
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
        setPhase('error');
      } else {
        setErrorMessage('Something went wrong. Please try again.');
        setPhase('error');
      }
    }
  }, []);

  const saveMeal = useCallback(() => {
    if (!draft || !imageUri) {
      return;
    }

    const trimmedName = draft.foodName.trim();
    if (!trimmedName) {
      setErrorMessage('Add a food name before saving.');
      return;
    }

    const meal = createSavedMeal(
      {
        ...draft,
        foodName: trimmedName,
      },
      imageUri,
    );

    addMeal(meal);
    resetFlow();
  }, [addMeal, draft, imageUri, resetFlow]);

  return {
    phase,
    imageUri,
    draft,
    errorMessage,
    savedMeals,
    isAnalyzing: phase === 'analyzing',
    pickAndAnalyze,
    setDraft,
    saveMeal,
    removeMeal,
    resetFlow,
  };
}
