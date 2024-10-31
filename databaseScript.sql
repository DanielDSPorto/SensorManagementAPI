CREATE TABLE sensors (
    id SERIAL PRIMARY KEY,
    equipment_id VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE sensor_readings (
    id SERIAL PRIMARY KEY,
    sensor_id INTEGER REFERENCES sensors(id),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    value REAL NOT NULL
);