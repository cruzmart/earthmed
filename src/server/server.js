import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import { initdb } from "./init_db.js";

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();


const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const {host, user, password, database} = process.env;
const dbConfig = {
  host: host,
  user: user,
  password: password,
  database: database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};
const pool = mysql.createPool(dbConfig);

await initdb();

/**
 * @typedef {Object} Plant
 * @property {number} id
 * @property {string} name
 * @property {string} scientificName
 * @property {string} imageUrl
 * @property {string} description
 * @property {string} howToGrow
 * @property {string} healthBenefit
 * @property {string} foundInNature
 * @property {string} citation
 * @property {number} cost
 */

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} username
 */

/**
 * GET /api/plants
 * Fetch all plants in the database.
 *
 * @name GetAllPlants
 * @route {GET} /api/plants
 * @returns {Promise<Plant[]>} Array of all plants in the database
 */
app.get("/api/plants", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM plants");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch plants" });
  }
});

/**
 * POST /api/filter
 * Filter plants based on search terms and cost limit.
 *
 * @name FilterPlants
 * @route {POST} /api/filter
 * @param {Object} req.body
 * @param {string} [req.body.Name] - Filter by plant name or scientific name
 * @param {string} [req.body.Benefit] - Filter by health benefits
 * @param {string} [req.body.Description] - Filter by description keywords
 * @param {string} [req.body.Location] - Filter by foundInNature
 * @param {number} [req.body.Cost] - Maximum cost
 * @returns {Promise<Plant[]>} Array of plants matching filters
 *
 * @example
 * POST /api/filter
 * {
 *   "Name": "Mint",
 *   "Cost": 10
 * }
 */
app.post("/api/filter", async (req, res) => {
  const filters = req.body;
  try {
    let query = `SELECT * FROM plants WHERE 1`;
    const params = [];

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

    if (filters.Cost && Number(filters.Cost) > 0) {
      query += ` AND cost <= ?`;
      params.push(filters.Cost);
    }

    if (searchTerms.length) {
      query += ` ORDER BY MATCH(name, scientificName, description, howToGrow, healthBenefit, foundInNature, citation)
                      AGAINST (? IN NATURAL LANGUAGE MODE) DESC`;
      params.push(searchTerms.join(" "));
    }

    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to filter plants" });
  }
});

/**
 * POST /api/signup
 * Register a new user account.
 *
 * @name Signup
 * @route {POST} /api/signup
 * @param {Object} req.body
 * @param {string} [req.body.firstName] - User's first name
 * @param {string} [req.body.lastName] - User's last name
 * @param {string} req.body.username - Unique username
 * @param {string} req.body.password - User password
 * @returns {Promise<{message: string, user?: {id: number}}>} Success message and new user ID
 */
app.post("/api/signup", async (req, res) => {
  const { firstName, lastName, username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username & password required" });

  try {
    const [result] = await pool.execute(
      "INSERT INTO accounts (firstName, lastName, username, password) VALUES (?, ?, ?, ?)",
      [firstName || "", lastName || "", username, password],
    );
    res.json({ message: "Signup successful", user: { id: result.insertId } });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "Username already exists" });
    } else {
      console.error(err);
      res.status(500).json({ error: "Failed to sign up" });
    }
  }
});

/**
 * POST /api/login
 * Authenticate a user.
 *
 * @name Login
 * @route {POST} /api/login
 * @param {Object} req.body
 * @param {string} req.body.username
 * @param {string} req.body.password
 * @returns {Promise<{message: string, user?: User}>} Success message and user data
 */
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username & password required" });

  try {
    const [rows] = await pool.execute(
      "SELECT id, firstName, lastName, username FROM accounts WHERE username=? AND password=?",
      [username, password],
    );

    if (rows.length === 0)
      return res.status(401).json({ error: "Invalid credentials" });

    res.json({ message: "Login successful", user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to log in" });
  }
});

/**
 * GET /api/favorites/:user_id
 * Get all favorite plants for a specific user.
 *
 * @name GetFavorites
 * @route {GET} /api/favorites/:user_id
 * @param {string} req.params.user_id
 * @returns {Promise<Plant[]>} Array of favorited plants
 */
app.get("/api/favorites/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const [rows] = await pool.execute(
      `SELECT p.* FROM plants p
       JOIN favorites f ON p.id = f.plant_id
       WHERE f.user_id = ?`,
      [user_id],
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

/**
 * POST /api/favorite/toggle
 * Add or remove a plant from a user's favorites.
 *
 * @name ToggleFavorite
 * @route {POST} /api/favorite/toggle
 * @param {Object} req.body
 * @param {number} req.body.user_id
 * @param {number} req.body.plantId
 * @returns {Promise<{message: string, favorite: boolean}>} Status and new favorite state
 */
app.post("/api/favorite/toggle", async (req, res) => {
  const { user_id, plantId } = req.body;
  if (!user_id || !plantId)
    return res.status(400).json({ error: "user_id and plantId required" });

  try {
    const [existing] = await pool.execute(
      "SELECT * FROM favorites WHERE user_id=? AND plant_id=?",
      [user_id, plantId],
    );

    if (existing.length) {
      await pool.execute(
        "DELETE FROM favorites WHERE user_id=? AND plant_id=?",
        [user_id, plantId],
      );
      return res.json({ message: "Removed from favorites", favorite: false });
    } else {
      await pool.execute(
        "INSERT INTO favorites (user_id, plant_id) VALUES (?, ?)",
        [user_id, plantId],
      );
      return res.json({ message: "Added to favorites", favorite: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to toggle favorite" });
  }
});

/**
 * GET /api/plants/trending
 * Get top favorited plants (trending).
 *
 * @name GetTrendingPlants
 * @route {GET} /api/plants/trending
 * @query {number} [limit=3] - How many top plants to return
 * @returns {Promise<Plant[]>} Array of top favorited plants with count
 *
 * @example
 * GET /api/plants/trending?limit=5
 */
app.get("/api/plants/trending", async (req, res) => {
  let limit = parseInt(req.query.limit, 10);
  if (!limit || limit <= 0) limit = 3; // default to 3

  try {
    const [rows] = await pool.execute(`
      SELECT p.*, COUNT(f.plant_id) AS favoritesCount FROM plants p
      LEFT JOIN favorites f ON p.id = f.plant_id
      GROUP BY p.id
      ORDER BY favoritesCount DESC
      LIMIT ${limit}
    `);

    res.json(rows); // always an array
  } catch (err) {
    console.error(err);
    res.status(500).json([]); // fallback to empty array
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🌱 Server running on http://localhost:${PORT}`);
});



export default app;