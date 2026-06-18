# NFL Game Insights Dashboard

NFL Game Insights Dashboard es una aplicación web académica desarrollada con React, TypeScript, Vite, Firebase Firestore y Recharts. El proyecto consiste en un dashboard interactivo orientado a la exploración, visualización e interpretación de datos históricos de partidos de la NFL.

La aplicación utiliza un dataset de Kaggle con información sobre temporadas, equipos, marcadores, estadios, favoritos, líneas de apuesta, over/under y condiciones climáticas. Estos datos fueron convertidos desde CSV a JSON, cargados en Firebase Firestore y consumidos desde React para generar indicadores, filtros, gráficos y una tabla dinámica.

---

## Descripción del proyecto

El objetivo principal del proyecto es construir un dashboard interactivo que permita analizar datos históricos de la NFL de forma visual y organizada.

El dashboard permite responder preguntas como:

- ¿Cuántos partidos hay registrados en el dataset?
- ¿Cuál es el promedio de puntos del equipo local?
- ¿Cuál es el promedio de puntos del equipo visitante?
- ¿Qué porcentaje de veces gana el equipo favorito?
- ¿Qué equipos tienen más victorias históricas?
- ¿Cómo cambia el puntaje total según condiciones climáticas?
- ¿Cómo se comportan los datos al filtrar por temporada, equipo, semana o tipo de partido?

Este proyecto fue desarrollado como parte del Proyecto 02, utilizando React para la interfaz y Firebase Firestore para la gestión y consumo de datos.

---

## Dataset utilizado

Dataset seleccionado:

NFL Scores and Betting Data

Fuente:

https://www.kaggle.com/datasets/tobycrabtree/nfl-scores-and-betting-data/data

Archivos utilizados:

- spreadspoke_scores.csv
- nfl_teams.csv

El archivo principal usado para alimentar el dashboard fue:

spreadspoke_scores.csv

Este archivo contiene información histórica de partidos de la NFL, incluyendo fechas, temporadas, semanas, equipos, marcadores, favoritos, líneas de apuesta, estadios y clima.

---

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- Firebase Firestore
- Recharts
- CSS
- Node.js
- GitHub Pages

---

## Funcionalidades principales

- Dashboard interactivo conectado a Firebase Firestore
- Carga de datos reales desde una colección de Firestore
- Conversión de CSV a JSON mediante script de Node.js
- Subida del JSON limpio a Firestore
- Filtros dinámicos por:
  - Temporada
  - Equipo
  - Semana
  - Tipo de partido
  - Condición climática
- Indicadores dinámicos:
  - Total de partidos analizados
  - Promedio de puntos del equipo local
  - Promedio de puntos del equipo visitante
  - Porcentaje de victoria del equipo favorito
- Gráficos con Recharts:
  - Victorias de local vs visitante
  - Top equipos por victorias
  - Impacto del clima en el puntaje total
- Tabla de partidos recientes con datos reales
- Navegación lateral con sección activa
- Cache local con localStorage para reducir lecturas repetidas desde Firebase
- Diseño visual tipo dashboard deportivo premium

---

## Estructura del proyecto

NFL-Dashboard/
├── data/
│   ├── nfl_games_clean.json
│   ├── nfl_teams.csv
│   └── spreadspoke_scores.csv
│
├── scripts/
│   ├── convertCsvToJson.cjs
│   └── uploadGamesToFirestore.mjs
│
├── src/
│   ├── assets/
│   │   ├── nfl-logo.png
│   │   ├── sidebar-stadium.jpg
│   │   └── hero-stadium.jpg
│   │
│   ├── firebase/
│   │   └── firebaseConfig.ts
│   │
│   ├── services/
│   │   └── gamesService.ts
│   │
│   ├── types/
│   │   └── nflGame.ts
│   │
│   ├── utils/
│   │   └── dashboardStats.ts
│   │
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
│
├── .env.local
├── .gitignore
├── package.json
├── vite.config.ts
└── README.md

---

## Variables de entorno

El proyecto utiliza Firebase, por lo que se debe crear un archivo .env.local en la raíz del proyecto.

Ejemplo:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

Estas variables se obtienen desde:

Firebase Console
→ Project Settings
→ General
→ Your apps
→ Firebase SDK config

Importante:

El archivo .env.local no debe subirse al repositorio. Por eso debe estar incluido en .gitignore.

---

## Conversión de CSV a JSON

El dataset original fue descargado desde Kaggle en formato CSV.

Para convertir el archivo CSV principal a JSON limpio, se utiliza el script:

scripts/convertCsvToJson.cjs

Ejecutar:

node scripts/convertCsvToJson.cjs

Esto genera el archivo:

data/nfl_games_clean.json

---

## Subida de datos a Firestore

Luego de generar el JSON limpio, se puede subir la información a Firebase Firestore usando:

scripts/uploadGamesToFirestore.mjs

Ejecutar:

node scripts/uploadGamesToFirestore.mjs

Los datos se guardan en Firestore dentro de la colección:

games

Cada documento utiliza un identificador como:

game_1
game_2
game_3
...

---

## Firestore

La aplicación lee los datos desde la colección:

games

Cada documento contiene campos como:

- id
- scheduleDate
- scheduleSeason
- scheduleWeek
- schedulePlayoff
- teamHome
- teamAway
- scoreHome
- scoreAway
- teamFavoriteId
- spreadFavorite
- overUnderLine
- stadium
- stadiumNeutral
- weatherTemperature
- weatherWindMph
- weatherHumidity
- weatherDetail

---

## Estado actual

El proyecto cuenta con:

- Dataset de Kaggle convertido a JSON
- Datos reales cargados en Firebase Firestore
- Dashboard conectado a Firestore
- Indicadores dinámicos
- Filtros interactivos
- Gráficos reales con Recharts
- Tabla con registros reales
- Cache local para optimización
- Diseño visual responsive
- Despliegue mediante GitHub Pages

---

## Autor

Josias Pérez Jácome

Proyecto 02   
Universidad de Especialidades Espíritu Santo
