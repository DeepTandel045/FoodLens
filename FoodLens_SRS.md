# FoodLens — Software Requirements Specification (SRS)

## Project Information

| Field | Details |
|---|---|
| Project Name | **FoodLens — AI-Powered Food Intelligence Platform** |
| Tagline | *“We don't just show you the label—we explain it, personalize it, and remember it.”* |
| Project Type | Full-Stack AI-Powered Web Application |
| Target Platforms | Mobile, Tablet, Desktop |
| Team | Deep Tandel (24IT098), Maulik Vaghela (24IT105) |
| Version | SRS v1.0 |
| Status | Development Baseline |

---

# 1. Introduction

## 1.1 Purpose

FoodLens is an AI-powered food intelligence and decision-support platform designed to help consumers understand packaged food products.

The system allows users to identify a food product using:

1. Barcode scanning
2. Manual barcode entry
3. Label/image scanning using OCR

After identifying the product, FoodLens collects and analyzes available information such as:

- Product name
- Brand
- Ingredients
- Additives
- Nutrition values
- Allergens
- Categories
- Dietary attributes
- User-specific dietary requirements

The system then generates:

- General nutritional analysis
- Personalized FoodLens score
- Ingredient explanations
- Warnings and insights
- AI-generated explanations
- Healthier alternative suggestions
- Product comparisons
- Shopping basket analysis
- Scan history
- Nutrition dashboard
- Healthy next-step suggestions

FoodLens is an **educational and decision-support system**, not a medical diagnosis, treatment, or cure system.

---

# 2. Problem Statement

Consumers frequently purchase packaged foods without fully understanding the information printed on the packaging.

Food labels can contain:

- Complex ingredient names
- Additive codes such as INS numbers
- Large nutrition tables
- Technical terminology
- Multiple serving-size formats
- Allergen information
- Claims that are difficult to interpret

Existing food applications often provide raw nutrition information but do not sufficiently connect that information with the user's personal goals.

FoodLens addresses this problem by converting food-label information into:

> **Understandable + Personalized + Explainable + Actionable information**

---

# 3. Project Objectives

## 3.1 Primary Objective

To develop a responsive AI-powered food analysis platform that helps users understand packaged food products and make more informed food choices.

## 3.2 Secondary Objectives

FoodLens shall:

1. Identify products using barcodes.
2. Support manual barcode entry.
3. Retrieve product information from Open Food Facts.
4. Detect when a barcode exists but the product is unavailable in the database.
5. Provide OCR-based label scanning as a fallback.
6. Extract ingredient and nutrition information from packaging.
7. Explain complex ingredients and additives.
8. Analyze nutrition values.
9. Generate a transparent general food score.
10. Generate a personalized suitability score based on user goals/preferences.
11. Support profiles such as diabetes-oriented food choices, low-sodium choices, weight-management goals, high-protein goals, vegetarian/vegan preferences, and allergy avoidance.
12. Explain why a product received its score.
13. Recommend potentially better alternatives.
14. Compare products.
15. Analyze a shopping basket.
16. Maintain scan history.
17. Generate nutrition/food dashboards.
18. Provide healthy next-step suggestions.
19. Provide general physical-activity suggestions where appropriate.
20. Deploy the application online.
21. Provide a professional project suitable for demonstration and inclusion in a technical resume.

---

# 4. Project Scope

## 4.1 In Scope

### User Management

- Registration
- Login
- Logout
- JWT authentication
- Profile management
- Dietary preferences
- Personal goals
- Allergies/restrictions

### Food Identification

- Barcode scanning
- Manual barcode entry
- Product lookup
- OCR label scanning
- Image upload
- Camera-based label capture

### Food Analysis

- Nutrition analysis
- Ingredient analysis
- Additive identification
- Allergen detection
- Personalized analysis
- FoodLens scoring

### AI Features

- Ingredient explanations
- Product summaries
- Personalized suggestions
- Healthier alternatives
- Comparison explanations
- Next-step recommendations

### Tracking

- Scan history
- Daily score
- Nutrition trends
- Shopping basket
- Basket score

### Comparison

- Product-to-product comparison
- Nutrition comparison
- Ingredient comparison
- Personalized comparison
- Better alternative suggestions

### Dashboard

- Daily score
- Weekly trends
- Nutrient information
- Recent scans
- Basket information
- Goal-oriented insights

### Deployment

- Production web deployment
- Responsive mobile interface
- Desktop interface
- HTTPS
- Backend deployment
- Database deployment

---

# 5. Out of Scope

FoodLens shall NOT:

1. Diagnose diseases.
2. Claim to cure diabetes or any medical condition.
3. Replace a doctor or registered dietitian.
4. Prescribe medication.
5. Recommend changing medication dosage.
6. Make clinical treatment decisions.
7. Guarantee that a food is medically safe for a specific person.
8. Guarantee that an AI recommendation is medically appropriate.
9. Claim that exercise will cure a medical condition.
10. Provide emergency medical advice.

The application shall clearly communicate that its information is educational/decision-support information.

---

# 6. Target Users

## 6.1 General Consumer

A person who wants to understand packaged food before purchasing or consuming it.

## 6.2 Goal-Oriented User

