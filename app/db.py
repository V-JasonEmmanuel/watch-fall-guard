from sqlmodel import SQLModel, create_engine, Session
from app.models.user import User
from app.models.health import Medication, HealthMetric
from app.models.medical import MedicalReport
from app.models.cognitive import BehaviorLog
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./eldercare.db")

engine = create_engine(DATABASE_URL, echo=True)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
