from typing import List, Dict, Any

def aggregate_basket_nutrition(items_data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Aggregate nutrition values and scores across all products in a shopping basket.
    """
    total_energy = 0.0
    total_sugars = 0.0
    total_fat = 0.0
    total_sat_fat = 0.0
    total_protein = 0.0
    total_fiber = 0.0
    total_sodium = 0.0
    
    general_scores = []
    personalized_scores = []
    warnings = []

    for item in items_data:
        qty = item.get("quantity", 1)
        product = item.get("product", {})
        nutrition = product.get("nutrition") or {}
        score = item.get("score") or {}

        if nutrition.get("energy_kcal") is not None:
            total_energy += nutrition["energy_kcal"] * qty
        if nutrition.get("sugars_g") is not None:
            total_sugars += nutrition["sugars_g"] * qty
            if nutrition["sugars_g"] > 18.0:
                warnings.append(f"High sugar item in basket: {product.get('name')}")
        if nutrition.get("fat_g") is not None:
            total_fat += nutrition["fat_g"] * qty
        if nutrition.get("saturated_fat_g") is not None:
            total_sat_fat += nutrition["saturated_fat_g"] * qty
        if nutrition.get("protein_g") is not None:
            total_protein += nutrition["protein_g"] * qty
        if nutrition.get("fiber_g") is not None:
            total_fiber += nutrition["fiber_g"] * qty
        if nutrition.get("sodium_mg") is not None:
            total_sodium += nutrition["sodium_mg"] * qty
            if nutrition["sodium_mg"] > 800:
                warnings.append(f"High sodium item in basket: {product.get('name')}")

        if score.get("general_score") is not None:
            general_scores.append(score["general_score"])
        if score.get("personalized_score") is not None:
            personalized_scores.append(score["personalized_score"])

    count = max(len(items_data), 1)
    avg_gen_score = round(sum(general_scores) / len(general_scores), 1) if general_scores else 75.0
    avg_pers_score = round(sum(personalized_scores) / len(personalized_scores), 1) if personalized_scores else 75.0

    return {
        "item_count": len(items_data),
        "aggregated_nutrition": {
            "energy_kcal": round(total_energy, 1),
            "carbohydrates_g": 0.0,
            "sugars_g": round(total_sugars, 1),
            "fat_g": round(total_fat, 1),
            "saturated_fat_g": round(total_sat_fat, 1),
            "trans_fat_g": 0.0,
            "protein_g": round(total_protein, 1),
            "fiber_g": round(total_fiber, 1),
            "sodium_mg": round(total_sodium, 1),
            "serving_size": "Combined Basket Total",
            "serving_unit": "g"
        },
        "average_general_score": avg_gen_score,
        "average_personalized_score": avg_pers_score,
        "basket_warnings": list(set(warnings)),
        "ai_basket_recommendation": f"Basket contains {len(items_data)} items with an average suitability score of {avg_pers_score}/100. " +
            ("Consider swapping high-sugar/high-sodium items with fiber-rich alternatives." if warnings else "This basket shows a well-balanced selection!")
    }