A user interested in:

- General healthy eating
- Weight management
- High-protein choices
- Lower-sodium choices
- Lower-sugar choices
- Vegetarian choices
- Vegan choices

## 6.3 Diabetes-Oriented User

A user who selects diabetes-related dietary considerations.

FoodLens should provide a **diabetes-oriented suitability analysis**, not a medical diagnosis or treatment recommendation.

---

# 7. High-Level System Workflow

```text
User
 ↓
Open FoodLens
 ↓
Login / Register
 ↓
Create Profile
 ↓
Select Goals / Preferences
 ↓
Home Dashboard
 ↓
Scan Food
 ↓
 ┌─────────────────────────────┐
 │ Barcode / Manual Barcode    │
 │ OR                          │
 │ Label/Image OCR             │
 └─────────────────────────────┘
 ↓
Identify / Extract Food Data
 ↓
Normalize Food Data
 ↓
Nutrition Analysis
 ↓
Ingredient Analysis
 ↓
Additive Analysis
 ↓
Allergen Analysis
 ↓
General FoodLens Score
 ↓
Personalized FoodLens Score
 ↓
AI Explanation
 ↓
Alternative Products
 ↓
Recommendations
 ↓
Save Scan History
 ↓
Update Dashboard
```

---

# 8. Food Identification Architecture

FoodLens shall use a **multi-layer identification strategy**.

## 8.1 Method 1 — Barcode Scanning

Preferred method:

```text
Camera
 ↓
ZXing
 ↓
Barcode
 ↓
FastAPI
 ↓
Open Food Facts API
 ↓
Product Data
```

## 8.2 Method 2 — Manual Barcode Entry

The user can manually enter the barcode.

```text
Manual Barcode
 ↓
Validation
 ↓
FastAPI
 ↓
Open Food Facts
 ↓
Product
```

## 8.3 Method 3 — OCR Fallback

If the barcode is unavailable, unreadable, or the product is not found:

```text
Camera / Upload
 ↓
OpenCV
 ↓
Tesseract OCR
 ↓
Extracted Text
 ↓
Nutrition / Ingredient Parser
 ↓
FoodLens Analysis
```

---

# 9. Barcode Handling

## 9.1 Supported Input

The system should support common barcode formats such as:

- EAN-13 / GTIN-13
- EAN-8
- UPC-A
- Other formats supported by the barcode scanning library

The system should not assume every product barcode is exactly 13 digits.

## 9.2 Barcode Not Found

If the barcode is valid but the product is not available in Open Food Facts:

```text
Barcode
 ↓
Open Food Facts
 ↓
Product Not Found
 ↓
FoodLens
 ↓
"Scan Product Label"
```

The user should be offered OCR rather than simply receiving an error.

---

# 10. OCR Fallback

## 10.1 Objective

OCR shall allow FoodLens to analyze products when:

- No barcode is available.
- Barcode cannot be scanned.
- Barcode is damaged.
- Product is not available in the database.
- User wants to scan the label directly.

## 10.2 Recommended Scan

FoodLens should provide a **Scan Label** option rather than limiting the user to an ingredient-only scan.

The image should ideally contain:

```text
Product Name
Ingredients
Nutrition Facts
Allergen Information
Serving Size
```

---

# 11. OCR Pipeline

```text
Camera / Upload
 ↓
Image
 ↓
OpenCV
 ↓
Image preprocessing
 ↓
Crop / perspective correction
 ↓
Noise removal
 ↓
Contrast improvement
 ↓
Tesseract OCR
 ↓
Raw text
 ↓
Text parser
 ↓
Nutrition parser
 ↓
Ingredient parser
 ↓
FoodLens analysis
```

---

# 12. OpenCV Responsibilities

OpenCV shall be used for image preprocessing, including:

- Resize
- Crop
- Grayscale conversion
- Noise reduction
- Thresholding
- Contrast enhancement
- Perspective correction
- Rotation correction
- Region detection

OpenCV improves the image for OCR; it does not perform the food analysis itself.

---

# 13. Tesseract OCR Responsibilities

Tesseract converts the processed image into text.

Example:

```text
IMAGE
 ↓
TESSERACT
 ↓
"Wheat flour, sugar, palm oil,
milk solids, INS 322..."
```

The extracted text is then processed by the backend.

---

# 14. Normalized Food Data

Regardless of whether information comes from a barcode lookup or OCR, FoodLens shall convert it into one common internal format.

```text
Barcode
   ↓
Open Food Facts
```

or

```text
OCR
   ↓
Extracted Text
```

Both become:

```text
Normalized Product Data
```

This prevents barcode and OCR from becoming two separate analysis systems.

---

# 15. Example Normalized Product Object

```json
{
  "product_name": "...",
  "brand": "...",
  "barcode": "...",
  "category": "...",
  "ingredients": [],
  "allergens": [],
  "nutrition": {
    "energy_kcal": 0,
    "sugars_g": 0,
    "fat_g": 0,
    "saturated_fat_g": 0,
    "trans_fat_g": 0,
    "protein_g": 0,
    "fiber_g": 0,
    "sodium_mg": 0,
    "carbohydrates_g": 0
  },
  "data_source": "barcode"
}
```

