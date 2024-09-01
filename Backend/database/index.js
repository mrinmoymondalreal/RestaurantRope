import { configDotenv } from "dotenv";
configDotenv();

import pg from "pg";
const { Client } = pg;
const client = new Client({
  connectionString: process.env.databaseURL,
});
await client.connect();

export default client;
