import { Client } from "pg";

export const db = new Client({
  user: "postgres",
  database: "postgres",
  password: "password",
  host: "localhost",
  port: 5432,
});

db.connect();
// export const query = (query: string) => db.query(query);