The exact production schema will be finalized during database implementation.

---

# 16. Data Source Priority

FoodLens should distinguish between:

1. Package/product data
2. Open Food Facts data
3. OCR-extracted data
4. FoodLens internal ingredient knowledge
5. AI-generated explanations

AI-generated content shall not overwrite raw nutritional values.

---

# 17. Open Food Facts

Open Food Facts shall be used as the primary external product-information source.

Potential information includes:

- Ingredients
- Nutritional values
- Product information
- Product images
- Product attributes

Because Open Food Facts is community-contributed, FoodLens shall treat returned information as external data and account for missing or incomplete values.

For new integrations, the current Open Food Facts API v3 should be used.

---

# 18. User Profile Requirements

During onboarding, FoodLens shall collect information needed for personalization.

## 18.1 Basic Information

- Name
- Email
- Password
- Age range
- Other fields only when required by the final scoring model

## 18.2 Dietary Goals

Example options:

```text
General healthy eating
Diabetes-oriented
Weight management
Low sugar
Low sodium
High protein
Heart-conscious
Vegetarian
Vegan
```

## 18.3 Restrictions

- Allergies
- Dietary restrictions
- Ingredient exclusions
- Food preferences

The final profile fields will be finalized before implementing the scoring engine.

---

# 19. Personalization Engine

Personalization is one of FoodLens's main differentiators.

The system shall calculate:

### General FoodLens Score

A general nutritional/product-quality score.

### Personalized FoodLens Score

A suitability score based on the user's goals and preferences.

Example:

```text
General FoodLens Score
78 / 100

Your Goal:
Diabetes-oriented eating

Personalized Suitability
62 / 100
```

The system shall explain why the scores differ.

---

# 20. Scoring Principle

The numerical score shall NOT be generated directly by an LLM.

Recommended architecture:

```text
Product Data
 ↓
Deterministic Scoring Algorithm
 ↓
Numerical Score
 ↓
AI Explanation
```

The score should be reproducible.

AI should explain and contextualize the score.

---

# 21. Scoring Framework

The scoring methodology should be based on established nutritional principles rather than arbitrary values.

Potential reference frameworks:

- WHO healthy-diet principles
- Nutri-Score methodology
- American Diabetes Association guidance for diabetes-oriented personalization

The exact numerical thresholds and weights shall be finalized in a separate scoring-design phase before implementation.

---

# 22. General Nutrition Components

Potential negative factors:

- High energy density
- High sugar
- High saturated fat
- Trans fat where available
- High sodium
- Excessive salt
- Poor overall nutrition profile

Potential positive factors:

- Fiber
- Protein
- Fruit/vegetable/legume content where available
- Nutrient density
- More favorable nutritional composition

The final weights shall be documented and version-controlled.

---

# 23. Personalized Goal Components

Different goals should change the weighting of relevant factors.

For a diabetes-oriented profile, relevant factors may include:

- Sugar
- Carbohydrate quality
- Fiber
- Added/free sugar information where available
- Protein
- Overall nutritional quality

FoodLens shall use cautious language and shall not claim that a food causes, cures, or treats diabetes.

---

# 24. Score Explanation

Every score shall have an explanation.

Example:

```text
FoodLens Score
64 / 100

Why?

⚠ High sugar
⚠ Low fiber
✓ Moderate protein
✓ Moderate saturated fat
```

Users should never receive only a numerical score without context.

---

# 25. Data Confidence

FoodLens should display the source of important information.

Example:

```text
Product:
Open Food Facts

Ingredients:
Package / OCR

Nutrition:
Package / Open Food Facts

Score:
FoodLens Algorithm

Explanation:
FoodLens AI
```

If OCR confidence is low:

```text
⚠ Some label information could not be confidently read.
Please retake the image.
```

---

# 26. Ingredient Intelligence

The ingredient analysis system shall:

1. Extract ingredient names.
2. Detect additive codes.
3. Normalize ingredient names.
4. Identify known ingredient categories.
5. Detect allergens where data is available.
6. Generate understandable explanations.

Example:

```text
INS 415
 ↓
Xanthan Gum
 ↓
Category: Stabilizer / Thickener
 ↓
Simple explanation
```

---

# 27. Internal Ingredient Database

FoodLens should maintain an internal ingredient/additive knowledge table.

Conceptual structure:

```text
ingredients
----------------------------
id
name
normalized_name
ins_code
category
description
common_use
allergen_flag
```

This database should be used before asking AI to explain an ingredient.

---

# 28. AI Features

OpenAI shall be used primarily for:

- Ingredient explanations
- Product summaries
- Score explanations
- Personalized suggestions
- Healthier alternatives
- Comparison explanations
- Next-step recommendations

AI should receive structured product and analysis data.

---

# 29. AI Output Rules

AI responses shall:

1. Be understandable.
2. Avoid diagnosis.
3. Avoid medical certainty.
4. Avoid cure/treatment claims.
5. Not invent nutritional values.
6. Not override database values.
7. Clearly distinguish facts from suggestions.
8. Use available product information.
9. Mention uncertainty when information is incomplete.

---

# 30. Healthier Alternatives

