// src/pages/EntrenamientoPage.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VOCALES = ["A", "E", "I", "O", "U"];
const MAX_SAMPLES = 50;

export default function EntrenamientoPage() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const [currentLetter, setCurrentLetter] = useState(letter?.toUpperCase() || "A");
  const [sampleCount, setSampleCount] = useState(0);

  const progress = Math.min(sampleCount / MAX_SAMPLES, 1) * 100;

  return (
    <div className="p-6 w-full min-h-screen flex flex-col items-center text-white">
      {/* Título */}
      <h2 className="text-4xl font-bold mb-6 text-indigo-400 text-center">
        Entrenamiento de Mano: "{currentLetter}" ✋
      </h2>
      <p className="text-gray-300 mb-6 text-center max-w-[700px]">
        Aprende a entrenar cada vocal con tu mano. Observa la referencia y utiliza los botones de acción.
      </p>

      {/* Contenedor principal */}
      <div className="flex gap-8 w-full max-w-[1200px] justify-center items-start flex-wrap">
        
        {/* Imagen de referencia */}
        <Section title="Referencia" description="Observa cómo debe posicionarse la mano.">
          <div className="w-full h-72 border-4 border-indigo-500 rounded-xl overflow-hidden shadow-lg flex items-center justify-center bg-gray-800">
            <img
              src={`/assets/abecedario/${currentLetter}.jpg`}
              alt={`Referencia letra ${currentLetter}`}
              className="w-full h-full object-contain"
            />
          </div>
        </Section>

        {/* Cámara */}
        <Section title="Cámara / Entrenamiento" description="Aquí aparecerá la cámara en tiempo real.">
          <div className="relative w-full h-72 rounded-xl overflow-hidden shadow-2xl border-4 border-indigo-500 bg-gray-900 flex items-center justify-center">
            <span className="text-gray-500">📹 Cámara aquí</span>
          </div>
          <div className="w-40 h-40 mt-4 flex items-center justify-center rounded-full border-8 border-indigo-600">
            <span className="text-2xl font-bold">{Math.round(progress)}%</span>
          </div>
        </Section>

        {/* Selector de vocales */}
        <Section title="Seleccionar vocal" description="Cambia la vocal que deseas entrenar.">
          <div className="grid grid-cols-5 gap-3 w-full justify-center">
            {VOCALES.map((v) => (
              <button
                key={v}
                onClick={() => setCurrentLetter(v)}
                className={`w-12 h-12 rounded-full font-bold transition-all duration-200 ${
                  v === currentLetter
                    ? "bg-indigo-600 text-white shadow-md scale-110"
                    : "bg-gray-700 text-gray-300 hover:bg-indigo-500 hover:scale-105"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </Section>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-4 justify-center flex-wrap mt-8">
        <ActionButton color="indigo" label="Entrenar" />
        <ActionButton color="yellow" label="Predecir" textDark />
        <ActionButton color="red" label="Limpiar" />
        <ActionButton color="green" label="Guardar" />
        <ActionButton
          color="gray"
          label="Regresar"
          onClick={() => navigate("/vocales")}
        />
      </div>

      {/* Barra de progreso horizontal */}
      <div className="w-full max-w-[700px] h-6 bg-gray-700 rounded-full overflow-hidden mt-6">
        <div
          className="h-full bg-indigo-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-gray-300 font-semibold mt-1">
        {sampleCount} / {MAX_SAMPLES} muestras
      </p>
    </div>
  );
}

/* 🔹 Componente genérico para secciones */
function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 flex-1 min-w-[300px]">
      <h3 className="text-xl font-semibold text-indigo-300">{title}</h3>
      <p className="text-gray-400 text-sm text-center mb-2">{description}</p>
      {children}
    </div>
  );
}

/* 🔹 Botón reutilizable */
function ActionButton({
  color,
  label,
  textDark,
  onClick,
}: {
  color: string;
  label: string;
  textDark?: boolean;
  onClick?: () => void;
}) {
  const base = `px-6 py-2 rounded-full font-bold transition-all duration-200`;
  const bg = `bg-${color}-600 hover:bg-${color}-700`;
  const text = textDark ? "text-gray-900" : "text-white";

  return (
    <button onClick={onClick} className={`${base} ${bg} ${text}`}>
      {label}
    </button>
  );
}
