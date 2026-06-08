const csv = require("csvtojson");
const fs = require("fs");
const path = require("path");

const inputFile = path.join(__dirname, "../data/spreadspoke_scores.csv");
const outputFile = path.join(__dirname, "../data/nfl_games_clean.json");

function toNumber(value) {
  if (value === undefined || value === null || value === "") return null;

  const number = Number(value);
  return Number.isNaN(number) ? null : number;
}

async function convertCsvToCleanJson() {
  try {
    const rows = await csv().fromFile(inputFile);

    const cleanData = rows.map((row, index) => ({
      id: `game_${index + 1}`,

      scheduleDate: row.schedule_date,
      scheduleSeason: toNumber(row.schedule_season),
      scheduleWeek: row.schedule_week,
      schedulePlayoff: row.schedule_playoff === "TRUE",

      teamHome: row.team_home,
      teamAway: row.team_away,
      scoreHome: toNumber(row.score_home),
      scoreAway: toNumber(row.score_away),

      teamFavoriteId: row.team_favorite_id || null,
      spreadFavorite: toNumber(row.spread_favorite),
      overUnderLine: toNumber(row.over_under_line),

      stadium: row.stadium,
      stadiumNeutral: row.stadium_neutral === "TRUE",

      weatherTemperature: toNumber(row.weather_temperature),
      weatherWindMph: toNumber(row.weather_wind_mph),
      weatherHumidity: toNumber(row.weather_humidity),
      weatherDetail: row.weather_detail || null,
    }));

    fs.writeFileSync(outputFile, JSON.stringify(cleanData, null, 2));

    console.log("CSV convertido correctamente.");
    console.log(`Total de registros: ${cleanData.length}`);
    console.log(`Archivo generado: ${outputFile}`);
  } catch (error) {
    console.error("Error al convertir CSV:", error);
  }
}

convertCsvToCleanJson();