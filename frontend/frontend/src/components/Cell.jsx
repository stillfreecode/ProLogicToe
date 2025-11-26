import React from 'react';

export default function Cell({ value, onClick }) {
  
    const styleX = "text-green-500"; 
    const styleO = "text-pink-500"; 
    
    const valueStyle = value === 'x' ? styleX : (value === 'o' ? styleO : '');

    return (
        <button 
            className={`
                flex items-center justify-center
                w-full aspect-square 
                bg-slate-800 
                rounded-lg 
                font-extrabold 
                text-5xl md:text-6xl
                cursor-pointer 
                transition-colors duration-150 ease-in-out
                hover:bg-slate-700
                focus:outline-none focus:ring-2 focus:ring-green-500
                ${valueStyle}
            `}
            onClick={onClick}
            aria-label={`Casilla ${value === 'v' ? 'vacía' : value}`}
        >
            {/* Mantenemos 'v' como vacío para la lógica */}
            {value !== 'v' ? value : ''}
        </button>
    );
}