// src/hooks/useHandDetection.ts
import { useEffect, useRef, useState } from 'react';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

export interface HandData {
  landmarks: { x: number; y: number; z: number }[];
  timestamp: number;
}

// ✅ Named export
export const useHandDetection = (
  videoRef: React.RefObject<HTMLVideoElement> | React.MutableRefObject<HTMLVideoElement | null>
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [handData, setHandData] = useState<HandData | null>(null);
  const [isHandDetected, setIsHandDetected] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    const hands = new Hands({
      locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(results => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas || !results.image) return;

      canvas.width = videoRef.current!.videoWidth;
      canvas.height = videoRef.current!.videoHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      if (results.multiHandLandmarks?.length) {
        const landmarks = results.multiHandLandmarks[0].map(lm => ({
          x: lm.x,
          y: lm.y,
          z: lm.z,
        }));

        setHandData({ landmarks, timestamp: Date.now() });
        setIsHandDetected(true);

        const connections: [number, number][] = [
          [0,1],[1,2],[2,3],[3,4],
          [0,5],[5,6],[6,7],[7,8],
          [0,9],[9,10],[10,11],[11,12],
          [0,13],[13,14],[14,15],[15,16],
          [0,17],[17,18],[18,19],[19,20],
        ];

        ctx.strokeStyle = 'aqua';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'lime';

        landmarks.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x * canvas.width, p.y * canvas.height, 5, 0, 2 * Math.PI);
          ctx.fill();
        });

        connections.forEach(([i, j]) => {
          ctx.beginPath();
          ctx.moveTo(landmarks[i].x * canvas.width, landmarks[i].y * canvas.height);
          ctx.lineTo(landmarks[j].x * canvas.width, landmarks[j].y * canvas.height);
          ctx.stroke();
        });
      } else {
        setHandData(null);
        setIsHandDetected(false);
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) await hands.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera.start();

    return () => {
      camera.stop();
      hands.close();
    };
  }, [videoRef]);

  return { canvasRef, handData, isHandDetected };
};
