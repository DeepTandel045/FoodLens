from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Dict, Any
from datetime import datetime
import re

# --- Auth & User Schemas ---

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, example="John Doe")
    email: str = Field(..., example="john@example.com")
    password: str = Field(..., min_length=6, example="secret123")

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        if not v or not isinstance(v, str):
            raise ValueError("Email is required")
        v = v.strip().lower()
        if "@" not in v or "." not in v or len(v) < 5:
            raise ValueError("Please enter a valid email address (e.g. name@domain.com)")
        return v

class UserLogin(BaseModel):
    email: str = Field(..., example="john@example.com")
    password: str = Field(..., example="secret123")

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        if not v or not isinstance(v, str):
            raise ValueError("Email is required")
        v = v.strip().lower()
        if "@" not in v or "." not in v or len(v) < 5:
            raise ValueError("Please enter a valid email address (e.g. name@domain.com)")
        return v

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    name: str
    email: str

class UserProfileUpdate(BaseModel):
    age_range: Optional[str] = "18-35"
    dietary_goal: Optional[str] = "general_healthy_eating"
    preferences: Optional[List[str]] = []  # e.g., ["low_sugar", "high_protein"]
    allergies: Optional[List[str]] = []    # e.g., ["peanuts", "gluten"]

class UserProfileResponse(BaseModel):
    id: int
    name: str
    email: str
    age_range: str
    dietary_goal: str
    preferences: List[str]
    allergies: List[str]

# --- Nutrition & Product Schemas ---

class NutritionData(BaseModel):
    energy_kcal: Optional[float] = None
    carbohydrates_g: Optional[float] = None
    sugars_g: Optional[float] = None
    fat_g: Optional[float] = None
    saturated_fat_g: Optional[float] = None
    trans_fat_g: Optional[float] = None
    protein_g: Optional[float] = None
    fiber_g: Optional[float] = None
    sodium_mg: Optional[float] = None
    serving_size: Optional[str] = "100g"
    serving_unit: Optional[str] = "g"

class ProductResponse(BaseModel):
    id: int
    barcode: Optional[str] = None
    name: str
    brand: str
    category: str
    image_url: Optional[str] = None
    ingredients_raw: Optional[str] = None
    ingredients_normalized: List[str] = []
    allergens: List[str] = []
    data_source: str
    nutrition: Optional[NutritionData] = None

# --- Scoring & Analysis Schemas ---

class ScoreFactorBreakdown(BaseModel):
    positive: List[Dict[str, Any]]
    negative: List[Dict[str, Any]]
    goal_warnings: List[Dict[str, Any]]

class ScoreResponse(BaseModel):
    general_score: float
    personalized_score: float
    goal_type: str
    confidence_level: str  # High, Medium, Low
    breakdown: ScoreFactorBreakdown
    ai_explanation: Optional[str] = None
    healthy_next_step: Optional[str] = None

class ScanResponse(BaseModel):
    scan_id: int
    scanned_at: datetime
    scan_method: str
    product: ProductResponse
    score: ScoreResponse

class ManualBarcodeRequest(BaseModel):
    barcode: str = Field(..., min_length=4, example="8901058852387")

class CompareRequest(BaseModel):
    product_ids: List[int] = Field(..., min_items=2, max_items=4)

class CompareResponse(BaseModel):
    products: List[ProductResponse]
    scores: List[ScoreResponse]
    comparison_summary: str
    winner_product_id: Optional[int] = None

# --- Basket Schemas ---

class AddBasketItemRequest(BaseModel):
    product_id: int
    quantity: int = 1

class BasketItemResponse(BaseModel):
    id: int
    product: ProductResponse
    quantity: int

class BasketAnalysisResponse(BaseModel):
    basket_id: int
    name: str
    item_count: int
    aggregated_nutrition: NutritionData
    average_general_score: float
    average_personalized_score: float
    items: List[BasketItemResponse]
    basket_warnings: List[str]
    ai_basket_recommendation: str

# --- Dashboard Schemas ---

class DashboardResponse(BaseModel):
    user_name: str
    dietary_goal: str
    today_scans_count: int
    average_today_score: float
    recent_scans: List[ScanResponse]
    weekly_score_trends: List[Dict[str, Any]]
    nutrient_trends: List[Dict[str, Any]]
    healthy_next_step_insight: str
