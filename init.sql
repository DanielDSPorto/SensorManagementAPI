CREATE USER sensor_management_user WITH PASSWORD 'Postgres@Radix';
CREATE DATABASE SensorManagementDB OWNER sensor_management_user;
GRANT ALL PRIVILEGES ON DATABASE SensorManagementDB TO sensor_management_user;
