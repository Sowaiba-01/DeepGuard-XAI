"""
Download model weights from HuggingFace at build/startup time.
Run once: python download_models.py
"""
import os
from huggingface_hub import hf_hub_download

HF_REPO   = "Sowaiba01/deepguard-ai"
MODELS_DIR = "models"
os.makedirs(MODELS_DIR, exist_ok=True)

def download(hf_filename, save_as=None):
    dest = os.path.join(MODELS_DIR, save_as or hf_filename)
    if os.path.exists(dest):
        print(f"✅ Already exists: {dest}")
        return
    print(f"⬇️  Downloading {hf_filename} -> {dest}...")
    path = hf_hub_download(
        repo_id=HF_REPO,
        filename=hf_filename,
        token=os.getenv("HF_TOKEN"),
    )
    import shutil
    shutil.copy(path, dest)
    print(f"✅ Saved: {dest}")

if __name__ == "__main__":
    # Save v2 model as the name the detector expects
    download("efficientnet_b4_deepguard_v2.pth", save_as="efficientnet_b4_deepguard.pth")
    download("inswapper_128.onnx")
    print("✅ All models ready.")
