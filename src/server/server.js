
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import { initdb } from "./init_db.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

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

// --- Filter plants ---
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

// --- Signup ---
app.post("/api/signup", async (req, res) => {

  
  const { firstName, lastName, username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Username & password required" });

  try {
    const [result] = await pool.execute(
      "INSERT INTO accounts (firstName, lastName, username, password) VALUES (?, ?, ?, ?)",
      [firstName || "", lastName || "", username, password]
    );
    res.json({ message: "Signup successful", user: result[0]});
     
    
  } catch (err) {
    
    if (err.code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "Username already exists" });
    } else {
      console.error(err);
      res.status(500).json({ error: "Failed to sign up" });
    }
  }
});

// --- Login ---
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Username & password required" });

  try {
    const [rows] = await pool.execute(
      "SELECT id, firstName, lastName, username FROM accounts WHERE username=? AND password=?",
      [username, password]
    );

    console.log(rows);

    if (rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ message: "Login successful", user: rows[0] }); // here we got the user data which will be a dictionary ish thing
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to log in" });
  }
});

// --- Get user's favorites ---
app.get("/api/favorites/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    // We find in the favourites database all of the plants the user has favourited by atching the id of the user and the id that is on the plant in favourites
    const [rows] = await pool.execute(
      `SELECT p.* FROM plants p
       JOIN favorites f ON p.id = f.plant_id
       WHERE f.user_id = ?`,
      [user_id]
    );
    res.json(rows); // returns all of the rows of plants the user has favourited
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

// --- Toggle favorite ---
app.post("/api/favorite/toggle", async (req, res) => {
  const { user_id, plantId } = req.body;
  if (!user_id || !plantId) return res.status(400).json({ error: "user_id and plantId required" });

  try {
    // Check if exists
    const [existing] = await pool.execute(
      "SELECT * FROM favorites WHERE user_id=? AND plant_id=?",
      [user_id, plantId]
    );

    if (existing.length) {
      // Remove
      await pool.execute("DELETE FROM favorites WHERE user_id=? AND plant_id=?", [user_id, plantId]);
      return res.json({ message: "Removed from favorites", favorite: false });
    } else {
      // Add
      await pool.execute("INSERT INTO favorites (user_id, plant_id) VALUES (?, ?)", [user_id, plantId]);
      return res.json({ message: "Added to favorites", favorite: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to toggle favorite" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🌱 Server running on http://localhost:${PORT}`);
});