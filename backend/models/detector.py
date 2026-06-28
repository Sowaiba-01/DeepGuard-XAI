"""
EfficientNet-B4 Deepfake Detector
Fine-tuned on 140K Real & Fake Faces dataset (99.78% val accuracy)
"""

import os
import torch
import torch.nn as nn
import timm


class DeepfakeDetector(nn.Module):
    """
    EfficientNet-B4 with attention head for deepfake detection.
    Binary classifier: 0 = REAL, 1 = FAKE
    """

    def __init__(self, pretrained: bool = True):
        super().__init__()
        # EfficientNet-B4 backbone (timm)
        self.backbone = timm.create_model(
            "efficientnet_b4",
            pretrained=pretrained,
            num_classes=0,   # Remove default head
            global_pool="avg",
        )
        in_features = self.backbone.num_features  # 1792 for B4

        # Classification head (matches Colab training architecture)
        self.head = nn.Sequential(
            nn.Linear(in_features, 512),
            nn.GELU(),
            nn.Dropout(0.3),
            nn.Linear(512, 128),
            nn.GELU(),
            nn.Dropout(0.2),
            nn.Linear(128, 1),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        features = self.backbone(x)   # (B, 1792)
        return self.head(features).squeeze(1)


def load_detection_model(
    checkpoint_path: str | None = None,
    device: str | None = None,
) -> DeepfakeDetector:
    """
    Load the EfficientNet-B4 detection model.
    If checkpoint_path is not provided, loads ImageNet pretrained weights.
    Fine-tuned weights should be saved to: backend/models/efficientnet_b4_ff++.pth
    """
    device = device or os.getenv("DEVICE", "cpu")
    checkpoint_path = checkpoint_path or os.getenv("DETECTION_MODEL_PATH", "models/efficientnet_b4_deepguard.pth")

    model = DeepfakeDetector(pretrained=True)

    if os.path.exists(checkpoint_path):
        print(f"  Loading fine-tuned weights from {checkpoint_path}")
        state = torch.load(checkpoint_path, map_location=device, weights_only=True)
        model.load_state_dict(state)
        print("  ✅ Fine-tuned weights loaded")
    else:
        print(f"  ⚠️  No checkpoint at {checkpoint_path} — using ImageNet pretrained weights")
        print("  Run the Colab notebook to fine-tune and download the checkpoint")

    model = model.to(device)
    model.eval()
    return model
