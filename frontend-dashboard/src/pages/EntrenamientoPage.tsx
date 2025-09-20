// src/pages/CamaraPage.tsx
import React, { useRef, useEffect, useState } from "react";
import { trainLetter, predictLetter } from "../services/api";
import * as mpHands from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

export default function CamaraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [letter, setLetter] = useState("A");
  const [resultado, setResultado] = useState<{ prediction: string; confidence: number } | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Inicializamos MediaPipe Hands
  useEffect(() => {
    if (!videoRef.current) return;

    const hands = new mpHands.Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults((results) => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || !canvasRef.current || !videoRef.current) return;

      // Limpiar canvas
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Dibujar video
      ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

      if (results.multiHandLandmarks?.length) {
        const landmarks = results.multiHandLandmarks[0];

        // Dibujar puntos (opcional)
        for (const lm of landmarks) {
          ctx.beginPath();
          ctx.arc(lm.x * canvasRef.current.width, lm.y * canvasRef.current.height, 5, 0, 2 * Math.PI);
          ctx.fillStyle = "red";
          ctx.fill();
        }

        // Guardar landmarks para entrenamiento/predicción
        videoRef.current.dataset.landmarks = JSON.stringify(landmarks.map(lm => [lm.x, lm.y, lm.z]));
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current! });
      },
      width: 640,
      height: 480,
    });
    camera.start();
  }, []);

  // ---- ENTRENAR LETRA ----
  const entrenar = async () => {
    try {
      if (!videoRef.current?.dataset.landmarks) return;
      const landmarks = JSON.parse(videoRef.current.dataset.landmarks);
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
      if (!videoRef.current?.dataset.landmarks) return;
      const landmarks = JSON.parse(videoRef.current.dataset.landmarks);
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