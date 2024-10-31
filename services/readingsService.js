import ReadingsRepository from '../repositories/ReadingsRepository.js';
import FilterObject from '../utils/FilterObject.js';

export const getAllByEquipmentId = async (equipmentId) => {
  try {
    const filterObj = new FilterObject('equipment_id', equipmentId);
    console.log(filterObj);
    const results = await ReadingsRepository.filteredGet([filterObj]);
    return results;
  } catch (error) {
    throw error;
  }
};
