import pg from "pg";

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export async function fetchReadings() {
  try {
    const readings = await pool.query("SELECT * FROM readings");
    return readings;
  } catch (error) {
    throw error;
  }
}

export default pool;
