import os
from pyswip import Prolog
from typing import List

# ----------------------------------------------------------------------
# 1. CONFIGURACIÓN DE PROLOG
# ----------------------------------------------------------------------
prolog = None
IA_PLAYER = 'x'
HUMAN_PLAYER = 'o'

def init_prolog():
    """Inicializa Prolog de forma segura (solo una vez)."""
    global prolog
    if prolog is None:
        try:
            prolog = Prolog()
            DIR_PATH = os.path.dirname(os.path.abspath(__file__))
            PROLOG_FILE = os.path.join(DIR_PATH, "..", "..", "prolog_engine", "rules.pl")
            PROLOG_FILE = os.path.normpath(PROLOG_FILE)
            prolog.consult(PROLOG_FILE)
            print(f"Motor lógico '{PROLOG_FILE}' cargado exitosamente.")
        except Exception as e:
            print(f"Error cargando 'rules.pl' o inicializando Prolog: {e}")

# ----------------------------------------------------------------------
# 2. HELPERS DE PROLOG
# ----------------------------------------------------------------------
def _board_to_prolog_list(board: list) -> str:
    """Convierte una lista de Python ['x', 'v'] a un string de Prolog "[x,v]"."""
    return f"[{','.join(board)}]"

def get_game_status(board_list: List[str]) -> str:
    """Consulta a Prolog para saber el estado actual del juego."""
    if prolog is None:
        print("ERROR CRÍTICO: ¡Prolog no está inicializado!")
        return "error_backend_prolog" 
    board_str = _board_to_prolog_list(board_list)
    if bool(list(prolog.query(f"ganador({board_str}, {IA_PLAYER})"))):
        return "gana_ia"
    if bool(list(prolog.query(f"ganador({board_str}, {HUMAN_PLAYER})"))):
        return "gana_humano"
    if bool(list(prolog.query(f"empate({board_str})"))):
        return "empate"
    return "en_juego"

# ----------------------------------------------------------------------
# 3. FUNCIÓN DE EVALUACIÓN (Caso Base)
# ----------------------------------------------------------------------
def evaluate_state(board_list):
    """Devuelve la puntuación de un tablero terminal."""
    board_str = _board_to_prolog_list(board_list)
    if bool(list(prolog.query(f"ganador({board_str}, {IA_PLAYER})"))):
        return 1
    if bool(list(prolog.query(f"ganador({board_str}, {HUMAN_PLAYER})"))):
        return -1
    return 0 

# ----------------------------------------------------------------------
# 4. ALGORITMO MINIMAX (Para la decisión de la IA)
# ----------------------------------------------------------------------
def minimax(board_list, is_maximizing_turn, alpha, beta, depth):
    """
    Núcleo del algoritmo Minimax con poda Alfa-Beta y logs de profundidad.
    """
    
    # Prefijo para logs (usa espacios normales)
    log_prefix = "  " * depth 
    # print(f"{log_prefix}minimax(depth={depth}, maximizing={is_maximizing_turn})")

    board_str = _board_to_prolog_list(board_list)
    if bool(list(prolog.query(f"estado_terminal({board_str})"))):
        score = evaluate_state(board_list)
        # print(f"{log_prefix}--> Caso Base. Score = {score}")
        return score

    if is_maximizing_turn:
        # Turno de MAX (IA)
        best_score = -float('inf')
        player = IA_PLAYER
        query = f"movimientos_posibles({board_str}, {player}, ListaMovimientos)"
        
        try:
            possible_moves_bindings = list(prolog.query(query))
            if possible_moves_bindings:
                next_boards = possible_moves_bindings[0]['ListaMovimientos']
                next_boards = [[str(atom) for atom in board] for board in next_boards]
            else:
                next_boards = []
        except Exception as e:
            print(f"Error en consulta Prolog (MAX): {e}")
            next_boards = []

        for next_board in next_boards:
            score = minimax(next_board, False, alpha, beta, depth + 1) 
            best_score = max(score, best_score)
            alpha = max(alpha, best_score)
            if beta <= alpha:
                # print(f"{log_prefix}--> Poda (MAX)")
                break # Poda
        
        # print(f"{log_prefix}--> Turno MAX retorna: {best_score}")
        return best_score

    else:
        # Turno de MIN (Humano)
        best_score = float('inf')
        player = HUMAN_PLAYER
        query = f"movimientos_posibles({board_str}, {player}, ListaMovimientos)"

        try:
            possible_moves_bindings = list(prolog.query(query))
            if possible_moves_bindings:
                next_boards = possible_moves_bindings[0]['ListaMovimientos']
                next_boards = [[str(atom) for atom in board] for board in next_boards]
            else:
                next_boards = []
        except Exception as e:
            print(f"Error en consulta Prolog (MIN): {e}")
            next_boards = []
        
        for next_board in next_boards:
            score = minimax(next_board, True, alpha, beta, depth + 1)
            best_score = min(score, best_score)
            beta = min(beta, best_score)
            if beta <= alpha:
                # print(f"{log_prefix}--> Poda (MIN)")
                break # Poda
        
        # print(f"{log_prefix}--> Turno MIN retorna: {best_score}")
        return best_score

