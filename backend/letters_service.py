from collections import defaultdict
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import string
import pickle
import os

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
    """Guarda el modelo entrenado en disco"""
    if model:
        with open(MODEL_FILE, "wb") as f:
            pickle.dump(model, f)

def load_model():
    """Carga el modelo desde disco si existe"""
    global model
    if os.path.exists(MODEL_FILE):
        with open(MODEL_FILE, "rb") as f:
            model = pickle.load(f)

def flatten_landmarks(landmarks):
    """Convierte array 21x3 → 63"""
    return np.array(landmarks).flatten()

# ---------------------------
# FUNCIONES PRINCIPALES
# ---------------------------

def train_letter_from_request(data):
    """Agrega una muestra y devuelve total de muestras para esa letra"""
    letter = data.label.upper()
    if letter not in string.ascii_uppercase:
        raise ValueError("Letra inválida")
    
    if len(data.landmarks) != 21:
        raise ValueError("Se necesitan 21 landmarks")
    
    # Convertir a numpy array
    arr = np.array([[lm.x, lm.y, lm.z] for lm in data.landmarks])
    samples_db[letter].append(arr)
    
    return len(samples_db[letter])

def train_model():
    """Entrena el modelo con todas las muestras"""
    global model
    X = []
    y = []
    for letter, samples in samples_db.items():
        for s in samples:
            X.append(flatten_landmarks(s))
            y.append(letter)
    
    if not X:
        return False  # no hay datos

    X = np.array(X)
    y = np.array(y)

    clf = RandomForestClassifier(n_estimators=100)
    clf.fit(X, y)
    model = clf
    save_model()
    return True

def predict_letter_from_request(data):
    """Predice la letra usando el modelo entrenado"""
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
    """Devuelve lista de letras entrenadas"""
    return [l for l in string.ascii_uppercase if l in samples_db and samples_db[l]]

def reset_letters():
    """Reinicia todo el modelo y borra muestras"""
    global samples_db, model
    samples_db = defaultdict(list)
    model = None
    if os.path.exists(MODEL_FILE):
        os.remove(MODEL_FILE)

def clear_letter(letter):
    """Borra muestras de una letra específica"""
    letter = letter.upper()
    if letter in samples_db:
        samples_db[letter] = []

def get_stats():
    """Devuelve estadísticas de todas las letras"""
    total = sum(len(v) for v in samples_db.values())
    per_letter = {k: len(v) for k, v in samples_db.items()}
    return {"total_samples": total, "samples_per_letter": per_letter}

# ---------------------------
# ORACION
# ---------------------------
def add_to_sentence(letter):
    global sentence
    sentence.append(letter.upper())
    return "".join(sentence)

def get_sentence():
    return "".join(sentence)

def reset_sentence():
    global sentence
    sentence = []
