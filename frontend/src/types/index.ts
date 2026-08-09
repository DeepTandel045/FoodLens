export interface NutritionData {
  energy_kcal?: number | null;
  carbohydrates_g?: number | null;
  sugars_g?: number | null;
  fat_g?: number | null;
  saturated_fat_g?: number | null;
  trans_fat_g?: number | null;
  protein_g?: number | null;
  fiber_g?: number | null;
  sodium_mg?: number | null;
  serving_size?: string;
  serving_unit?: string;
}

export interface Product {
  id: number;
  barcode?: string | null;
  name: string;
  brand: string;
  category: string;
  image_url?: string | null;
  ingredients_raw?: string | null;
  ingredients_normalized: string[];
  allergens: string[];
  data_source: string;
  nutrition?: NutritionData | null;
}

export interface ScoreFactor {
  factor: string;
  detail: string;
  impact: number;
}

export interface ScoreFactorBreakdown {
  positive: ScoreFactor[];
  negative: ScoreFactor[];
  goal_warnings: ScoreFactor[];
}

export interface Score {
  general_score: number;
  personalized_score: number;
  goal_type: string;
  confidence_level: string;
  breakdown: ScoreFactorBreakdown;
  ai_explanation?: string | null;
  healthy_next_step?: string | null;
}

export interface ScanResult {
  scan_id: number;
  scanned_at: string;
  scan_method: string;
  product: Product;
  score: Score;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  age_range: string;
  dietary_goal: string;
  preferences: string[];
  allergies: string[];
}

export interface BasketItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface BasketAnalysis {
  basket_id: number;
  name: string;
  item_count: number;
  aggregated_nutrition: NutritionData;
  average_general_score: number;
  average_personalized_score: number;
  items: BasketItem[];
  basket_warnings: string[];
  ai_basket_recommendation: string;
}

export interface DashboardData {
  user_name: string;
  dietary_goal: string;
  today_scans_count: number;
  average_today_score: number;
  recent_scans: ScanResult[];
  weekly_score_trends: { day: string; general_score: number; personalized_score: number }[];
  nutrient_trends: { day: string; sugar: number; sodium: number; protein: number }[];
  healthy_next_step_insight: string;
}
