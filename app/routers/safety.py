from fastapi import APIRouter, Depends, BackgroundTasks
from sqlmodel import Session
from app.db import get_session
from app.models.user import User
from app.models.health import HealthMetric
from app.routers.profile import get_current_user
from app.services.whatsapp import send_emergency_alert
import json

router = APIRouter()

@router.post("/alert/fall")
async def trigger_fall_alert(
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user), 
    session: Session = Depends(get_session)
):
    """
    Endpoint called when JS detects a fall.
    """
    # 1. Log the event
    from datetime import datetime
    metric = HealthMetric(
        user_id=current_user.id,
        timestamp=datetime.now(),
        source="camera_ai",
        fall_detected=True
    )
    
    session.add(metric)
    session.commit()
    
    # 2. Parse contacts
    contacts = []
    if current_user.emergency_contacts:
        try:
            contacts = json.loads(current_user.emergency_contacts)
        except:
            pass
            
    # 3. Send WhatsApp Alerts (Background Task)
    background_tasks.add_task(send_emergency_alert, current_user.full_name, contacts, "Home Bedroom (Camera 1)")
    
    return {"status": "alert_sent", "message": "Fall detected! escalating to emergency contacts."}
