// src/server/server.js

// --- IMPORTS ---
import express from "express";             // Web framework for Node.js
import cors from "cors";                   // Middleware to allow cross-origin requests
import mysql from "mysql2/promise";        // MySQL client with Promise support
import { initdb } from "./init_db.js";     // Custom function to ensure DB + table exist

// --- EXPRESS SETUP ---
const app = express();

// Enable CORS for your frontend only
app.use(cors({ origin: "http://localhost:5173" }));

// Enable JSON parsing for POST requests
app.use(express.json());

// --- MYSQL CONNECTION POOL ---
// Using a pool to reuse connections efficiently
const dbConfig = {
  host: "localhost",
  user: "plants123",
  password: "@+Plants1378201-",
  database: "plantsdb",
  waitForConnections: true,   // Queue requests if all connections are busy
  connectionLimit: 10,        // Max simultaneous connections
  queueLimit: 0               // No limit for queued requests
};
const pool = mysql.createPool(dbConfig);

// Ensure DB and table exist at startup
await initdb();

// --- GET ALL PLANTS ---
// Endpoint: GET /api/plants
// Returns all plants from the database
app.get("/api/plants", async (req, res) => {
  try {
    // Execute query to fetch all plants
    const [rows] = await pool.execute("SELECT * FROM plants");
    res.json(rows);  // Send results as JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch plants" });
  }
});

// --- FILTER / SEARCH PLANTS ---
// Endpoint: POST /api/filter
// Accepts filters in request body and returns matching plants
app.post("/api/filter", async (req, res) => {
  const filters = req.body; // Expected: { Name, Benefit, Description, Location, Cost }

  try {
    // Base query with full-text relevance calculation
    let query = `
      SELECT *,
             MATCH(name, scientificName, description, howToGrow, healthBenefit, foundInNature, citation)
             AGAINST (? IN NATURAL LANGUAGE MODE) AS relevance
      FROM plants
      WHERE 1
    `;
    const params = [];  // Will store values for placeholders (?)

    // Build full-text search string dynamically from filters
    let searchTerms = [];
    if (filters.Name) searchTerms.push(filters.Name);
    if (filters.Benefit) searchTerms.push(filters.Benefit);
    if (filters.Description) searchTerms.push(filters.Description);
    if (filters.Location) searchTerms.push(filters.Location);

    // If there are search terms, add full-text condition
    if (searchTerms.length) {
      query += ` AND MATCH(name, scientificName, description, howToGrow, healthBenefit, foundInNature, citation)
                 AGAINST (? IN NATURAL LANGUAGE MODE)`;
      params.push(searchTerms.join(" "));  // Join all terms with spaces
    }

    // Apply numeric Cost filter if provided
    if (filters.Cost && Number(filters.Cost) > 0) {
      query += ` AND cost <= ?`;
      params.push(filters.Cost);
    }

    // Sort results by full-text relevance (highest match first)
    query += ` ORDER BY relevance DESC`;

    // Execute the query with parameterized values
    const [rows] = await pool.execute(query, params);
    res.json(rows); // Send filtered plants back to frontend
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to filter plants" });
  }
});

// --- START SERVER ---
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🌱 Server running on http://localhost:${PORT}`);
});
