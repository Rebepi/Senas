import React, { useState } from "react";
import { trainLetter, predictLetter } from "../services/api";
import { useHandCamera } from "../hooks/useHandCamera";

export default function CamaraPage() {
  const [letter, setLetter] = useState("A");
  const [landmarks, setLandmarks] = useState<number[][] | null>(null);
  const [resultado, setResultado] = useState<{ prediction: string; confidence: number } | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Usamos nuestro hook
  const { videoRef, canvasRef } = useHandCamera({
    onResults: (lm) => setLandmarks(lm),
  });

  // ---- ENTRENAR LETRA ----
  const entrenar = async () => {
    try {
      if (!landmarks) return;
      const res = await trainLetter(landmarks, letter);
      setMensaje(`Letra ${letter} entrenada. Total muestras: ${res.total_samples}`);
      setResultado(null);
      setError("");
    } catch (err: any) {
      console.error("Error entrenando:", err);
      setError("Error entrenando la letra");
    }
  };

  // ---- PREDICCIÓN ----
  const predecir = async () => {
    try {
      if (!landmarks) return;
      const res = await predictLetter(landmarks);
      setResultado(res);
      setMensaje("");
      setError("");
    } catch (err: any) {
      console.error("Error prediciendo:", err);
      setError("Error conectando con backend o modelo no entrenado");
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold">Reconocimiento de Señas en Tiempo Real</h2>

      <div className="mt-4">
        <video ref={videoRef} width="640" height="480" style={{ display: "none" }} />
        <canvas ref={canvasRef} width="640" height="480" className="border" />
      </div>

      <div className="mt-4">
        <input
          type="text"
          value={letter}
          onChange={(e) => setLetter(e.target.value.toUpperCase())}
          maxLength={1}
          className="px-2 py-1 rounded text-black"
        />
        <button onClick={entrenar} className="ml-2 px-4 py-2 bg-blue-500 rounded font-bold">
          Entrenar
        </button>
        <button onClick={predecir} className="ml-2 px-4 py-2 bg-green-500 rounded font-bold">
          Predecir
        </button>
      </div>

      {resultado && (
        <div className="mt-4">
          <p>Predicción: {resultado.prediction}</p>
          <p>Confianza: {(resultado.confidence * 100).toFixed(2)}%</p>
        </div>
      )}
      {mensaje && <div className="mt-4 text-blue-400">{mensaje}</div>}
      {error && <div className="mt-4 text-red-400">{error}</div>}
    </div>
  );
}
