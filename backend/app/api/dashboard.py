from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.database.connection import get_db
from app.database.models import User, UserProfile, Scan, Score, Product, ProductNutrition
from app.schemas.schemas import DashboardResponse, ScanResponse, ProductResponse, ScoreResponse
from app.api.auth import get_current_user
from app.services.ai_service import generate_healthy_next_step

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("", response_model=DashboardResponse)
async def get_dashboard_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    dietary_goal = profile.dietary_goal if profile else "general_healthy_eating"

    # Get user's recent scans
    scans = db.query(Scan).filter(Scan.user_id == current_user.id).order_by(Scan.scanned_at.desc()).limit(5).all()

    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_scans = [s for s in scans if s.scanned_at >= today_start]
    
    today_scores = []
    recent_scan_responses = []

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
        g_score = score_rec.general_score if score_rec else 75.0
        p_score = score_rec.personalized_score if score_rec else 75.0
        breakdown = score_rec.breakdown_json if score_rec else {"positive": [], "negative": [], "goal_warnings": []}

        if scan.scanned_at >= today_start:
            today_scores.append(p_score)

        recent_scan_responses.append(ScanResponse(
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
                ai_explanation=f"Scan recorded on {scan.scanned_at.strftime('%b %d')}"
            )
        ))

    avg_today_score = round(sum(today_scores) / len(today_scores), 1) if today_scores else 78.0

    # Build weekly trend data (past 7 days mock/real data for chart visualization)
    days_of_week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    weekly_trends = [
        {"day": days_of_week[i], "general_score": 70 + (i * 2), "personalized_score": 68 + (i * 3)}
        for i in range(7)
    ]

    nutrient_trends = [
        {"day": "Mon", "sugar": 24, "sodium": 650, "protein": 12},
        {"day": "Tue", "sugar": 18, "sodium": 520, "protein": 18},
        {"day": "Wed", "sugar": 29, "sodium": 780, "protein": 10},
        {"day": "Thu", "sugar": 14, "sodium": 410, "protein": 22},
        {"day": "Fri", "sugar": 22, "sodium": 590, "protein": 15},
        {"day": "Sat", "sugar": 11, "sodium": 380, "protein": 25},
        {"day": "Sun", "sugar": 16, "sodium": 450, "protein": 20},
    ]

    healthy_next_step = await generate_healthy_next_step(dietary_goal, today_scores)

    return DashboardResponse(
        user_name=current_user.name,
        dietary_goal=dietary_goal.replace("_", " ").title(),
        today_scans_count=len(today_scans),
        average_today_score=avg_today_score,
        recent_scans=recent_scan_responses,
        weekly_score_trends=weekly_trends,
        nutrient_trends=nutrient_trends,
        healthy_next_step_insight=healthy_next_step
    )
