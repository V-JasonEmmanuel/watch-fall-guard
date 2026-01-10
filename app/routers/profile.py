from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db import get_session
from app.models.user import User, UserRead, UserBase
from app.routers.auth import router as auth_router # To reuse dependency if needed?
# Actually, we need a current_user dependency. 
# For now, I'll duplicate the logic or extract it. Best to extract.
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
from app.routers.auth import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    # BYPASS FOR DEMO / SKIP LOGIN
    if token == "demo-token":
        # Return a dummy user for testing
        return User(
            id=999,
            email="demo@elder.com",
            full_name="Demo Elder",
            role="elder",
            hashed_password="mock",
            emergency_contacts='[{"name": "Demo Doctor", "phone": "1234567890", "relation": "Doctor"}]'
        )

    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()
    if user is None:
        raise credentials_exception
    return user

router = APIRouter()

@router.get("/me", response_model=UserRead)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserRead)
def update_user_me(user_update: UserBase, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # Update fields
    user_data = user_update.dict(exclude_unset=True)
    for key, value in user_data.items():
        if key != "email" and key != "role": # Prevent changing email/role for now
            setattr(current_user, key, value)
            
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user
