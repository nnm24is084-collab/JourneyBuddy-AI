
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.internships import router as internship_router

from app.roadmap import router as roadmap_router

app = FastAPI(
    title="JourneyBuddy AI",
    description="Your personal learning and career copilot",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://10.79.28.194:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(internship_router)
app.include_router(roadmap_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to JourneyBuddy AI!",
        "status": "running",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "JourneyBuddy AI Backend",
    }
