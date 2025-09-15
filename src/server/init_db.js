// src/server/init_db.js
import mysql from "mysql2/promise";

export async function initdb() {
  // This information is crucial to reconnect and work on the backend updating stuff btw.
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "plants123",
    password: "@+Plants1378201-",
    database: "plantsdb"
  });

  // Ensure table exists
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

  return connection;
}