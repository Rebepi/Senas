import React, { useState, useEffect } from "react";
import { useHandCamera } from "../hooks/useHandCamera";
import type { HandPoint } from "../hooks/useHandCamera";
import { trainLetter, predictLetter } from "../services/api";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const TARGET_PER_CLASS = 100;

export default function AbecedarioPage() {
  const { videoRef, canvasRef, landmarks, status, error } = useHandCamera();
  const [samples, setSamples] = useState<{ label: string; landmarks: number[][] }[]>([]);
  const [collecting, setCollecting] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<{ letter: string; confidence: number } | null>(null);
  const [apiError, setApiError] = useState<string>("");

  // Helper para obtener el conteo de muestras
  const getCount = (label: string) => samples.filter(s => s.label === label).length;

  // Maneja el inicio de la recolección
  const startCollect = (letter: string) => {
    setCollecting(letter);
    setPrediction(null); // Limpiar predicción anterior
    setApiError(""); // Limpiar errores
  };

  // Maneja la detención de la recolección
  const stopCollect = () => setCollecting(null);

  // Recolecta landmarks cada 300ms y se detiene automáticamente al alcanzar el objetivo
  useEffect(() => {
    if (!collecting || !landmarks) return;

    const interval = setInterval(() => {
      // Detener la recolección si se alcanza el objetivo
      const currentCount = getCount(collecting);
      if (currentCount >= TARGET_PER_CLASS) {
        stopCollect();
        console.log(`Recolectadas ${TARGET_PER_CLASS} muestras para la letra ${collecting}.`);
        return;
      }
      
      const formatted = (landmarks as HandPoint[]).map(l => [l.x, l.y, l.z]);
      setSamples(prev => [...prev, { label: collecting, landmarks: formatted }]);
    }, 300);

    // Función de limpieza para detener el intervalo
    return () => clearInterval(interval);
  }, [collecting, landmarks]);

  const handleTrain = async (label: string) => {
    const allLandmarksForLabel = samples.filter(s => s.label === label).map(s => s.landmarks);
    
    if (allLandmarksForLabel.length < TARGET_PER_CLASS) {
      alert(`Necesitas recolectar ${TARGET_PER_CLASS} muestras para entrenar la letra ${label}.`);
      return;
    }
    
    // Aplanar el array de arrays de landmarks para enviarlo a la API
    const flattenedData = allLandmarksForLabel.flat();

    try {
      const res = await trainLetter(flattenedData, label);
      alert(`Letra ${label} entrenada. Total de muestras: ${res.total_samples}`);
      setApiError("");
    } catch {
      setApiError(`Error entrenando letra ${label}`);
    }
  };

  const handlePredict = async () => {
    if (!landmarks) {
      setApiError("No se detectan landmarks. Asegúrate de que tu mano esté visible.");
      return;
    }
    
    const formatted = (landmarks as HandPoint[]).map(l => [l.x, l.y, l.z]);

    try {
      const res = await predictLetter(formatted);
      setPrediction({ letter: res.prediction, confidence: res.confidence });
      setApiError("");
    } catch {
      setApiError("Error prediciendo letra. Asegúrate de que el modelo esté entrenado.");
    }
  };

  const getPercentage = (label: string) => Math.min((getCount(label) / TARGET_PER_CLASS) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">🖐️ Detector de Abecedario</h1>

      <div className="relative w-full max-w-lg aspect-video rounded-xl overflow-hidden border-4 border-slate-700 shadow-lg mb-6">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" autoPlay muted playsInline />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute top-2 left-2 bg-black/50 px-3 py-1 rounded text-sm">{status}</div>
        {error && <p className="absolute bottom-2 left-2 text-red-400 text-sm">{error}</p>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
        {ALPHABET.map(letter => (
          <div key={letter} className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg flex flex-col gap-2">
            <div className="font-bold text-lg">{letter}</div>
            <div className="h-3 w-full bg-slate-700 rounded">
              <div className="h-3 bg-green-500 rounded" style={{ width: `${getPercentage(letter)}%` }} />
            </div>
            <div className="text-sm">{getCount(letter)} / {TARGET_PER_CLASS}</div>
            <div className="flex gap-2">
              <button
                onClick={() => (collecting === letter ? stopCollect() : startCollect(letter))}
                className={`flex-1 px-2 py-1 rounded font-semibold ${collecting === letter ? "bg-rose-600" : "bg-green-600"}`}
              >
                {collecting === letter ? "Detener" : "Recolectar"}
              </button>
              <button
                onClick={() => handleTrain(letter)}
                className="flex-1 px-2 py-1 rounded bg-indigo-600 font-semibold"
              >
                Entrenar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg w-full max-w-3xl flex flex-col items-center gap-2">
        <button
          onClick={handlePredict}
          className="px-4 py-2 bg-emerald-500 rounded font-bold hover:bg-emerald-600"
        >
          Predecir Última Letra
        </button>
        {prediction && (
          <div className="mt-2 p-2 bg-black/50 rounded w-full text-center">
            <p>Letra: <strong>{prediction.letter}</strong></p>
            <p>Confianza: {(prediction.confidence * 100).toFixed(2)}%</p>
          </div>
        )}
        {apiError && <p className="mt-2 text-red-400">{apiError}</p>}
      </div>
    </div>
  );
}