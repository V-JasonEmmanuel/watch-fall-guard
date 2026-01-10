from typing import Optional
from sqlmodel import Field, SQLModel
from datetime import datetime

class MedicalReport(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int
    title: str
    doctor_name: Optional[str] = None
    report_type: str = "report" # report, prescription, lab_result
    summary: Optional[str] = None # AI Generated Summary
    file_path: Optional[str] = None
    upload_date: datetime = Field(default_factory=datetime.now)