FoodLens shall recommend alternatives using:

```text
Product category
+
Nutrition similarity
+
User goal
+
FoodLens score
+
Available product data
```

Example:

```text
Current Product
Sugar: 22g
Score: 58

Alternative A
Sugar: 12g
Score: 74

Alternative B
Sugar: 9g
Score: 78
```

FoodLens can identify Alternative B as a stronger match for the selected goal when the products are reasonably comparable.

---

# 31. Product Comparison

Users shall be able to compare products.

Example:

| Metric | Product A | Product B |
|---|---:|---:|
| Calories | 450 kcal | 390 kcal |
| Sugar | 22 g | 12 g |
| Protein | 6 g | 8 g |
| Fiber | 2 g | 5 g |
| Sodium | 650 mg | 420 mg |
| FoodLens Score | 61 | 78 |

The interface shall highlight meaningful differences.

---

# 32. Shopping Basket

Users shall be able to add scanned products to a virtual basket.

```text
Basket
 ├── Biscuit
 ├── Cereal
 ├── Bread
 └── Beverage
```

FoodLens shall calculate available aggregate information.

---

# 33. Basket Analysis

Where sufficient data is available, calculate:

- Total calories
- Total sugar
- Total carbohydrates
- Total protein
- Total fat
- Total saturated fat
- Total fiber
- Total sodium
- General/average score
- Personalized basket score

The system must distinguish between **per serving** and **per 100 g / 100 ml** data.

---

# 34. Daily Dashboard

The dashboard shall display:

- Today's FoodLens score
- Today's scans
- Recent products
- Nutrition information
- Goal-related insights
- Basket information

---

# 35. Historical Tracking

FoodLens shall store:

- Product scanned
- Date/time
- User
- General score
- Personalized score
- Data source
- Relevant nutrition values

This enables trend analysis.

---

# 36. Recharts Dashboard

Recharts shall be used for visualizations such as:

- Daily score
- Weekly score trend
- Sugar trend
- Sodium trend
- Protein trend
- Fiber trend
- Other available nutrition trends

Charts shall gracefully handle missing data.

---

# 37. Healthy Next-Step Planner

The existing "Health Recovery Planner" concept should be presented as a **Healthy Next-Step Planner** in the user-facing interface.

Purpose:

> Suggest a reasonable healthier next food choice or lifestyle action based on recent food patterns.

Example:

```text
Recent pattern:
High sugar intake

Next-Step Suggestion:
Consider choosing a lower-sugar food
with more fiber at your next meal.
```

Where appropriate, general physical-activity suggestions may be provided.

These are educational suggestions, not medical prescriptions.

---

# 38. Mobile-First Design

FoodLens shall be responsive and support:

- Mobile
- Tablet
- Desktop

## Mobile

Primary use case:

```text
Open FoodLens
 ↓
Scan Food
 ↓
Camera
 ↓
Barcode / OCR
```

## Desktop

Users should be able to:

- Use webcam where supported
- Upload images
- Enter barcode manually
- View dashboards
- Compare products
- Manage profiles
- Analyze baskets

The application should use one responsive codebase rather than separate mobile and desktop applications.

---

# 39. Frontend Technology

## React

Used for:

- Login
- Registration
- Dashboard
- Scanner
- Product details
- Score
- Comparison
- Basket
- History
- Profile

## TypeScript

Used for:

- Type safety
- API models
- Component props
- Product models
- Maintainability

## Tailwind CSS

Used for:

- Responsive layouts
- Mobile-first design
- Cards
- Buttons
- Navigation
- Forms
- Responsive grids

---

# 40. Backend Technology

## FastAPI + Python

Used for:

- REST APIs
- Authentication
- Business logic
- Product processing
- Barcode lookup
- OCR integration
- Scoring engine
- AI integration
- Database operations
- Basket analysis
- Dashboard aggregation

---

# 41. Database

## PostgreSQL

PostgreSQL is the primary persistent database.

---

# 42. Proposed Database Tables

## users

```text
id
name
email
password_hash
created_at
updated_at
```

## user_profiles

```text
id
user_id
age_range
dietary_goal
created_at
updated_at
```

## user_preferences

```text
id
user_id
preference_type
preference_value
```

Examples:

```text
low_sugar
low_sodium
vegetarian
vegan
high_protein
```

## allergies

```text
id
user_id
allergen
```

## products

```text
id
barcode
name
brand
category
image_url
ingredients_raw
ingredients_normalized
allergens
created_at
updated_at
```

## product_nutrition

```text
id
product_id
energy_kcal
carbohydrates_g
sugars_g
fat_g
saturated_fat_g
trans_fat_g
protein_g
fiber_g
sodium_mg
serving_size
serving_unit
```

## ingredients

```text
id
name
normalized_name
ins_code
category
description
allergen_flag
```

## product_ingredients

```text
id
product_id
ingredient_id
position
```

## scans

```text
id
user_id
product_id
scan_method
scanned_at
data_source
```

Possible scan methods:

```text
barcode
manual_barcode
ocr
```

## scores

```text
id
scan_id
general_score
personalized_score
goal_type
score_version
created_at
```

## baskets

