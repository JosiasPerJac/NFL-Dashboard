import type { NflGame } from "../types/nflGame";

function getCompletedGames(games: NflGame[]) {
  return games.filter((game) => {
    return game.scoreHome !== null && game.scoreAway !== null;
  });
}

export function getAverageHomeScore(games: NflGame[]) {
  const completedGames = getCompletedGames(games);

  if (completedGames.length === 0) return 0;

  const total = completedGames.reduce((sum, game) => {
    return sum + Number(game.scoreHome);
  }, 0);

  return Number((total / completedGames.length).toFixed(1));
}

export function getAverageAwayScore(games: NflGame[]) {
  const completedGames = getCompletedGames(games);

  if (completedGames.length === 0) return 0;

  const total = completedGames.reduce((sum, game) => {
    return sum + Number(game.scoreAway);
  }, 0);

  return Number((total / completedGames.length).toFixed(1));
}

export function getFavoriteWinPercentage(games: NflGame[]) {
  const gamesWithFavorite = getCompletedGames(games).filter((game) => {
    return game.teamFavoriteId !== null;
  });

  if (gamesWithFavorite.length === 0) return 0;

  const favoriteWins = gamesWithFavorite.filter((game) => {
    const homeWon = Number(game.scoreHome) > Number(game.scoreAway);
    const awayWon = Number(game.scoreAway) > Number(game.scoreHome);

    const favorite = game.teamFavoriteId?.toLowerCase() ?? "";
    const homeTeam = game.teamHome.toLowerCase();
    const awayTeam = game.teamAway.toLowerCase();

    return (
      (favorite.includes(homeTeam) && homeWon) ||
      (favorite.includes(awayTeam) && awayWon)
    );
  });

  return Number(((favoriteWins.length / gamesWithFavorite.length) * 100).toFixed(1));
}