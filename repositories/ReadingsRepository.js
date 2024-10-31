import BaseRepository from './BaseRepository.js';

class ReadingsRepository extends BaseRepository {
  static async getAll() {
    try {
      const results = await super.getAll('readings', [
        'id',
        'equipment_id',
        'timestamp',
        'value',
      ]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  static async filteredGet(filterCriteriasArray) {
    try {
      const results = await super.filteredGet(
        'readings',
        ['id', 'equipment_id', 'timestamp', 'value'],
        filterCriteriasArray
      );
    } catch (error) {
      throw error;
    }
  }
}

export default ReadingsRepository;
