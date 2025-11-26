% ----------------------------------------------------------------------
%          MOTOR LÓGICO DE TIC TAC TOE (PROLOG)
% ----------------------------------------------------------------------
%
% Representación del Tablero:
% Una lista de 9 elementos, donde cada elemento es 'x', 'o', o 'v' (vacío).
% Las posiciones se mapean de la siguiente manera:
% [1, 2, 3,
%  4, 5, 6,
%  7, 8, 9]
%
% Ejemplo de tablero: [x, v, v, o, x, v, v, v, o]

% ----------------------------------------------------------------------
% 1. DEFINICIÓN DE LÍNEAS GANADORAS
% ----------------------------------------------------------------------

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

% ----------------------------------------------------------------------
% 3. PREDICADOS DE ESTADO DEL JUEGO (Empate, Terminal)
% ----------------------------------------------------------------------

% tablero_lleno(Tablero)
% Es verdadero si no quedan casillas vacías ('v') en el tablero.
tablero_lleno(Tablero) :-
    \+ member(v, Tablero).

% empate(Tablero)
% Es verdadero si el tablero está lleno Y nadie ha ganado[cite: 21, 22].
empate(Tablero) :-
    tablero_lleno(Tablero),
    \+ ganador(Tablero, x),
    \+ ganador(Tablero, o).

% estado_terminal(Tablero)
% Es verdadero si el juego ha terminado (ya sea por victoria o empate).
estado_terminal(Tablero) :- ganador(Tablero, x). % Comprueba si 'x' ganó
estado_terminal(Tablero) :- ganador(Tablero, o). % Comprueba si 'o' ganó
estado_terminal(Tablero) :- empate(Tablero).      % Comprueba si es empate
% ----------------------------------------------------------------------
% 4. PREDICADOS DE MOVIMIENTO
% ----------------------------------------------------------------------

% movimiento_valido(Tablero, Posicion)
% Es verdadero si la Posicion (1-9) está vacía ('v')[cite: 6].
movimiento_valido(Tablero, Posicion) :-
    nth1(Posicion, Tablero, v).

% reemplazar(Lista, Indice, ViejoValor, NuevoValor, NuevaLista)
% Helper para reemplazar un elemento en una lista (Prolog es inmutable).
% Nota: Usamos nth1/4 para una versión más declarativa y eficiente.
reemplazar(Lista, Indice, NuevoValor, NuevaLista) :-
    nth1(Indice, Lista, _, Resto),       % Descompone la lista en el índice
    nth1(Indice, NuevaLista, NuevoValor, Resto). % Recompone con el nuevo valor

% hacer_movimiento(TableroViejo, Posicion, Jugador, TableroNuevo)
% Genera un TableroNuevo aplicando el movimiento del Jugador en Posicion.
hacer_movimiento(TableroViejo, Posicion, Jugador, TableroNuevo) :-
    movimiento_valido(TableroViejo, Posicion), % Asegura que el movimiento es legal
    reemplazar(TableroViejo, Posicion, Jugador, TableroNuevo).

% ----------------------------------------------------------------------
% 5. UTILIDADES (Opcional, Minimax)
% ----------------------------------------------------------------------

% oponente(Jugador, Oponente)
oponente(x, o).
oponente(o, x).

% movimientos_posibles(Tablero, Jugador, ListaDeNuevosTableros)
% Genera una lista de todos los posibles tableros resultantes
% para el turno del Jugador.
movimientos_posibles(Tablero, Jugador, Movimientos) :-
    % findall(Plantilla, Objetivo, Lista)
    % Busca todos los TableroNuevo tales que...
    findall(TableroNuevo,
            % ...se pueda hacer un movimiento...
            (   between(1, 9, Posicion), % Itera de 1 a 9
                hacer_movimiento(Tablero, Posicion, Jugador, TableroNuevo)
            ),
            Movimientos). % ...y los colecciona en la lista Movimientos.