# vocales_service.py
import os
import joblib
import numpy as np
from sklearn.neighbors import KNeighborsClassifier

MODEL_PATH = "models/vocales_knn.pkl"

# Carpeta de modelos
if not os.path.exists("models"):
    os.makedirs("models")

# Variables internas
X_train = []
y_train = []
model = None

# ---------------------------
# Cargar modelo si existe
# ---------------------------
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    print("Modelo de vocales cargado desde disco.")
else:
    print("No se encontró modelo de vocales. Se iniciará uno nuevo.")

# ---------------------------
# Funciones principales
# ---------------------------
def train_vocal(landmarks, label):
    """
    Entrena el modelo con una nueva muestra de vocal.
    """
    global X_train, y_train, model

    # Flatten landmarks y añadir a X_train
    features = np.array(landmarks).flatten()
    X_train.append(features)
    y_train.append(label)

    # KNN dinámico según número de muestras
    n_neighbors = min(3, len(X_train))
    model = KNeighborsClassifier(n_neighbors=n_neighbors)
    model.fit(X_train, y_train)

    # Guardar modelo
    joblib.dump(model, MODEL_PATH)
    print(f"Entrenando vocal '{label}'... Total muestras: {len(y_train)}")

    return len(y_train)


def predict_vocal(landmarks):
    """
    Predice la vocal a partir de landmarks.
    """
    global model
    if model is None or len(X_train) == 0:
        return None, 0.0

    features = np.array(landmarks).flatten().reshape(1, -1)
    prediction = model.predict(features)[0]
    confidence = model.predict_proba(features).max()
    print(f"Predicción: {prediction} Confianza: {confidence:.2f}")
    return prediction, float(confidence)


def list_vocales():
    """
    Lista todas las clases de vocales entrenadas.
    """
    global model
    if model is None:
        return []
    return sorted(list(model.classes_))


def reset_vocales():
    """
    Reinicia el modelo y elimina el archivo de disco.
    """
    global X_train, y_train, model
    X_train = []
    y_train = []
    model = None
    if os.path.exists(MODEL_PATH):
        os.remove(MODEL_PATH)
    print("Modelo de vocales reiniciado.")
