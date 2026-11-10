"""Local inference API for the SkinWise HAM10000 educational model."""
import json
from pathlib import Path

import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError

BASE = Path(__file__).resolve().parent
MODEL_PATH = BASE / "models" / "skinwise_ham10000.keras"
LABEL_PATH = BASE / "models" / "labels.json"
app = FastAPI(title="SkinWise ML API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"], allow_credentials=True, allow_methods=["GET", "POST"], allow_headers=["*"])
model = None
metadata = None

@app.on_event("startup")
def load_model():
    global model, metadata
    if MODEL_PATH.exists() and LABEL_PATH.exists():
        model = tf.keras.models.load_model(MODEL_PATH)
        metadata = json.loads(LABEL_PATH.read_text(encoding="utf-8"))

@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None, "dataset": "HAM10000"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None or metadata is None:
        raise HTTPException(status_code=503, detail="Model not trained yet. Follow ml-service/README.md to download HAM10000 and run train.py.")
    if file.content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise HTTPException(status_code=415, detail="Upload a JPG, PNG, or WEBP image.")
    raw = await file.read()
    if len(raw) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Image must be 10 MB or smaller.")
    try:
        image = Image.open(__import__("io").BytesIO(raw)).convert("RGB").resize(tuple(metadata.get("image_size", [224, 224])))
    except (UnidentifiedImageError, OSError):
        raise HTTPException(status_code=400, detail="Could not read that image. Try a JPG or PNG.")
    array = np.asarray(image, dtype=np.float32)
    array = tf.keras.applications.efficientnet.preprocess_input(array)
    probabilities = model.predict(np.expand_dims(array, 0), verbose=0)[0]
    order = np.argsort(probabilities)[::-1][:3]
    labels = metadata["labels"]
    names = metadata["class_names"]
    top = [{"class": labels[int(i)], "class_name": names[labels[int(i)]], "probability": float(probabilities[int(i)])} for i in order]
    best = top[0]
    return {"predicted_class": best["class"], "predicted_class_name": best["class_name"], "confidence": best["probability"], "top_predictions": top, "dataset": "HAM10000", "notice": "Experimental research output only. Image classification cannot diagnose skin cancer; please consult a qualified clinician for assessment."}
