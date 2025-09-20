import React from "react";

const letrasDisponibles: Record<string, string> = {
  A: "/assets/abecedario/A.jpg",
  B: "/assets/abecedario/B.jpg",
  C: "/assets/abecedario/C.jpg",
  D: "/assets/abecedario/D.jpg",
  E: "/assets/abecedario/E.jpg",
  F: "/assets/abecedario/F.jpg",
  G: "/assets/abecedario/G.jpg",
  H: "/assets/abecedario/H.jpg",
  I: "/assets/abecedario/I.jpg",
  J: "/assets/abecedario/J.jpg",
  K: "/assets/abecedario/K.jpg",
  L: "/assets/abecedario/L.jpg",
  M: "/assets/abecedario/M.jpg",
  N: "/assets/abecedario/N.jpg",
  Ñ: "/assets/abecedario/Ñ.jpg",
  O: "/assets/abecedario/O.jpg",
  P: "/assets/abecedario/P.jpg",
  Q: "/assets/abecedario/Q.jpg",
  R: "/assets/abecedario/R.jpg",
  S: "/assets/abecedario/S.jpg",
  T: "/assets/abecedario/T.jpg",
  U: "/assets/abecedario/U.jpg",
  V: "/assets/abecedario/V.jpg",
  W: "/assets/abecedario/W.jpg",
  X: "/assets/abecedario/X.jpg",
  Y: "/assets/abecedario/Y.jpg",
  Z: "/assets/abecedario/Z.jpg",
};

// Array de letras
const letras = [
  "A","B","C","D","E","F","G","H","I","J","K","L","M",
  "N","Ñ","O","P","Q","R","S","T","U","V","W","X","Y","Z"
] as const;

// Descripciones únicas para cada letra
const descripciones: Record<string, string> = {
  A: "Vocal A - Inicio de palabras importantes.",
  B: "Consonante B - Usada en muchas palabras básicas.",
  C: "Consonante C - Forma de semicírculo con la mano.",
  D: "Consonante D - Dedo índice apuntando hacia arriba.",
  E: "Vocal E - Mano en forma de garra cerrada.",
  F: "Consonante F - Dedos formando un círculo.",
  G: "Consonante G - Mano apuntando horizontalmente.",
  H: "Consonante H - Dos dedos extendidos juntos.",
  I: "Vocal I - Dedo meñique levantado.",
  J: "Consonante J - Dibuja la letra con el dedo.",
  K: "Consonante K - Dedo índice y medio levantados.",
  L: "Consonante L - Forma de L con pulgar e índice.",
  M: "Consonante M - Tres dedos sobre el pulgar.",
  N: "Consonante N - Dos dedos sobre el pulgar.",
  Ñ: "Consonante Ñ - Similar a N, con movimiento ondulado.",
  O: "Vocal O - Mano en forma de O perfecta.",
  P: "Consonante P - Mano apuntando hacia abajo.",
  Q: "Consonante Q - Mano apuntando hacia abajo con pulgar y índice.",
  R: "Consonante R - Dedos índice y medio cruzados.",
  S: "Consonante S - Puño cerrado con el pulgar delante.",
  T: "Consonante T - Pulgar entre índice y medio.",
  U: "Vocal U - Dos dedos juntos apuntando arriba.",
  V: "Consonante V - Dos dedos formando V.",
  W: "Consonante W - Tres dedos formando W.",
  X: "Consonante X - Dedo índice doblado.",
  Y: "Consonante Y - Pulgar y meñique extendidos.",
  Z: "Consonante Z - Dibujar Z en el aire con el dedo.",
};

const abecedario = letras.map((letter) => ({
  letter,
  img: letrasDisponibles[letter],
  desc: descripciones[letter],
}));

export default function AbecedarioPage() {
  return (
    <div className="p-6 bg-slate-950 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-white text-center">
        Abecedario en Lengua de Señas
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {abecedario.map(({ letter, img, desc }) => (
          <div
            key={letter}
            className="
              bg-slate-900 border border-slate-700 rounded-xl overflow-hidden
              flex flex-col items-center transition-transform duration-300
              hover:scale-105 hover:shadow-[0_0_50px_10px_rgba(99,102,241,0.8)]
            "
          >
            <img
              src={img}
              alt={`Seña de ${letter}`}
              className="w-full h-28 sm:h-32 object-cover rounded-t-xl"
            />
            <div className="p-3 flex flex-col items-center w-full">
              <span className="text-3xl sm:text-4xl font-bold text-indigo-500">{letter}</span>
              <p className="text-xs sm:text-sm text-slate-400 text-center mt-1">{desc}</p>
              <button className="mt-3 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition">
                Comenzar Entrenamiento
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
