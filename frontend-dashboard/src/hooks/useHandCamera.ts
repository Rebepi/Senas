import { useEffect, useRef } from "react";
import * as mpHands from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

interface UseHandCameraProps {
  width?: number;
  height?: number;
  onResults: (landmarks: number[][] | null) => void;
}

export function useHandCamera({ width = 640, height = 480, onResults }: UseHandCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Conexiones de la mano según MediaPipe
  const connections: [number, number][] = [
    [0,1],[1,2],[2,3],[3,4],       // Pulgar
    [0,5],[5,6],[6,7],[7,8],       // Índice
    [0,9],[9,10],[10,11],[11,12],  // Medio
    [0,13],[13,14],[14,15],[15,16],// Anular
    [0,17],[17,18],[18,19],[19,20] // Meñique
  ];

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
      // Dibujar video como fondo
      ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

      let landmarks: number[][] | null = null;

      if (results.multiHandLandmarks?.length) {
        landmarks = results.multiHandLandmarks[0].map(lm => [lm.x, lm.y, lm.z]);

        // Dibujar conexiones (malla)
        ctx.strokeStyle = "#4ade80"; // verde pastel
        ctx.lineWidth = 2;
        for (const [startIdx, endIdx] of connections) {
          const start = results.multiHandLandmarks[0][startIdx];
          const end = results.multiHandLandmarks[0][endIdx];
          ctx.beginPath();
          ctx.moveTo(start.x * canvasRef.current.width, start.y * canvasRef.current.height);
          ctx.lineTo(end.x * canvasRef.current.width, end.y * canvasRef.current.height);
          ctx.stroke();
        }

        // Dibujar puntos
        for (const lm of results.multiHandLandmarks[0]) {
          ctx.beginPath();
          ctx.arc(lm.x * canvasRef.current.width, lm.y * canvasRef.current.height, 4, 0, 2 * Math.PI);
          ctx.fillStyle = "#facc15"; // amarillo brillante
          ctx.fill();
          ctx.strokeStyle = "#eab308"; // borde naranja
          ctx.stroke();
        }
      }

      onResults(landmarks);
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current! });
      },
      width,
      height,
    });
    camera.start();

  }, [onResults, width, height]);

  return { videoRef, canvasRef };
}
