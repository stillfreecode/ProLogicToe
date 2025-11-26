import React from 'react';
import Cell from './Cell';

export default function Board({ board, onCellClick }) {
    return (
        <div 
            className="
                grid grid-cols-3 gap-2 md:gap-3 
                w-full 
                aspect-square 
                bg-slate-700 
                rounded-xl 
                shadow-lg 
                p-2 md:p-3
            "
        >
            {board.map((value, index) => (
                <Cell 
                    key={index} 
                    value={value} 
                    onClick={() => onCellClick(index)} 
                />
            ))}
        </div>
    );
}