class ReadingsDTO {
  constructor(equipment_id, timestamp, value) {
    this.equipment_id = equipment_id;
    this.timestamp = timestamp;
    this.value = value;
  }
}

export default ReadingsDTO;
