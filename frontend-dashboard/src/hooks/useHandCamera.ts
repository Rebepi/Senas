// src/hooks/useHandCamera.ts
import { useRef, useEffect, useState } from "react";
import * as mpHands from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

export interface HandPoint {
  x: number;
  y: number;
  z: number;
}

export const useHandCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [landmarks, setLandmarks] = useState<HandPoint[] | null>(null);
  const [status, setStatus] = useState("Cargando cámara...");
  const [error, setError] = useState("");

  // Conexiones de la mano para dibujar la malla
  const HAND_CONNECTIONS: [number, number][] = [
    [0,1],[1,2],[2,3],[3,4],      // pulgar
    [0,5],[5,6],[6,7],[7,8],      // índice
    [0,9],[9,10],[10,11],[11,12], // medio
    [0,13],[13,14],[14,15],[15,16], // anular
    [0,17],[17,18],[18,19],[19,20]  // meñique
  ];

  useEffect(() => {
    if (!videoRef.current) return;

    const hands = new mpHands.Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    let processing = false;

    hands.onResults((results) => {
      const ctx = canvasRef.current?.getContext("2d");
      const video = videoRef.current;
      if (!ctx || !canvasRef.current || !video) return;

      canvasRef.current.width = video.videoWidth;
      canvasRef.current.height = video.videoHeight;

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(video, 0, 0, canvasRef.current.width, canvasRef.current.height);

      if (results.multiHandLandmarks?.length) {
        const lm = results.multiHandLandmarks[0];
        setLandmarks(lm);

        // Dibujar malla
        ctx.strokeStyle = "aqua";
        ctx.lineWidth = 2;
        HAND_CONNECTIONS.forEach(([i, j]) => {
          const x1 = lm[i].x * canvasRef.current!.width;
          const y1 = lm[i].y * canvasRef.current!.height;
          const x2 = lm[j].x * canvasRef.current!.width;
          const y2 = lm[j].y * canvasRef.current!.height;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        });

        // Dibujar puntos
        lm.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x * canvasRef.current!.width, p.y * canvasRef.current!.height, 5, 0, 2 * Math.PI);
          ctx.fillStyle = "lime";
          ctx.fill();
        });
      } else {
        setLandmarks(null);
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (processing) return;
        processing = true;
        try {
          await hands.send({ image: videoRef.current! });
        } catch (e) {
          setError("Error enviando frame a MediaPipe");
        } finally {
          processing = false;
        }
      },
      width: 640,
      height: 480,
    });

    camera.start()
      .then(() => setStatus("Cámara lista"))
      .catch(() => setError("No se pudo iniciar la cámara"));

    return () => {
      camera.stop();
      // no cerramos hands para evitar errores WASM
    };
  }, []);

  return { videoRef, canvasRef, landmarks, status, error };
};
