import React, { useState } from 'react';

// --- Sub-componente: "Sobre este Proyecto" ---
const AboutContent = () => (
  <>
    <h2 className="text-2xl font-bold mb-4 text-green-400">
      Sobre este Proyecto
    </h2>
    <div className="space-y-4 text-slate-300">
      <div>
        <h3 className="text-lg font-semibold text-blue-400">Función de la App</h3>
        <p className="text-sm mt-1">
          Esta es una demostración educativa de una IA imbatible para Tic Tac
          Toe. El objetivo es mostrar cómo un algoritmo clásico puede
          "resolver" un juego por completo.
        </p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-blue-400">¿Cómo Funciona?</h3>
        <p className="text-sm mt-1">
          El frontend (React/Astro) envía el tablero al backend (Python). El
          backend decide la jugada óptima y la devuelve para actualizar la UI.
        </p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-blue-400">
          Motor Lógico: Prolog
        </h3>
        <p className="text-sm mt-1">
          Las reglas (<code>ganador(X)</code>, <code>empate</code>, <code>movimiento_valido</code>)
          están definidas en Prolog. Python consulta este motor para
          evaluar los estados del juego.
        </p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-blue-400">
          IA: Python + Minimax
        </h3>
        <p className="text-sm mt-1">
          El "cerebro" es un algoritmo Minimax en Python. Explora
          recursivamente el árbol de jugadas (con Poda Alfa-Beta) para
          encontrar el movimiento que garantiza la victoria o el empate.
        </p>
      </div>
    </div>
    <hr className="my-6 border-slate-700" />
    <div className="text-sm text-slate-400 space-y-1">
      <p>
        <span className="font-semibold text-slate-300">Autor:</span> @Angel Cordoba
      </p>
      <p>
        <span className="font-semibold text-slate-300">Curso:</span> @Inteligencia Artificial
      </p>
      <p><span className="font-semibold text-slate-300">Grupo:</span> @8s1</p>
    </div>
  </>
);

// --- Sub-componente: "Reglas del Juego" ---
const RulesContent = () => (
  <>
    <h2 className="text-2xl font-bold mb-4 text-green-400">
      Reglas de Produccion
    </h2>
    <div className="space-y-3 text-slate-300 text-sm">
      <p><strong>1. Tablero:</strong> El juego usa una cuadrícula de 3x3.</p>
      <p><strong>2. Jugadores:</strong> Compiten dos jugadores, uno con "X" y el otro con "O".</p>
      <p><strong>3. Objetivo:</strong> Alinear tres de tus símbolos en fila (horizontal, vertical o diagonal).</p>
      <p><strong>4. Turnos:</strong> Los jugadores colocan un símbolo por turno."X" comienza primero.</p>
      <p><strong>5. Ganar:</strong> El primer jugador en conseguir tres en raya, gana.</p>
      <p><strong>6. Empate:</strong> Si todas las casillas se ocupan y nadie gana, es un empate.</p>
    </div>
  </>
);

// --- Componente Principal del Panel ---
export default function InfoPanel() {
  // Estado para controlar la pestaña activa ('about' o 'rules')
  const [view, setView] = useState('about');

  // Clases de Tailwind para las pestañas
  const activeTabClass = "border-b-2 border-green-400 text-white font-semibold";
  const inactiveTabClass = "text-slate-400 hover:text-slate-200 border-b-2 border-transparent";

  return (
    <div className="w-full h-full p-6 md:p-8">
      {/* Pestañas de Navegación */}
      <div className="flex mb-6 border-b border-slate-700">
        <button
          onClick={() => setView('about')}
          className={`pb-2 px-4 text-sm transition-colors ${view === 'about' ? activeTabClass : inactiveTabClass}`}
        >
          Sobre este Proyecto
        </button>
        <button
          onClick={() => setView('rules')}
          className={`pb-2 px-4 text-sm transition-colors ${view === 'rules' ? activeTabClass : inactiveTabClass}`}
        >
          Reglas del Juego
        </button>
      </div>

      {/* Contenido Dinámico */}
      <div>
        {view === 'about' ? <AboutContent /> : <RulesContent />}
      </div>
    </div>
  );
}