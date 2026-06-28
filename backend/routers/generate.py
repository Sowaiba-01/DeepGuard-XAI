"""
Generation Router — InsightFace inswapper face swap
"""

import io
import os
import time
import cv2
import numpy as np
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import Response
from PIL import Image

router = APIRouter()

# Global model instances (lazy loaded)
_face_app = None
_swapper   = None


def get_models():
    """Lazy-load InsightFace models on first use."""
    global _face_app, _swapper

    if _face_app is not None and _swapper is not None:
        return _face_app, _swapper

    try:
        import insightface
        from insightface.app import FaceAnalysis

        MODEL_DIR    = os.path.join(os.path.dirname(__file__), '..', 'models')
        BUFFALO_DIR  = os.path.join(MODEL_DIR, 'buffalo_l')
        INSWAPPER    = os.path.join(MODEL_DIR, 'inswapper_128.onnx')
        INSIGHTFACE_ROOT = os.path.abspath(os.path.join(MODEL_DIR, '..', '.insightface'))

        # Download buffalo_l if not present
        if not os.path.exists(BUFFALO_DIR) or not os.listdir(BUFFALO_DIR):
            print("  ⬇️  Downloading buffalo_l face detection model...")
            os.makedirs(BUFFALO_DIR, exist_ok=True)
            import urllib.request, zipfile, tempfile
            url = "https://github.com/deepinsight/insightface/releases/download/v0.7/buffalo_l.zip"
            with tempfile.NamedTemporaryFile(suffix='.zip', delete=False) as tmp:
                urllib.request.urlretrieve(url, tmp.name)
                with zipfile.ZipFile(tmp.name, 'r') as z:
                    z.extractall(BUFFALO_DIR)
            os.unlink(tmp.name)
            print("  ✅ buffalo_l downloaded")

        # Download inswapper_128.onnx if not present
        if not os.path.exists(INSWAPPER):
            print("  ⬇️  Downloading inswapper_128.onnx (~500MB)...")
            import urllib.request

            def progress_hook(count, block_size, total_size):
                if total_size <= 0:
                    return
                downloaded = count * block_size
                pct = min(downloaded / total_size * 100, 100)
                mb_done = downloaded / 1_048_576
                mb_total = total_size / 1_048_576
                if count % 200 == 0 or pct >= 100:
                    print(f"     {mb_done:.1f} MB / {mb_total:.1f} MB  ({pct:.1f}%)", flush=True)

            url = "https://huggingface.co/ezioruan/inswapper_128.onnx/resolve/main/inswapper_128.onnx"
            urllib.request.urlretrieve(url, INSWAPPER, reporthook=progress_hook)
            print("  ✅ inswapper_128.onnx downloaded")

        # Load face analyzer
        _face_app = FaceAnalysis(
            name='buffalo_l',
            root=INSIGHTFACE_ROOT,
            providers=['CPUExecutionProvider']
        )
        _face_app.prepare(ctx_id=-1, det_size=(320, 320))

        # Load face swapper
        _swapper = insightface.model_zoo.get_model(
            INSWAPPER,
            providers=['CPUExecutionProvider']
        )

        print("  ✅ InsightFace models loaded")
        return _face_app, _swapper

    except ImportError:
        raise HTTPException(
            500,
            "InsightFace not installed. Run: pip install insightface onnxruntime"
        )
    except Exception as e:
        raise HTTPException(500, f"Failed to load face swap models: {str(e)}")


def pil_to_cv2(img: Image.Image) -> np.ndarray:
    return cv2.cvtColor(np.array(img.convert("RGB")), cv2.COLOR_RGB2BGR)


def cv2_to_pil(img: np.ndarray) -> Image.Image:
    return Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))


@router.post("")
async def generate_deepfake(
    source: UploadFile = File(...),
    target: UploadFile = File(...),
    identity_strength: float = Form(0.7),
    blend_alpha: float = Form(0.85),
    resolution: int = Form(512),
    postprocess: bool = Form(True),
):
    """
    Perform real face swap using InsightFace inswapper_128.
    - source: face whose IDENTITY to use
    - target: face to SWAP ONTO
    Returns: swapped image as JPEG bytes
    """
    for f in [source, target]:
        if not f.content_type or not f.content_type.startswith("image/"):
            raise HTTPException(400, "Both files must be images (JPG/PNG)")

    start = time.time()

    # Read images
    src_bytes = await source.read()
    tgt_bytes = await target.read()

    src_pil = Image.open(io.BytesIO(src_bytes))
    tgt_pil = Image.open(io.BytesIO(tgt_bytes))

    src_cv2 = pil_to_cv2(src_pil)
    tgt_cv2 = pil_to_cv2(tgt_pil)

    # Load models
    face_app, swapper = get_models()

    # Detect faces
    src_faces = face_app.get(src_cv2)
    tgt_faces = face_app.get(tgt_cv2)

    if not src_faces:
        raise HTTPException(400, "No face detected in source image. Use a clear front-facing photo.")
    if not tgt_faces:
        raise HTTPException(400, "No face detected in target image. Use a clear front-facing photo.")

    # Perform face swap
    result = tgt_cv2.copy()
    result = swapper.get(result, tgt_faces[0], src_faces[0], paste_back=True)

    # Optional: resize to requested resolution
    if resolution != result.shape[0]:
        result = cv2.resize(result, (resolution, resolution), interpolation=cv2.INTER_LANCZOS4)

    # Optional: post-processing (sharpening)
    if postprocess:
        kernel = np.array([[0, -0.5, 0], [-0.5, 3, -0.5], [0, -0.5, 0]])
        result = cv2.filter2D(result, -1, kernel)

    # Convert to JPEG
    result_pil = cv2_to_pil(result)
    buf = io.BytesIO()
    result_pil.save(buf, format="JPEG", quality=95)
    buf.seek(0)

    latency = (time.time() - start) * 1000

    return Response(
        content=buf.read(),
        media_type="image/jpeg",
        headers={
            "X-Latency-Ms": str(round(latency, 1)),
            "X-Model": "InsightFace-inswapper_128",
            "X-Resolution": f"{resolution}x{resolution}",
        },
    )
