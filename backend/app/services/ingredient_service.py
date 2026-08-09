from typing import Dict, Any, Optional, List
from sqlalchemy.orm import Session
from app.database.models import Ingredient

# Known INS (International Numbering System) Additive Dictionary Seed Data
INS_DICTIONARY = {
    "INS 322": {
        "name": "Lecithin",
        "ins_code": "INS 322",
        "category": "Emulsifier",
        "description": "Natural fat emulsifier obtained from soybeans or eggs. Used to keep water and oils blended smoothly.",
        "common_use": "Chocolates, bakery items, margarine, instant drinks.",
        "allergen_flag": True
    },
    "INS 415": {
        "name": "Xanthan Gum",
        "ins_code": "INS 415",
        "category": "Stabilizer / Thickener",
        "description": "Polysaccharide produced by fermentation. Increases liquid viscosity and prevents phase separation.",
        "common_use": "Salad dressings, sauces, gluten-free baking, ice creams.",
        "allergen_flag": False
    },
    "INS 211": {
        "name": "Sodium Benzoate",
        "ins_code": "INS 211",
        "category": "Preservative",
        "description": "Antimicrobial preservative inhibiting yeast, mold, and bacterial growth in acidic products.",
        "common_use": "Carbonated drinks, fruit juices, pickles, condiments.",
        "allergen_flag": False
    },
    "INS 330": {
        "name": "Citric Acid",
        "ins_code": "INS 330",
        "category": "Acidity Regulator / Flavoring",
        "description": "Weak organic acid naturally occurring in citrus fruits. Gives a tart flavor and acts as an antioxidant.",
        "common_use": "Beverages, candies, canned fruits, jams.",
        "allergen_flag": False
    },
    "INS 500": {
        "name": "Sodium Carbonates (Baking Soda)",
        "ins_code": "INS 500",
        "category": "Raising / Leavening Agent",
        "description": "Mineral salt used as a leavening agent in baked products to expand dough.",
        "common_use": "Biscuits, cakes, cookies, baked goods.",
        "allergen_flag": False
    },
    "INS 471": {
        "name": "Mono- and Diglycerides of Fatty Acids",
        "ins_code": "INS 471",
        "category": "Emulsifier",
        "description": "Synthetic or plant-derived fatty acids used to extend shelf life and improve texture.",
        "common_use": "Bread, cakes, ice cream, margarine.",
        "allergen_flag": False
    },
    "INS 621": {
        "name": "Monosodium Glutamate (MSG)",
        "ins_code": "INS 621",
        "category": "Flavor Enhancer",
        "description": "Sodium salt of glutamic acid. Enhances savory (umami) flavor profile.",
        "common_use": "Instant noodles, potato chips, savory snacks, soups.",
        "allergen_flag": False
    },
    "INS 951": {
        "name": "Aspartame",
        "ins_code": "INS 951",
        "category": "Artificial Sweetener",
        "description": "Low-calorie artificial sweetener ~200 times sweeter than sucrose.",
        "common_use": "Diet sodas, sugar-free chewing gums, low-calorie desserts.",
        "allergen_flag": False
    }
}

def seed_ingredients_db(db: Session):
    """Seed internal ingredient database with standard INS additives if table is empty."""
    count = db.query(Ingredient).count()
    if count == 0:
        for ins_code, item in INS_DICTIONARY.items():
            ing = Ingredient(
                name=item["name"],
                normalized_name=item["name"].lower(),
                ins_code=item["ins_code"],
                category=item["category"],
                description=item["description"],
                common_use=item["common_use"],
                allergen_flag=item["allergen_flag"]
            )
            db.add(ing)
        db.commit()

def lookup_ins_code(ins_code: str) -> Optional[Dict[str, Any]]:
    """Lookup INS additive details from memory dictionary."""
    clean_code = ins_code.upper().strip()
    if not clean_code.startswith("INS"):
        clean_code = f"INS {clean_code}"
    return INS_DICTIONARY.get(clean_code)

def analyze_ingredients_list(ingredients: List[str]) -> Dict[str, Any]:
    """Parse list of ingredient strings to identify INS codes, additives, and allergen tags."""
    detected_additives = []
    detected_allergens = []
    
    known_allergens = ["peanuts", "tree nuts", "milk", "egg", "wheat", "soy", "fish", "shellfish", "sesame", "gluten"]

    for ing in ingredients:
        ing_lower = ing.lower()
        
        # Check for INS code pattern
        for code, details in INS_DICTIONARY.items():
            code_num = code.replace("INS ", "")
            if code_num in ing or code.lower() in ing_lower:
                detected_additives.append(details)
                
        # Check for allergens
        for allergen in known_allergens:
            if allergen in ing_lower and allergen not in detected_allergens:
                detected_allergens.append(allergen.title())

    return {
        "total_ingredients_count": len(ingredients),
        "detected_additives": detected_additives,
        "detected_allergens": list(set(detected_allergens))
    }
