// src/server/seed_plants.js
import { plants } from "../data/plants.js";
import { initdb } from "./init_db.js";

/**
 * Seed initial plants data if missing.
 */
export async function seedPlants() {
  const db = await initdb();

  for (const plant of plants) {
    const [rows] = await db.execute(
      `SELECT id FROM plants WHERE scientificName = ?`,
      [plant.scientificName]
    );

    if (rows.length === 0) {
      await db.execute(
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

  console.log("🌿 Seed completed successfully!");
  await db.end();
}
