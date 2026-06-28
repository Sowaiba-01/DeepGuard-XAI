---
language: en
license: mit
tags:
  - deepfake-detection
  - image-classification
  - efficientnet
  - computer-vision
  - pytorch
datasets:
  - Sowaiba01/Deepguard-dataset
metrics:
  - accuracy
  - f1
  - roc_auc
model-index:
  - name: DeepGuard-EfficientNet-B4
    results:
      - task:
          type: image-classification
          name: Deepfake Detection
        dataset:
          name: 140K Real and Fake Faces
          type: image-classification
        metrics:
          - type: accuracy
            value: 0.9978
          - type: f1
            value: 0.9978
          - type: roc_auc
            value: 0.9990
---

# DeepGuard AI — EfficientNet-B4 Deepfake Detector

[![HuggingFace](https://img.shields.io/badge/🤗-Model_Card-yellow)](https://huggingface.co/Sowaiba01/deepguard-ai)
[![Dataset](https://img.shields.io/badge/Dataset-10.8K_images-blue)](https://huggingface.co/Sowaiba01/Deepguard-dataset)
[![Accuracy](https://img.shields.io/badge/Val_Accuracy-99.78%25-green)]()
[![License](https://img.shields.io/badge/License-MIT-lightgrey)]()

> Final Year Project (FYP) — Computer Science, 2025–2026  
> Full-stack deepfake detection & generation platform

---

## Model Description

**DeepGuard** is a binary image classifier that detects whether a face image is **real** or **AI-generated / face-swapped (deepfake)**.

It is built on **EfficientNet-B4** (18.5M parameters) fine-tuned on the [140K Real and Fake Faces](https://www.kaggle.com/datasets/xhlulu/140k-real-and-fake-faces) dataset, achieving **99.78% validation accuracy**.

The model is designed for use in the DeepGuard AI web platform, which also includes:
- GradCAM explainability (highlights which facial regions triggered the detection)
- InsightFace inswapper_128 deepfake generation pipeline
- Video frame-by-frame analysis
- Published deepfake dataset of 10,852 images

---

## Model Architecture

```
EfficientNet-B4 (timm backbone, global_pool="avg", num_classes=0)
  └── backbone output: 1792-dim feature vector
      └── head: Sequential(
            Linear(1792 → 512) → GELU → Dropout(0.3)
            Linear(512 → 128)  → GELU → Dropout(0.2)
            Linear(128 → 1)
          )
Output: raw logit → sigmoid → P(fake)
```

| Property | Value |
|---|---|
| Base model | EfficientNet-B4 |
| Parameters | 18.5M |
| Input size | 224×224 px |
| Output | Binary (REAL / FAKE) |
| Framework | PyTorch + timm |
| Inference | CPU / CUDA |

---

## Performance

### Primary Benchmark — 140K Validation Set (4,500 images)

| Metric | Score |
|---|---|
| **Accuracy** | **99.78%** |
| **F1 Score** | **99.78%** |
| **AUC-ROC** | **99.90%** |
| Precision | 99.87% |
| Recall | 99.69% |
| False Negative Rate | 0.31% |

### Cross-Method Robustness

| Deepfake Method | Accuracy | F1 | Notes |
|---|---|---|---|
| StyleGAN2 | 99.8% | 99.8% | Training distribution |
| InsightFace inswapper | 91.2% | 90.8% | Tested on our dataset |
| FaceSwap | 87.4% | 86.9% | Generalized |
| DeepFaceLab | 83.6% | 82.4% | Partial generalization |
| Stable Diffusion (inpaint) | 74.1% | 72.8% | Out of distribution |

### Confusion Matrix (Validation Set)

|  | Predicted REAL | Predicted FAKE |
|---|---|---|
| **Actual REAL** | 2,241 (TP) | 3 (FP) |
| **Actual FAKE** | 7 (FN) | 2,249 (TN) |

---

## Training Details

```python
# Training configuration
optimizer    = AdamW(lr=2e-4, weight_decay=1e-4)
scheduler    = CosineAnnealingLR(T_max=15)
epochs       = 15
batch_size   = 16
image_size   = 224
loss         = BCEWithLogitsLoss()
device       = CUDA (T4 GPU, Google Colab)

# Data augmentation
transforms = [
    RandomHorizontalFlip(p=0.5),
    RandomRotation(15),
    ColorJitter(brightness=0.2, contrast=0.2),
    Normalize(mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225]),
]
```

**Training curve:** Started at 98.56% (epoch 1) → 99.78% (epoch 15)

---

## Dataset

The model was trained on the [140K Real and Fake Faces](https://www.kaggle.com/datasets/xhlulu/140k-real-and-fake-faces) Kaggle dataset:

- **Real faces:** CelebA + FFHQ subsets
- **Fake faces:** StyleGAN2-generated
- **Split:** 70K train / 17.5K val / 17.5K test (rough)
- **Task:** Binary classification (real vs. fake)

We additionally generated and published our own deepfake dataset using InsightFace inswapper_128:

👉 [Sowaiba01/Deepguard-dataset](https://huggingface.co/Sowaiba01/Deepguard-dataset) — **10,852 face-swap images**

---

## Usage

### Installation

```bash
pip install torch torchvision timm Pillow
```

### Loading the Model

```python
import torch
import torch.nn as nn
import timm
from PIL import Image
import torchvision.transforms as T

class DeepfakeDetector(nn.Module):
    def __init__(self):
        super().__init__()
        self.backbone = timm.create_model(
            "efficientnet_b4",
            pretrained=False,
            num_classes=0,
            global_pool="avg",
        )
        self.head = nn.Sequential(
            nn.Linear(1792, 512), nn.GELU(), nn.Dropout(0.3),
            nn.Linear(512, 128),  nn.GELU(), nn.Dropout(0.2),
            nn.Linear(128, 1),
        )

    def forward(self, x):
        return self.head(self.backbone(x)).squeeze(1)

# Load weights
model = DeepfakeDetector()
state = torch.load("efficientnet_b4_deepguard.pth", map_location="cpu")
model.load_state_dict(state)
model.eval()
```

### Inference

```python
transform = T.Compose([
    T.Resize((224, 224)),
    T.ToTensor(),
    T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

img   = Image.open("face.jpg").convert("RGB")
tensor = transform(img).unsqueeze(0)  # [1, 3, 224, 224]

with torch.no_grad():
    logit = model(tensor)
    prob  = torch.sigmoid(logit).item()

label = "FAKE" if prob > 0.5 else "REAL"
confidence = prob * 100 if label == "FAKE" else (1 - prob) * 100
print(f"{label} — {confidence:.1f}% confidence")
```

### GradCAM Explainability

```python
import torch.nn.functional as F
import numpy as np
import cv2

activations, gradients = [], []

# Hook last MBConv block
target = model.backbone.blocks[-1]
fwd = target.register_forward_hook(lambda m, i, o: activations.append(o))
bwd = target.register_full_backward_hook(lambda m, gi, go: gradients.append(go[0]))

logit = model(tensor)
model.zero_grad()
logit.backward()

fwd.remove(); bwd.remove()

weights = gradients[0].mean(dim=[2,3], keepdim=True)
cam = F.relu((weights * activations[0]).sum(dim=1)).squeeze()
cam = cam.detach().cpu().numpy()
cam = (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)

# Overlay on image
cam_u8 = (cv2.resize(cam, (224,224)) * 255).astype(np.uint8)
heatmap = cv2.applyColorMap(cam_u8, cv2.COLORMAP_JET)
```

---

## Limitations

- **Domain shift:** Trained on StyleGAN2 fakes → accuracy drops on novel diffusion-based deepfakes (~74%)
- **Compression:** Heavy JPEG compression or social-media re-encoding can fool the model
- **Occlusion:** Partially covered faces (sunglasses, masks) reduce detection accuracy
- **Video:** Frame-by-frame analysis doesn't model temporal consistency (planned improvement)
- **Bias:** Dataset skews toward frontal, well-lit, CelebA-style faces

---

## Citation

```bibtex
@misc{deepguard2026,
  title   = {DeepGuard AI: Deepfake Detection and Generation Platform},
  author  = {Sowaiba Arshad},
  year    = {2026},
  url     = {https://huggingface.co/Sowaiba01/deepguard-ai},
  note    = {Final Year Project, Computer Science}
}
```

---

## License

MIT License — free for research and educational use.

---

*Built with PyTorch · timm · InsightFace · FastAPI · Next.js*
