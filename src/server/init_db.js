// src/server/init_db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

/**
 * Initialize database and ensure required tables exist...
 */
export async function initdb() {
  const { HOST, USER, PASSWORD, DATABASE, PORT } = process.env;

  const connection = await mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
    port: PORT ? Number(PORT) : 3306,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
  });

  console.log("✅ Connected to database:", HOST);

  // Create tables if missing
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

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      firstName VARCHAR(100),
      lastName VARCHAR(100),
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    ) ENGINE=InnoDB;
  `);

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
