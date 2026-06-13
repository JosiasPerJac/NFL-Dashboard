import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp } from "firebase/app";
import { getFirestore, writeBatch, doc } from "firebase/firestore";

dotenv.config({ path: ".env.local" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const jsonPath = path.join(__dirname, "../data/nfl_games_clean.json");

function loadGames() {
  const fileContent = fs.readFileSync(jsonPath, "utf-8");
  return JSON.parse(fileContent);
}

async function uploadGames() {
  try {
    const games = loadGames();

    console.log(`Total de partidos encontrados: ${games.length}`);
    console.log("Subiendo datos a Firestore...");

    const batchSize = 450;

    for (let i = 0; i < games.length; i += batchSize) {
      const batch = writeBatch(db);
      const chunk = games.slice(i, i + batchSize);

      chunk.forEach((game) => {
        const gameRef = doc(db, "games", game.id);
        batch.set(gameRef, game);
      });

      await batch.commit();

      console.log(`Subidos ${Math.min(i + batchSize, games.length)} de ${games.length}`);
    }

    console.log("Carga completada correctamente.");
  } catch (error) {
    console.error("Error al subir datos a Firestore:", error);
  }
}

uploadGames();