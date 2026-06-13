import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import type { NflGame } from "../types/nflGame";

export async function getGamesFromFirestore(): Promise<NflGame[]> {
  const gamesRef = collection(db, "games");

  const gamesQuery = query(gamesRef, limit(100));

  const querySnapshot = await getDocs(gamesQuery);

  const games = querySnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    } as NflGame;
  });

  return games;
}