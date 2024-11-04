import BaseRepository from "./BaseRepository.js";

class ReadingsRepository extends BaseRepository {
  static async getAll() {
    try {
      const results = await super.getAll("readings", [
        "id",
        "equipment_id",
        "timestamp",
        "value",
      ]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  static async filteredGet(filterCriteriasArray) {
    try {
      const results = await super.filteredGet(
        "readings",
        ["id", "equipment_id", "timestamp", "value"],
        filterCriteriasArray
      );
      return results;
    } catch (error) {
      throw error;
    }
  }

  static async getTimeAggregatedAll(
    aggregationFunction,
    windowStartDate,
    windowEndDate,
    orderByArray = []
  ) {
    try {
      const aggregationTimeExpression = `timestamp > CAST('${windowStartDate.toISOString()}' as TIMESTAMP)
      AND timestamp <= CAST('${windowEndDate.toISOString()}' as TIMESTAMP) `;
      const results = await super.getTimeAggregatedAll(
        "readings",
        aggregationFunction,
        "value",
        [
          "equipment_id",
          `format('%s - %s', '${windowStartDate.toLocaleString()}' , '${windowEndDate.toLocaleString()}') as interval`,
        ],
        aggregationTimeExpression,
        ["equipment_id"],
        orderByArray
      );
      return results;
    } catch (error) {
      throw error;
    }
  }

  static async insertOne(sensorReadingObj) {
    try {
      const id = await super.insertOne("readings", sensorReadingObj);
      return id;
    } catch (error) {
      throw error;
    }
  }

  static async insertMultiple(parsedValuesArray) {
    try {
      await super.insertMultiple("readings", parsedValuesArray);
    } catch (error) {
      throw error;
    }
  }
}

export default ReadingsRepository;
