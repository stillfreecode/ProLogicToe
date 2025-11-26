import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from contextlib import asynccontextmanager

# ----------------------------------------------------------------------
# 1. IMPORTAR *FUNCIONES* DE LA IA
# ----------------------------------------------------------------------
from ai.minimax import (
    find_best_move,
    init_prolog,
    get_game_status,
    build_explanation_tree
)

# ----------------------------------------------------------------------
# 2. EVENTO LIFESPAN
# ----------------------------------------------------------------------
@asynccontextmanager
async def app_lifespan(app: FastAPI):
    """Maneja el evento de inicio de FastAPI."""
    print("INFO:     Iniciando aplicación... Llamando a init_prolog().")
    init_prolog()
    print("INFO:     Llamada a init_prolog() completada.")
    yield
    print("INFO:     Aplicación apagándose.")

# ----------------------------------------------------------------------
# 3. INICIALIZACIÓN DE LA APP Y CORS
# ----------------------------------------------------------------------
app = FastAPI(lifespan=app_lifespan) 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------------------------
# 4. DEFINICIÓN DE MODELOS DE DATOS
# ----------------------------------------------------------------------
class GameState(BaseModel):
    board: List[str]

class ResponseState(BaseModel):
    new_board: List[str]
    status: str

# ----------------------------------------------------------------------
# 5. ENDPOINTS DE LA API
# ----------------------------------------------------------------------
@app.get("/")
def read_root():
    return {"message": "Servidor de IA para Tic Tac Toe funcionando."}


@app.post("/api/move", response_model=ResponseState)
def make_ai_move(game_state: GameState):
    """
    Endpoint principal del juego.
    """
    current_board = game_state.board
    print(f"Tablero recibido (jugada humana): {current_board}")

    # Esta función ahora es la 'get_game_status' importada
    human_move_status = get_game_status(current_board)
    
    if human_move_status != "en_juego":
        print(f"-> Estado: {human_move_status}. No se llama a la IA.")
        return {"new_board": current_board, "status": human_move_status}

    print("-> Estado: En juego. Calculando movimiento de la IA...")
    ai_board_state = find_best_move(current_board)
    print(f"Movimiento IA calculado: {ai_board_state}")

    # Esta función también es la 'get_game_status' importada
    ai_move_status = get_game_status(ai_board_state)
    print(f"-> Estado final: {ai_move_status}")
    
    return {"new_board": ai_board_state, "status": ai_move_status}

@app.post("/api/explain")
def get_explanation(game_state: GameState):
    """
    Devuelve el árbol de decisión de Minimax para propósitos educativos.
    Recibe el tablero ANTES del movimiento de la IA.
    """
    print(f"-> Petición de explicación recibida para: {game_state.board}")
    
    # Construimos el árbol iniciando con el turno de la IA (True)
    tree = build_explanation_tree(
        game_state.board, 
        is_maximizing_turn=True, 
        alpha=-float('inf'), 
        beta=float('inf'), 
        current_depth=0,
        max_depth=3 # Límite para no sobrecargar (puedes ajustarlo)
    )
    return tree

# ----------------------------------------------------------------------
# 6. PUNTO DE ENTRADA PARA EJECUTAR EL SERVIDOR
# ----------------------------------------------------------------------
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)