from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlmodel import Session, select
from app.db import get_session
from app.models.medical import MedicalReport
from app.models.user import User
from app.routers.profile import get_current_user
from datetime import datetime
import os
import random

router = APIRouter()

# Ensure upload directory exists
UPLOAD_DIR = "static/uploads/medical"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/", response_model=list[MedicalReport])
def get_reports(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    statement = select(MedicalReport).where(MedicalReport.user_id == current_user.id).order_by(MedicalReport.upload_date.desc())
    return session.exec(statement).all()

@router.post("/upload", response_model=MedicalReport)
async def upload_report(
    title: str = Form(...),
    doctor_name: str = Form(None),
    report_type: str = Form("report"),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # 1. Save File
    file_location = f"{UPLOAD_DIR}/{file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())
        
    # 2. Extract Text (PyPDF2) & Summarize (Hugging Face)
    import PyPDF2
    from app.services.ai_service import summarize_medical_report
    
    extracted_text = ""
    
    if file.filename.endswith(".pdf"):
        try:
            # Read PDF from file path
            with open(file_location, "rb") as pdf_file:
                reader = PyPDF2.PdfReader(pdf_file)
                for page in reader.pages:
                    extracted_text += page.extract_text() + "\n"
        except Exception as e:
            print(f"PDF Error: {e}")
            extracted_text = f"Error reading PDF: {str(e)}"
    else:
        # Fallback for images (since User asked to replace OCR with PyPDF2, we skip OCR)
        extracted_text = f"Image file uploaded: {title}. Visual analysis not available yet."

    # If extracted text is too short, use a fallback context for the AI
    if len(extracted_text.strip()) < 10:
        extracted_text = f"Medical Report: {title}. Doctor: {doctor_name}. (Content could not be extracted)"
        
    ai_summary = summarize_medical_report(extracted_text)
    
    # 3. Save to DB
    report = MedicalReport(
        user_id=current_user.id,
        title=title,
        doctor_name=doctor_name,
        report_type=report_type,
        file_path=f"/{file_location}",
        summary=ai_summary,
        upload_date=datetime.now()
    )
    
    session.add(report)
    session.commit()
    session.refresh(report)
    
    return report

@router.delete("/{report_id}")
def delete_report(report_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    report = session.get(MedicalReport, report_id)
    if not report or report.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Report not found")
        
    session.delete(report)
    session.commit()
    return {"ok": True}