```text
id
user_id
name
created_at
updated_at
```

## basket_items

```text
id
basket_id
product_id
quantity
```

## ai_explanations

```text
id
scan_id
explanation_type
content
created_at
```

---

# 43. Database Relationships

```text
USER
 │
 ├── PROFILE
 ├── PREFERENCES
 ├── ALLERGIES
 ├── SCANS
 │     │
 │     └── PRODUCT
 │             │
 │             ├── NUTRITION
 │             └── INGREDIENTS
 │
 ├── BASKETS
 │     │
 │     └── PRODUCTS
 │
 └── DASHBOARD DATA
```

---

# 44. Authentication

JWT shall be used.

```text
Register
 ↓
Password hashing
 ↓
PostgreSQL
 ↓
Login
 ↓
Verify credentials
 ↓
Generate JWT
 ↓
Frontend
 ↓
Authenticated API calls
```

Passwords must never be stored as plain text.

---

# 45. Core API Endpoints

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

## Profile

```text
GET /api/profile
PUT /api/profile
GET /api/preferences
PUT /api/preferences
```

## Barcode

```text
POST /api/scan/barcode
GET  /api/products/{barcode}
```

## OCR

```text
POST /api/scan/label
```

## Product Analysis

```text
POST /api/products/analyze
GET  /api/products/{product_id}
```

## Scores

```text
GET /api/products/{product_id}/score
GET /api/scans/{scan_id}/score
```

## History

```text
GET /api/history
GET /api/history/{scan_id}
```

## Dashboard

```text
GET /api/dashboard
GET /api/dashboard/nutrition
GET /api/dashboard/trends
```

## Comparison

```text
POST /api/products/compare
```

## Alternatives

```text
GET /api/products/{product_id}/alternatives
```

## Basket

```text
POST   /api/baskets
GET    /api/baskets
POST   /api/baskets/{basket_id}/items
DELETE /api/baskets/{basket_id}/items/{item_id}
GET    /api/baskets/{basket_id}/analysis
```

---

# 46. Redis

Redis is an optimization/cache layer, not a replacement for PostgreSQL.

Example:

```text
Barcode
 ↓
Redis?
 ├── YES → Cached Product
 │
 └── NO
      ↓
 Open Food Facts
      ↓
 Redis cache
      ↓
 Product processing
```

Redis should be added after the core system works.

---

# 47. Git and GitHub Workflow

Recommended branches:

```text
main
develop
feature/frontend
feature/backend
feature/auth
feature/barcode
feature/ocr
feature/scoring
feature/ai
feature/dashboard
```

Both team members should understand the full architecture even if modules are divided between them.

---

# 48. Recommended Project Structure

## Frontend

```text
foodlens/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── assets/
│   │
│   └── package.json
│
└── backend/
```

## Backend

```text
backend/
│
├── app/
│   ├── main.py
│   ├── api/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── core/
│   ├── database/
│   ├── scoring/
│   ├── ocr/
│   ├── barcode/
│   ├── ai/
│   └── utils/
│
├── tests/
├── requirements.txt
└── Dockerfile
```

---

# 49. Frontend Pages

## Landing Page

- Explain FoodLens
- Show benefits
- Login/register CTA

## Login

- Email
- Password

## Registration

- Name
- Email
- Password
- Confirm password

## Onboarding

- Dietary goals
- Preferences
- Allergies

## Home Dashboard

- FoodLens score
- Recent scans
- Quick Scan button
- Today's insights

## Scan Page

- Scan Barcode
- Enter Barcode
- Scan Label
- Upload Label

## Product Details

- Product image
- Product name
- Brand
- Ingredients
- Nutrition
- Allergens
- Data source

## Score Page

- General score
- Personalized score
- Positive factors
- Negative factors
- Goal-specific factors

## Ingredient Page

- Name
- INS code
- Category
- Purpose
- Simple explanation
- User relevance

## Alternatives Page

- Current product
- Alternative products
- Comparison
- Recommended alternative

## Comparison Page

- Nutrition comparison
- Ingredient comparison
- Score comparison
- Personalized comparison

## Basket Page

- Products
- Nutrition aggregation
- Basket score
- Personalized basket score
- Major concerns
- Suggested replacements

## History Page

- Previous scans
- Date
- Product
- Score
- Personalized score

## Profile Page

- Personal information
- Goals
- Dietary preferences
- Allergies

---

# 50. Non-Functional Requirements

## 50.1 Performance

Target under normal project-scale load:

- Standard API/database requests: preferably under 2 seconds
- Cached product lookup: preferably under 1 second
- Barcode lookup: typically a few seconds depending on external API
- OCR: may take longer because of image processing
- AI: may take longer because of external API latency

These targets should be benchmarked after deployment.

## 50.2 Responsiveness

The application shall work on:

- Mobile
- Tablet
- Desktop
- Large desktop

No critical feature should depend exclusively on desktop dimensions.

## 50.3 Usability

The application should:

- Use clear navigation.
- Use understandable language.
- Display scores visually.
- Explain technical ingredients.
- Show warnings clearly.
- Avoid unnecessary jargon.
- Provide retry options for failed scans.

---

# 51. Security Requirements

