# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

## Backend Setup (Node.js/Express + PostgreSQL + Docker)

### 1. Prerequisites
- Docker and Docker Compose installed
- Node.js (for local dev)

### 2. Start PostgreSQL with Docker Compose
From the project root:
```sh
docker-compose up -d
```
This will start a PostgreSQL container with default credentials (see .env).

### 3. Configure Backend Environment
Create a `.env` file in `node-backend/backend-node/` (see example below):
```
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=scalevolt_store
PORT=3002
```

### 4. Install Backend Dependencies
```
cd node-backend/backend-node
npm install
```

### 5. Run Database Schema Scripts
With Docker running, connect to the DB and run the schema scripts:
```
docker exec -it <your_postgres_container_name> psql -U postgres -d scalevolt_store -f /docker-entrypoint-initdb.d/cable_products_schema.sql
# Repeat for other .sql files as needed
```
Or, if you mapped a volume, you can run the scripts from your host:
```
psql -h localhost -U postgres -d scalevolt_store -f node-backend/db/cable_products_schema.sql
psql -h localhost -U postgres -d scalevolt_store -f node-backend/db/products_table.sql
psql -h localhost -U postgres -d scalevolt_store -f node-backend/db/quote_requests_table.sql
psql -h localhost -U postgres -d scalevolt_store -f node-backend/db/suppliers_table.sql
```

### 6. Start the Backend
```
npm start
```

The backend will run on http://localhost:3002

---
