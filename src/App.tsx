import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import "./App.css";
import nflLogo from "./assets/nfl-logo.png";
import sidebarImage from "./assets/sidebar-stadium.jpeg";
import heroImage from "./assets/hero-stadium.jpg";
import { getGamesFromFirestore } from "./services/gamesService";
import type { NflGame } from "./types/nflGame";
import {
  filterGames,
  getAverageAwayScore,
  getAverageHomeScore,
  getFavoriteWinPercentage,
  getHomeAwayWins,
  getRecentGames,
  getSeasonOptions,
  getTeamOptions,
  getTopTeamsByWins,
  getWeatherImpact,
  getWeatherOptions,
  getWeekOptions,
  type DashboardFilters,
} from "./utils/dashboardStats";

const initialFilters: DashboardFilters = {
  season: "All Seasons",
  team: "All Teams",
  week: "All Weeks",
  type: "Regular Season + Playoffs",
  weather: "All Conditions",
};

type SectionId = "overview" | "seasons" | "weather" | "games";

function App() {
  const [games, setGames] = useState<NflGame[]>([]);
  const [filters, setFilters] = useState<DashboardFilters>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeSection, setActiveSection] = useState<SectionId>("overview");

  const isAutoScrollingRef = useRef(false);
  const autoScrollTimerRef = useRef<number | null>(null);

  useEffect(() => {
    async function loadGames() {
      try {
        const firestoreGames = await getGamesFromFirestore();
        setGames(firestoreGames);
      } catch (error) {
        console.error("Error loading games:", error);
        setLoadError("No se pudieron cargar los datos desde Firebase.");
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, []);

  useEffect(() => {
    const sectionIds: SectionId[] = ["overview", "seasons", "weather", "games"];

    function handleScroll() {
      if (isAutoScrollingRef.current) return;

      const scrollPosition = window.scrollY + 220;
      let currentSection: SectionId = "overview";

      sectionIds.forEach((sectionId) => {
        const section = document.getElementById(sectionId);

        if (!section) return;

        const sectionTop = section.getBoundingClientRect().top + window.scrollY;

        if (sectionTop <= scrollPosition) {
          currentSection = sectionId;
        }
      });

      setActiveSection(currentSection);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (autoScrollTimerRef.current) {
        window.clearTimeout(autoScrollTimerRef.current);
      }
    };
  }, []);

  const seasonOptions = useMemo(() => getSeasonOptions(games), [games]);
  const teamOptions = useMemo(() => getTeamOptions(games), [games]);
  const weekOptions = useMemo(() => getWeekOptions(games), [games]);
  const weatherOptions = useMemo(() => getWeatherOptions(games), [games]);

  const filteredGames = useMemo(() => {
    return filterGames(games, filters);
  }, [games, filters]);

  const averageHomeScore = useMemo(() => {
    return getAverageHomeScore(filteredGames);
  }, [filteredGames]);

  const averageAwayScore = useMemo(() => {
    return getAverageAwayScore(filteredGames);
  }, [filteredGames]);

  const favoriteWinPercentage = useMemo(() => {
    return getFavoriteWinPercentage(filteredGames);
  }, [filteredGames]);

  const homeAwayWins = useMemo(() => {
    return getHomeAwayWins(filteredGames);
  }, [filteredGames]);

  const topTeams = useMemo(() => {
    return getTopTeamsByWins(filteredGames, 7);
  }, [filteredGames]);

  const weatherImpact = useMemo(() => {
    return getWeatherImpact(filteredGames);
  }, [filteredGames]);

  const recentGames = useMemo(() => {
    return getRecentGames(filteredGames, 10);
  }, [filteredGames]);

  const homeAwayWinsData = useMemo(() => {
    return [
      {
        name: "Game Results",
        homeWins: homeAwayWins.homeWins,
        awayWins: homeAwayWins.awayWins,
      },
    ];
  }, [homeAwayWins]);

  const topTeamsChartData = useMemo(() => {
    return topTeams.map((team) => ({
      name: team.team,
      wins: team.wins,
    }));
  }, [topTeams]);

  const weatherChartData = useMemo(() => {
    return weatherImpact.map((item) => ({
      name: item.weather,
      averageScore: item.averageScore,
    }));
  }, [weatherImpact]);

  function updateFilter(filterName: keyof DashboardFilters, value: string) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [filterName]: value,
    }));
  }

  function resetFilters() {
    setFilters(initialFilters);
    handleSectionScroll("overview");
  }

  function getNavClass(sectionId: SectionId) {
    return activeSection === sectionId ? "active" : "";
  }

  function handleSectionScroll(sectionId: SectionId) {
    const section = document.getElementById(sectionId);

    if (!section) return;

    setActiveSection(sectionId);
    isAutoScrollingRef.current = true;

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.replaceState(null, "", `#${sectionId}`);

    if (autoScrollTimerRef.current) {
      window.clearTimeout(autoScrollTimerRef.current);
    }

    autoScrollTimerRef.current = window.setTimeout(() => {
      isAutoScrollingRef.current = false;
      setActiveSection(sectionId);
    }, 850);
  }

  function handleNavClick(
    event: MouseEvent<HTMLAnchorElement>,
    sectionId: SectionId
  ) {
    event.preventDefault();
    handleSectionScroll(sectionId);
  }

  return (
    <main className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">
            <img src={nflLogo} alt="NFL logo" />
          </div>

          <div>
            <p>Game Insights</p>
            <span>Analytics dashboard</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a
            className={getNavClass("overview")}
            href="#overview"
            onClick={(event) => handleNavClick(event, "overview")}
          >
            Overview
          </a>

          <a
            className={getNavClass("seasons")}
            href="#seasons"
            onClick={(event) => handleNavClick(event, "seasons")}
          >
            Seasons
          </a>

          <a
            className={getNavClass("weather")}
            href="#weather"
            onClick={(event) => handleNavClick(event, "weather")}
          >
            Weather Impact
          </a>

          <a
            className={getNavClass("games")}
            href="#games"
            onClick={(event) => handleNavClick(event, "games")}
          >
            Game Table
          </a>
        </nav>

        <div className="sidebar-panel">
          <img src={sidebarImage} alt="Football stadium" />

          <div className="sidebar-panel-content">
            <p>Dataset Status</p>
            <strong>
              {loading ? "Loading..." : `${games.length.toLocaleString()} games`}
            </strong>
            <span>Firestore connected</span>
          </div>
        </div>
      </aside>

      <section className="dashboard-content">
        <header className="page-header">
          <div>
            <p>Proyecto 02 · Dashboard Interactivo</p>
            <h1>NFL Game Insights Dashboard</h1>
          </div>

          <div className="header-meta">
            <span>{filteredGames.length.toLocaleString()} selected games</span>
            <button onClick={resetFilters}>Reset</button>
          </div>
        </header>

        <section className="overview-grid" id="overview">
          <article
            className="hero-card"
            style={
              {
                "--hero-image": `url(${heroImage})`,
              } as CSSProperties
            }
          >
            <div className="hero-content">
              <p className="section-label">Academic dashboard · Kaggle dataset</p>

              <h2>Historical NFL performance, simplified.</h2>

              <p>
                Explore seasons, teams, scores, betting context and weather behavior
                through real records loaded from Firebase Firestore.
              </p>

              <span className={loadError ? "firebase-status error" : "firebase-status"}>
                {loading && "Loading Firebase data..."}
                {!loading &&
                  !loadError &&
                  `Firebase connected · ${games.length.toLocaleString()} games loaded`}
                {loadError && loadError}
              </span>
            </div>
          </article>

          <section className="kpi-strip">
            <article className="kpi-card">
              <span className="kpi-icon">↗</span>
              <p>Total Games</p>
              <strong>{loading ? "..." : filteredGames.length.toLocaleString()}</strong>
              <small>{games.length.toLocaleString()} total records</small>
            </article>

            <article className="kpi-card">
              <span className="kpi-icon blue">⌂</span>
              <p>Avg Home Score</p>
              <strong>{loading ? "..." : averageHomeScore}</strong>
              <small>Selected games</small>
            </article>

            <article className="kpi-card">
              <span className="kpi-icon red">✈</span>
              <p>Avg Away Score</p>
              <strong>{loading ? "..." : averageAwayScore}</strong>
              <small>Selected games</small>
            </article>

            <article className="kpi-card">
              <span className="kpi-icon purple">★</span>
              <p>Favorite Win %</p>
              <strong>{loading ? "..." : `${favoriteWinPercentage}%`}</strong>
              <small>Favorite data available</small>
            </article>
          </section>
        </section>

        <section className="filters-card">
          <div className="filters-title">
            <p>Interactive Filters</p>
            <span>All metrics below react to these controls</span>
          </div>

          <div className="filter-bar">
            <label>
              Season
              <select
                value={filters.season}
                onChange={(event) => updateFilter("season", event.target.value)}
              >
                <option>All Seasons</option>
                {seasonOptions.map((season) => (
                  <option key={season}>{season}</option>
                ))}
              </select>
            </label>

            <label>
              Team
              <select
                value={filters.team}
                onChange={(event) => updateFilter("team", event.target.value)}
              >
                <option>All Teams</option>
                {teamOptions.map((team) => (
                  <option key={team}>{team}</option>
                ))}
              </select>
            </label>

            <label>
              Week
              <select
                value={filters.week}
                onChange={(event) => updateFilter("week", event.target.value)}
              >
                <option>All Weeks</option>
                {weekOptions.map((week) => (
                  <option key={week}>{week}</option>
                ))}
              </select>
            </label>

            <label>
              Type
              <select
                value={filters.type}
                onChange={(event) => updateFilter("type", event.target.value)}
              >
                <option>Regular Season + Playoffs</option>
                <option>Regular Season</option>
                <option>Playoffs</option>
              </select>
            </label>

            <label>
              Weather
              <select
                value={filters.weather}
                onChange={(event) => updateFilter("weather", event.target.value)}
              >
                <option>All Conditions</option>
                {weatherOptions.map((weather) => (
                  <option key={weather}>{weather}</option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="insights-grid" id="seasons">
          <article className="data-card score-card">
            <div className="card-header">
              <div>
                <p>Score Profile</p>
                <h3>Average Points by Team Type</h3>
              </div>
              <span>01</span>
            </div>

            <div className="score-comparison">
              <div>
                <span>Home Team</span>
                <strong>{averageHomeScore}</strong>
              </div>

              <div>
                <span>Away Team</span>
                <strong>{averageAwayScore}</strong>
              </div>
            </div>
          </article>

          <article className="data-card wins-card">
            <div className="card-header">
              <div>
                <p>Game Results</p>
                <h3>Home Wins vs Away Wins</h3>
              </div>
              <span>02</span>
            </div>

            <div className="chart-box">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={homeAwayWinsData}
                  margin={{ top: 10, right: 12, left: -8, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(148, 163, 184, 0.12)"
                  />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: "rgba(59, 130, 246, 0.08)" }}
                    contentStyle={{
                      background: "rgba(2, 6, 23, 0.96)",
                      border: "1px solid rgba(96, 165, 250, 0.32)",
                      borderRadius: "14px",
                      color: "#f8fafc",
                      boxShadow: "0 18px 40px rgba(0, 0, 0, 0.35)",
                    }}
                    labelStyle={{
                      color: "#bfdbfe",
                      fontWeight: 900,
                    }}
                    itemStyle={{
                      color: "#7dd3fc",
                      fontWeight: 900,
                    }}
                    formatter={(value, name) => [String(value), String(name)]}
                    labelFormatter={() => "Game Results"}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{
                      color: "#cbd5e1",
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  />
                  <Bar
                    dataKey="homeWins"
                    name="Home Wins"
                    radius={[12, 12, 0, 0]}
                    fill="#3b82f6"
                  />
                  <Bar
                    dataKey="awayWins"
                    name="Away Wins"
                    radius={[12, 12, 0, 0]}
                    fill="#f43f5e"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="data-card summary-card">
            <div className="card-header">
              <div>
                <p>Current View</p>
                <h3>Filter Summary</h3>
              </div>
              <span>03</span>
            </div>

            <ul className="summary-list">
              <li>
                <span>Season</span>
                <strong>{filters.season}</strong>
              </li>
              <li>
                <span>Team</span>
                <strong>{filters.team}</strong>
              </li>
              <li>
                <span>Week</span>
                <strong>{filters.week}</strong>
              </li>
              <li>
                <span>Type</span>
                <strong>{filters.type}</strong>
              </li>
              <li>
                <span>Weather</span>
                <strong>{filters.weather}</strong>
              </li>
            </ul>
          </article>

          <article className="data-card top-teams-card">
            <div className="card-header">
              <div>
                <p>Team Ranking</p>
                <h3>Top Teams by Total Wins</h3>
              </div>
              <span>04</span>
            </div>

            <div className="chart-box large">
              <ResponsiveContainer width="100%" height={330}>
                <BarChart
                  data={topTeamsChartData}
                  layout="vertical"
                  margin={{ top: 10, right: 28, left: 40, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(148, 163, 184, 0.12)"
                  />
                  <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={180}
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(59, 130, 246, 0.08)" }}
                    contentStyle={{
                      background: "rgba(2, 6, 23, 0.96)",
                      border: "1px solid rgba(96, 165, 250, 0.32)",
                      borderRadius: "14px",
                      color: "#f8fafc",
                      boxShadow: "0 18px 40px rgba(0, 0, 0, 0.35)",
                    }}
                    labelStyle={{
                      color: "#bfdbfe",
                      fontWeight: 900,
                    }}
                    itemStyle={{
                      color: "#7dd3fc",
                      fontWeight: 900,
                    }}
                    formatter={(value) => [String(value), "Wins"]}
                  />
                  <Bar dataKey="wins" radius={[0, 12, 12, 0]} fill="#60a5fa" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="data-card weather-card" id="weather">
            <div className="card-header">
              <div>
                <p>Weather Behavior</p>
                <h3>Weather Impact on Total Score</h3>
              </div>
              <span>05</span>
            </div>

            <div className="chart-box large">
              <ResponsiveContainer width="100%" height={330}>
                <BarChart
                  data={weatherChartData}
                  margin={{ top: 10, right: 16, left: -8, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(148, 163, 184, 0.12)"
                  />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: "rgba(34, 211, 238, 0.08)" }}
                    contentStyle={{
                      background: "rgba(2, 6, 23, 0.96)",
                      border: "1px solid rgba(96, 165, 250, 0.32)",
                      borderRadius: "14px",
                      color: "#f8fafc",
                      boxShadow: "0 18px 40px rgba(0, 0, 0, 0.35)",
                    }}
                    labelStyle={{
                      color: "#bfdbfe",
                      fontWeight: 900,
                    }}
                    itemStyle={{
                      color: "#7dd3fc",
                      fontWeight: 900,
                    }}
                    formatter={(value) => [String(value), "Avg Total Score"]}
                  />
                  <Bar dataKey="averageScore" radius={[12, 12, 0, 0]} fill="#22d3ee" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="data-card takeaways-card">
            <div className="card-header">
              <div>
                <p>Interpretation</p>
                <h3>Key Takeaways</h3>
              </div>
              <span>06</span>
            </div>

            <ul className="takeaway-list">
              <li>The dashboard is reading real NFL records from Firestore.</li>
              <li>Filters update indicators, rankings, weather impact and table rows.</li>
              <li>Home wins and away wins are calculated directly from final scores.</li>
              <li>Local cache reduces Firebase reads during development.</li>
            </ul>
          </article>
        </section>

        <section className="table-card" id="games">
          <div className="table-title">
            <div>
              <p>Game Records</p>
              <h3>Recent Games</h3>
            </div>

            <span>Showing {recentGames.length} rows</span>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Season</th>
                <th>Week</th>
                <th>Home Team</th>
                <th>Away Team</th>
                <th>Home Score</th>
                <th>Away Score</th>
                <th>Favorite</th>
                <th>Spread</th>
                <th>O/U</th>
                <th>Stadium</th>
              </tr>
            </thead>

            <tbody>
              {recentGames.map((game) => (
                <tr key={game.id}>
                  <td>{game.scheduleDate}</td>
                  <td>{game.scheduleSeason}</td>
                  <td>{game.scheduleWeek}</td>
                  <td>{game.teamHome}</td>
                  <td>{game.teamAway}</td>
                  <td className="home-score">{game.scoreHome}</td>
                  <td className="away-score">{game.scoreAway}</td>
                  <td>{game.teamFavoriteId ?? "N/A"}</td>
                  <td>{game.spreadFavorite ?? "N/A"}</td>
                  <td>{game.overUnderLine ?? "N/A"}</td>
                  <td>{game.stadium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </section>
    </main>
  );
}

export default App;