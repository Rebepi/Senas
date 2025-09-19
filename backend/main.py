from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Importar servicios
import math_service
import backend.vocales_service as vocales_service
from sign_service import add_training_sample, predict_landmarks
from vocales_service import train_vocal, predict_vocal, list_vocales

# ---------------------------
# APP
# ---------------------------
app = FastAPI(
    title="Sistema Gestual con MediaPipe API",
    description="API para vocales, operaciones matemáticas y reconocimiento de gestos",
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
    operation: str = "+"  # Default suma

class MathResult(BaseModel):
    result: float
    operation: str

class TrainData(BaseModel):
    landmarks: list[list[float]]
    label: str

class PredictData(BaseModel):
    landmarks: list[list[float]]

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
async def train_vocal(data: TrainData):
    total = vocales_service.train_vocal(data.landmarks, data.label)
    return {"message": "Vocal entrenada", "total_samples": total}

@app.post("/vocales/predict", tags=["vocales"])
async def predict_vocal(data: PredictData):
    prediction, confidence = vocales_service.predict_vocal(data.landmarks)
    if prediction is None:
        raise HTTPException(status_code=400, detail="Modelo no entrenado aún")
    return {"prediction": prediction, "confidence": confidence}

@app.get("/vocales/list", tags=["vocales"])
async def list_vocales():
    return {"vocales": vocales_service.list_vocales()}

@app.post("/vocales/reset", tags=["vocales"])
async def reset_vocales():
    vocales_service.reset_vocales()
    return {"message": "Modelo de vocales reiniciado"}

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
        if op == "+":
            result = math_service.add(a, b)
        elif op == "-":
            result = math_service.subtract(a, b)
        elif op == "*":
            result = math_service.multiply(a, b)
        elif op == "/":
            result = math_service.divide(a, b)
        elif op == "**":
            result = math_service.power(a, b)
        else:
            raise HTTPException(status_code=400, detail="Operación no válida")
        return MathResult(result=result, operation=f"{a} {op} {b}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

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
            "math": {
                "calculate": "/math/calculate"
            },
            "sign": {
                "train": "/sign/train",
                "predict": "/sign/predict"
            }
        }
    }

# ---------------------------
# MAIN
# ---------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
