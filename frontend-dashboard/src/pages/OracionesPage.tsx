import { useState } from 'react';

const PracticeSection = () => {
  const [currentMode, setCurrentMode] = useState('vocales');
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const practiceModes = [
    { id: 'vocales', label: 'Práctica de Vocales', icon: '🎵' },
    { id: 'consonantes', label: 'Práctica de Consonantes', icon: '🔤' },
    { id: 'numeros', label: 'Práctica de Números', icon: '🔢' },
    { id: 'palabras', label: 'Práctica de Palabras', icon: '💬' },
  ];

  const startPractice = (mode: string) => {
    alert(`Iniciando práctica de: ${mode}`);
    // Aquí iría la lógica para iniciar la práctica
  };

  return (
    <div className="p-6">
      <header className="bg-gradient-to-r from-purple-500 to-purple-700 text-white text-center p-6 rounded-xl shadow-lg mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-3">PRÁCTICA</h1>
        <h2 className="text-lg md:text-xl font-medium">Mejora tus habilidades</h2>
      </header>

      {/* Estadísticas de práctica */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Tu Progreso</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-blue-800">Puntuación</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{totalQuestions}</div>
            <div className="text-sm text-green-800">Intentos</div>
          </div>
        </div>
      </div>

      {/* Modos de práctica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {practiceModes.map((mode) => (
          <div key={mode.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:translate-y-[-5px]">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-5 flex items-center">
              <span className="text-2xl mr-3">{mode.icon}</span>
              <h3 className="text-lg font-semibold">{mode.label}</h3>
            </div>
            
            <div className="p-5">
              <p className="text-gray-600 mb-4">
                Practica y mejora tu conocimiento en {mode.label.toLowerCase()}.
              </p>
              
              <button
                onClick={() => startPractice(mode.id)}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
              >
                Iniciar Práctica
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Retos rápidos */}
      <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
        <h3 className="font-semibold text-yellow-800 mb-3">Reto del Día</h3>
        <p className="text-yellow-700 mb-4">
          Hoy: Aprende 5 señas nuevas y practícalas durante 10 minutos.
        </p>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg">
          Aceptar Reto
        </button>
      </div>
    </div>
  );
};

export default PracticeSection;