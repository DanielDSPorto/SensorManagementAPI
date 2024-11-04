# Documentação da API Sensor Management

## Visão Geral

Esta documentação descreve como configurar e usar a API de Gerenciamento de Sensores. A API permite o envio de leituras de sensores para um banco de dados PostgreSQL.

## Pré-requisitos

- Docker e Docker Compose instalados
- Node.js e npm

## Configuração

### Arquivo `docker-compose.yml`

Certifique-se de ter o arquivo `docker-compose.yml` configurado no diretório raiz do seu projeto. Este arquivo define os serviços necessários para a execução da API, incluindo o banco de dados PostgreSQL utilizando uma imagem do Docker.

```yaml
services:
  postgres:
    image: postgres:latest
    container_name: SensorManagementDBContainer
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - postgres-network

volumes:
  postgres_data:

networks:
  postgres-network:
    external: true
```

### Template do Arquivo `.env`

Crie um arquivo `.env` no diretório raiz do seu projeto com as seguintes variáveis de ambiente. Estas variáveis serão usadas pelo Docker Compose e pela aplicação Node.js.

```plaintext
PORT=
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
UPLOADED_FILES_PATH=
```

### Script de Inicialização do Banco de Dados

Adapte o seguinte script SQL e mantenha-o na pasta raiz da aplicação para configurar o banco de dados PostgreSQL. Este script cria o usuário, o banco de dados e a tabela de leituras de sensores, se ainda não existirem. Ele será executado pelo nosso docker-compose.yaml ()

```sql
--init.sql
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
```

## Iniciar a Aplicação

1. **Baixar a Imagem do PostgreSQL**:

   ```sh
   docker pull postgres:latest
   ```

2. **Construir e Iniciar os Contêineres**:

   ```sh
   docker-compose up --build
   ```

3. **Instalar Dependências do projeto com o NPM**:
   Após iniciar os contêineres, acesse o contêiner da API e execute os comandos npm para instalar as dependências:

   ```sh
   npm install
   ```

4. **Execute o projeto**:
   Com tudo configurado, basta executar o comando abaixo para que a API comece a funcionar no seu computador
   ```sh
   npm run dev
   ```
