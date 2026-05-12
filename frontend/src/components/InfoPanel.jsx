import React, { useState } from 'react';

const AboutContent = () => (
  <>
    <h2 className="text-2xl font-bold mb-4 text-green-400">
      Inteligencia Aritficial aplicada en Juegos de Suma Cero
    </h2>
    <div className="space-y-4 text-slate-300">
      <div>
        <h3 className="text-lg font-semibold text-blue-400">Algoritmo Minimax</h3>
        <p className="text-sm mt-1">
          Esta aplicación implementa Minimax, un método de decisión recursivo utilizado en teoría de juegos. El algoritmo busca el movimiento que maximiza la ganancia mínima esperada, asumiendo que el adversario ejecuta una estrategia óptima.
        </p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-blue-400">Exploración del Espacio de Estados</h3>
        <p className="text-sm mt-1">
          El sistema genera un árbol de juego que representa todas las secuencias de movimientos posibles hasta alcanzar un estado terminal (victoria, derrota o empate). Este análisis permite determinar el valor de cada nodo basándose en resultados finales.
        </p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-blue-400">
          Función de Evaluación
        </h3>
        <p className="text-sm mt-1">
          Se asigna un valor numérico a los estados finales: +1 para la victoria de la IA, -1 para la derrota y 0 para el empate. El algoritmo propaga estos valores hacia arriba en el árbol para seleccionar la ruta con el valor máximo disponible.
        </p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-blue-400">
          Optimización: Poda Alfa-Beta
        </h3>
        <p className="text-sm mt-1">
          Para reducir la complejidad computacional, se aplica Poda Alfa-Beta. Esta técnica descarta ramas del árbol de búsqueda que no influyen en la decisión final, permitiendo procesar el espacio de estados de manera más eficiente sin alterar el resultado del algoritmo.
        </p>
      </div>
    </div>
    <hr className="my-6 border-slate-700" />
    <div className="text-sm text-slate-400 space-y-1">
      <p>
        <span className="font-semibold text-slate-300">stillfreecode</span>
      </p>
    </div>
  </>
);

const RulesContent = () => (
  <>
    <h2 className="text-2xl font-bold mb-4 text-green-400">
      Reglas de Producción
    </h2>
    <div className="space-y-3 text-slate-300 text-sm">
      <p><strong>1. Tablero:</strong> Cuadrícula estática de 3x3.</p>
      <p><strong>2. Agentes:</strong> Dos agentes identificados por los símbolos "X" y "O".</p>
      <p><strong>3. Objetivo:</strong> Alinear tres símbolos idénticos en cualquier vector (horizontal, vertical o diagonal).</p>
      <p><strong>4. Secuencia:</strong> Turnos alternados de un solo movimiento por turno.</p>
      <p><strong>5. Estado Final:</strong> El sistema se detiene al detectar una alineación de tres símbolos o al completar todas las celdas (empate).</p>
    </div>
  </>
);

export default function InfoPanel() {
  const [view, setView] = useState('about');

  const activeTabClass = "border-b-2 border-green-400 text-white font-semibold";
  const inactiveTabClass = "text-slate-400 hover:text-slate-200 border-b-2 border-transparent";

  return (
    <div className="w-full h-full p-6 md:p-8">
      <div className="flex mb-6 border-b border-slate-700">
        <button
          onClick={() => setView('about')}
          className={`pb-2 px-4 text-sm transition-colors ${view === 'about' ? activeTabClass : inactiveTabClass}`}
        >
          Análisis del Algoritmo
        </button>
        <button
          onClick={() => setView('rules')}
          className={`pb-2 px-4 text-sm transition-colors ${view === 'rules' ? activeTabClass : inactiveTabClass}`}
        >
          Lógica del Juego
        </button>
      </div>

      <div>
        {view === 'about' ? <AboutContent /> : <RulesContent />}
      </div>
    </div>
  );
}
