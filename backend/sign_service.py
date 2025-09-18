from sklearn.neighbors import KNeighborsClassifier
import numpy as np

X_train = []
y_train = []
model = None

def add_training_sample(landmarks, label):
    global X_train, y_train, model
    features = np.array(landmarks).flatten()
    X_train.append(features)
    y_train.append(label)

    if len(set(y_train)) > 0:
        model = KNeighborsClassifier(n_neighbors=3)
        model.fit(X_train, y_train)

    return len(y_train)

def predict_landmarks(landmarks):
    global model
    if model is None:
        return None, 0.0

    features = np.array(landmarks).flatten().reshape(1, -1)
    prediction = model.predict(features)[0]
    confidence = model.predict_proba(features).max()
    return prediction, float(confidence)
