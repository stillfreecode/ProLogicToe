import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Board from './Board.jsx';


// --- (Constantes
const API_URL = 'http://127.0.0.1:8000/api/move';
const API_EXPLAIN_URL = 'http://127.0.0.1:8000/api/explain'; 
const PLAYER_HUMAN = 'o';
const PLAYER_AI = 'x';
const EMPTY_CELL = 'v';
const INITIAL_BOARD = Array(9).fill(EMPTY_CELL);

// --- (Iconos SVG) ---
const UserIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="w-5 h-5 inline-block mr-2 text-slate-400" 
    viewBox="0 0 20 20" 
    fill="currentColor"
  >
    <path 
      fillRule="evenodd" 
      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
      clipRule="evenodd" 
    />
  </svg>
);

const BotIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="w-5 h-5 inline-block mr-2 text-slate-400" 
    viewBox="0 0 20 20" 
    fill="currentColor"
  >
    {/* (Path del icono del Bot) */}
    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 14.95a1 1 0 10-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM3 10a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zM10 18a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zM4.343 5.757a1 1 0 011.414-1.414l.707.707a1 1 0 11-1.414 1.414l-.707-.707zM14.95 14.95a1 1 0 011.414 1.414l.707-.707a1 1 0 01-1.414-1.414l.707.707z" />
    <path d="M10 6a4 4 0 100 8 4 4 0 000-8zM8 10a2 2 0 114 0 2 2 0 01-4 0z" />
  </svg>
);


