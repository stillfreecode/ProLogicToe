import React from 'react';
import MiniBoard from './MiniBoard.jsx';

// Componente recursivo para el Árbol
function TreeNode({ node }) {
  if (!node) return null;

  // 2. Extrae los nuevos datos
  const { board, score, children, is_terminal, is_maximizing_turn } = node;

  // 3. Define los colores
  const borderColor = is_maximizing_turn ? "border-yellow-400" : "border-blue-500";
  
  // Colores de score
  let scoreColor = "text-slate-400";
  if (score === 1) scoreColor = "text-green-500 font-bold";
  if (score === -1) scoreColor = "text-pink-500 font-bold";
  if (score === 0) scoreColor = "text-yellow-500 font-bold";

  return (
    // 4. Usa 'pl-4' y 'border-l' (con color) para la jerarquía
    <div className={`pl-4 border-l-2 ${borderColor} transition-colors duration-300`}>
      
      {/* 5. Renderizar este Nodo */}
      <div className="flex items-center space-x-3 p-2">
        
        {/* El Mini Tablero */}
        <MiniBoard board={board} />
        
        {/* El Score y Estado */}
        <div className="flex flex-col">
          <span className={`text-lg px-2 py-0.5 rounded ${scoreColor}`}>
            Score: {score}
          </span>
          <span className="text-slate-300 text-xs mt-1">
            {is_terminal ? "(Terminal)" : `(${children.length} hijos)`}
          </span>
          <span className={`text-xs font-bold ${is_maximizing_turn ? 'text-yellow-400' : 'text-blue-500'}`}>
            {is_maximizing_turn ? 'Turno: MAX' : 'Turno: MIN'}
          </span>
        </div>
      </div>

      {/* 6. Renderizar Hijos (Recursión) */}
      <div className="mt-2 space-y-2">
        {children && children.map((childNode, index) => (
          <TreeNode key={index} node={childNode} />
        ))}
      </div>
    </div>
  );
}

// Componente Principal del Panel 
export default function MinimaxTree({ node }) {
  return (
    <div className="text-white h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-green-400">
        Árbol de Decisión (Minimax)
      </h2>
      <p className="text-sm text-slate-400 mb-4">
        Visualización de las jugadas que la IA (X) está evaluando.
        (Profundidad limitada a 3 niveles).
      </p>
      
      {/* Inicia la recursión con el nodo raíz */}
      {node ? 
        <TreeNode node={node} /> : 
        <p className="text-slate-500 animate-pulse">Calculando árbol...</p>
      }
    </div>
  );
}