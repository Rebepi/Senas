import React, { useState } from 'react';

// =============================================================================
// Componente de tarjeta reutilizable
// =============================================================================
interface AppCardProps {
  title: string;
  description: string;
  symbol: string;
  image?: string;
  onStartLearning?: () => void;
}

const AppCard = ({ title, description, symbol, image, onStartLearning }: AppCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:translate-y-[-5px] hover:shadow-2xl cursor-pointer" onClick={onStartLearning}>
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-5 flex justify-between items-center">
        <div className="text-lg font-semibold">{title}</div>
        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-lg font-bold">
          {symbol}
        </div>
      </div>
      
      <div className="p-5">
        <div className="mb-4 flex justify-center">
          <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            {image ? (
              <img 
                src={image} 
                alt={title} 
                className="w-full h-full object-contain rounded-lg"
              />
            ) : null}
            <div className={`w-full h-full flex items-center justify-center text-4xl font-bold text-blue-600 ${image ? 'hidden' : 'flex'}`}>
              {symbol}
            </div>
          </div>
        </div>

        <p className="text-gray-700 mb-4 text-base font-medium border-l-4 border-blue-600 pl-3 py-1">
          {description}
        </p>
      </div>
    </div>
  );
};

// =============================================================================
// Componente principal de la aplicación
// =============================================================================
export default function App() {
  const [learningMode, setLearningMode] = useState<string | null>(null);

  const VOCALES = [
    {
      title: 'Vocal A',
      symbol: 'A',
      description: 'Mano empuñada, pulgar a un lado.',
      image: 'https://placehold.co/600x400/2f2f2f/ffffff?text=A',
    },
    {
      title: 'Vocal E',
      symbol: 'E',
      description: 'Mano empuñada con el pulgar por encima de los dedos.',
      image: 'https://placehold.co/600x400/2f2f2f/ffffff?text=E',
    },
    {
      title: 'Vocal I',
      symbol: 'I',
      description: 'Mano empuñada, dedo meñique extendido hacia arriba.',
      image: 'https://placehold.co/600x400/2f2f2f/ffffff?text=I',
    },
    {
      title: 'Vocal O',
      symbol: 'O',
      description: 'Mano en forma de círculo con todos los dedos unidos.',
      image: 'https://placehold.co/600x400/2f2f2f/ffffff?text=O',
    },
    {
      title: 'Vocal U',
      symbol: 'U',
      description: 'Mano empuñada, dedos índice y medio extendidos.',
      image: 'https://placehold.co/600x400/2f2f2f/ffffff?text=U',
    },
  ];

  const ABECEDARIO = {
    title: 'Abecedario Completo',
    symbol: 'ABC',
    description: 'Aprende el abecedario completo, de la A a la Z.',
    image: 'https://placehold.co/600x400/2f2f2f/ffffff?text=ABC',
  };

  const handleStartLearning = (symbol: string) => {
    setLearningMode(symbol);
  };

  const handleBack = () => {
    setLearningMode(null);
  };

  if (learningMode) {
    const currentVocal = VOCALES.find(v => v.symbol === learningMode);

    return (
      <div className="min-h-screen bg-gray-900 p-8 flex flex-col items-center">
        <div className="w-full max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-5 flex justify-between items-center">
              <div className="text-lg font-semibold">Aprendiendo: {currentVocal?.title}</div>
              <button
                onClick={handleBack}
                className="text-white hover:text-blue-200 text-sm"
              >
                ← Volver
              </button>
            </div>
            
            <div className="p-5 bg-gray-50 text-gray-800">
              <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
                Detección en Tiempo Real - {currentVocal?.symbol}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contenedor de la Cámara */}
                <div className="bg-gray-800 rounded-xl overflow-hidden">
                  <div className="relative h-64 bg-black flex items-center justify-center">
                    <div className="text-white text-center p-4">
                      <div className="text-3xl mb-2">📷</div>
                      <p className="text-sm">Cámara desactivada</p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-900">
                    <button
                      className="w-full py-2 px-3 rounded-lg text-sm font-semibold transition-all bg-blue-500 hover:bg-blue-600 text-white"
                      disabled
                    >
                      Activar Cámara
                    </button>
                  </div>
                </div>

                {/* Detección de Vocal */}
                <div className="bg-blue-50 rounded-xl p-4 flex flex-col justify-center">
                  <h4 className="text-lg font-semibold mb-3 text-blue-800 text-center">Vocal Detectada:</h4>
                  <div className="h-32 bg-white rounded-lg flex items-center justify-center border-2 border-dashed border-blue-300 mb-4">
                    <span className="text-gray-400 text-sm">
                      Active la cámara
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de tarjetas
  return (
    <div className="min-h-screen bg-gray-900 p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl mx-auto">
        <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl shadow-lg p-6 md:p-8 mb-8 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            BIENVENIDO A SIGNSPEAK ALL
          </h1>
          <p className="text-lg md:text-xl font-light mt-2 opacity-90">
            Abecedario en Lengua de Señas
          </p>
        </header>
        
        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AppCard
              key={ABECEDARIO.symbol}
              title={ABECEDARIO.title}
              description={ABECEDARIO.description}
              symbol={ABECEDARIO.symbol}
              image={ABECEDARIO.image}
            />
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
        </main>
      </div>
    </div>
  );
}
