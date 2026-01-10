from fastapi import APIRouter, Depends, HTTPException, Body
from sqlmodel import Session, SQLModel, Field, select
from app.db import get_session
from app.models.user import User
from app.models.cognitive import BehaviorLog, CognitiveAnalysis
from app.routers.profile import get_current_user
from datetime import datetime
from typing import Optional, List

# --- Router ---
router = APIRouter()

@router.post("/log", response_model=BehaviorLog)
def log_behavior(
    log: BehaviorLog, 
    current_user: User = Depends(get_current_user), 
    session: Session = Depends(get_session)
):
    log.user_id = current_user.id
    session.add(log)
    session.commit()
    session.refresh(log)
    return log

@router.get("/logs", response_model=List[BehaviorLog])
def get_logs(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    return session.exec(select(BehaviorLog).where(BehaviorLog.user_id == current_user.id).order_by(BehaviorLog.timestamp.desc())).all()

@router.post("/analyze", response_model=CognitiveAnalysis)
def analyze_cognitive_health(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Fetch recent logs
    logs = session.exec(select(BehaviorLog).where(BehaviorLog.user_id == current_user.id)).all()
    
    if not logs:
        return CognitiveAnalysis(stage="Unknown", score=0, advice=["Not enough data. Log daily behaviors for analysis."])
    
    # --- Hugging Face AI Analysis ---
    from app.services.ai_service import analyze_cognitive_state
    
    # Construct a prompt from logs
    logs_text = "\n".join([f"- [{l.timestamp}] ({l.severity}): {l.description}" for l in logs])
    
    result = analyze_cognitive_state(logs_text)
    
    return CognitiveAnalysis(
        stage=result["stage"], 
        score=result["score"], 
        advice=result["advice"]
    )
