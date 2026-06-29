import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { SavedMeal } from '@/lib/types/food';

type MealsState = {
  savedMeals: SavedMeal[];
  addMeal: (meal: SavedMeal) => void;
  removeMeal: (id: string) => void;
  clearMeals: () => void;
};

export const useMealsStore = create<MealsState>()(
  persist(
    (set) => ({
      savedMeals: [],
      addMeal: (meal) =>
        set((state) => ({
          savedMeals: [meal, ...state.savedMeals],
        })),
      removeMeal: (id) =>
        set((state) => ({
          savedMeals: state.savedMeals.filter((meal) => meal.id !== id),
        })),
      clearMeals: () => set({ savedMeals: [] }),
    }),
    {
      name: 'rovexa-saved-meals',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
