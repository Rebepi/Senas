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
  const sendingFrame = useRef(false);
  const cameraRef = useRef<Camera | null>(null);
  const handsRef = useRef<mpHands.Hands | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    if (!videoRef.current) return;

    const hands = new mpHands.Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    handsRef.current = hands;

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults((results) => {
      if (!mounted.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth || width;
      canvas.height = video.videoHeight || height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      } catch {}

      let landmarks: number[][] | null = null;
      if (results.multiHandLandmarks?.length) {
        landmarks = results.multiHandLandmarks[0].map((lm) => [lm.x, lm.y, lm.z]);
      }

      onResults(landmarks);
    });

    const camera = new Camera(videoRef.current, {
      width,
      height,
      onFrame: async () => {
        if (!mounted.current) return;
        if (sendingFrame.current || !handsRef.current) return;
        if (!videoRef.current || videoRef.current.readyState < 2) return;

        sendingFrame.current = true;
        try {
          await handsRef.current.send({ image: videoRef.current });
        } catch (err) {
          console.warn("Error enviando frame a MediaPipe:", err);
        } finally {
          sendingFrame.current = false;
        }
      },
    });

    cameraRef.current = camera;
    camera.start().catch((err) => console.error("Error iniciando cámara:", err));

    return () => {
      mounted.current = false;
      try { cameraRef.current?.stop(); } catch {}
      try { handsRef.current?.close(); } catch {}
      cameraRef.current = null;
      handsRef.current = null;
    };
  }, [onResults, width, height]);

  return { videoRef, canvasRef };
}
