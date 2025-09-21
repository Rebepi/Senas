from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import letters_service  # tu módulo donde manejas el modelo y los datos

# ---------------------------
# APP
# ---------------------------
app = FastAPI(
    title="Sistema Gestual con MediaPipe API",
    description="API para vocales, letras, operaciones matemáticas y reconocimiento de gestos",
    version="1.1.0"
)

# ---------------------------
# CORS
# ---------------------------
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
    label: str  # 'A'-'Z'

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
        total = letters_service.train_letter_from_request(data)
        return {"message": f"Letra '{data.label.upper()}' entrenada", "total_samples": total}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error entrenando letra: {str(e)}")

@app.post("/letters/predict", tags=["letters"])
async def predict_letter_endpoint(data: PredictData):
    try:
        prediction, confidence = letters_service.predict_letter_from_request(data)
        if prediction is None:
            raise HTTPException(status_code=400, detail="Modelo de letras no entrenado aún")
        return {"prediction": prediction, "confidence": confidence}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error prediciendo letra: {str(e)}")

@app.get("/letters/list", tags=["letters"])
async def list_letters_endpoint():
    return {"letters": letters_service.list_letters()}

@app.post("/letters/reset", tags=["letters"])
async def reset_letters_endpoint(letter: Optional[str] = None):
    """
    Reinicia todas las letras o solo una letra específica.
    - Sin parámetro: reinicia todo el modelo.
    - Con letra: reinicia solo esa letra.
    """
    try:
        if letter:
            letters_service.clear_letter(letter)
            return {"message": f"Muestras de '{letter.upper()}' eliminadas"}
        else:
            letters_service.reset_letters()
            return {"message": "Modelo de letras reiniciado"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reiniciando letra(s): {str(e)}")

@app.get("/letters/stats", tags=["letters"], response_model=StatsResponse)
async def letters_stats_endpoint():
    """Devuelve estadísticas de todas las letras entrenadas."""
    stats = letters_service.get_stats()
    return StatsResponse(total_samples=stats['total_samples'], samples_per_letter=stats['samples_per_letter'])

# ---------------------------
# Modo oración
# ---------------------------
@app.post("/letters/sentence/add", tags=["letters"])
async def add_letter_to_sentence(data: LetterInput):
    sentence = letters_service.add_to_sentence(data.letter)
    return {"sentence": sentence}

@app.get("/letters/sentence", tags=["letters"])
async def get_sentence_endpoint():
    return {"sentence": letters_service.get_sentence()}

@app.post("/letters/sentence/reset", tags=["letters"])
async def reset_sentence_endpoint():
    letters_service.reset_sentence()
    return {"message": "Oración reiniciada"}

# ---------------------------
# MAIN
# ---------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
