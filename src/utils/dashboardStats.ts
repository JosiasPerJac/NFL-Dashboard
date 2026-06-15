import type { NflGame } from "../types/nflGame";

export type DashboardFilters = {
  season: string;
  team: string;
  week: string;
  type: string;
  weather: string;
};

export function getCompletedGames(games: NflGame[]) {
  return games.filter((game) => {
    return game.scoreHome !== null && game.scoreAway !== null;
  });
}

export function getSeasonOptions(games: NflGame[]) {
  return Array.from(
    new Set(
      games
        .map((game) => game.scheduleSeason)
        .filter((season): season is number => season !== null)
    )
  ).sort((a, b) => b - a);
}

export function getTeamOptions(games: NflGame[]) {
  return Array.from(
    new Set(
      games.flatMap((game) => [game.teamHome, game.teamAway]).filter(Boolean)
    )
  ).sort();
}

export function getWeekOptions(games: NflGame[]) {
  return Array.from(
    new Set(games.map((game) => game.scheduleWeek).filter(Boolean))
  ).sort((a, b) => {
    const numberA = Number(a);
    const numberB = Number(b);

    if (!Number.isNaN(numberA) && !Number.isNaN(numberB)) {
      return numberA - numberB;
    }

    return String(a).localeCompare(String(b));
  });
}

export function getWeatherCategory(game: NflGame) {
  const detail = game.weatherDetail?.toLowerCase() ?? "";

  if (detail.includes("rain")) return "Rain";
  if (detail.includes("snow")) return "Snow";
  if (detail.includes("cloud")) return "Cloudy";
  if (detail.includes("clear") || detail.includes("sun")) return "Clear";
  if (detail.includes("dome") || detail.includes("indoor")) return "Indoor";

  if (game.weatherTemperature !== null) {
    if (game.weatherTemperature <= 32) return "Cold";
    if (game.weatherTemperature >= 80) return "Warm";
  }

  return "Unknown";
}

export function getWeatherOptions(games: NflGame[]) {
  return Array.from(new Set(games.map(getWeatherCategory))).sort();
}

