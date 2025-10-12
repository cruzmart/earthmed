import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { plants } from "../data/plants.js";

dotenv.config();

const { HOST, USER, PASSWORD, DATABASE, PORT } = process.env;

const pool = await mysql.createPool({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DATABASE, // should be "defaultdb"
  port: PORT ? Number(PORT) : 3306,
  ssl: { rejectUnauthorized: false },
});

console.log("🛠 Creating tables in Aiven...");

await pool.execute(`
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

await pool.execute(`
  CREATE TABLE IF NOT EXISTS accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
  ) ENGINE=InnoDB;
`);

await pool.execute(`
  CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plant_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_fav (user_id, plant_id)
  ) ENGINE=InnoDB;
`);

for (const plant of plants) {
  const [rows] = await pool.execute(
    `SELECT id FROM plants WHERE scientificName = ?`,
    [plant.scientificName]
  );
  if (rows.length === 0) {
    await pool.execute(
      `INSERT INTO plants
        (name, scientificName, imageUrl, description, howToGrow, healthBenefit, foundInNature, citation, cost)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        plant.name,
        plant.scientificName,
        plant.imageUrl,
        plant.description,
        plant.howToGrow,
        plant.healthBenefit,
        plant.foundInNature,
        plant.citation,
        plant.cost,
      ]
    );
  }
}

console.log("✅ Tables created and plants inserted!");
await pool.end();