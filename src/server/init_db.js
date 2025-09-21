// src/server/init_db.js
import mysql from "mysql2/promise";

/**
 * Initializes the database connection and ensures that the required tables exist.
 * This includes `plants`, `accounts`, and `favorites`.
 *
 * @async
 * @function initdb
 * @returns {Promise<import("mysql2/promise").Connection>} Returns a promise that resolves
 * to a MySQL connection object ready for queries.
 *
 * @example
 * import { initdb } from "./init_db.js";
 * const db = await initdb();
 * const [rows] = await db.query("SELECT * FROM plants");
 */
export async function initdb() {
  // Connect to MySQL database
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "plants123",
    password: "@+Plants1378201-",
    database: "plantsdb",
  });

  // Ensure 'plants' table exists
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS plants (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      scientificName VARCHAR(255),
      imageUrl TEXT,
      description TEXT,
      howToGrow TEXT,
      healthBenefit TEXT,
      foundInNature TEXT,
      citation TEXT,
      cost DECIMAL(10,2),
      FULLTEXT(name, scientificName, description, howToGrow, healthBenefit, foundInNature, citation)
    ) ENGINE=InnoDB;
  `);

  // Ensure 'accounts' table exists
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      firstName VARCHAR(100),
      lastName VARCHAR(100),
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    ) ENGINE=InnoDB;
  `);

  // Ensure 'favorites' table exists with foreign key constraints
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      plant_id INT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES accounts(id) ON DELETE CASCADE,
      FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
      UNIQUE KEY unique_fav (user_id, plant_id)
    ) ENGINE=InnoDB;
  `);

  return connection;
}
