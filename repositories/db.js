import pg from 'pg';

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  onQueryStart: (query, { text, values }) => {
    console.log(query);
    console.log(
      `Starting query: ${text} with values: ${JSON.stringify(values)}`
    );
  },
  onQueryEnd: (query, { text, rows }) => {
    console.log(`Finished query: ${text} with rows: ${rows.length}`);
  },
  onQueryError: (query, { text, error }) => {
    console.error(`Error in query: ${text} with error: ${error.message}`);
  },
});

export async function fetchReadings() {
  try {
    const readings = await pool.query('SELECT * FROM readings');
    console.log(readings);
    return readings;
  } catch (error) {
    console.error(error);
  }
}

export default pool;
