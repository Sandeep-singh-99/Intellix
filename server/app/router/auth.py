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
async def register(full_name: str = Form(...), email: str = Form(...), password: str = Form(...), db: Session = Depends(get_db), response: Response = None):
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(password)

    new_user = User(
        email=email,
        hashed_password=hashed_password,
        full_name=full_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token({"sub": new_user.email})

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=60*60*24*15,
        secure=True,
        samesite="none"
    )

    return new_user


@router.post("/login", response_model=UserResponse)
async def login(email: str = Form(...), password: str = Form(...), response: Response = None, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == email).first()
    if not db_user or not verify_password(password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token({"sub": db_user.email})

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=60*60*24*15,
        secure=True,
        samesite="none"
    )

    return db_user

@router.get("/me", response_model=UserResponse)
async def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user), response: Response = None):
    response.delete_cookie(
          key="access_token",
           httponly=True,
           secure=True,      
           samesite="none"
    )

    return {"message": "Successfully logged out", "user": current_user}