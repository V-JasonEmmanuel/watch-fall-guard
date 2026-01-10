from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

from app.routers import auth, profile, health, safety
from app.db import init_db

app = FastAPI(title="Elder Care Platform")

@app.on_event("startup")
def on_startup():
    init_db()

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Templates
templates = Jinja2Templates(directory="templates")

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(profile.router, prefix="/profile", tags=["profile"])
app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(safety.router, prefix="/safety", tags=["safety"])
from app.routers import medical, cognitive
app.include_router(medical.router, prefix="/medical", tags=["medical"])
app.include_router(cognitive.router, prefix="/cognitive", tags=["cognitive"])

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/signup", response_class=HTMLResponse)
async def signup_page(request: Request):
    return templates.TemplateResponse("signup.html", {"request": request})

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard_page(request: Request):
    # In a real app, we'd check cookies/session here, but for now we rely on JS redirection
    return templates.TemplateResponse("dashboard.html", {"request": request})

@app.get("/monitor", response_class=HTMLResponse)
async def monitor_page(request: Request):
    return templates.TemplateResponse("fall_monitor.html", {"request": request})

@app.get("/videocall", response_class=HTMLResponse)
async def videocall_page(request: Request):
    return templates.TemplateResponse("videocall.html", {"request": request})

@app.get("/companion", response_class=HTMLResponse)
async def companion_page(request: Request):
    return templates.TemplateResponse("companion.html", {"request": request})

@app.get("/location", response_class=HTMLResponse)
async def location_page(request: Request):
    return templates.TemplateResponse("location.html", {"request": request})

@app.get("/nutrition", response_class=HTMLResponse)
async def nutrition_page(request: Request):
    return templates.TemplateResponse("nutrition.html", {"request": request})

@app.get("/medical-records", response_class=HTMLResponse)
async def medical_records_page(request: Request):
    return templates.TemplateResponse("medical_reports.html", {"request": request})

@app.get("/medications", response_class=HTMLResponse)
async def medications_page(request: Request):
    return templates.TemplateResponse("medications.html", {"request": request})

@app.get("/patient-profile", response_class=HTMLResponse)
async def patient_profile_page(request: Request):
    return templates.TemplateResponse("patient_profile.html", {"request": request})

@app.get("/cognitive-health", response_class=HTMLResponse)
async def cognitive_page(request: Request):
    return templates.TemplateResponse("cognitive.html", {"request": request})

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    from fastapi.responses import FileResponse
    return FileResponse("static/images/favicon.svg")

