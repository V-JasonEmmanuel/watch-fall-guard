from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.db import get_session
from app.models.user import User, UserCreate, UserRead, UserLogin
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os

router = APIRouter()

SECRET_KEY = os.getenv("JWT_SECRET", "secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/signup", response_model=UserRead)
def signup(user: UserCreate, session: Session = Depends(get_session)):
    statement = select(User).where(User.email == user.email)
    existing_user = session.exec(statement).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    # Exclude 'password' from the source data, add 'hashed_password'
    user_data = user.dict(exclude={"password"})
    db_user = User(**user_data, hashed_password=hashed_password)
    
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

@router.post("/login")
def login(user: UserLogin, session: Session = Depends(get_session)):
    statement = select(User).where(User.email == user.email)
    db_user = session.exec(statement).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email, "role": db_user.role, "id": db_user.id},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "role": db_user.role}
