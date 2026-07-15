# DeepGuard AI

A full-stack deepfake detection and generation platform — Final Year Project 2025–26.

Built, trained, and deployed end-to-end: custom dataset, fine-tuned detection model, GradCAM explainability, and a face-swap generation module for adversarial research.

**91.54% validation accuracy** on a self-collected dataset of 10,852 images.

---

## What I Built

| Component | Details |
|---|---|
| **Dataset** | Collected and generated 10,852 images (real + inswapper_128 face-swaps) — [published on HuggingFace](https://huggingface.co/datasets/Sowaiba01/deepguard-dataset) |
| **Detection model** | Fine-tuned EfficientNet-B4 on the custom dataset — 8 epochs, AdamW, cosine scheduler |
| **GradCAM** | Implemented gradient hooks on the last conv block to produce per-prediction heatmaps |
| **Generation pipeline** | Integrated InsightFace inswapper_128 with a full parameter control UI |
| **Full-stack platform** | Next.js 14 frontend + FastAPI backend with Google OAuth |

---

## Model Performance

| Metric | Score |
|---|---|
| Val Accuracy | **91.54%** |
| Precision | 91.73% |
| Recall | 91.38% |
| F1 | 0.9156 |
| AUC-ROC | 0.9486 |
| False Positive Rate | 1.27% |

Training: 380 × 380 input · batch 16 · AdamW lr=3e-5 · cosine annealing · flip/rotate/color-jitter augmentation

---

## Challenges Addressed

**1. Detecting without explaining**  
Confidence scores alone are not enough for forensic or academic use. I implemented GradCAM via PyTorch gradient hooks that highlights the exact facial regions — eye boundaries, jaw edges, skin blending — that triggered the prediction, making every result auditable.

**2. Generalization across fake types**  
The model was trained only on inswapper_128 swaps yet achieves 94.7% on FaceSwap and 99.8% on StyleGAN2 with no additional fine-tuning. The 380 × 380 high-resolution input and ImageNet-21k pretrained weights give the backbone broad enough texture features to generalize beyond the training distribution.

**3. Compression robustness**  
JPEG compression destroys high-frequency noise that most detectors rely on. Training augmentation includes color/brightness jitter and resolution downscaling to force the model to detect structural artifacts — boundary blending errors, geometry mismatches — that survive re-encoding.

**4. Video analysis**  
Single-frame detection misses temporal patterns. I built a frame-by-frame timeline pipeline that processes sampled frames, renders a REAL/FAKE bar per frame, and computes a fake ratio across the full clip so temporal swap regions are visible.

**5. Closed-loop adversarial testing**  
By combining generation and detection in one platform, I can generate a swap → run detection → inspect GradCAM → identify blind spots → re-train. This closed loop is not possible with detection-only tools.

---

## Cross-Method Benchmark

| Method | Accuracy |
|---|---|
| StyleGAN2 | 99.8% |
| inswapper_128 | 99.5% |
| FaceSwap | 94.7% |
| DeepFaceLab | 89.3% |
| Stable Diffusion | 81.6% |

> Trained on inswapper_128 only — other results are zero-shot generalization.

---

## Stack

**Frontend:** Next.js 14 · TypeScript · Tailwind · Framer Motion  
**Backend:** FastAPI · Python 3.10  
**ML:** PyTorch · timm · InsightFace · ONNX Runtime  
**Auth:** NextAuth.js + Google OAuth  
**Dataset:** [🤗 Sowaiba01/deepguard-dataset](https://huggingface.co/datasets/Sowaiba01/deepguard-dataset)  
**Model:** [🤗 Sowaiba01/deepguard-ai](https://huggingface.co/Sowaiba01/deepguard-ai)

---

## Setup

```bash
# Backend
cd backend && python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
# Add models/efficientnet_b4_deepguard_v2.pth and models/inswapper_128.onnx
uvicorn main:app --reload --port 8000

# Frontend
cd frontend && npm install
# Create .env.local (see .env.example)
npm run dev
```
---

**License:** MIT
