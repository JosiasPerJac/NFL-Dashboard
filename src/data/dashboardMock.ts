export type GameRow = {
  date: string;
  season: number;
  week: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  favorite: string;
  spread: string;
  overUnder: number;
  stadium: string;
};

export const kpis = [
  {
    label: "Total Games Analyzed",
    value: "12,842",
    trend: "↑ 6.7% vs last update",
    icon: "↗",
  },
  {
    label: "Average Home Team Score",
    value: "24.6",
    trend: "↑ 1.3 pts vs last update",
    icon: "⌂",
  },
  {
    label: "Average Away Team Score",
    value: "21.1",
    trend: "↑ 1.1 pts vs last update",
    icon: "✈",
  },
  {
    label: "Favorite Win Percentage",
    value: "61.8%",
    trend: "↑ 2.9% vs last update",
    icon: "★",
  },
];

export const filters = [
  {
    label: "Season",
    options: ["All Seasons", "2024", "2023", "2022", "2021"],
  },
  {
    label: "Team",
    options: ["All Teams", "Kansas City Chiefs", "Dallas Cowboys", "Green Bay Packers", "San Francisco 49ers"],
  },
  {
    label: "Week",
    options: ["All Weeks", "1", "2", "3", "Playoffs"],
  },
  {
    label: "Type",
    options: ["Regular Season + Playoffs", "Regular Season", "Playoffs"],
  },
  {
    label: "Stadium",
    options: ["All Stadiums", "GEHA Field at Arrowhead", "Lambeau Field", "Levi's Stadium"],
  },
  {
    label: "Weather Condition",
    options: ["All Conditions", "Clear", "Cloudy", "Rain", "Snow"],
  },
];

export const topTeams = [
  { name: "Dallas Cowboys", wins: 168, percent: 100 },
  { name: "Green Bay Packers", wins: 159, percent: 94 },
  { name: "Pittsburgh Steelers", wins: 157, percent: 92 },
  { name: "New England Patriots", wins: 154, percent: 89 },
  { name: "San Francisco 49ers", wins: 152, percent: 87 },
];

export const recentGames: GameRow[] = [
  {
    date: "May 12, 2024",
    season: 2024,
    week: 18,
    homeTeam: "Kansas City Chiefs",
    awayTeam: "Buffalo Bills",
    homeScore: 27,
    awayScore: 24,
    favorite: "Kansas City Chiefs",
    spread: "-3.5",
    overUnder: 45.5,
    stadium: "GEHA Field at Arrowhead",
  },
  {
    date: "Jan 7, 2024",
    season: 2023,
    week: 18,
    homeTeam: "Dallas Cowboys",
    awayTeam: "Philadelphia Eagles",
    homeScore: 31,
    awayScore: 17,
    favorite: "Philadelphia Eagles",
    spread: "-6.0",
    overUnder: 48.0,
    stadium: "Lincoln Financial Field",
  },
  {
    date: "Dec 31, 2023",
    season: 2023,
    week: 17,
    homeTeam: "San Francisco 49ers",
    awayTeam: "Los Angeles Rams",
    homeScore: 20,
    awayScore: 23,
    favorite: "San Francisco 49ers",
    spread: "+2.5",
    overUnder: 41.5,
    stadium: "Levi's Stadium",
  },
  {
    date: "Dec 24, 2023",
    season: 2023,
    week: 16,
    homeTeam: "Green Bay Packers",
    awayTeam: "Detroit Lions",
    homeScore: 28,
    awayScore: 21,
    favorite: "Green Bay Packers",
    spread: "-4.0",
    overUnder: 44.0,
    stadium: "Lambeau Field",
  },
  {
    date: "Dec 17, 2023",
    season: 2023,
    week: 15,
    homeTeam: "Baltimore Ravens",
    awayTeam: "Cincinnati Bengals",
    homeScore: 24,
    awayScore: 27,
    favorite: "Baltimore Ravens",
    spread: "+1.5",
    overUnder: 43.5,
    stadium: "Paycor Stadium",
  },
];

export const takeaways = [
  "Home teams average more points per game than away teams.",
  "Favorites win above the historical baseline in this sample.",
  "Rain and snow conditions reduce total scoring significantly.",
  "Point spread can be compared against final score difference.",
];
