// src/types/index.ts

// Representa un punto 3D de la mano
export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

// Datos completos de la mano en un frame
export interface HandData {
  landmarks: HandLandmark[];
  timestamp: number;
}

// Muestra de entrenamiento para una letra
export interface TrainingData {
  letter: string;         // 'A' a 'Z'
  handData: HandData;
  confidence?: number;    // opcional
}

// Resultado de detección de letra
export interface DetectionResult {
  letter: string;        // 'A' a 'Z'
  confidence: number;
  timestamp: number;
}

// Estadísticas del modelo de letras
export interface ModelStats {
  totalSamples: number;
  samplesPerLetter: Record<string, number>;  // ej. { A: 10, B: 5, ... }
  accuracy?: number;
  lastTrained?: string;
}

// Tipo para letras (A–Z)
export type LetterType =
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J'
  | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T'
  | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';

// Estado de la cámara
export interface CameraState {
  isActive: boolean;
  hasPermission: boolean;
  error?: string;
}
