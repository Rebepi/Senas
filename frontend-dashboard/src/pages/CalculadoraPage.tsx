import { useState } from 'react';

const NumbersSection = () => {
    const [selectedOperation, setSelectedOperation] = useState<string | null>(null);
    const [currentNumber, setCurrentNumber] = useState<number | null>(null);
    const [result, setResult] = useState<number | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);

    const operations = [
        { id: 'suma', symbol: '➕', label: 'Suma' },
        { id: 'resta', symbol: '➖', label: 'Resta' },
        { id: 'multiplicacion', symbol: '✖️', label: 'Multiplicación' },
        { id: 'division', symbol: '➗', label: 'División' },
    ];

    // Simulación de reconocimiento de números (en una app real, esto vendría de la IA)
    const simulateNumberRecognition = () => {
        const randomNumber = Math.floor(Math.random() * 10);
        setCurrentNumber(randomNumber);
        
        // Simular cálculo después de un delay
        setTimeout(() => {
            if (selectedOperation && currentNumber !== null) {
                const calculatedResult = calculateResult(randomNumber);
                setResult(calculatedResult);
            }
        }, 1000);
    };

    const calculateResult = (newNumber: number): number => {
        // Esta es una simulación - en una app real, se acumularían los números
        switch (selectedOperation) {
            case 'suma': return newNumber + 5;
            case 'resta': return newNumber - 2;
            case 'multiplicacion': return newNumber * 3;
            case 'division': return parseFloat((newNumber / 1.5).toFixed(2));
            default: return newNumber;
        }
    };

    const handleOperationSelect = (operationId: string) => {
        setSelectedOperation(operationId);
        setResult(null);
        setCurrentNumber(null);
        
        if (isCameraActive) {
            simulateNumberRecognition();
        }
    };

    const toggleCamera = () => {
        setIsCameraActive(!isCameraActive);
        setCurrentNumber(null);
        setResult(null);
    };

    const handleReset = () => {
        setCurrentNumber(null);
        setResult(null);
    };

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white">
            <h2 className="text-2xl font-bold text-center mb-8 text-blue-400">Operaciones con Números</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                {/* Columna izquierda: Video y controles */}
                <div className="space-y-6">
                    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                        <div id="camera-container" className="h-64 bg-black flex items-center justify-center relative">
                            {isCameraActive ? (
                                <>
                                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                        <div className="text-white text-center">
                                            <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto mb-3"></div>
                                            <p>Video en vivo activo</p>
                                            <p className="text-sm text-gray-400">Simulando reconocimiento...</p>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 bg-red-500 rounded-full w-3 h-3 animate-pulse"></div>
                                </>
                            ) : (
                                <div className="text-white text-center p-6">
                                    <div className="text-4xl mb-3">📷</div>
                                    <p>Cámara desactivada</p>
                                    <p className="text-sm text-gray-400">Haz clic en "Activar Cámara" para comenzar</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="p-4 bg-gray-900">
                            <button
                                onClick={toggleCamera}
                                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                                    isCameraActive
                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }`}
                            >
                                {isCameraActive ? 'Desactivar Cámara' : 'Activar Cámara'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-lg">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Selecciona una operación:</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {operations.map((op) => (
                                <button
                                    key={op.id}
                                    onClick={() => handleOperationSelect(op.id)}
                                    className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${
                                        selectedOperation === op.id
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                                    }`}
                                >
                                    <span className="text-2xl mb-1">{op.symbol}</span>
                                    <span className="text-sm font-medium text-gray-800">{op.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Columna derecha: Display y resultado */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Número reconocido:</h3>
                        <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                            {currentNumber !== null ? (
                                <span className="text-6xl font-bold text-blue-600">{currentNumber}</span>
                            ) : (
                                <span className="text-gray-400 text-lg">Esperando reconocimiento...</span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 mt-3 text-center">
                            La IA detectará números en tiempo real
                        </p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl p-6 shadow-lg">
                        <h3 className="text-lg font-semibold mb-4 text-white">Resultado:</h3>
                        <div className="h-32 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                            {result !== null ? (
                                <span className="text-6xl font-bold text-white">{result}</span>
                            ) : (
                                <span className="text-white text-opacity-70 text-lg">
                                    {selectedOperation 
                                        ? 'Realizando operación...' 
                                        : 'Selecciona una operación primero'
                                    }
                                </span>
                            )}
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                            <span className="text-white text-sm">
                                {selectedOperation && `Operación: ${operations.find(op => op.id === selectedOperation)?.label}`}
                            </span>
                            <button 
                                onClick={handleReset}
                                className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-blue-50"
                            >
                                Reiniciar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-blue-50 rounded-xl p-5 border border-blue-200 max-w-7xl mx-auto">
                <h3 className="font-semibold text-blue-800 mb-2">Cómo funciona:</h3>
                <ul className="text-blue-700 text-sm list-disc list-inside space-y-1">
                    <li>Activa la cámara para comenzar el reconocimiento</li>
                    <li>Selecciona la operación matemática que deseas realizar</li>
                    <li>La IA detectará números mostrados con señas</li>
                    <li>El resultado se calculará automáticamente</li>
                </ul>
            </div>
        </div>
    );
};

export default NumbersSection;
