// src/server/server.js
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import { initdb } from "./init_db.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173" })); // frontend origin
app.use(express.json());

// MySQL pool configuration
const dbConfig = {
  host: "localhost",
  user: "plants123",
  password: "@+Plants1378201-",
  database: "plantsdb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};
const pool = mysql.createPool(dbConfig);

// Ensure DB and table exists at startup
await initdb();

// --- Get all plants ---
app.get("/api/plants", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM plants");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch plants" });
  }
});

// --- Filter endpoint ---
app.post("/api/filter", async (req, res) => {
  const filters = req.body; // { Name, Benefit, Description, Location, Cost }
  try {
    let query = `SELECT * FROM plants WHERE 1`;
    const params = [];

    // Build full-text search string dynamically
    const searchTerms = [];
    if (filters.Name) searchTerms.push(filters.Name);
    if (filters.Benefit) searchTerms.push(filters.Benefit);
    if (filters.Description) searchTerms.push(filters.Description);
    if (filters.Location) searchTerms.push(filters.Location);

    if (searchTerms.length) {
      query += ` AND MATCH(name, scientificName, description, howToGrow, healthBenefit, foundInNature, citation)
                AGAINST (? IN NATURAL LANGUAGE MODE)`;
      params.push(searchTerms.join(" "));
    }

    // Apply cost filter if set
    if (filters.Cost && Number(filters.Cost) > 0) {
      query += ` AND cost <= ?`;
      params.push(filters.Cost);
    }

    // Optionally order by relevance if full-text search is used
    if (searchTerms.length) {
      query += ` ORDER BY MATCH(name, scientificName, description, howToGrow, healthBenefit, foundInNature, citation)
                      AGAINST (? IN NATURAL LANGUAGE MODE) DESC`;
      // push the same search string again for ORDER BY
      params.push(searchTerms.join(" "));
    }

    console.log("SQL Query: ", query);
    console.log("Params: ", params);

    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to filter plants" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🌱 Server running on http://localhost:${PORT}`);
});
