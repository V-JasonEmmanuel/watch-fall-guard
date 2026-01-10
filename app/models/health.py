from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime

class Medication(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    name: str
    dosage: str
    timing: str # e.g. "08:00, 20:00"
    instructions: Optional[str] = None # "Before food"
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class HealthMetric(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    timestamp: datetime
    source: str = "manual" # "samsung_watch", "manual", "device"
    
    # Core Vitals
    heart_rate: Optional[int] = None
    steps: Optional[int] = None
    sleep_minutes: Optional[int] = None
    spo2: Optional[int] = None
    
    # Fall/Safety
    fall_detected: bool = False
    inactivity_alert: bool = False
