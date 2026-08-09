from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.connection import get_db
from app.database.models import Product, ProductNutrition, UserProfile, User
from app.schemas.schemas import CompareRequest, CompareResponse, ProductResponse, ScoreResponse
from app.api.auth import get_current_user
from app.services.scoring_engine import calculate_foodlens_score

router = APIRouter(prefix="/products", tags=["Product Comparison"])

@router.post("/compare", response_model=CompareResponse)
def compare_products(
    req: CompareRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    dietary_goal = profile.dietary_goal if profile else "general_healthy_eating"
    prefs = [p.preference_type for p in current_user.preferences]
    allergies = [a.allergen for a in current_user.allergies]

    products_res = []
    scores_res = []
    highest_score = -1.0
    winner_id = None

    for pid in req.product_ids:
        product = db.query(Product).filter(Product.id == pid).first()
        if not product:
            continue

        nutr = db.query(ProductNutrition).filter(ProductNutrition.product_id == product.id).first()
        nutr_dict = {
            "energy_kcal": nutr.energy_kcal if nutr else None,
            "carbohydrates_g": nutr.carbohydrates_g if nutr else None,
            "sugars_g": nutr.sugars_g if nutr else None,
            "fat_g": nutr.fat_g if nutr else None,
            "saturated_fat_g": nutr.saturated_fat_g if nutr else None,
            "trans_fat_g": nutr.trans_fat_g if nutr else None,
            "protein_g": nutr.protein_g if nutr else None,
            "fiber_g": nutr.fiber_g if nutr else None,
            "sodium_mg": nutr.sodium_mg if nutr else None,
            "serving_size": nutr.serving_size if nutr else "100g",
            "serving_unit": nutr.serving_unit if nutr else "g",
        }

        s_calc = calculate_foodlens_score(
            nutrition=nutr_dict,
            ingredients=product.ingredients_normalized or [],
            allergens=product.allergens or [],
            user_goal=dietary_goal,
            user_preferences=prefs,
            user_allergies=allergies
        )

        p_score = s_calc["personalized_score"]
        if p_score > highest_score:
            highest_score = p_score
            winner_id = product.id

        products_res.append(ProductResponse(
            id=product.id,
            barcode=product.barcode,
            name=product.name,
            brand=product.brand,
            category=product.category,
            image_url=product.image_url,
            ingredients_raw=product.ingredients_raw,
            ingredients_normalized=product.ingredients_normalized or [],
            allergens=product.allergens or [],
            data_source=product.data_source,
            nutrition=nutr_dict
        ))

        scores_res.append(ScoreResponse(
            general_score=s_calc["general_score"],
            personalized_score=s_calc["personalized_score"],
            goal_type=dietary_goal,
            confidence_level=s_calc["confidence_level"],
            breakdown=s_calc["breakdown"],
            ai_explanation=f"Product received {s_calc['personalized_score']}/100 suitability for your {dietary_goal} profile."
        ))

    if not products_res:
        raise HTTPException(status_code=404, detail="No valid products found for comparison")

    winner_name = next((p.name for p in products_res if p.id == winner_id), "Product")
    summary = f"Comparing {len(products_res)} products. '{winner_name}' achieved the highest suitability score ({highest_score}/100) based on your {dietary_goal.replace('_', ' ')} preferences."

    return CompareResponse(
        products=products_res,
        scores=scores_res,
        comparison_summary=summary,
        winner_product_id=winner_id
    )
