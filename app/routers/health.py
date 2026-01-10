from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlmodel import Session, select
from app.db import get_session
from app.models.health import Medication, HealthMetric
from app.models.user import User
from app.routers.profile import get_current_user
import pandas as pd
import io
from datetime import datetime

router = APIRouter()

# --- Medication Endpoints ---

@router.post("/medications", response_model=Medication)
def create_medication(med: Medication, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    med.user_id = current_user.id
    session.add(med)
    session.commit()
    session.refresh(med)
    return med

@router.get("/medications", response_model=list[Medication])
def get_medications(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    statement = select(Medication).where(Medication.user_id == current_user.id)
    return session.exec(statement).all()

@router.delete("/medications/{med_id}")
def delete_medication(med_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    med = session.get(Medication, med_id)
    if not med or med.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Medication not found")
    session.delete(med)
    session.commit()
    return {"ok": True}

# --- Health Data Import (Samsung Watuch) ---

@router.post("/upload")
async def upload_health_data(file: UploadFile = File(...), current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    """
    Parses a CSV file (Samsung Health Export format mockup) and saves metrics.
    Expected CSV columns: Time, HeartRate, Steps, SleepMinutes
    """
    contents = await file.read()
    try:
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        # Simple parsing logic - assume standard columns for now
        # In real world, would need mapping logic
        metrics = []
        for index, row in df.iterrows():
            # Mock parsing - just looking for keys case-insensitively
            row_keys = {k.lower(): v for k, v in row.items()}
            
            metric = HealthMetric(
                user_id=current_user.id,
                timestamp=datetime.now(), # In real app, parse row_keys.get('time')
                source="samsung_watch",
                heart_rate=row_keys.get('heartrate') or row_keys.get('heart_rate') or 0,
                steps=row_keys.get('steps') or row_keys.get('step_count') or 0,
                sleep_minutes=row_keys.get('sleep') or row_keys.get('sleep_minutes') or 0
            )
            session.add(metric)
            metrics.append(metric)
            
        session.commit()
        return {"imported": len(metrics), "message": "Health data imported successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid CSV format: {str(e)}")

@router.get("/stats")
def get_health_stats(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # Update Last Activity (Stub logic for "Inactivity Monitor")
    # In a real app, this would update a timestamp on the User model
    # print(f"User {current_user.id} active at {datetime.now()}")
    
    # Return recent stats
    statement = select(HealthMetric).where(HealthMetric.user_id == current_user.id).order_by(HealthMetric.timestamp.desc()).limit(10)
    return session.exec(statement).all()

# New Endpoint for Inactivity Check (called by frontend periodically)
@router.get("/inactivity-check")
def check_inactivity(current_user: User = Depends(get_current_user)):
    # Simplified Logic: If no stats uploaded in last 6 hours -> Alert
    # For demo, we just return "Active"
    return {"status": "active", "message": "User is active"}
