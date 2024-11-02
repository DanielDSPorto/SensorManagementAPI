import ReadingsRepository from '../repositories/ReadingsRepository.js';
import FilterObject from '../utils/FilterObject.js';

export const getAllByEquipmentId = async (equipmentId) => {
  try {
    const filterObj = new FilterObject('equipment_id', equipmentId);
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
}
