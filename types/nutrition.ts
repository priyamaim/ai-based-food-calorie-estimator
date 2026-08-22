export interface FoodItemBreakdown {
  name: string;
  portion: string;
  calories: number;
}

export interface NutritionalAnalysis {
  food_name: string;
  total_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  confidence_score: 'High' | 'Medium' | 'Low' | string;
  health_tip: string;
  items?: FoodItemBreakdown[];
  portionSizeMultiplier?: number;
  portionLabel?: string;
  cookingMethod?: string;
  mealType?: string;
}

export interface MealScanItem {
  id: string;
  timestamp: number;
  imageUri: string;
  analysis: NutritionalAnalysis;
}

export interface ApiPredictRequest {
  image: string; // base64 string
  mimeType: string;
  portionSizeMultiplier?: number;
  portionLabel?: string;
  cookingMethod?: string;
  mealType?: string;
}

export interface ApiPredictResponse {
  success: boolean;
  data?: NutritionalAnalysis;
  error?: string;
  isNonFood?: boolean;
}
