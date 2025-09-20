# letters_service.py
import os
import joblib
import numpy as np
from sklearn.neighbors import KNeighborsClassifier

MODEL_PATH = "models/letters_knn.pkl"

# Crear carpeta de modelos si no existe
if not os.path.exists("models"):
    os.makedirs("models")

# Variables internas
X_train = []
y_train = []
model = None
sentence_buffer = []  # Para modo oración

# ---------------------------
# Cargar modelo si existe
# ---------------------------
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    print("Modelo de letras cargado desde disco.")
else:
    print("No se encontró modelo de letras. Se iniciará uno nuevo.")

# ---------------------------
# Función de conversión
# ---------------------------
def landmarks_to_features(landmarks):
    """
    Convierte una lista de dicts {'x','y','z'} a lista plana de floats.
    """
    features = []
    for point in landmarks:
        features.extend([point['x'] if isinstance(point, dict) else point.x,
                         point['y'] if isinstance(point, dict) else point.y,
                         point['z'] if isinstance(point, dict) else point.z])
    return features

# ---------------------------
# Funciones principales
# ---------------------------
def train_letter(landmarks, label):
    """
    Entrena el modelo con una nueva muestra de letra.
    landmarks: lista de floats (ya aplanada)
    """
    global X_train, y_train, model

    features = np.array(landmarks).flatten()
    X_train.append(features)
    y_train.append(label)

    n_neighbors = min(3, len(X_train))
    model = KNeighborsClassifier(n_neighbors=n_neighbors)
    model.fit(X_train, y_train)

    joblib.dump(model, MODEL_PATH)
    print(f"Entrenando letra '{label}'... Total muestras: {len(y_train)}")
    return len(y_train)

def train_letter_from_request(req):
    """
    Entrena letra a partir del request del frontend (landmarks dict + label)
    """
    features = landmarks_to_features(req.landmarks)
    return train_letter(features, req.label)


def predict_letter(landmarks):
    """
    Predice la letra a partir de landmarks (lista de floats)
    """
    global model
    if model is None or len(X_train) == 0:
        return None, 0.0

    features = np.array(landmarks).flatten().reshape(1, -1)
    prediction = model.predict(features)[0]
    confidence = model.predict_proba(features).max()
    print(f"Predicción: {prediction} Confianza: {confidence:.2f}")
    return prediction, float(confidence)

def predict_letter_from_request(req):
    """
    Predice letra a partir del request del frontend (landmarks dict)
    """
    features = landmarks_to_features(req.landmarks)
    return predict_letter(features)


def list_letters():
    """
    Lista todas las letras entrenadas.
    """
    global model
    if model is None:
        return []
    return sorted(list(model.classes_))


def reset_letters():
    """
    Reinicia el modelo de letras.
    """
    global X_train, y_train, model, sentence_buffer
    X_train = []
    y_train = []
    model = None
    sentence_buffer = []
    if os.path.exists(MODEL_PATH):
        os.remove(MODEL_PATH)
    print("Modelo de letras reiniciado.")


# ---------------------------
# Modo oración
# ---------------------------
def add_to_sentence(letter):
    """
    Agrega una letra al buffer de oración.
    """
    global sentence_buffer
    sentence_buffer.append(letter)
    return "".join(sentence_buffer)


def get_sentence():
    """
    Retorna la oración actual.
    """
    return "".join(sentence_buffer)


def reset_sentence():
    """
    Reinicia la oración.
    """
    global sentence_buffer
    sentence_buffer = []
