# SkinWise ML service — real dataset setup

This adds an image-classification API and a ten-question skin-health screening flow to the existing React app. The classifier is trained from **HAM10000**, a real, publicly available dermatoscopic image dataset containing 10,015 images across seven diagnostic categories. It is an educational prototype and is **not validated for clinical use**. HAM10000 is not representative of every skin tone, camera, or real-world phone photo; do not use its output to diagnose, exclude cancer, or choose treatment.

## 1. Get the real dataset

1. Create/sign in to a Kaggle account and accept the dataset's terms: https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000 (HAM10000 / Skin Cancer MNIST: HAM10000).
2. Download and extract the dataset. The metadata file is `HAM10000_metadata.csv`; the image files are commonly split across `HAM10000_images_part_1` and `HAM10000_images_part_2`.
3. Create `ml-service/data/HAM10000_images/` and copy all `.jpg` files from both image folders into it. Put `HAM10000_metadata.csv` directly in `ml-service/data/`.
4. Keep dataset files out of Git; they are large and have their own terms.

Expected structure:

```text
ml-service/
  data/
    HAM10000_metadata.csv
    HAM10000_images/
      ISIC_0024306.jpg
      ...
  models/                  # generated after training
  app.py
  train.py
```

## 2. Train the model

Python 3.10 or 3.11 is recommended. In a terminal:

```bash
cd ml-service
python -m venv .venv
# Windows:
.venv\\Scripts\\activate
# macOS/Linux:
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
python train.py
```

Training uses ImageNet-pretrained EfficientNetB0 transfer learning, a stratified validation split, and class weights for class imbalance. It writes `models/skinwise_ham10000.keras` and `models/labels.json`. A GPU is helpful but not required; training can take a while on CPU. Review validation metrics and test performance on a separate, representative dataset before any serious use.

## 3. Start the API and React app

In the same virtual environment, run:

```bash
uvicorn app:app --reload --port 8000
```

In another terminal at the project root:

```bash
npm install
npm start
```

Sign in, then open **AI Skin Check** from the navbar or visit `http://localhost:3000/ai-skin-check`. API health: `http://localhost:8000/health`.

## Dataset labels

- `akiec`: actinic keratoses / intraepithelial carcinoma
- `bcc`: basal cell carcinoma
- `bkl`: benign keratosis-like lesions
- `df`: dermatofibroma
- `mel`: melanoma
- `nv`: melanocytic nevi
- `vasc`: vascular lesions

These are dataset labels, not a complete list of skin conditions. A model confidence score is not the probability that a person has cancer.

## Safety and treatment guidance

The questionnaire is a warning-sign and risk-factor prompt, not an AI diagnosis or a validated risk score. Any new, changing, bleeding, crusting, or non-healing lesion should be assessed by a qualified clinician. Do not attempt to cure a suspicious lesion at home or use the model result to delay care. Treatment is diagnosis-specific and should be decided by a clinician; the app only gives general prevention and care-seeking guidance.
