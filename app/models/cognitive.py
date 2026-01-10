from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional, List

class BehaviorLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int
    description: str # e.g., "Forgot name of grandchild"
    severity: str # Low, Medium, High
    timestamp: datetime = Field(default_factory=datetime.now)

class CognitiveAnalysis(SQLModel):
    stage: str # "Normal Aging", "Mild Cognitive Impairment", "Early Dementia"
    score: int # 0-100 risk score
    advice: List[str]
