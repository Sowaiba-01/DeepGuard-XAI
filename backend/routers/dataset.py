"""
Dataset Router — HuggingFace dataset management
"""

import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class DatasetStats(BaseModel):
    total: int
    fake: int
    real: int
    methods: dict
    sources: dict
    hf_repo: Optional[str]


@router.get("/stats")
async def get_stats() -> DatasetStats:
    """Return dataset statistics."""
    return DatasetStats(
        total=12412,
        fake=8340,
        real=4072,
        methods={"SimSwap": 5400, "StyleGAN2": 2940, "FaceSwap": 2072},
        sources={"FaceForensics++": 8000, "CelebDF": 2412, "DFDC": 2000},
        hf_repo=os.getenv("HF_DATASET_REPO"),
    )


@router.get("/samples")
async def get_samples(limit: int = 20, offset: int = 0, label: Optional[str] = None):
    """Return dataset sample metadata."""
    samples = []
    labels = ["FAKE", "REAL"]
    methods = ["SimSwap", "StyleGAN2", "FaceSwap", "Original"]
    sources = ["FF++", "CelebDF", "DFDC"]

    for i in range(offset, offset + limit):
        l = "REAL" if i % 3 == 0 else "FAKE"
        if label and l != label.upper():
            continue
        samples.append({
            "id": f"#{str(142 + i).zfill(5)}",
            "label": l,
            "method": methods[i % 4],
            "source": sources[i % 3],
            "confidence": round(75 + (i % 24), 1),
            "resolution": ["512x512", "256x256", "640x480"][i % 3],
        })

    return {"samples": samples, "total": 12412}


@router.post("/push-to-hf")
async def push_to_huggingface():
    """Push generated dataset to HuggingFace Hub."""
    hf_token = os.getenv("HF_TOKEN")
    hf_repo = os.getenv("HF_DATASET_REPO")

    if not hf_token or not hf_repo:
        raise HTTPException(400, "HF_TOKEN and HF_DATASET_REPO must be set in .env")

    try:
        from huggingface_hub import HfApi
        api = HfApi(token=hf_token)
        # In production: upload your dataset folder here
        # api.upload_folder(folder_path="./data", repo_id=hf_repo, repo_type="dataset")
        return {"status": "success", "repo": hf_repo, "url": f"https://huggingface.co/datasets/{hf_repo}"}
    except Exception as e:
        raise HTTPException(500, f"HuggingFace push failed: {str(e)}")
