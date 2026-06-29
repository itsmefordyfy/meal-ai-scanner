import {
  AnalyzeFoodError,
  type FoodAnalysisResult,
} from '@/lib/types/food';

export function parseFoodAnalysisResponse(payload: unknown): FoodAnalysisResult {
  if (!payload || typeof payload !== 'object') {
    throw new AnalyzeFoodError('invalid_response', 'Unexpected response from food analysis.');
  }

  const data = payload as Record<string, unknown>;

  if (data.error && typeof data.error === 'string') {
    throw new AnalyzeFoodError('server', data.error);
  }

  const isFood = Boolean(data.isFood);
  const foodName = typeof data.foodName === 'string' ? data.foodName : '';
  const calories = typeof data.calories === 'number' ? data.calories : 0;
  const confidence =
    data.confidence === 'high' || data.confidence === 'medium' || data.confidence === 'low'
      ? data.confidence
      : 'low';

  const macrosRaw = data.macros;
  const macros =
    macrosRaw && typeof macrosRaw === 'object'
      ? {
          protein: Number((macrosRaw as Record<string, unknown>).protein) || 0,
          carbs: Number((macrosRaw as Record<string, unknown>).carbs) || 0,
          fat: Number((macrosRaw as Record<string, unknown>).fat) || 0,
        }
      : { protein: 0, carbs: 0, fat: 0 };

  const notes = typeof data.notes === 'string' ? data.notes : undefined;

  if (!isFood) {
    throw new AnalyzeFoodError(
      'not_food',
      notes ?? 'This photo does not appear to contain food.',
    );
  }

  if (confidence === 'low' && calories <= 0 && !foodName.trim()) {
    throw new AnalyzeFoodError(
      'uncertain',
      notes ?? 'Could not confidently identify the meal. Try a clearer photo.',
    );
  }

  return {
    isFood,
    foodName: foodName.trim() || 'Unknown meal',
    calories: Math.max(0, Math.round(calories)),
    macros: {
      protein: Math.max(0, Math.round(macros.protein)),
      carbs: Math.max(0, Math.round(macros.carbs)),
      fat: Math.max(0, Math.round(macros.fat)),
    },
    confidence,
    notes,
  };
}