# ----------------------------------------------------------------------
# 5. FUNCIÓN PRINCIPAL (Entry Point para /api/move)
# ----------------------------------------------------------------------
def find_best_move(board_list):
    """
    Encuentra el mejor movimiento (tablero resultante) para la IA.
    """
    
    print("--- 1. find_best_move: Iniciando.")
    best_score = -float('inf')
    best_move_board = None 

    board_str = _board_to_prolog_list(board_list)
    player = IA_PLAYER
    query = f"movimientos_posibles({board_str}, {player}, ListaMovimientos)"
    
    try:
        print("--- 2. find_best_move: Consultando movimientos...")
        possible_moves_bindings = list(prolog.query(query))
        print("--- 3. find_best_move: Consulta de movimientos recibida.")

        if possible_moves_bindings:
            next_boards = possible_moves_bindings[0]['ListaMovimientos']
            next_boards = [[str(atom) for atom in board] for board in next_boards]
        else:
            next_boards = []
            
        if not next_boards:
            print("--- 4. find_best_move: No hay movimientos posibles.")
            return board_list 

    except Exception as e:
        print(f"--- !!! ERROR CRÍTICO en 'movimientos_posibles': {e}")
        return board_list

    print(f"--- 5. find_best_move: Encontrados {len(next_boards)} movimientos. Entrando a bucle Minimax.")
    
    alpha = -float('inf')
    beta = float('inf')

    # Bucle principal que evalúa los movimientos RAÍZ
    for i, next_board in enumerate(next_boards):
        print(f"\n--- 6. find_best_move: Evaluando Movimiento Raíz #{i+1} -> {next_board}")
        
        score = minimax(next_board, False, alpha, beta, 1)
        
        print(f"--- 6. find_best_move: Movimiento Raíz #{i+1} obtuvo un score de: {score}")

        if score > best_score:
            print(f"--- 6. find_best_move: ¡NUEVO MEJOR! (Score: {score} > {best_score})")
            best_score = score
            best_move_board = next_board # <-- Se actualiza el tablero
        
        alpha = max(alpha, best_score)
    
    print(f"\n--- 7. find_best_move: Bucle completado. Mejor score final: {best_score}.")
    print(f"--- 7. find_best_move: Devolviendo tablero: {best_move_board}")
    return best_move_board

# ----------------------------------------------------------------------
# 6. CONSTRUCTOR DEL ÁRBOL (Entry Point para /api/explain)
# ----------------------------------------------------------------------
def build_explanation_tree(board_list, is_maximizing_turn, alpha, beta, current_depth, max_depth=3):
    """
    Función recursiva que construye un árbol de decisión JSON para
    visualizarlo en el frontend.
    """
    
    board_str = _board_to_prolog_list(board_list)
    
    # --- Caso Base: Estado Terminal o Límite de Profundidad ---
    is_terminal = bool(list(prolog.query(f"estado_terminal({board_str})")))
    
    if is_terminal or current_depth >= max_depth:
        score = evaluate_state(board_list)
        return {
            "board": board_list,
            "score": score,
            "is_terminal": is_terminal,
            "is_maximizing_turn": is_maximizing_turn, # <-- CORRECCIÓN AÑADIDA
            "children": []
        }

    # --- Caso Recursivo: Explorar Movimientos ---
    
    player = IA_PLAYER if is_maximizing_turn else HUMAN_PLAYER
    query = f"movimientos_posibles({board_str}, {player}, ListaMovimientos)"
    
    try:
        bindings = list(prolog.query(query))
        next_boards = bindings[0]['ListaMovimientos'] if bindings else []
        next_boards = [[str(atom) for atom in board] for board in next_boards]
    except Exception as e:
        print(f"Error en consulta Prolog (build_tree): {e}") # <-- DEBUG AÑADIDO
        next_boards = []

    
    children_nodes = []
    
    if is_maximizing_turn:
        best_score = -float('inf')
        for next_board in next_boards:
            child_node = build_explanation_tree(
                next_board, False, alpha, beta, current_depth + 1, max_depth
            )
            children_nodes.append(child_node)
            
            best_score = max(best_score, child_node["score"])
            alpha = max(alpha, best_score)
            if beta <= alpha:
                break # Poda
        
        return {
            "board": board_list,
            "score": best_score, 
            "is_terminal": False,
            "is_maximizing_turn": is_maximizing_turn, # <-- CORRECCIÓN AÑADIDA
            "children": children_nodes
        }
        
    else: # Turno de MIN (Humano)
        best_score = float('inf')
        for next_board in next_boards:
            child_node = build_explanation_tree(
                next_board, True, alpha, beta, current_depth + 1, max_depth
            )
            children_nodes.append(child_node)
            
            best_score = min(best_score, child_node["score"])
            beta = min(beta, best_score)
            if beta <= alpha:
                break # Poda

        return {
            "board": board_list,
            "score": best_score,
            "is_terminal": False,
            "is_maximizing_turn": is_maximizing_turn, # <-- CORRECCIÓN AÑADIDA
            "children": children_nodes
        }
