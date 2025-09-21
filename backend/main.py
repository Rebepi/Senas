from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import pickle
import string
import numpy as np
from collections import defaultdict
from sklearn.ensemble import RandomForestClassifier

# ---------------------------
# VARIABLES GLOBALES
# ---------------------------
samples_db = defaultdict(list)  # { 'A': [array_landmarks, ...], ... }
model = None
sentence = []

MODEL_FILE = "letters_model.pkl"

# ---------------------------
# FUNCIONES AUXILIARES
# ---------------------------
def save_model():
    global model
    if model:
        with open(MODEL_FILE, "wb") as f:
            pickle.dump(model, f)

def load_model():
    global model
    if os.path.exists(MODEL_FILE):
        with open(MODEL_FILE, "rb") as f:
            model = pickle.load(f)

def flatten_landmarks(landmarks):
    return np.array(landmarks).flatten()

# ---------------------------
# FUNCIONES PRINCIPALES
# ---------------------------
def train_letter_from_request(data):
    letter = data.label.upper()
    if letter not in string.ascii_uppercase:
        raise ValueError("Letra inválida")
    if len(data.landmarks) != 21:
        raise ValueError("Se necesitan 21 landmarks")
    arr = np.array([[lm.x, lm.y, lm.z] for lm in data.landmarks])
    samples_db[letter].append(arr)
    return len(samples_db[letter])

def train_model():
    global model
    X = []
    y = []
    for letter, samples in samples_db.items():
        for s in samples:
            X.append(flatten_landmarks(s))
            y.append(letter)
    if not X:
        return False
    X = np.array(X)
    y = np.array(y)
    clf = RandomForestClassifier(n_estimators=100)
    clf.fit(X, y)
    model = clf
    save_model()
    return True

def predict_letter_from_request(data):
    global model
    if not model:
        load_model()
    if not model:
        return None, 0.0
    if len(data.landmarks) != 21:
        raise ValueError("Se necesitan 21 landmarks")
    arr = np.array([[lm.x, lm.y, lm.z] for lm in data.landmarks])
    x = flatten_landmarks(arr).reshape(1, -1)
    pred = model.predict(x)[0]
    conf = np.max(model.predict_proba(x))
    return pred, float(conf)

def list_letters():
    return [l for l in string.ascii_uppercase if l in samples_db and samples_db[l]]

def reset_letters():
    global samples_db, model
    samples_db = defaultdict(list)
    model = None
    if os.path.exists(MODEL_FILE):
        os.remove(MODEL_FILE)

def clear_letter(letter):
    letter = letter.upper()
    if letter in samples_db:
        samples_db[letter] = []

def get_stats():
    total = sum(len(v) for v in samples_db.values())
    per_letter = {k: len(v) for k, v in samples_db.items()}
    return {"total_samples": total, "samples_per_letter": per_letter}

def add_to_sentence(letter):
    global sentence
    sentence.append(letter.upper())
    return "".join(sentence)

def get_sentence():
    return "".join(sentence)

def reset_sentence():
    global sentence
    sentence = []

# ---------------------------
# APP
# ---------------------------
app = FastAPI(
    title="Sistema Gestual con MediaPipe API",
    description="API para vocales, letras y reconocimiento de gestos",
    version="1.1.0"
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# MODELOS Pydantic
# ---------------------------
class Point3D(BaseModel):
    x: float
    y: float
    z: float

class TrainData(BaseModel):
    landmarks: List[Point3D]
    label: str

class PredictData(BaseModel):
    landmarks: List[Point3D]

class LetterInput(BaseModel):
    letter: str

class StatsResponse(BaseModel):
    total_samples: int
    samples_per_letter: dict

# ---------------------------
# ENDPOINTS LETRAS
# ---------------------------
@app.post("/letters/train", tags=["letters"])
async def train_letter_endpoint(data: TrainData):
    try:
        total = train_letter_from_request(data)
        return {"message": f"Letra '{data.label.upper()}' entrenada", "total_samples": total}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error entrenando letra: {str(e)}")

@app.post("/letters/train-model", tags=["letters"])
async def train_model_endpoint():
    try:
        success = train_model()
        if not success:
            raise HTTPException(status_code=400, detail="No hay muestras para entrenar el modelo")
        return {"message": "Modelo entrenado correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error entrenando modelo: {str(e)}")

@app.post("/letters/predict", tags=["letters"])
async def predict_letter_endpoint(data: PredictData):
    try:
        prediction, confidence = predict_letter_from_request(data)
        if prediction is None:
            raise HTTPException(status_code=400, detail="Modelo de letras no entrenado aún")
        return {"prediction": prediction, "confidence": confidence}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error prediciendo letra: {str(e)}")

@app.get("/letters/list", tags=["letters"])
async def list_letters_endpoint():
    return {"letters": list_letters()}

@app.post("/letters/reset", tags=["letters"])
async def reset_letters_endpoint(letter: Optional[str] = None):
    try:
        if letter:
            clear_letter(letter)
            return {"message": f"Muestras de '{letter.upper()}' eliminadas"}
        else:
            reset_letters()
            return {"message": "Modelo de letras reiniciado"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reiniciando letra(s): {str(e)}")

@app.get("/letters/stats", tags=["letters"], response_model=StatsResponse)
async def letters_stats_endpoint():
    stats = get_stats()
    return StatsResponse(total_samples=stats['total_samples'], samples_per_letter=stats['samples_per_letter'])

# ---------------------------
# Modo oración
# ---------------------------
@app.post("/letters/sentence/add", tags=["letters"])
async def add_letter_to_sentence_endpoint(data: LetterInput):
    sentence_str = add_to_sentence(data.letter)
    return {"sentence": sentence_str}

@app.get("/letters/sentence", tags=["letters"])
async def get_sentence_endpoint():
    return {"sentence": get_sentence()}

@app.post("/letters/sentence/reset", tags=["letters"])
async def reset_sentence_endpoint():
    reset_sentence()
    return {"message": "Oración reiniciada"}

# ---------------------------
# MAIN
# ---------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
