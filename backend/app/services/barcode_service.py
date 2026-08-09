import httpx
import logging
from typing import Optional, Dict, Any
from app.core.config import settings

logger = logging.get_logger(__name__) if hasattr(logging, "get_logger") else logging.getLogger(__name__)

async def fetch_product_by_barcode(barcode: str) -> Optional[Dict[str, Any]]:
    """Fetch product details from Open Food Facts API v3."""
    clean_barcode = barcode.strip().lstrip("0") if len(barcode.strip()) > 10 else barcode.strip()
    
    # Try OFF v3 API
    url = f"{settings.OPEN_FOOD_FACTS_URL}/product/{clean_barcode}.json"
    headers = {"User-Agent": "FoodLens - Web App - Version 1.0 - www.foodlens.app"}
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(url, headers=headers)
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == 1 or data.get("product"):
                    return parse_open_food_facts_data(data.get("product", {}), barcode)
        except Exception as e:
            logger.warning(f"OFF v3 lookup failed for barcode {barcode}: {str(e)}")
            
        # Fallback to v0 API if v3 returned no result
        fallback_url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"
        try:
            response = await client.get(fallback_url, headers=headers)
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == 1 and data.get("product"):
                    return parse_open_food_facts_data(data.get("product", {}), barcode)
        except Exception as e:
            logger.warning(f"OFF v0 fallback lookup failed for barcode {barcode}: {str(e)}")

    return None

def parse_open_food_facts_data(product_raw: Dict[str, Any], barcode: str) -> Dict[str, Any]:
    """Normalize raw Open Food Facts payload into FoodLens standardized format."""
    nutriments = product_raw.get("nutriments", {})
    
    # Extract nutrition per 100g/ml
    energy_kcal = (
        nutriments.get("energy-kcal_100g")
        or nutriments.get("energy-kcal_value")
        or nutriments.get("energy_100g", 0) / 4.184 if nutriments.get("energy_100g") else None
    )
    
    sugars_g = nutriments.get("sugars_100g") or nutriments.get("sugars_value")
    carbohydrates_g = nutriments.get("carbohydrates_100g") or nutriments.get("carbohydrates_value")
    fat_g = nutriments.get("fat_100g") or nutriments.get("fat_value")
    saturated_fat_g = nutriments.get("saturated-fat_100g") or nutriments.get("saturated-fat_value")
    trans_fat_g = nutriments.get("trans-fat_100g") or nutriments.get("trans-fat_value")
    protein_g = nutriments.get("proteins_100g") or nutriments.get("proteins_value")
    fiber_g = nutriments.get("fiber_100g") or nutriments.get("fiber_value")
    
    # Convert salt or sodium to sodium_mg
    sodium_mg = nutriments.get("sodium_100g")
    if sodium_mg is not None:
        sodium_mg = float(sodium_mg) * 1000  # Convert grams to mg if stored as grams
    elif nutriments.get("salt_100g") is not None:
        sodium_mg = float(nutriments.get("salt_100g")) * 400  # 1g salt ~ 400mg sodium
        
    # Extract ingredients list
    ingredients_text = product_raw.get("ingredients_text_en") or product_raw.get("ingredients_text") or ""
    ingredients_tags = product_raw.get("ingredients_original_tags", [])
    
    normalized_ingredients = []
    if ingredients_text:
        # Split by comma or semicolon
        items = [i.strip(" .;") for i in ingredients_text.replace(";", ",").split(",")]
        normalized_ingredients = [i for i in items if i]
    elif ingredients_tags:
        normalized_ingredients = [t.replace("en:", "").replace("-", " ").title() for t in ingredients_tags]

    # Extract allergens
    allergens_raw = product_raw.get("allergens_tags", [])
    allergens = [a.replace("en:", "").replace("-", " ").title() for a in allergens_raw]

    return {
        "barcode": barcode,
        "name": product_raw.get("product_name_en") or product_raw.get("product_name") or f"Product #{barcode}",
        "brand": product_raw.get("brands") or "Unknown Brand",
        "category": product_raw.get("categories") or product_raw.get("main_category") or "General Packaged Food",
        "image_url": product_raw.get("image_url") or product_raw.get("image_front_url"),
        "ingredients_raw": ingredients_text,
        "ingredients_normalized": normalized_ingredients,
        "allergens": allergens,
        "data_source": "open_food_facts",
        "nutrition": {
            "energy_kcal": round(float(energy_kcal), 1) if energy_kcal is not None else None,
            "carbohydrates_g": round(float(carbohydrates_g), 1) if carbohydrates_g is not None else None,
            "sugars_g": round(float(sugars_g), 1) if sugars_g is not None else None,
            "fat_g": round(float(fat_g), 1) if fat_g is not None else None,
            "saturated_fat_g": round(float(saturated_fat_g), 1) if saturated_fat_g is not None else None,
            "trans_fat_g": round(float(trans_fat_g), 1) if trans_fat_g is not None else None,
            "protein_g": round(float(protein_g), 1) if protein_g is not None else None,
            "fiber_g": round(float(fiber_g), 1) if fiber_g is not None else None,
            "sodium_mg": round(float(sodium_mg), 1) if sodium_mg is not None else None,
            "serving_size": product_raw.get("serving_size") or "100g",
            "serving_unit": "g"
        }
    }
