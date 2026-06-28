"""
DeepGuard AI - FastAPI Backend
Deepfake Detection & Generation API
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from routers import detect, generate, dataset, health

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load models on startup."""
    print("🧿 DeepGuard AI backend starting...")
    from models.detector import load_detection_model
    app.state.detector = load_detection_model()
    print("✅ Detection model loaded")
    yield
    print("🛑 Shutting down...")

app = FastAPI(
    title="DeepGuard AI API",
    description="Deepfake detection and generation API powered by EfficientNet-B4 and SimSwap",
    version="1.2.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["health"])
app.include_router(detect.router, prefix="/detect", tags=["detection"])
app.include_router(generate.router, prefix="/generate", tags=["generation"])
app.include_router(dataset.router, prefix="/dataset", tags=["dataset"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
