from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Importar servicios
import math_service
import vocales_service  # ya está en la misma carpeta
from sign_service import add_training_sample, predict_landmarks
import letters_service  # servicio para letras
# ---------------------------
# APP
# ---------------------------
app = FastAPI(
    title="Sistema Gestual con MediaPipe API",
    description="API para vocales, letras, operaciones matemáticas y reconocimiento de gestos",
    version="1.0.0"
)

# ---------------------------
# CORS
# ---------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, usar dominios exactos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# MODELOS DE DATOS
# ---------------------------
class MathOperation(BaseModel):
    a: float
    b: float
    operation: str = "+"

class MathResult(BaseModel):
    result: float
    operation: str

class TrainData(BaseModel):
    landmarks: list[list[float]]
    label: str

class PredictData(BaseModel):
    landmarks: list[list[float]]

class LetterInput(BaseModel):
    letter: str

# ---------------------------
# ENDPOINTS DE PRUEBA
# ---------------------------
@app.get("/ping")
async def ping():
    return {"message": "pong"}

# ---------------------------
# ENDPOINTS DE VOCAL
# ---------------------------
@app.post("/vocales/train", tags=["vocales"])
async def train_vocal_endpoint(data: TrainData):
    total = vocales_service.train_vocal(data.landmarks, data.label)
    return {"message": "Vocal entrenada", "total_samples": total}

@app.post("/vocales/predict", tags=["vocales"])
async def predict_vocal_endpoint(data: PredictData):
    prediction, confidence = vocales_service.predict_vocal(data.landmarks)
    if prediction is None:
        raise HTTPException(status_code=400, detail="Modelo no entrenado aún")
    return {"prediction": prediction, "confidence": confidence}

@app.get("/vocales/list", tags=["vocales"])
async def list_vocales_endpoint():
    return {"vocales": vocales_service.list_vocales()}

@app.post("/vocales/reset", tags=["vocales"])
async def reset_vocales_endpoint():
    vocales_service.reset_vocales()
    return {"message": "Modelo de vocales reiniciado"}

# ---------------------------
# ENDPOINTS DE LETRAS
# ---------------------------
@app.post("/letters/train", tags=["letters"])
async def train_letter_endpoint(data: TrainData):
    total = letters_service.train_letter(data.landmarks, data.label)
    return {"message": "Letra entrenada", "total_samples": total}

@app.post("/letters/predict", tags=["letters"])
async def predict_letter_endpoint(data: PredictData):
    prediction, confidence = letters_service.predict_letter(data.landmarks)
    if prediction is None:
        raise HTTPException(status_code=400, detail="Modelo de letras no entrenado aún")
    return {"prediction": prediction, "confidence": confidence}

@app.get("/letters/list", tags=["letters"])
async def list_letters_endpoint():
    return {"letters": letters_service.list_letters()}

@app.post("/letters/reset", tags=["letters"])
async def reset_letters_endpoint():
    letters_service.reset_letters()
    return {"message": "Modelo de letras reiniciado"}

# ---------------------------
# Modo oración
# ---------------------------
@app.post("/letters/sentence/add", tags=["letters"])
async def add_letter_to_sentence(data: LetterInput):
    sentence = letters_service.add_to_sentence(data.letter)
    return {"sentence": sentence}

@app.get("/letters/sentence", tags=["letters"])
async def get_sentence():
    sentence = letters_service.get_sentence()
    return {"sentence": sentence}

@app.post("/letters/sentence/reset", tags=["letters"])
async def reset_sentence():
    letters_service.reset_sentence()
    return {"message": "Oración reiniciada"}

# ---------------------------
# ENDPOINTS DE GESTOS
# ---------------------------
@app.post("/sign/train", tags=["sign"])
async def train_sign(data: TrainData):
    total = add_training_sample(data.landmarks, data.label)
    return {"message": "Gesto entrenado", "total_samples": total}

@app.post("/sign/predict", tags=["sign"])
async def predict_sign(data: PredictData):
    prediction, confidence = predict_landmarks(data.landmarks)
    if prediction is None:
        raise HTTPException(status_code=400, detail="Modelo no entrenado aún")
    return {"prediction": prediction, "confidence": confidence}

# ---------------------------
# ENDPOINTS DE OPERACIONES MATEMÁTICAS
# ---------------------------
@app.post("/math/calculate", response_model=MathResult, tags=["math"])
async def calculate_math(operation: MathOperation):
    try:
        a, b = operation.a, operation.b
        op = operation.operation

        # Usamos un diccionario para mapear las operaciones, es más limpio esto
        operations = {
            "+": math_service.add,
            "-": math_service.subtract,
            "*": math_service.multiply,
            "/": math_service.divide,
            "**": math_service.power,
            "sqrt": math_service.square_root
        }

        # Validamos si la operación existe en el diccionario
        if op not in operations:
            raise HTTPException(status_code=400, detail="Operación no válida")
        
        # En el caso de raíz cuadrada, solo usamos 'a'
        if op == "sqrt":
            result = operations[op](a) # Solo se pasa un argumento
            return MathResult(result=result, operation=f"sqrt({a})")
        
        # Llamamos a la función correspondiente
        result = operations[op](a, b)

        return MathResult(result=result, operation=f"{a} {op} {b}")
    
    except ValueError as e:
        # Capturamos solo el error de división por cero
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Capturamos cualquier otro error
        raise HTTPException(status_code=500, detail="Error interno del servidor")

# ---------------------------
# ROOT (INFO GENERAL)
# ---------------------------
@app.get("/", tags=["info"])
async def root():
    return {
        "message": "Sistema Gestual con MediaPipe API",
        "version": "1.0.0",
        "endpoints": {
            "ping": "/ping",
            "vocales": {
                "train": "/vocales/train",
                "predict": "/vocales/predict",
                "list": "/vocales/list",
                "reset": "/vocales/reset"
            },
            "letters": {
                "train": "/letters/train",
                "predict": "/letters/predict",
                "list": "/letters/list",
                "reset": "/letters/reset",
                "sentence": {
                    "add": "/letters/sentence/add",
                    "get": "/letters/sentence",
                    "reset": "/letters/sentence/reset"
                }
            },
            "math": {"calculate": "/math/calculate"},
            "sign": {"train": "/sign/train", "predict": "/sign/predict"}
        }
    }

# ---------------------------
# MAIN
# ---------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
