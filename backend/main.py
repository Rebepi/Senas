from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import math_service
from sign_service import add_training_sample, predict_landmarks

app = FastAPI(
    title="Calculadora con MediaPipe API",
    description="API para operaciones matemáticas y reconocimiento de gestos",
    version="1.0.0"
)

# Configuración CORS para el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica dominios exactos
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
# ENDPOINTS MATEMÁTICOS
# ---------------------------
@app.post("/math/add", response_model=MathResult, tags=["math"])
async def add_numbers(operation: MathOperation):
    try:
        result = math_service.add(operation.a, operation.b)
        return MathResult(result=result, operation=f"{operation.a} + {operation.b}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/math/subtract", response_model=MathResult, tags=["math"])
async def subtract_numbers(operation: MathOperation):
    try:
        result = math_service.subtract(operation.a, operation.b)
        return MathResult(result=result, operation=f"{operation.a} - {operation.b}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/math/multiply", response_model=MathResult, tags=["math"])
async def multiply_numbers(operation: MathOperation):
    try:
        result = math_service.multiply(operation.a, operation.b)
        return MathResult(result=result, operation=f"{operation.a} * {operation.b}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/math/divide", response_model=MathResult, tags=["math"])
async def divide_numbers(operation: MathOperation):
    try:
        result = math_service.divide(operation.a, operation.b)
        return MathResult(result=result, operation=f"{operation.a} / {operation.b}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

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
# ROOT (INFO GENERAL)
# ---------------------------
@app.get("/")
async def root():
    return {
        "message": "Calculadora con MediaPipe API",
        "version": "1.0.0",
        "endpoints": {
            "ping": "/ping",
            "math": {
                "add": "/math/add",
                "subtract": "/math/subtract",
                "multiply": "/math/multiply",
                "divide": "/math/divide"
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
    uvicorn.run(app, host="0.0.0.0", port=8000)