The system shall:

1. Hash passwords.
2. Use JWT securely.
3. Validate API inputs.
4. Validate uploaded files.
5. Limit image file sizes.
6. Prevent unauthorized access to user data.
7. Use HTTPS in production.
8. Keep secrets in environment variables.
9. Never expose OpenAI API keys in frontend code.
10. Never expose database credentials.
11. Validate user-owned resources before returning them.

---

# 52. Privacy Requirements

User-specific information shall be private.

The application shall protect:

- Email
- Password hashes
- Personal preferences
- Scan history
- Dietary information

from unauthorized users.

---

# 53. AI Security and Architecture

The frontend shall not contain the OpenAI secret key.

Correct flow:

```text
React
 ↓
FastAPI
 ↓
OpenAI
 ↓
FastAPI validates response
 ↓
React
```

---

# 54. Image Security

Uploaded images shall be:

- Validated
- Size-limited
- Processed securely
- Deleted when no longer required, depending on final storage policy

FoodLens should not permanently retain label images unless required.

---

# 55. Error Handling

## Barcode failure

```text
Barcode could not be detected.
Try again.
```

## Product unavailable

```text
Product not found.
Scan the label instead.
```

## OCR failure

```text
We couldn't read the label clearly.
Try taking a clearer picture.
```

## Missing nutrition

```text
Some nutrition values are unavailable.
Score calculated using available information.
```

## AI failure

```text
AI explanation is temporarily unavailable.
Your product analysis is still available.
```

## External API failure

```text
Product database temporarily unavailable.
Try again later or scan the label.
```

---

# 56. Missing Data Handling

FoodLens must never invent missing nutritional information.

For example:

```text
Sugar = unavailable
```

must not become:

```text
Sugar = 0
```

Instead:

```text
Sugar: Not available
```

The scoring engine shall account for missing information and may reduce confidence accordingly.

---

# 57. Score Confidence

Example:

```text
Score: 78/100

Data completeness:
High
```

or:

```text
Score: 70/100

⚠ Some nutritional information was unavailable.
```

---

# 58. Product Data Sourcing

FoodLens should distinguish:

```text
External data
User-provided data
OCR data
FoodLens-generated analysis
AI-generated explanation
```

Example:

```text
Nutrition:
Open Food Facts

Ingredients:
Package OCR

Score:
FoodLens Algorithm

Explanation:
FoodLens AI
```

---

# 59. Deployment Architecture

Recommended production architecture:

```text
                   INTERNET
                       │
                       ▼
                Frontend Hosting
                 React Build
                       │
                       ▼
                  HTTPS API
                       │
                       ▼
                 FastAPI Server
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
      PostgreSQL     Redis      External APIs
                                    │
                          ┌─────────┴─────────┐
                          ▼                   ▼
                   Open Food Facts         OpenAI
```

The final application shall be publicly accessible through a deployment URL.

---

# 60. Environment Variables

Sensitive configuration shall use environment variables.

Example:

```text
DATABASE_URL=
JWT_SECRET=
OPENAI_API_KEY=
OPEN_FOOD_FACTS_BASE_URL=
REDIS_URL=
```

These values must never be committed to GitHub.

---

# 61. Testing Strategy

## Unit Testing

Test:

- Score calculation
- Ingredient parsing
- Barcode normalization
- Nutrition calculations
- Basket calculations

## Integration Testing

Test:

```text
React
 ↓
FastAPI
 ↓
PostgreSQL
```

and:

```text
FastAPI
 ↓
Open Food Facts
```

and:

```text
FastAPI
 ↓
OpenAI
```

## OCR Testing

Test different:

- Lighting conditions
- Angles
- Font sizes
- Label layouts
- Image qualities

## UI Testing

Test:

- Mobile
- Tablet
- Desktop

---

# 62. Important Test Cases

| ID | Scenario | Expected Result |
|---|---|---|
| TC-01 | Valid barcode + product exists | Product information displayed |
| TC-02 | Valid barcode + product unavailable | OCR fallback offered |
| TC-03 | Invalid barcode | Validation error |
| TC-04 | Clear ingredient image | Ingredients extracted |
| TC-05 | Poor-quality image | Retry message |
| TC-06 | Product has missing nutrition | Missing values shown as unavailable |
| TC-07 | User changes goal | Personalized score updates |
| TC-08 | Two products compared | Nutrition and score comparison |
| TC-09 | Products added to basket | Basket analysis generated |
| TC-10 | Unauthorized history request | Access denied |

---

# 63. Development Phases

## Phase 1 — Project Setup

Build:

```text
GitHub
React
TypeScript
Tailwind
FastAPI
PostgreSQL
```

Deliverable:

> Frontend successfully communicates with backend.

## Phase 2 — Authentication

Build:

```text
Register
Login
JWT
Profile
Preferences
```

Deliverable:

> User can securely create an account and log in.

## Phase 3 — Barcode Pipeline

Build:

```text
Camera
 ↓
ZXing
 ↓
Barcode
 ↓
FastAPI
 ↓
Open Food Facts
 ↓
Product
```

Deliverable:

> Scan a real food barcode and display product information.

## Phase 4 — Product Details

Build:

