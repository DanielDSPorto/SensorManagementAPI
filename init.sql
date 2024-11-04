CREATE USER sensor_management_user WITH PASSWORD '';

CREATE DATABASE SensorManagementDB OWNER sensor_management_user;

GRANT ALL PRIVILEGES ON DATABASE SensorManagementDB TO sensor_management_user;

\c SensorManagementDB;

CREATE TABLE readings (
    id SERIAL PRIMARY KEY,
    equipmentId VARCHAR(50) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    value REAL NOT NULL
);