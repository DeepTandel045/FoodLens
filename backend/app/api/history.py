from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.connection import get_db
from app.database.models import Scan, Score, Product, ProductNutrition, User, UserProfile, AIExplanation
from app.schemas.schemas import ScanResponse, ProductResponse, ScoreResponse
from app.api.auth import get_current_user
from app.services.scoring_engine import calculate_foodlens_score

router = APIRouter(prefix="/history", tags=["Scan History"])

@router.get("", response_model=List[ScanResponse])
def get_scan_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    scans = db.query(Scan).filter(Scan.user_id == current_user.id).order_by(Scan.scanned_at.desc()).limit(20).all()
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    dietary_goal = profile.dietary_goal if profile else "general_healthy_eating"

    results = []
    for scan in scans:
        product = db.query(Product).filter(Product.id == scan.product_id).first()
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

        score_rec = db.query(Score).filter(Score.scan_id == scan.id).first()
        ai_rec = db.query(AIExplanation).filter(AIExplanation.scan_id == scan.id).first()

        if score_rec:
            g_score = score_rec.general_score
            p_score = score_rec.personalized_score
            breakdown = score_rec.breakdown_json or {"positive": [], "negative": [], "goal_warnings": []}
        else:
            s_calc = calculate_foodlens_score(nutr_dict, product.ingredients_normalized or [], product.allergens or [], dietary_goal)
            g_score = s_calc["general_score"]
            p_score = s_calc["personalized_score"]
            breakdown = s_calc["breakdown"]

        results.append(ScanResponse(
            scan_id=scan.id,
            scanned_at=scan.scanned_at,
            scan_method=scan.scan_method,
            product=ProductResponse(
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
            ),
            score=ScoreResponse(
                general_score=g_score,
                personalized_score=p_score,
                goal_type=dietary_goal,
                confidence_level="High",
                breakdown=breakdown,
                ai_explanation=ai_rec.content if ai_rec else f"Scan performed on {scan.scanned_at.strftime('%Y-%m-%d')}."
            )
        ))

    return results