export default function GameUI() {
    // --- (Estados del Juego) ---
    const [board, setBoard] = useState(INITIAL_BOARD);
    const [isHumanTurn, setIsHumanTurn] = useState(true);
    const [gameStatus, setGameStatus] = useState('en_juego');
    const [isLoading, setIsLoading] = useState(false);
    const [scores, setScores] = useState({ human: 0, ai: 0 });
    
    // --- (Estados de Bienvenida y Vistas) ---
    const [playerName, setPlayerName] = useState("");
    const [view, setView] = useState("welcome"); // "welcome" o "game"

    // (Lógica de Handlers para el juego)
    const handleGameEnd = (status) => {
        setIsLoading(false);
        setIsHumanTurn(false);
        if (status === 'gana_humano') {
            setGameStatus('¡Ganaste!');
            setScores(s => ({ ...s, human: s.human + 1 }));
        } else if (status === 'gana_ia') {
            setGameStatus('¡La IA gana!');
            setScores(s => ({ ...s, ai: s.ai + 1 }));
        } else if (status === 'empate') {
            setGameStatus('Empate');
        } else if (status === 'error_backend_prolog') {
            setGameStatus('Error de Backend');
        }
    };

    const handleHumanMove = async (index) => {
        if (board[index] !== EMPTY_CELL || !isHumanTurn || isLoading || gameStatus !== 'en_juego') {
            return;
        }
        const newBoard = [...board];
        newBoard[index] = PLAYER_HUMAN;
        setBoard(newBoard);
        setIsHumanTurn(false);
        setIsLoading(true);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ board: newBoard }),
            });
            if (!response.ok) throw new Error(`Error de API: ${response.statusText}`);
            const data = await response.json();
            setBoard(data.new_board);
            if (data.status === 'en_juego') {
                setIsLoading(false);
                setIsHumanTurn(true);
            } else {
                handleGameEnd(data.status);
            }
        } catch (error) {
            console.error("Error al contactar la IA:", error);
            setGameStatus("Error de conexión");
        }
    };

    const handleReset = () => {
        setBoard(INITIAL_BOARD);
        setIsHumanTurn(true);
        setGameStatus('en_juego');
    };

    // --- (Handlers para la Bienvenida) ---
    const handleNameChange = (e) => {
        setPlayerName(e.target.value);
    };

    const handleStartGame = (e) => {
        e.preventDefault(); 
        if (playerName.trim()) { 
            setView("game");
        }
    };

    // --- Renderizado Condicional ---

    // VISTA 1: Pantalla de Bienvenida
    if (view === "welcome") {
        return (
            <div 
                className="
                    flex flex-col justify-center 
                    w-full max-w-xs md:max-w-sm 
                    p-6 md:p-8 
                    bg-slate-900 
                    rounded-2xl
                    shadow-2xl
                    min-h-[600px] 
                "
            >
                <h1 className="text-3xl font-bold text-white mb-3 text-center">
                    Bienvenido
                </h1>
                
                { }
                <p className="text-slate-400 mb-6 text-center text-lg">
                    Tic Tac Toe IA
                    <br />
                    <span className="text-sm">Powered by Prolog & Python Minimax</span>
                    <br />
                    <span className="text-sm">Por Angel Cordoba</span>
                </p>
                { }

                <form onSubmit={handleStartGame}>
                    <label htmlFor="playerName" className="text-sm font-medium text-slate-300">
                        Tu Nombre
                    </label>
                    <input
                        id="playerName"
                        type="text"
                        placeholder="Escribe aquí..."
                        value={playerName}
                        onChange={handleNameChange}
                        className="
                            w-full p-3 mt-2 
                            rounded-lg 
                            bg-slate-800 
                            text-white 
                            border border-slate-700
                            focus:outline-none focus:ring-2 focus:ring-green-500
                        "
                    />
                    
                    <button 
                        type="submit"
                        className="
                            w-full mt-6 
                            bg-white 
                            hover:bg-neutral-200 
                            text-slate-900 
                            font-bold py-3 
                            rounded-lg 
                            shadow-lg 
                            transition-all duration-200 ease-in-out 
                            transform hover:scale-105 
                            focus:outline-none focus:ring-2 focus:ring-green-500
                            disabled:opacity-50 disabled:hover:scale-100
                        "
                        disabled={!playerName.trim()}
                    >
                        Jugar
                    </button>
                </form>
            </div>
        );
    }

    // VISTA 2: Pantalla de Juego 
    return (
        <div 
            className="
                flex flex-col 
                w-full max-w-xs md:max-w-sm 
                p-4 md:p-6 
                bg-slate-900 
                rounded-2xl
                shadow-2xl
                min-h-[600px]
            "
        >
            {/* --- Marcador (Scoreboard) --- */}
            <div className="flex justify-between w-full mb-4">
                {/* Tarjeta de Jugador (con nombre) */}
                <div 
                    className={`
                        flex-1 p-3 rounded-lg 
                        transition-all duration-300
                        ${isHumanTurn ? 'bg-slate-700 ring-2 ring-pink-500' : 'bg-slate-800'}
                    `}
                >
                    <div className="flex items-center justify-between">
                        <span className="flex items-center text-sm font-medium text-slate-300 truncate">
                            <UserIcon /> {playerName} (O)
                        </span>
                        <span className="text-xl font-bold text-white">{scores.human}</span>
                    </div>
                </div>
                
                <div className="w-4"></div> {/* Espaciador */}
                
                {/* Tarjeta de la IA */}
                <div 
                    className={`
                        flex-1 p-3 rounded-lg 
                        transition-all duration-300
                        ${!isHumanTurn ? 'bg-slate-700 ring-2 ring-green-500' : 'bg-slate-800'}
                    `}
                >
                    <div className="flex items-center justify-between">
                        <span className="flex items-center text-sm font-medium text-slate-300">
                            <BotIcon /> Bot (X)
                        </span>
                        <span className="text-xl font-bold text-white">{scores.ai}</span>
                    </div>
                </div>
            </div>

            {/* --- Indicador de Turno --- */}
            <div className="h-10 my-2 md:my-4 text-center text-xl font-bold text-white">
                {isLoading && <p className="animate-pulse">Bot está pensando...</p>}
                {!isLoading && gameStatus === 'en_juego' && (
                    <p>{isHumanTurn ? `Tu Turno, ${playerName}` : 'Turno del Bot'}</p>
                )}
                {!isLoading && gameStatus !== 'en_juego' && (
                    <p className="text-yellow-500">{gameStatus}</p>
                )}
            </div>

            <Board board={board} onCellClick={handleHumanMove} />
            
            {/* --- Botón de Reinicio --- */}
            <button 
                className="
                    w-full mt-6 
                    bg-white 
                    hover:bg-neutral-200 
                    text-slate-900 
                    font-bold py-3 
                    rounded-lg 
                    shadow-lg 
                    transition-colors duration-150 ease-in-out 
                    focus:outline-none focus:ring-2 focus:ring-green-500
                "
                onClick={handleReset}
            >
                Reiniciar Juego
            </button>
            
            {/* --- Botón de Reglas --- */}
            <button 
                className="
                    w-full mt-3 
                    bg-slate-800 
                    hover:bg-slate-700 
                    text-slate-400 
                    font-medium py-3 
                    rounded-lg 
                    transition-colors duration-150 ease-in-out 
                    focus:outline-none focus:ring-2 focus:ring-slate-600
                    disabled:opacity-50
                "
                disabled 
            >
                Reglas del Juego
            </button>
        </div>
    );
}