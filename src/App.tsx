import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { getGamesFromFirestore } from "./services/gamesService";
import type { NflGame } from "./types/nflGame";
import {
  getAverageAwayScore,
  getAverageHomeScore,
  getFavoriteWinPercentage,
} from "./utils/dashboardStats";

function App() {
  const [games, setGames] = useState<NflGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGames() {
      try {
        const firestoreGames = await getGamesFromFirestore();
        setGames(firestoreGames);
        console.log("Games from Firestore:", firestoreGames);
      } catch (error) {
        console.error("Error loading games:", error);
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, []);

  const averageHomeScore = useMemo(() => getAverageHomeScore(games), [games]);
  const averageAwayScore = useMemo(() => getAverageAwayScore(games), [games]);
  const favoriteWinPercentage = useMemo(
    () => getFavoriteWinPercentage(games),
    [games]
  );

  return (
    <main className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">NFL</div>
          <p>Game Insights</p>
        </div>

        <nav className="sidebar-nav">
          <a className="active" href="#overview">Overview</a>
          <a href="#teams">Teams</a>
          <a href="#seasons">Seasons</a>
          <a href="#betting">Betting Trends</a>
          <a href="#weather">Weather Impact</a>
          <a href="#games">Game Table</a>
        </nav>

        <div className="sidebar-art">
          <div className="football"></div>
          <p>Historical NFL analytics</p>
        </div>
      </aside>

      <section className="dashboard-content">
        <header className="topbar">
          <h1>NFL Game Insights Dashboard</h1>

          <nav className="topbar-nav">
            <a className="selected" href="#overview">Overview</a>
            <a href="#teams">Teams</a>
            <a href="#seasons">Seasons</a>
            <a href="#betting">Betting Trends</a>
            <a href="#weather">Weather Impact</a>
            <a href="#games">Game Table</a>
          </nav>

          <div className="topbar-actions">
            <button>⌕</button>
            <button>◔</button>
            <button className="avatar">J</button>
          </div>
        </header>

        <section className="hero-kpi-grid" id="overview">
          <article className="hero-card">
            <div>
              <p className="section-label">Academic dashboard · Kaggle dataset</p>
              <h2>Actionable insights from every snap.</h2>
              <p>
                Explore historical NFL games with a focus on scores, team performance,
                betting context, weather conditions and trends across every season.
              </p>
              <span className="firebase-status">
                {loading
                  ? "Loading Firebase data..."
                  : `Firebase connected · ${games.length} games loaded`}
              </span>
            </div>

            <div className="hero-visual">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </article>

          <section className="kpi-grid">
            <article className="kpi-card">
              <div className="kpi-icon">↗</div>
              <p>Total Games Analyzed</p>
              <strong>{loading ? "..." : games.length}</strong>
              <small>Loaded from Firestore</small>
            </article>

            <article className="kpi-card">
              <div className="kpi-icon blue">⌂</div>
              <p>Average Home Team Score</p>
              <strong>{loading ? "..." : averageHomeScore}</strong>
              <small>Based on loaded games</small>
            </article>

            <article className="kpi-card">
              <div className="kpi-icon red">✈</div>
              <p>Average Away Team Score</p>
              <strong>{loading ? "..." : averageAwayScore}</strong>
              <small>Based on loaded games</small>
            </article>

            <article className="kpi-card">
              <div className="kpi-icon purple">★</div>
              <p>Favorite Win Percentage</p>
              <strong>
                {loading ? "..." : `${favoriteWinPercentage}%`}
              </strong>
              <small>When favorite data exists</small>
            </article>
          </section>
        </section>

        <section className="filter-bar">
          <label>
            Season
            <select>
              <option>All Seasons</option>
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
            </select>
          </label>

          <label>
            Team
            <select>
              <option>All Teams</option>
              <option>Kansas City Chiefs</option>
              <option>Dallas Cowboys</option>
              <option>Green Bay Packers</option>
              <option>San Francisco 49ers</option>
            </select>
          </label>

          <label>
            Week
            <select>
              <option>All Weeks</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>Playoffs</option>
            </select>
          </label>

          <label>
            Type
            <select>
              <option>Regular Season + Playoffs</option>
              <option>Regular Season</option>
              <option>Playoffs</option>
            </select>
          </label>

          <label>
            Weather
            <select>
              <option>All Conditions</option>
              <option>Clear</option>
              <option>Rain</option>
              <option>Snow</option>
            </select>
          </label>

          <button>Reset Filters</button>
        </section>

        <section className="analytics-grid">
          <article className="chart-card">
            <div className="card-header">
              <h3>Average Points by Season</h3>
              <span>ⓘ</span>
            </div>

            <div className="line-chart">
              <span className="line home-line"></span>
              <span className="line away-line"></span>
              <div className="axis-labels">
                <small>'05</small>
                <small>'09</small>
                <small>'13</small>
                <small>'17</small>
                <small>'21</small>
                <small>'24</small>
              </div>
            </div>
          </article>

          <article className="chart-card">
            <div className="card-header">
              <h3>Home Wins vs Away Wins</h3>
              <span>ⓘ</span>
            </div>

            <div className="bar-chart">
              {Array.from({ length: 10 }).map((_, index) => (
                <div className="bar-group" key={index}>
                  <span
                    className="bar home-bar"
                    style={{ height: `${45 + (index % 4) * 10}%` }}
                  ></span>
                  <span
                    className="bar away-bar"
                    style={{ height: `${35 + (index % 3) * 9}%` }}
                  ></span>
                </div>
              ))}
            </div>
          </article>

          <article className="chart-card">
            <div className="card-header">
              <h3>Top Teams by Total Wins</h3>
              <span>ⓘ</span>
            </div>

            <div className="ranking-list">
              {[
                ["Dallas Cowboys", 168],
                ["Green Bay Packers", 159],
                ["Pittsburgh Steelers", 157],
                ["New England Patriots", 154],
                ["San Francisco 49ers", 152],
              ].map(([team, wins]) => (
                <div className="ranking-row" key={team}>
                  <p>{team}</p>
                  <div>
                    <span style={{ width: `${Number(wins) / 1.8}%` }}></span>
                  </div>
                  <strong>{wins}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="chart-card">
            <div className="card-header">
              <h3>Point Spread vs Final Score Difference</h3>
              <span>ⓘ</span>
            </div>

            <div className="scatter-chart">
              {Array.from({ length: 55 }).map((_, index) => (
                <span
                  key={index}
                  style={{
                    left: `${8 + ((index * 17) % 84)}%`,
                    top: `${12 + ((index * 31) % 72)}%`,
                  }}
                ></span>
              ))}
              <i></i>
            </div>
          </article>

          <article className="chart-card wide">
            <div className="card-header">
              <h3>Weather Impact on Total Score</h3>
              <span>ⓘ</span>
            </div>

            <div className="weather-chart">
              <div><span style={{ height: "86%" }}></span><small>Clear</small></div>
              <div><span style={{ height: "74%" }}></span><small>Cloudy</small></div>
              <div><span style={{ height: "61%" }}></span><small>Rain</small></div>
              <div><span style={{ height: "48%" }}></span><small>Snow</small></div>
            </div>
          </article>

          <article className="chart-card wide key-card">
            <div className="card-header">
              <h3>Key Takeaways</h3>
              <span>★</span>
            </div>

            <ul>
              <li>Home teams usually perform better than away teams.</li>
              <li>Weather conditions can influence total scoring.</li>
              <li>Point spread can be compared with final score difference.</li>
              <li>Firestore data is now connected to the dashboard.</li>
            </ul>
          </article>
        </section>

        <section className="table-card" id="games">
          <div className="table-title">
            <h3>Recent Games</h3>
            <button>View Full Game Table →</button>
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
              {games.slice(0, 8).map((game) => (
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