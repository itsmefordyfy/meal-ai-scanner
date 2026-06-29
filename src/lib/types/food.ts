export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type FoodMacros = {
  protein: number;
  carbs: number;
  fat: number;
};

export type FoodAnalysisResult = {
  isFood: boolean;
  foodName: string;
  calories: number;
  macros: FoodMacros;
  confidence: ConfidenceLevel;
  notes?: string;
};

export type SavedMeal = FoodAnalysisResult & {
  id: string;
  imageUri: string;
  savedAt: string;
};

export type AnalyzeFoodErrorCode =
  | 'network'
  | 'server'
  | 'not_food'
  | 'uncertain'
  | 'invalid_response';

export class AnalyzeFoodError extends Error {
  code: AnalyzeFoodErrorCode;

  constructor(code: AnalyzeFoodErrorCode, message: string) {
    super(message);
    this.name = 'AnalyzeFoodError';
    this.code = code;
  }
}
