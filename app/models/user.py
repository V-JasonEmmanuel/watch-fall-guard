from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from enum import Enum

class UserRole(str, Enum):
    ELDER = "elder"
    CAREGIVER = "caregiver"
    ADMIN = "admin"

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    full_name: str
    role: UserRole
    phone_number: Optional[str] = None
    role: UserRole = Field(default=UserRole.ELDER)
    
    # Common profile fields
    address: Optional[str] = None
    
    # New Patient Details
    age: Optional[int] = None
    blood_type: Optional[str] = None
    medical_conditions: Optional[str] = None # Comma separated
    handling_instructions: Optional[str] = None # Special care notes (e.g., "Needs help walking")
    
    # Medical Info
    medical_history: Optional[str] = None
    emergency_contacts: Optional[str] = None # JSON string: [{"name": "...", "phone": "...", "relation": "..."}]

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    
    # Relationships
    # If Elder, can have multiple caregivers
    # If Caregiver, can manage multiple elders
    # Modeled as Many-to-Many or naive foreign keys. 
    # For simplicity: CaregiverElderLink table.
    
class CaregiverElderLink(SQLModel, table=True):
    caregiver_id: Optional[int] = Field(default=None, foreign_key="user.id", primary_key=True)
    elder_id: Optional[int] = Field(default=None, foreign_key="user.id", primary_key=True)

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int

class UserLogin(SQLModel):
    email: str
    password: str
