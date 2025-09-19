# test_letters_full.py
from letters_service import (
    train_letter,
    predict_letter,
    list_letters,
    reset_letters,
    add_to_sentence,
    get_sentence,
    reset_sentence
)
import numpy as np

# ---------------------------
# Reiniciar modelo y oración
# ---------------------------
print("Reiniciando modelo de letras y oración...")
reset_letters()
reset_sentence()

# ---------------------------
# Letras de prueba y muestras
# ---------------------------
letters = ['A', 'B', 'C', 'D', 'E']
num_muestras = 5  # puedes aumentar a 20 como mencionaste

# Generar datos de prueba (simulación)
def generar_landmarks():
    # Cada "landmark" es una lista de pares de coordenadas aleatorias
    return [[np.random.rand(), np.random.rand()] for _ in range(21)]

# ---------------------------
# Entrenamiento
# ---------------------------
print("\nEntrenando letras...")
for letra in letters:
    for i in range(num_muestras):
        landmarks = generar_landmarks()
        train_letter(landmarks, letra)

# ---------------------------
# Listar letras entrenadas
# ---------------------------
print("\nLetras entrenadas:", list_letters())

# ---------------------------
# Predicciones
# ---------------------------
print("\nProbando predicciones:")
for letra in letters:
    landmarks = generar_landmarks()
    pred, conf = predict_letter(landmarks)
    print(f"Vocal: {letra} | Predicción: {pred}, Confianza: {conf:.2f}")

# ---------------------------
# Modo oración
# ---------------------------
print("\nModo oración:")
sentence_test = ['A', 'B', 'C', 'A', 'E']
for l in sentence_test:
    add_to_sentence(l)
    print(f"Agregando '{l}'... Oración actual: {get_sentence()}")

# Reset de oración
print("\nReiniciando oración...")
reset_sentence()
print("Oración después de reset:", get_sentence())
