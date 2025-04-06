const express = require("express");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const escape = require("pg-escape");
const path = require("path");
const cors = require("cors");
const dotenvResult = require('dotenv').config({ path: path.join(__dirname, '.env') });
console.log("dotenv loaded:", dotenvResult);
console.log(process.env);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());


const { Pool } = require("pg");
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  pool_mode: process.env.DB_POOLMODE,
  ssl: false // Add this for Supabase SSL support
});

// 🛡️ Secure POST Request: Add User
app.post(
  "/api/register",
  [
    body("username").trim().isAlphanumeric().isLength({ min: 3, max: 20 }),
    body("password").isLength({ min: 6, max: 100 }),
    body("email").contains("@"),
  ],
  async (req, res) => {
    console.log("handling submit")
    const errors = validationResult(req);
    let { username, password, email } = req.body;
    username = escape.literal(username);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const checkQuery = "SELECT * FROM users WHERE email = $1 OR username = $2";
    const existingUser = await pool.query(checkQuery, [email, username]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: "Username or email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const result = await pool.query(
        "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *",
        [username, hashedPassword, email]
      );
      res.json({ message: "User added successfully!", user: result.rows[0] });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Database error" });
    }
  }
);

// Test database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error", err);
  } else {
    console.log("Database connected at", res.rows[0].now);
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});


// Serve React frontend in production
app.use(express.static(path.join(__dirname, '../build')));

// Uncomment if you want to only see raw express backend in dev
// if (process.env.NODE_ENV === "production") {
//     app.use(express.static("client/build"));
  
//     app.get("*", (req, res) => {
//       res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//     });
//   }

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
