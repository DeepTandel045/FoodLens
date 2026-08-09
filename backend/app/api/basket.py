from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.connection import get_db
from app.database.models import Basket, BasketItem, Product, ProductNutrition, User, UserProfile
from app.schemas.schemas import AddBasketItemRequest, BasketAnalysisResponse, BasketItemResponse, ProductResponse
from app.api.auth import get_current_user
from app.services.basket_service import aggregate_basket_nutrition
from app.services.scoring_engine import calculate_foodlens_score

router = APIRouter(prefix="/baskets", tags=["Shopping Basket"])

def get_or_create_user_basket(db: Session, user_id: int) -> Basket:
    basket = db.query(Basket).filter(Basket.user_id == user_id).first()
    if not basket:
        basket = Basket(user_id=user_id, name="My FoodLens Basket")
        db.add(basket)
        db.commit()
        db.refresh(basket)
    return basket

@router.get("", response_model=BasketAnalysisResponse)
def get_basket_analysis(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    basket = get_or_create_user_basket(db, current_user.id)
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    dietary_goal = profile.dietary_goal if profile else "general_healthy_eating"
    prefs = [p.preference_type for p in current_user.preferences]
    allergies = [a.allergen for a in current_user.allergies]

    items_data = []
    item_responses = []

    for item in basket.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
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

        prod_resp = ProductResponse(
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
        )

        item_responses.append(BasketItemResponse(
            id=item.id,
            product=prod_resp,
            quantity=item.quantity
        ))

        items_data.append({
            "quantity": item.quantity,
            "product": {"name": product.name, "nutrition": nutr_dict},
            "score": s_calc
        })

    analysis = aggregate_basket_nutrition(items_data)

    return BasketAnalysisResponse(
        basket_id=basket.id,
        name=basket.name,
        item_count=len(item_responses),
        aggregated_nutrition=analysis["aggregated_nutrition"],
        average_general_score=analysis["average_general_score"],
        average_personalized_score=analysis["average_personalized_score"],
        items=item_responses,
        basket_warnings=analysis["basket_warnings"],
        ai_basket_recommendation=analysis["ai_basket_recommendation"]
    )

@router.post("/items")
def add_item_to_basket(
    req: AddBasketItemRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    basket = get_or_create_user_basket(db, current_user.id)
    product = db.query(Product).filter(Product.id == req.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing_item = db.query(BasketItem).filter(
        BasketItem.basket_id == basket.id,
        BasketItem.product_id == req.product_id
    ).first()

    if existing_item:
        existing_item.quantity += req.quantity
    else:
        new_item = BasketItem(basket_id=basket.id, product_id=req.product_id, quantity=req.quantity)
        db.add(new_item)

    db.commit()
    return {"message": "Product added to basket successfully"}

@router.delete("/items/{item_id}")
def remove_item_from_basket(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    basket = get_or_create_user_basket(db, current_user.id)
    item = db.query(BasketItem).filter(
        BasketItem.id == item_id,
        BasketItem.basket_id == basket.id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Basket item not found")

    db.delete(item)
    db.commit()
    return {"message": "Item removed from basket"}
