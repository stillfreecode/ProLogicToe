# ProLogicToe

![License](https://img.shields.io/badge/license-MIT-blue)
![Python](https://img.shields.io/badge/Backend-Python%203.10%2B-yellow)
![Prolog](https://img.shields.io/badge/Logic-SWI--Prolog-red)
![React](https://img.shields.io/badge/Frontend-Astro%20%2B%20React-blueviolet)
![Docker](https://img.shields.io/badge/Deployment-Docker-2496ED)

**ProLogicToe** es una implementación del juego Tic Tac Toe, diseñada para demostrar la viabilidad del algoritmo Minimax de IA en la solución de juegos 1 vs 1
<img width="1200" height="752" alt="image" src="https://github.com/user-attachments/assets/e43193ec-dd69-4fca-8c11-5349ce2f1eba" />


El proyecto desacopla la lógica de reglas del algoritmo de búsqueda. Mientras que un motor lógico en **Prolog** valida los estados del juego, un backend en **Python** ejecuta una búsqueda **Minimax optimizada con Poda Alfa-Beta**. Esta separación de responsabilidades permite un código más limpio, mantenible y demostrable matemáticamente. La interfaz de usuario, construida con **React y Astro**, ofrece una experiencia moderna y responsiva.

---

## Demo

![Captura de Pantalla](https://github.com/user-attachments/assets/34f31207-3e41-4123-b7c0-b8b53143bb46)

---

## Fundamentos Teóricos: Minimax

El núcleo de este sistema se basa en la Teoría de Juegos para entornos de información perfecta y suma cero.

El algoritmo Minimax opera bajo la premisa de que ambos jugadores actuarán de manera óptima:
1.  **Maximizador (IA):** Busca el nodo hoja con el valor más alto (+1).
2.  **Minimizador (Oponente):** Busca el nodo hoja con el valor más bajo (-1).

El algoritmo atraviesa el árbol de decisiones de forma recursiva. Para optimizar el rendimiento computacional, integramos la **Poda Alfa-Beta**. Esta técnica descarta ramas del árbol que no pueden influir en la decisión final, reduciendo el espacio de búsqueda sin comprometer la exactitud de la solución.

---

## Arquitectura del Código

El sistema utiliza `PySwip` como puente de comunicación entre el paradigma imperativo (Python) y el declarativo (Prolog).

### Validación Declarativa (Prolog)
En lugar de iterar sobre matrices, definimos las condiciones de victoria como hechos lógicos dentro de `rules.pl`.

```prolog
% Hechos que definen las 8 combinaciones ganadoras (índices de la lista).
linea_ganadora(1, 2, 3). % Horizontal 1
linea_ganadora(4, 5, 6). % Horizontal 2
linea_ganadora(7, 8, 9). % Horizontal 3
linea_ganadora(1, 4, 7). % Vertical 1
linea_ganadora(2, 5, 8). % Vertical 2
linea_ganadora(3, 6, 9). % Vertical 3
linea_ganadora(1, 5, 9). % Diagonal 1
linea_ganadora(3, 5, 7). % Diagonal 2

% ----------------------------------------------------------------------
% 2. PREDICADO DE VICTORIA (ganador/2)
% ----------------------------------------------------------------------

% ganador(Tablero, Jugador)
% Es verdadero si el Jugador ('x' o 'o') ha ganado en el Tablero dado.

% Regla: Un jugador gana si ocupa las tres posiciones de cualquier linea_ganadora.
ganador(Tablero, Jugador) :-
    linea_ganadora(P1, P2, P3),         % Encuentra una línea ganadora
    nth1(P1, Tablero, Jugador),         % Verifica que la casilla P1 es del Jugador
    nth1(P2, Tablero, Jugador),         % Verifica que la casilla P2 es del Jugador
    nth1(P3, Tablero, Jugador).         % Verifica que la casilla P3 es del Jugador
```

### Algoritmo de Búsqueda (Python)
El backend delega la validación de estados a Prolog, permitiendo que Python se concentre exclusivamente en la estrategia de búsqueda en `minimax.py`.

```minimax.py
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
```
---

## Despliegue e Instalacion

**Opción A: Docker**

**Requisitos previos** Docker Dekstop: https://www.docker.com/products/docker-desktop/

Para garantizar la consistencia entre entornos y evitar configuraciones manuales de Prolog, recomendamos usar Docker:

### 1. Clonar el repositorio

```bash
git clone https://github.com/stillfreecode/ProLogicToe.git
cd ProLogicToe
```

### 2. Desplegar los servicios

```bash
docker-compose up --build
```

### 3. Acceder a la aplicación: Navegar a http://localhost:4321.
---

**Opción B**: Ejecución Local

**Requisitos previos**: Python 3.10+, Node.js, y SWI-Prolog instalado en el sistema y agregado al PATH.

### 1. Configurar Backend

```bash
cd backend/python_api
python -m venv venv
# Activar entorno virtual (Windows: venv\Scripts\activate | Unix: source venv/bin/activate)
pip install -r requirements.txt
python main.py
```

### 2. Configurar Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Informacion del proyecto
**Licencia: MIT**

**Desarrollado por: Ing. Rodolfo Ángel Córdoba Villegas**

**Copyright (c) 2025 Rodolfo Angel Cordoba Villegas**