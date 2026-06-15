import type { NflGame } from "../types/nflGame";

type RecentGamesTableProps = {
  games: NflGame[];
};

export function RecentGamesTable({ games }: RecentGamesTableProps) {
  return (
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
  );
}