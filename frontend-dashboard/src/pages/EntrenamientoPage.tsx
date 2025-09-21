import React, { useState } from "react";
import { useCamera } from "../hooks/useCamera";
import { useHandDetection } from "../hooks/useHandDetection";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface Props {
  initialLetter?: string;
  maxSamples?: number;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function EntrenamientoPage({ initialLetter = "A", maxSamples = 50 }: Props) {
  const { videoRef } = useCamera();
  const { canvasRef, handData, isHandDetected } = useHandDetection(videoRef);

  const [letter, setLetter] = useState(initialLetter);
  const [sampleCount, setSampleCount] = useState(0);

  const progress = Math.min(sampleCount / maxSamples, 1) * 100;

  // Funciones
  const handleTrain = () => { if (isHandDetected && sampleCount < maxSamples) setSampleCount(sampleCount + 1); };
  const handlePredict = () => { if (!handData) return alert("Predicción API aquí"); };
  const handleClear = () => setSampleCount(0);
  const handleSave = () => alert(`Guardadas ${sampleCount} muestras para la letra ${letter}`); 
  const handleBack = () => alert("Regresando al panel principal...");
  const handleChangeLetter = (l: string) => { setLetter(l); setSampleCount(0); };

  return (
    <h2 className="text-2xl font-bold w-full">
      {/* TODO EL CONTENIDO DEL ENTRENAMIENTO */}
      <div className="p-6 w-full min-h-screen bg-gray-900 text-white flex flex-col items-center">
        <h2 className="text-4xl font-bold mb-6 text-indigo-400 text-center">Entrenamiento de Mano: "{letter}" ✋</h2>
        <p className="text-gray-300 mb-6 text-center max-w-[700px]">
          Aprende a entrenar cada letra con tu mano. Captura muestras, observa la referencia y sigue el progreso.
        </p>

        <div className="flex gap-8 w-full max-w-[1200px] justify-center items-start flex-wrap">

          {/* Sección 1: Imagen de referencia */}
          <div className="flex flex-col items-center gap-3 flex-1 min-w-[300px]">
            <h3 className="text-xl font-semibold text-indigo-300">Referencia</h3>
            <p className="text-gray-400 text-sm text-center mb-2">Observa cómo debe posicionarse la mano.</p>
            <div className="w-full h-72 border-4 border-indigo-500 rounded-xl overflow-hidden shadow-lg flex items-center justify-center bg-gray-800">
              <img src={`/assets/abecedario/${letter}.jpg`} alt={`Referencia letra ${letter}`} className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Sección 2: Video + Canvas + CircularProgress */}
          <div className="flex flex-col items-center gap-4 flex-1 min-w-[350px]">
            <h3 className="text-xl font-semibold text-indigo-300">Cámara / Entrenamiento</h3>
            <p className="text-gray-400 text-sm text-center mb-2">Coloca tu mano frente a la cámara y comienza a entrenar.</p>
            <div className={`relative w-full h-72 rounded-xl overflow-hidden shadow-2xl border-4 transition-all duration-500
              ${isHandDetected ? "border-green-500 shadow-green-500/50 animate-pulse" : "border-indigo-500"}`}>
              <video ref={videoRef} className="absolute w-full h-full object-cover" autoPlay muted playsInline />
              <canvas ref={canvasRef} className="absolute w-full h-full" />
            </div>

            <div className="w-40 h-40 mt-4">
              <CircularProgressbar
                value={progress}
                text={`${Math.round(progress)}%`}
                styles={buildStyles({
                  textColor: "white",
                  pathColor: "#6366f1",
                  trailColor: "#374151",
                  textSize: "16px",
                })}
              />
            </div>
          </div>

          {/* Sección 3: Selector de letras */}
          <div className="flex flex-col items-center gap-4 flex-1 min-w-[300px]">
            <h3 className="text-xl font-semibold text-indigo-300">Seleccionar letra</h3>
            <p className="text-gray-400 text-sm text-center mb-2">Cambia la letra que deseas entrenar.</p>
            <div className="grid grid-cols-4 gap-3 w-full justify-center">
              {ALPHABET.map((l) => (
                <button
                  key={l}
                  onClick={() => handleChangeLetter(l)}
                  className={`w-12 h-12 rounded-full font-bold transition-all duration-200
                    ${l === letter
                      ? "bg-indigo-600 text-white shadow-md scale-110"
                      : "bg-gray-700 text-gray-300 hover:bg-indigo-500 hover:scale-105"
                    }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Botones de acción */}
        <div className="flex gap-4 justify-center flex-wrap mt-8">
          <button
            onClick={handleTrain}
            disabled={!isHandDetected || sampleCount >= maxSamples}
            className={`px-6 py-2 rounded-full font-bold transition-all duration-200 ${
              !isHandDetected || sampleCount >= maxSamples
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            Entrenar
          </button>

          <button
            onClick={handlePredict}
            className="px-6 py-2 rounded-full bg-yellow-500 hover:bg-yellow-600 font-bold text-gray-900 transition-all duration-200"
          >
            Predecir
          </button>

          <button
            onClick={handleClear}
            className="px-6 py-2 rounded-full bg-red-500 hover:bg-red-600 font-bold transition-all duration-200"
          >
            Limpiar
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-full bg-green-600 hover:bg-green-700 font-bold transition-all duration-200"
          >
            Guardar
          </button>

          <button
            onClick={handleBack}
            className="px-6 py-2 rounded-full bg-gray-600 hover:bg-gray-700 font-bold transition-all duration-200"
          >
            Regresar
          </button>
        </div>

        {/* Barra de progreso horizontal */}
        <div className="w-full max-w-[700px] h-6 bg-gray-700 rounded-full overflow-hidden mt-6">
          <div className="h-full bg-indigo-400 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-gray-300 font-semibold mt-1">{sampleCount} / {maxSamples} muestras</p>

        {/* Información opcional */}
        {handData && (
          <p className="mt-2 text-sm text-gray-400">
            Última actualización: {new Date(handData.timestamp).toLocaleTimeString()}
          </p>
        )}
      </div>
    </h2>
  );
}
