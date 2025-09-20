// src/services/api.ts
import axios from "axios";

const API_BASE = "http://localhost:8000"; // cambiar si el backend está en remoto

// 👉 Helper para dar formato correcto a los landmarks
export const formatLandmarks = (landmarks: number[][]) =>
  landmarks.map(([x, y, z]) => ({ x, y, z }));

// ✅ Test de conexión al backend
export const pingBackend = async () => {
  try {
    const res = await axios.get(`${API_BASE}/ping`);
    return res.data;
  } catch (err) {
    console.error("Error en pingBackend:", err);
    return null;
  }
};

// ✅ Entrenar una letra con landmarks
export const trainLetter = async (landmarks: number[][], label: string) => {
  try {
    const res = await axios.post(`${API_BASE}/letters/train`, {
      landmarks: formatLandmarks(landmarks),
      label,
    });
    return res.data;
  } catch (err) {
    console.error("Error trainLetter:", err);
    throw err;
  }
};

// ✅ Predecir letra
export const predictLetter = async (landmarks: number[][]) => {
  try {
    const res = await axios.post(`${API_BASE}/letters/predict`, {
      landmarks: formatLandmarks(landmarks),
    });
    return res.data; // { prediction: string, confidence: number }
  } catch (err) {
    console.error("Error predictLetter:", err);
    throw err;
  }
};
