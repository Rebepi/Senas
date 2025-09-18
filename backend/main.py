from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Union
import math_service

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

# Modelos de datos
class MathOperation(BaseModel):
    a: float
    b: float

class MathResult(BaseModel):
    result: float
    operation: str

# Ruta de prueba
@app.get("/ping")
async def ping():
    return {"message": "pong"}

# Rutas matemáticas
@app.post("/math/add", response_model=MathResult)
async def add_numbers(operation: MathOperation):
    try:
        result = math_service.add(operation.a, operation.b)
        return MathResult(result=result, operation=f"{operation.a} + {operation.b}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/math/subtract", response_model=MathResult)
async def subtract_numbers(operation: MathOperation):
    try:
        result = math_service.subtract(operation.a, operation.b)
        return MathResult(result=result, operation=f"{operation.a} - {operation.b}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/math/multiply", response_model=MathResult)
async def multiply_numbers(operation: MathOperation):
    try:
        result = math_service.multiply(operation.a, operation.b)
        return MathResult(result=result, operation=f"{operation.a} * {operation.b}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/math/divide", response_model=MathResult)
async def divide_numbers(operation: MathOperation):
    try:
        result = math_service.divide(operation.a, operation.b)
        return MathResult(result=result, operation=f"{operation.a} / {operation.b}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Ruta para información general
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
            }
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)