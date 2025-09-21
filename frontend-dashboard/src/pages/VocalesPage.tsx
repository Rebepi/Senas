import React, { useState } from "react";

// =============================================================================
// Reusable Message Display Component
// =============================================================================
const MessageDisplay = ({ message }: { message: string | null }) => {
  if (!message) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <div className="p-6 bg-white rounded-xl shadow-2xl text-center">
        <p className="text-gray-800 font-semibold">{message}</p>
      </div>
    </div>
  );
};

// =============================================================================
// Reusable AppCard Component
// =============================================================================
interface AppCardProps {
  title: string;
  description: string;
  symbol: string;
  image?: string;
  onStartLearning?: () => void;
}

const AppCard = ({
  title,
  description,
  symbol,
  image,
  onStartLearning,
}: AppCardProps) => {
  return (
    <div
      className="bg-slate-800 rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl cursor-pointer"
      onClick={onStartLearning}
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-5 flex justify-between items-center border-b border-slate-700">
        <div className="text-lg font-bold">{title}</div>
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
          {symbol}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 text-slate-300">
        <div className="mb-4 flex justify-center">
          <div className="w-40 h-40 bg-slate-900 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-600">
            {image ? (
              <img
                src={image}
                alt={title}
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/600x400/2f2f2f/ffffff?text=${symbol}`;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl font-extrabold text-purple-400">
                {symbol}
              </div>
            )}
          </div>
        </div>

        <p className="text-base font-light border-l-4 border-purple-500 pl-3 py-1">
          {description}
        </p>
      </div>
    </div>
  );
};

// =============================================================================
// Learning Detail View Component
// =============================================================================
interface LearningDetailViewProps {
  vocal: {
    title: string;
    symbol: string;
    description: string;
    image?: string;
  };
  onBack: () => void;
}

const LearningDetailView = ({ vocal, onBack }: LearningDetailViewProps) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectedVocal, setDetectedVocal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCameraToggle = () => {
    setIsCameraActive(!isCameraActive);
    setDetectedVocal(null);
    if (!isCameraActive) {
      setLoading(true);
      // Simulación de AI
      setTimeout(() => {
        setDetectedVocal(vocal.symbol);
        setLoading(false);
      }, 3000);
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-5 flex justify-between items-center">
            <div className="text-lg font-bold">Aprendiendo: {vocal?.title}</div>
            <button
              onClick={onBack}
              className="bg-purple-700 px-4 py-2 rounded-full text-white text-sm font-semibold hover:bg-purple-600 transition-colors"
            >
              ← Volver
            </button>
          </div>

          <div className="p-8 bg-slate-900 text-slate-200">
            <h3 className="text-2xl font-bold mb-6 text-center text-purple-400">
              Detección en Tiempo Real
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Cámara */}
              <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg">
                <div className="relative h-64 bg-slate-900 flex items-center justify-center">
                  {isCameraActive ? (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 border-4 border-dashed border-purple-500 rounded-full animate-spin"></div>
                      <p className="mt-4 text-sm text-slate-400">Cámara activa</p>
                      <p className="text-sm text-slate-500">
                        Buscando "{vocal.symbol}"...
                      </p>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <div className="text-4xl mb-2">📷</div>
                      <p className="text-sm">Cámara desactivada</p>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-800">
                  <button
                    onClick={handleCameraToggle}
                    className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-colors ${
                      isCameraActive
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    {isCameraActive ? "Desactivar Cámara" : "Activar Cámara"}
                  </button>
                </div>
              </div>

              {/* Resultado */}
              <div className="bg-slate-800 rounded-xl p-6 flex flex-col justify-center shadow-lg">
                <h4 className="text-xl font-bold mb-4 text-purple-400 text-center">
                  Vocal Detectada:
                </h4>
                <div className="h-32 bg-slate-900 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-600 mb-4">
                  {detectedVocal ? (
                    <span className="text-6xl font-extrabold text-green-500">
                      {detectedVocal}
                    </span>
                  ) : (
                    <span className="text-slate-600 text-sm">
                      {loading ? "Detectando..." : "Active la cámara para iniciar"}
                    </span>
                  )}
                </div>
                {detectedVocal && (
                  <p className="text-center text-sm text-green-400 font-medium">
                    ¡Vocal detectada con éxito!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// Main Component (solo Vocales)
// =============================================================================
const VocalesApp = () => {
  const [learningMode, setLearningMode] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const VOCALES = [
    {
      title: "Vocal A",
      symbol: "A",
      description: "Mano empuñada, pulgar a un lado.",
      image: "/assets/abecedario/A.jpg",
    },
    {
      title: "Vocal E",
      symbol: "E",
      description: "Mano empuñada con el pulgar encima de los dedos.",
      image: "/assets/abecedario/E.jpg",
    },
    {
      title: "Vocal I",
      symbol: "I",
      description: "Mano empuñada, meñique extendido hacia arriba.",
      image: "/assets/abecedario/I.jpg",
    },
    {
      title: "Vocal O",
      symbol: "O",
      description: "Mano en forma circular con todos los dedos unidos.",
      image: "/assets/abecedario/O.jpg",
    },
    {
      title: "Vocal U",
      symbol: "U",
      description: "Mano empuñada, dedos índice y medio extendidos.",
      image: "/assets/abecedario/U.jpg",
    },
  ];

  const handleStartLearning = (symbol: string) => {
    setLearningMode(symbol);
  };

  const handleBack = () => {
    setLearningMode(null);
  };

  const handleAceptarReto = () => {
    setMessage("Reto aceptado. ¡Mucha suerte!");
    setTimeout(() => setMessage(null), 3000);
  };

  if (learningMode) {
    const currentVocal = VOCALES.find((v) => v.symbol === learningMode);
    if (!currentVocal) {
      handleBack();
      return null;
    }
    return <LearningDetailView vocal={currentVocal} onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8 flex flex-col items-center font-sans text-white">
      <MessageDisplay message={message} />
      <div className="w-full max-w-6xl mx-auto">
        <header className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-3xl shadow-xl p-8 md:p-12 mb-8 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            BIENVENIDO A SIGNSPEAK ALL
          </h1>
          <p className="text-lg md:text-xl font-light mt-2 opacity-90">
            Aprende las vocales en Lengua de Señas
          </p>
        </header>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {VOCALES.map((vocal) => (
            <AppCard
              key={vocal.symbol}
              title={vocal.title}
              description={vocal.description}
              symbol={vocal.symbol}
              image={vocal.image}
              onStartLearning={() => handleStartLearning(vocal.symbol)}
            />
          ))}
        </div>

        {/* Reto */}
        <div className="mt-8 bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-xl flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-3/4">
            <h3 className="font-semibold text-xl text-yellow-300 mb-2">
              Reto del Día
            </h3>
            <p className="text-slate-400 mb-4 md:mb-0">
              Hoy: Aprende la seña para tu nombre.
            </p>
          </div>
          <button
            onClick={handleAceptarReto}
            className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold py-3 px-6 rounded-full transition-colors w-full md:w-auto"
          >
            Aceptar Reto
          </button>
        </div>
      </div>
    </div>
  );
};

export default VocalesApp;