export function filterGames(games: NflGame[], filters: DashboardFilters) {
  return games.filter((game) => {
    const matchesSeason =
      filters.season === "All Seasons" ||
      String(game.scheduleSeason) === filters.season;

    const matchesTeam =
      filters.team === "All Teams" ||
      game.teamHome === filters.team ||
      game.teamAway === filters.team;

    const matchesWeek =
      filters.week === "All Weeks" || game.scheduleWeek === filters.week;

    const matchesType =
      filters.type === "Regular Season + Playoffs" ||
      (filters.type === "Regular Season" && !game.schedulePlayoff) ||
      (filters.type === "Playoffs" && game.schedulePlayoff);

    const matchesWeather =
      filters.weather === "All Conditions" ||
      getWeatherCategory(game) === filters.weather;

    return matchesSeason && matchesTeam && matchesWeek && matchesType && matchesWeather;
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

export function getHomeAwayWins(games: NflGame[]) {
  const completedGames = getCompletedGames(games);

  const homeWins = completedGames.filter((game) => {
    return Number(game.scoreHome) > Number(game.scoreAway);
  }).length;

  const awayWins = completedGames.filter((game) => {
    return Number(game.scoreAway) > Number(game.scoreHome);
  }).length;

  return {
    homeWins,
    awayWins,
  };
}

const teamIdToName: Record<string, string> = {
  ARI: "Arizona Cardinals",
  ATL: "Atlanta Falcons",
  BAL: "Baltimore Ravens",
  BUF: "Buffalo Bills",
  CAR: "Carolina Panthers",
  CHI: "Chicago Bears",
  CIN: "Cincinnati Bengals",
  CLE: "Cleveland Browns",
  DAL: "Dallas Cowboys",
  DEN: "Denver Broncos",
  DET: "Detroit Lions",
  GB: "Green Bay Packers",
  HOU: "Houston Texans",
  IND: "Indianapolis Colts",
  JAX: "Jacksonville Jaguars",
  KC: "Kansas City Chiefs",
  LAC: "Los Angeles Chargers",
  LAR: "Los Angeles Rams",
  LV: "Las Vegas Raiders",
  MIA: "Miami Dolphins",
  MIN: "Minnesota Vikings",
  NE: "New England Patriots",
  NO: "New Orleans Saints",
  NYG: "New York Giants",
  NYJ: "New York Jets",
  PHI: "Philadelphia Eagles",
  PIT: "Pittsburgh Steelers",
  SEA: "Seattle Seahawks",
  SF: "San Francisco 49ers",
  TB: "Tampa Bay Buccaneers",
  TEN: "Tennessee Titans",
  WAS: "Washington Commanders",

  // Equipos históricos / nombres anteriores
  OAK: "Oakland Raiders",
  SD: "San Diego Chargers",
  STL: "St. Louis Rams",
  LA: "Los Angeles Rams",
  PHO: "Phoenix Cardinals",
};

export function getFavoriteWinPercentage(games: NflGame[]) {
  const completedGames = getCompletedGames(games).filter((game) => {
    return game.teamFavoriteId !== null && game.teamFavoriteId !== "PICK";
  });

  if (completedGames.length === 0) return 0;

  const favoriteWins = completedGames.filter((game) => {
    const favoriteName =
      teamIdToName[String(game.teamFavoriteId)] ?? String(game.teamFavoriteId);

    const favoriteIsHome = favoriteName === game.teamHome;
    const favoriteIsAway = favoriteName === game.teamAway;

    const homeWon = Number(game.scoreHome) > Number(game.scoreAway);
    const awayWon = Number(game.scoreAway) > Number(game.scoreHome);

    return (favoriteIsHome && homeWon) || (favoriteIsAway && awayWon);
  });

  return Number(((favoriteWins.length / completedGames.length) * 100).toFixed(1));
}

export function getTopTeamsByWins(games: NflGame[], limit = 5) {
  const winsByTeam: Record<string, number> = {};

  getCompletedGames(games).forEach((game) => {
    const homeWon = Number(game.scoreHome) > Number(game.scoreAway);
    const awayWon = Number(game.scoreAway) > Number(game.scoreHome);

    if (homeWon) {
      winsByTeam[game.teamHome] = (winsByTeam[game.teamHome] ?? 0) + 1;
    }

    if (awayWon) {
      winsByTeam[game.teamAway] = (winsByTeam[game.teamAway] ?? 0) + 1;
    }
  });

  return Object.entries(winsByTeam)
    .map(([team, wins]) => ({ team, wins }))
    .sort((a, b) => b.wins - a.wins)
    .slice(0, limit);
}

export function getWeatherImpact(games: NflGame[]) {
  const totalsByWeather: Record<string, { totalScore: number; games: number }> = {};

  getCompletedGames(games).forEach((game) => {
    const category = getWeatherCategory(game);
    const totalScore = Number(game.scoreHome) + Number(game.scoreAway);

    if (!totalsByWeather[category]) {
      totalsByWeather[category] = {
        totalScore: 0,
        games: 0,
      };
    }

    totalsByWeather[category].totalScore += totalScore;
    totalsByWeather[category].games += 1;
  });

  return Object.entries(totalsByWeather)
    .map(([weather, data]) => ({
      weather,
      averageScore: Number((data.totalScore / data.games).toFixed(1)),
      games: data.games,
    }))
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 4);
}

export function getRecentGames(games: NflGame[], limit = 8) {
  return [...games]
    .filter((game) => game.scheduleSeason !== null)
    .sort((a, b) => {
      const seasonDiff = Number(b.scheduleSeason) - Number(a.scheduleSeason);

      if (seasonDiff !== 0) return seasonDiff;

      return String(b.scheduleDate).localeCompare(String(a.scheduleDate));
    })
    .slice(0, limit);
}