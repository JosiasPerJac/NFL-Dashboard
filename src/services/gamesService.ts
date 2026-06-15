import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import type { NflGame } from "../types/nflGame";

const CACHE_KEY = "nfl_games_cache_v1";
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 horas

type GamesCache = {
  savedAt: number;
  games: NflGame[];
};

function getCachedGames(): NflGame[] | null {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);

    if (!cachedData) return null;

    const parsedCache = JSON.parse(cachedData) as GamesCache;
    const cacheIsExpired = Date.now() - parsedCache.savedAt > CACHE_DURATION;

    if (cacheIsExpired) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return parsedCache.games;
  } catch (error) {
    console.error("Error reading cached games:", error);
    return null;
  }
}

function saveGamesToCache(games: NflGame[]) {
  try {
    const cachePayload: GamesCache = {
      savedAt: Date.now(),
      games,
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(cachePayload));
  } catch (error) {
    console.warn("Could not save games to cache:", error);
  }
}

export function clearGamesCache() {
  localStorage.removeItem(CACHE_KEY);
}

export async function getGamesFromFirestore(forceRefresh = false): Promise<NflGame[]> {
  if (!forceRefresh) {
    const cachedGames = getCachedGames();

    if (cachedGames) {
      console.log("Games loaded from local cache:", cachedGames.length);
      return cachedGames;
    }
  }

  const gamesRef = collection(db, "games");
  const gamesQuery = query(gamesRef);
  const querySnapshot = await getDocs(gamesQuery);

  const games = querySnapshot.docs.map((document) => {
    return {
      id: document.id,
      ...document.data(),
    } as NflGame;
  });

  saveGamesToCache(games);

  console.log("Games loaded from Firestore:", games.length);

  return games;
}