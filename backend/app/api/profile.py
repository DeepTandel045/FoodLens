from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import User, UserProfile, UserPreference, Allergy
from app.schemas.schemas import UserProfileUpdate, UserProfileResponse
from app.api.auth import get_current_user

router = APIRouter(prefix="/profile", tags=["User Profile"])

@router.get("", response_model=UserProfileResponse)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    prefs = [p.preference_type for p in current_user.preferences]
    allergies = [a.allergen for a in current_user.allergies]

    return UserProfileResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        age_range=profile.age_range if profile else "18-35",
        dietary_goal=profile.dietary_goal if profile else "general_healthy_eating",
        preferences=prefs,
        allergies=allergies
    )

@router.put("", response_model=UserProfileResponse)
def update_profile(
    profile_in: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)

    if profile_in.age_range:
        profile.age_range = profile_in.age_range
    if profile_in.dietary_goal:
        profile.dietary_goal = profile_in.dietary_goal

    # Update preferences
    if profile_in.preferences is not None:
        db.query(UserPreference).filter(UserPreference.user_id == current_user.id).delete()
        for pref in profile_in.preferences:
            db.add(UserPreference(user_id=current_user.id, preference_type=pref, preference_value="true"))

    # Update allergies
    if profile_in.allergies is not None:
        db.query(Allergy).filter(Allergy.user_id == current_user.id).delete()
        for alg in profile_in.allergies:
            db.add(Allergy(user_id=current_user.id, allergen=alg.strip().lower()))

    db.commit()
    db.refresh(current_user)

    prefs = [p.preference_type for p in current_user.preferences]
    allergies = [a.allergen for a in current_user.allergies]

    return UserProfileResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        age_range=profile.age_range,
        dietary_goal=profile.dietary_goal,
        preferences=prefs,
        allergies=allergies
    )