- Product image
- Product name
- Brand
- Ingredients
- Nutrition
- Allergens

## Phase 5 — Nutrition Engine

Build:

```text
Nutrition parser
 ↓
Normalized values
 ↓
Nutrition analysis
```

## Phase 6 — Ingredient Intelligence

Build:

```text
Ingredient parser
 ↓
Ingredient database
 ↓
Additive detection
 ↓
Allergen detection
```

## Phase 7 — Scoring Engine

Build:

```text
Nutrition
+
Ingredients
+
User goals
 ↓
FoodLens score
```

## Phase 8 — AI

Build:

```text
FoodLens result
 ↓
OpenAI
 ↓
Explanation
 ↓
Suggestions
```

## Phase 9 — OCR

Build:

```text
Image
 ↓
OpenCV
 ↓
Tesseract
 ↓
Text
 ↓
Nutrition/Ingredient parser
 ↓
Existing analysis engine
```

## Phase 10 — History

Build:

```text
Scans
 ↓
PostgreSQL
 ↓
History
```

## Phase 11 — Dashboard

Build:

```text
History
 ↓
Aggregations
 ↓
Recharts
 ↓
Dashboard
```

## Phase 12 — Comparison

Build product comparison.

## Phase 13 — Alternatives

Build:

```text
Product
 ↓
Category
 ↓
Candidate products
 ↓
Scoring
 ↓
User goal
 ↓
Alternative recommendation
```

## Phase 14 — Shopping Basket

Build:

```text
Products
 ↓
Basket
 ↓
Nutrition aggregation
 ↓
Basket score
 ↓
Personalized analysis
```

## Phase 15 — Next-Step Planner

Build:

```text
Recent food pattern
 ↓
Identify notable nutrition pattern
 ↓
Educational next-step suggestion
```

## Phase 16 — Redis

Add caching after the core application works.

## Phase 17 — Testing

Test:

- Authentication
- Barcode
- OCR
- Nutrition
- Scoring
- AI
- Alternatives
- Comparison
- Basket
- Dashboard
- Security
- Mobile
- Desktop

## Phase 18 — Deployment

Deploy:

- Frontend
- Backend
- Database
- Redis

Then test using:

- Mobile phone
- Laptop
- Different browsers
- Different networks

---

# 64. MVP Definition

The minimum working FoodLens should contain:

```text
Registration
        ↓
Login
        ↓
Profile
        ↓
Barcode Scan
        ↓
Open Food Facts
        ↓
Product Information
        ↓
Nutrition Analysis
        ↓
Ingredient Analysis
        ↓
FoodLens Score
        ↓
Personalized Score
        ↓
AI Explanation
        ↓
History
```

If this works, the core application is functional.

---

# 65. Full Version

The final version should contain:

```text
Authentication
+
Profile
+
Barcode
+
Manual Barcode
+
OCR
+
Nutrition
+
Ingredients
+
Allergens
+
General Score
+
Personalized Score
+
AI
+
Alternatives
+
Comparison
+
Basket
+
History
+
Dashboard
+
Next-Step Planner
+
Responsive UI
+
Deployment
```

---

# 66. Resume Value

FoodLens is suitable as a resume project if the implemented version actually demonstrates the architecture described in this SRS.

Strong technical areas include:

### Full-stack development

```text
React
+
FastAPI
+
PostgreSQL
```

### Computer vision

```text
OpenCV
+
Tesseract OCR
```

### External API integration

```text
Open Food Facts
```

### AI integration

```text
OpenAI API
```

### Data processing

```text
Nutrition analysis
+
Scoring
+
Basket aggregation
```

### Personalization

```text
User goals
+
Personalized scoring
```

### Production engineering

```text
Authentication
+
Security
+
Deployment
+
GitHub
```

---

# 67. Project Success Criteria

FoodLens shall be considered successfully implemented when:

- **SC-01:** A user can register and log in.
- **SC-02:** A user can create dietary preferences.
- **SC-03:** A user can scan a supported barcode.
- **SC-04:** FoodLens can retrieve a product from Open Food Facts.
- **SC-05:** FoodLens handles an unavailable product through OCR fallback.
- **SC-06:** FoodLens extracts useful label information using OCR.
- **SC-07:** FoodLens analyzes nutrition information.
- **SC-08:** FoodLens identifies/explains ingredients.
- **SC-09:** FoodLens calculates a reproducible general score.
- **SC-10:** FoodLens calculates a personalized suitability score.
- **SC-11:** FoodLens explains the score.
- **SC-12:** FoodLens recommends comparable alternatives.
- **SC-13:** FoodLens supports product comparison.
- **SC-14:** FoodLens supports shopping-basket analysis.
- **SC-15:** FoodLens stores scan history.
- **SC-16:** FoodLens displays dashboard trends.
- **SC-17:** FoodLens provides educational next-step suggestions.
- **SC-18:** The system works on mobile and desktop.
- **SC-19:** The application is deployed online.
- **SC-20:** The project is documented and available through GitHub.

---

# 68. Major Project Risks

## Risk 1 — Open Food Facts Missing Data

Solution:

```text
Barcode
 ↓
Database
 ↓
If unavailable
 ↓
OCR
```

