//helper that clears the database for testing purposes
import db from "./db/connection.js";
db.query("SET FOREIGN_KEY_CHECKS = 0");

db.query("TRUNCATE TABLE images;", (err) => {
  if (err) throw err;
  console.log("Images table cleared!");
});

db.query("TRUNCATE TABLE posts;", (err) => {
  if (err) throw err;
  console.log("Posts table cleared!");
});

db.query("TRUNCATE TABLE users;", (err) => {
  if (err) throw err;
  console.log("Users table cleared!");
});

db.query("SET FOREIGN_KEY_CHECKS = 1");
