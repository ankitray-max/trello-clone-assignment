const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "trello1",
  password: "10214",
  port: 5432,
});

module.exports = pool;