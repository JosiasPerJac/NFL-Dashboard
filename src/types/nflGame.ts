export type NflGame = {
  id: string;

  scheduleDate: string;
  scheduleSeason: number | null;
  scheduleWeek: string;
  schedulePlayoff: boolean;

  teamHome: string;
  teamAway: string;
  scoreHome: number | null;
  scoreAway: number | null;

  teamFavoriteId: string | null;
  spreadFavorite: number | null;
  overUnderLine: number | null;

  stadium: string;
  stadiumNeutral: boolean;

  weatherTemperature: number | null;
  weatherWindMph: number | null;
  weatherHumidity: number | null;
  weatherDetail: string | null;
};