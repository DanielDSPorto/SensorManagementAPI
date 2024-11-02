import { camelToSnakeCase } from "../utils/utilFunctions.js";
import pool from "./db.js";

class BaseRepository {
  static async getAll(table, columnsArray) {
    try {
      const baseQuery = `SELECT ${columnsArray.join()} FROM ${table}`;
      const results = await pool.query(baseQuery);
      return results.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getOne(table, columnsArray, id) {
    try {
      let baseQuery = `SELECT ${columnsArray.join()} FROM ${table} WHERE id = $1`;
      const results = await pool.query(baseQuery, [id]);
      return results.rows;
    } catch (error) {
      throw error;
    }
  }

  static async filteredGet(table, columnsArray, filterCriteriasArray) {
    try {
      let baseQuery = `SELECT ${columnsArray.join()} FROM ${table} WHERE 1 = 1 `;
      const filterValuesArray = filterCriteriasArray.map(
        (filterObj) => filterObj.columnValue
      );
      filterCriteriasArray.forEach(
        ({ columnName }, index) =>
          (baseQuery += `AND ${columnName} = $${index + 1} `)
      );
      baseQuery += ";";
      const results = await pool.query(baseQuery, filterValuesArray);
      return results.rows;
    } catch (error) {
      throw error;
    }
  }

  static async insertOne(table, insertObject) {
    const columns = Object.keys(insertObject);
    const columnsValues = columns.map((key) => insertObject[key]);
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const queryText = `INSERT INTO ${table} (${columns
        .map((columnName) => camelToSnakeCase(columnName))
        .join()}) VALUES(${Array.from(new Array(columns.length).keys())
        .map((num) => `$${num + 1}`)
        .join()}) RETURNING id`;
      const res = (await client.query(queryText, columnsValues)).rows[0].id;
      await client.query("COMMIT");
      return res;
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  static async updateById(table, updateObject, id) {
    const columns = Object.keys(updateObject);
    const columnsValues = columns.map((key) => updateObject[key]);
    let updateInfo = "";
    let index = 0;
    while (index < columns.length - 1) {
      updateInfo += `${columns[index]} = $${index + 1}, `;
      index++;
    }
    updateInfo += `${columns[index]} = $${index + 1} `;
    const client = await pool.connect();
    try {
      await client.query("BEGIN TRANSACTION");
      const queryText = `UPDATE ${table} SET ${updateInfo} WHERE id = $${
        index + 2
      } RETURNING ${columns.join()}`;

      const response = await client.query(queryText, [...columnsValues, id]);
      await client.query("COMMIT");
      return response.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

export default BaseRepository;
