import type { GameRow } from "../data/dashboardMock";

type RecentGamesTableProps = {
  games: GameRow[];
};

export function RecentGamesTable({ games }: RecentGamesTableProps) {
  return (
    <section className="table-card" id="games">
      <div className="table-header">
        <h3>Recent Games</h3>
        <button className="table-action">View Full Game Table →</button>
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
          {games.map((game) => (
            <tr key={`${game.date}-${game.homeTeam}-${game.awayTeam}`}>
              <td>{game.date}</td>
              <td>{game.season}</td>
              <td>{game.week}</td>
              <td>{game.homeTeam}</td>
              <td>{game.awayTeam}</td>
              <td className="score-home">{game.homeScore}</td>
              <td className="score-away">{game.awayScore}</td>
              <td>{game.favorite}</td>
              <td className={game.spread.startsWith("+") ? "spread-positive" : "spread-negative"}>
                {game.spread}
              </td>
              <td>{game.overUnder}</td>
              <td>{game.stadium}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}