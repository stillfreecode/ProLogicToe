# Usamos una imagen base ligera de Python 3.10
FROM python:3.10-slim

# INSTALAR SWI-PROLOG Y DEPENDENCIAS DE SISTEMA
# instala Prolog en el contenedor automáticamente.
RUN apt-get update && \
    apt-get install -y swi-prolog && \
    rm -rf /var/lib/apt/lists/*

# Configurar directorio de trabajo
WORKDIR /app

# Copiar requirements e instalar dependencias de Python
COPY python_api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el código del backend
COPY . .

# Movernos a la carpeta de la API para ejecutar
WORKDIR /app/python_api

# Exponer el puerto
EXPOSE 8000

# Comando de inicio
CMD ["python", "main.py"]