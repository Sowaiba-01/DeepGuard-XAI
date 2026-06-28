from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def root():
    return {"status": "ok", "service": "DeepGuard AI", "version": "1.2.0"}

@router.get("/health")
async def health():
    return {"status": "healthy", "models": {"detector": "loaded", "generator": "ready"}}