## Risk 2 — OCR Errors

Solution:

- Image preprocessing
- Quality detection
- User retry
- Manual correction option

## Risk 3 — AI Hallucination

Solution:

- Structured prompts
- Ground AI in extracted data
- Do not let AI calculate authoritative nutrition values
- Deterministic scoring engine
- Validate AI response

## Risk 4 — Health Misinformation

Solution:

- Use established public-health sources
- Explain that the system is educational
- Avoid diagnosis/treatment claims
- Use cautious wording

## Risk 5 — API Rate Limits

Solution:

```text
Backend
 ↓
Redis cache
 ↓
Avoid unnecessary repeated requests
```

---

# 69. Final Architecture

```text
                         ┌──────────────────────┐
                         │        USER          │
                         └──────────┬───────────┘
                                    │
                         ┌──────────▼───────────┐
                         │ Responsive React UI  │
                         │ TypeScript + Tailwind│
                         └──────────┬───────────┘
                                    │
                              REST / HTTPS
                                    │
                         ┌──────────▼───────────┐
                         │       FastAPI        │
                         │       Backend        │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼──────────────────────┐
              │                     │                      │
              ▼                     ▼                      ▼
        PostgreSQL                Redis              External APIs
                                                         │
                                             ┌───────────┴──────────┐
                                             │                      │
                                             ▼                      ▼
                                      Open Food Facts             OpenAI
              │
              ▼
        FoodLens Engine
              │
       ┌──────┼────────┐
       │      │        │
       ▼      ▼        ▼
   Nutrition Ingredients Allergens
    Analysis   Analysis   Analysis
       │      │        │
       └──────┼────────┘
              │
              ▼
       Scoring Engine
              │
       ┌──────┴──────────┐
       ▼                 ▼
 General Score     Personalized Score
                         │
                         ▼
                    AI Explanation
                         │
          ┌──────────────┼───────────────┐
          ▼              ▼               ▼
      Alternatives   Comparison       Suggestions
          │              │               │
          └──────────────┼───────────────┘
                         ▼
                  History / Basket
                         │
                         ▼
                     Dashboard
```

---

# 70. Final Technology Map

| Technology | FoodLens Responsibility |
|---|---|
| React 19 | Frontend application |
| TypeScript | Frontend type safety |
| Tailwind CSS | Responsive UI |
| FastAPI | Backend/API |
| Python | Analysis/scoring/OCR integration |
| PostgreSQL | Permanent database |
| JWT | Authentication |
| ZXing | Barcode detection |
| Open Food Facts API | Product information |
| OpenCV | Image preprocessing |
| Tesseract OCR | Label → text |
| OpenAI API | Explanation/recommendation |
| Recharts | Dashboard charts |
| Redis | Product/API caching |
| Git | Version control |
| GitHub | Collaboration/source repository |
| Deployment platform | Public application hosting |

---

# 71. Core Development Principle

FoodLens must be built as **one analysis pipeline**, not as separate barcode and OCR applications.

```text
                 INPUT
                   │
          ┌────────┴────────┐
          ▼                 ▼
       BARCODE             OCR
          │                 │
          ▼                 ▼
    Open Food Facts    Extracted Label
          │                 │
          └────────┬────────┘
                   ▼
          NORMALIZED DATA
                   │
                   ▼
            ANALYSIS ENGINE
                   │
        ┌──────────┼───────────┐
        ▼          ▼           ▼
    Nutrition  Ingredients  Allergens
        │          │           │
        └──────────┼───────────┘
                   ▼
            GENERAL SCORE
                   │
                   ▼
            USER PROFILE
                   │
                   ▼
        PERSONALIZED SCORE
                   │
                   ▼
                OPENAI
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
    Explanation Suggestions Alternatives
                   │
                   ▼
          History / Basket
                   │
                   ▼
               Dashboard
```

---

# 72. Official Reference Sources

The scoring methodology and health-related functionality should be finalized using reputable sources.

- WHO — Healthy Diet: https://www.who.int/en/news-room/fact-sheets/detail/healthy-diet
- WHO — Healthy Diet: https://www.who.int/health-topics/healthy-diet
- Santé publique France — Nutri-Score: https://www.santepubliquefrance.fr/index.php/en/nutri-score
- American Diabetes Association — Food & Nutrition: https://diabetes.org/food-nutrition
- American Diabetes Association — Physical Activity: https://diabetes.org/health-wellness/fitness
- Open Food Facts — API Documentation: https://openfoodfacts.github.io/documentation/docs/Product-Opener/api/
- Open Food Facts — Product by Barcode: https://openfoodfacts.github.io/documentation/docs/Product-Opener/v3/products/get-api-v3-product-code/
- Open Food Facts — Barcode Normalization: https://openfoodfacts.github.io/openfoodfacts-server/api/ref-barcode-normalization/

---

## Document Status

**SRS v1.0 — Development Baseline**

The next technical artifacts to produce from this SRS are:

1. ER Diagram
2. PostgreSQL database schema
3. FastAPI API specification
4. Frontend page/component architecture
5. FoodLens scoring formula
6. GitHub development task breakdown
7. Deployment architecture
