import os
from pyswip import Prolog

DIR_PATH = os.path.dirname(os.path.abspath(__file__))

PROLOG_FILE = os.path.join(DIR_PATH, "..", "prolog_engine", "rules.pl")

PROLOG_FILE = os.path.normpath(PROLOG_FILE)

print(f"Intentando cargar: {PROLOG_FILE}")

try:
    prolog = Prolog()
    prolog.consult(PROLOG_FILE)
    print("Motor Prolog cargado y 'rules.pl' consultado.")
except Exception as e:
    print(f"FALLO EN CARGA. Error: {e}")
    print("Causa probable: SWI-Prolog no está instalado o pyswip no lo encuentra.")
    exit()


try:
    print("\n Probando consulta simple: 'oponente(x, O)'")
    query_simple = "oponente(x, O)"
    result_simple = list(prolog.query(query_simple))
    print(f"Resultado: {result_simple}")
except Exception as e:
    print(f"FALLO EN CONSULTA SIMPLE. Error: {e}")
    print("Causa probable: Problema con pyswip o las librerías C de Prolog.")
    exit()


try:
    print("\n Probando consulta compleja: 'movimientos_posibles(...)'")

    board_str = "[o,v,v,v,v,v,v,v,v]" 
    query_complex = f"movimientos_posibles({board_str}, x, ListaMovimientos)"
    
    print(f"Ejecutando: {query_complex}")
   
    result_complex = list(prolog.query(query_complex))
 
    print(f"Resultado: {result_complex}")
    print("\n PRUEBA COMPLETADA.")
    
except Exception as e:
    print(f"FALLO EN CONSULTA COMPLEJA. Error: {e}")
    print("Causa probable: Bucle infinito o error lógico en 'movimientos_posibles' en rules.pl.")