from fastapi import Depends, HTTPException, Request, Response, Form, status
from sqlalchemy.orm import Session, joinedload
from app.config.db import get_db
from app.models.auth import User
from app.utils.utils import hash_password, verify_password, create_access_token
from app.dependencies.dependencies import get_current_user
from datetime import timedelta
from app.schemas.auth import UserCreate, UserResponse, UserLogin
from fastapi import APIRouter

router = APIRouter()


@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate = Form(...), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = hash_password(user.password)
    new_user = User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_pw
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user