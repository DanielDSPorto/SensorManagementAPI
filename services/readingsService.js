import ReadingsRepository from "../repositories/ReadingsRepository.js";
import FilterObject from "../utils/FilterObject.js";
import parseCSV from "../utils/csvParser.js";

export const getAllByEquipmentId = async (equipmentId) => {
  try {
    const filterObj = new FilterObject("equipment_id", equipmentId);
    const results = await ReadingsRepository.filteredGet([filterObj]);
    return results;
  } catch (error) {
    throw error;
  }
};

export const insertSensorReadingsData = async (sensorReadingsObj) => {
  try {
    const id = await ReadingsRepository.insertOne(sensorReadingsObj);
    return id;
  } catch (error) {
    throw error;
  }
};

export const getAvgValuesForWindowDuration = async (
  windowDurationInDays = 7
) => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - windowDurationInDays);
    const results = await ReadingsRepository.getTimeAggregatedAll(
      "AVG",
      startDate,
      endDate
    );
    return results;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const insertReadingsFromCSVFile = async (filePath, fileName) => {
  try {
    const parsedData = await parseCSV(filePath, fileName);
    await ReadingsRepository.insertMultiple(parsedData);
  } catch (error) {
    throw error;
  }
};

export const getAllEquipmentIds = async () => {
  try {
    const equipmentIds = await ReadingsRepository.getAllEquipmentIds();
    return equipmentIds;
  } catch (error) {
    throw error;
  }
};
