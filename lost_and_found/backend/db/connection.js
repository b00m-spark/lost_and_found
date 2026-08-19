// This file is a connection between node.js server and MYSQL database
import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const isTest = process.env.NODE_ENV === "test" || process.env.VITEST === "true";

//create a connection to the database we created in MYSQL
const db = isTest
  ? {
      query() {
        throw new Error("Database query was called during a test without being mocked");
      },
    }
  : mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

if (!isTest) {
  db.connect((err) => {
    if (err) throw err;
    console.log("MySQL connected!");
  });
}

export default db;
