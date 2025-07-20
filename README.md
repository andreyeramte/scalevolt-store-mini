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

## **What You’re Seeing in pgAdmin**

- **localhost**: This is a connection you created to your local PostgreSQL server (the actual database instance running on your machine or in Docker).
- **PostgreSQL 17**: This is likely a default or extra server registration in pgAdmin, but it’s not connected (hence the red X).

**You only need one connection to your running PostgreSQL instance.**  
If you see your `scalevolt_store` database under `localhost` and can expand it (as in your screenshot), you are connected and ready to go!

---

## **What to Do Next**

### **A. You Don’t Need to Connect to Both**
- You only need to use the `localhost` connection if that’s where your database is running.
- The “PostgreSQL 17” entry is just a label. If it’s not configured with the right host/user/password, it won’t connect.

### **B. (Optional) Remove or Fix the Extra Server**
- You can right-click “PostgreSQL 17” and delete it if you want to avoid confusion.
- Or, right-click and “Properties” to set the host/user/password to match your running instance.

### **C. Use the Connected Server**
- All your database work (creating tables, running queries, etc.) should be done under the connected `localhost` server where you see your databases.

---

## **Summary Table**

| Server in pgAdmin | What it means                | Action Needed?         |
|-------------------|------------------------------|------------------------|
| localhost         | Your real, working database  | Use this one!          |
| PostgreSQL 17     | Extra/unused registration    | Delete or ignore       |

---

## **Next Steps for Backend Setup**

1. **Use the `localhost` connection in pgAdmin** for all your database work.
2. **Continue with the backend setup** as described in the README (run schema scripts, start backend, etc.).
3. **If you want to connect from your backend,** use these `.env` settings:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=scalevolt_store
   PORT=3002
   ```

---

If you want to test your connection or run SQL scripts, let me know and I’ll walk you through it!  
If you get any errors, copy them here and I’ll help you debug.
