// src/hooks/useCamera.ts
import { useRef, useState, useEffect } from 'react';

export interface CameraState {
  isActive: boolean;
  hasPermission: boolean;
  error?: string;
}

export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>({
    isActive: false,
    hasPermission: false,
  });

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraState({ isActive: true, hasPermission: true });
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraState({
        isActive: false,
        hasPermission: false,
        error: 'No se pudo acceder a la cámara',
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraState({ isActive: false, hasPermission: true });
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return { videoRef, cameraState, startCamera, stopCamera };
};
