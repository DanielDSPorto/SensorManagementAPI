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

  static async getTimeAggregatedAll(
    table,
    aggregationFunction,
    aggregationTarget,
    otherColumnsArray,
    aggregationTimeExpression,
    groupByArray,
    orderByArray
  ) {
    try {
      let baseQuery = `SELECT ${aggregationFunction}(${aggregationTarget}) ${
        otherColumnsArray.length ? `, ${otherColumnsArray.join()}` : ""
      }
       FROM ${table}
       WHERE ${aggregationTimeExpression} 
       ${groupByArray.length ? `GROUP BY ${groupByArray.join()}` : ""} 
       ${orderByArray.length ? `ORDER BY ${orderByArray.join()} DESC` : ""} 
       `;
      baseQuery += ";";
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

  static async filteredGet(
    table,
    columnsArray,
    filterCriteriasArray,
    orderByColumnName = ""
  ) {
    try {
      let baseQuery = `SELECT ${columnsArray.join()} FROM ${table} WHERE 1 = 1 `;
      const filterValuesArray = filterCriteriasArray.map(
        (filterObj) => filterObj.columnValue
      );
      filterCriteriasArray.forEach(
        ({ columnName }, index) =>
          (baseQuery += `AND ${columnName} = $${index + 1} `)
      );
      baseQuery +=
        orderByColumnName !== "" ? `ORDER BY ${orderByColumnName} ASC;` : ";";
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

  static async insertMultiple(table, parsedValuesArray) {
    const columns = parsedValuesArray.shift();
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      let queryText = `INSERT INTO ${table} (${columns
        .map((columnName) => camelToSnakeCase(columnName))
        .join()}) 
        VALUES `;
      for (let index = 0; index < parsedValuesArray.length; index++) {
        queryText += `(${Array.from(new Array(columns.length).keys())
          .map((num) => `$${index * columns.length + num + 1}`)
          .join()}), `;
      }
      queryText = queryText.slice(0, -2);
      await client.query(queryText, parsedValuesArray.flat());
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }
}

export default BaseRepository;
