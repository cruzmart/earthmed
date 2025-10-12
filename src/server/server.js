// src/server/server.js
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { initdb } from "./init_db.js";
import { seedPlants } from "./seed_plants.js";

dotenv.config();

const app = express();

// CORS setup
const allowedOrigin =
  process.env.NODE_ENV === "production"
    ? "https://earthmed.vercel.app"
    : "http://localhost:5173";

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

// Database connection pool
const { HOST, USER, PASSWORD, DATABASE, PORT } = process.env;

const pool = mysql.createPool({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
  port: PORT ? Number(PORT) : 3306,
  ssl:{ rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
});

// Initialize tables on startup
(async () => {
  try {
    const db = await initdb();
    await db.end();
    console.log("✅ Database initialized");
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
  }
})();

// Manual seeding route (run once, then remove)
app.post("/api/admin/seed", async (req, res) => {
  try {
    await seedPlants();
    res.json({ message: "🌱 Plants seeded successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Seeding failed" });
  }
});


// --- ROUTES BELOW ---
app.get("/api/plants", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM plants");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch plants" });
  }
});

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

app.get("/api/plants/trending", async (req, res) => {
  let limit = parseInt(req.query.limit, 10);
  if (!limit || limit <= 0) limit = 3;

  try {
    const [rows] = await pool.execute(`
      SELECT p.*, COUNT(f.plant_id) AS favoritesCount FROM plants p
      LEFT JOIN favorites f ON p.id = f.plant_id
      GROUP BY p.id
      ORDER BY favoritesCount DESC
      LIMIT ${limit}
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// --- Only start the server locally ---
const LOCAL_PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== "production") {
  app.listen(LOCAL_PORT, () => {
    console.log(`🌱 Server running on http://localhost:${LOCAL_PORT}`);
  });
}

// Export for Vercel
export default app;
