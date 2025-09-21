from pydantic import BaseModel
from typing import List

class Landmark(BaseModel):
    x: float
    y: float
    z: float

class LetterSample(BaseModel):
    letter: str   # 'A' a 'Z'
    landmarks: List[Landmark]

class TrainResponse(BaseModel):
    message: str

class StatsResponse(BaseModel):
    total_samples: int
    samples_per_letter: dict
