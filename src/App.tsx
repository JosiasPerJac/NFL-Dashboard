import "./App.css";

function App() {
  return (
    <main className="dashboard">
      {/* Encabezado */}
      <section className="header">
        <p className="project-label">Proyecto 02 · Dashboard Interactivo</p>
        <h1>NFL Game Insights Dashboard</h1>
        <p className="description">
          Dashboard académico para explorar datos históricos de partidos de la NFL,
          incluyendo equipos, temporadas, marcadores, condiciones climáticas y tendencias.
        </p>
      </section>

      {/* Alertas */}
      <section className="alert">
        <span>✓</span>
        <p>Dataset seleccionado: NFL Scores and Betting Data</p>
      </section>

      {/* Selector */}
      <section className="card selector">
        <h2>Selector</h2>

        <div className="filters">
          <label>
            Temporada
            <select>
              <option>Todas las temporadas</option>
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
            </select>
          </label>

          <label>
            Equipo
            <select>
              <option>Todos los equipos</option>
              <option>Kansas City Chiefs</option>
              <option>Dallas Cowboys</option>
              <option>Green Bay Packers</option>
              <option>San Francisco 49ers</option>
            </select>
          </label>

          <label>
            Tipo de partido
            <select>
              <option>Temporada regular + Playoffs</option>
              <option>Temporada regular</option>
              <option>Playoffs</option>
            </select>
          </label>
        </div>
      </section>

      {/* Indicadores */}
      <section className="card indicators">
        <h2>Indicadores</h2>

        <div className="indicator-grid">
          <div className="indicator">
            <p>Total de partidos</p>
            <strong>12,842</strong>
          </div>

          <div className="indicator">
            <p>Promedio local</p>
            <strong>24.6</strong>
          </div>

          <div className="indicator">
            <p>Promedio visitante</p>
            <strong>21.1</strong>
          </div>

          <div className="indicator">
            <p>Favorito ganador</p>
            <strong>61.8%</strong>
          </div>
        </div>
      </section>

      {/* Gráfico */}
      <section className="card chart">
        <h2>Gráfico</h2>
        <p>Comparación visual inicial de puntos promedio por temporada.</p>

        <div className="fake-chart">
          <div style={{ height: "45%" }}></div>
          <div style={{ height: "60%" }}></div>
          <div style={{ height: "50%" }}></div>
          <div style={{ height: "75%" }}></div>
          <div style={{ height: "65%" }}></div>
          <div style={{ height: "80%" }}></div>
        </div>
      </section>

      {/* Tabla */}
      <section className="card table-section">
        <h2>Tabla</h2>

        <table>
          <thead>
            <tr>
              <th>Temporada</th>
              <th>Semana</th>
              <th>Local</th>
              <th>Visitante</th>
              <th>Marcador</th>
              <th>Estadio</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>2024</td>
              <td>18</td>
              <td>Kansas City Chiefs</td>
              <td>Buffalo Bills</td>
              <td>27 - 24</td>
              <td>GEHA Field</td>
            </tr>

            <tr>
              <td>2023</td>
              <td>17</td>
              <td>San Francisco 49ers</td>
              <td>Los Angeles Rams</td>
              <td>20 - 23</td>
              <td>Levi's Stadium</td>
            </tr>

            <tr>
              <td>2023</td>
              <td>16</td>
              <td>Green Bay Packers</td>
              <td>Detroit Lions</td>
              <td>28 - 21</td>
              <td>Lambeau Field</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Información adicional */}
      <section className="card info">
        <h2>Información adicional</h2>
        <p>
          En esta primera etapa se presenta la estructura base del dashboard.
          Posteriormente, los datos serán conectados desde Firebase y se agregarán
          gráficos dinámicos usando la información real del dataset seleccionado.
        </p>
      </section>
    </main>
  );
}

export default App;