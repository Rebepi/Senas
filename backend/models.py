# models.py
from pydantic import BaseModel
from typing import List

class Landmark(BaseModel):
    x: float
    y: float
    z: float

class LetterTrainRequest(BaseModel):
    landmarks: List[Landmark]  # lista de dicts {x,y,z}
    label: str

class LetterPredictRequest(BaseModel):
    landmarks: List[Landmark]
