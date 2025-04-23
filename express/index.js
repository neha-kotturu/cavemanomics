require('dotenv').config();
const express = require("express");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

// log all incoming requests
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url, req.body);
  next();
});

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: false,
});

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, userId) => {
    if (err) return res.sendStatus(403);
    req.userId = userId;
    next();
  });
};


// =============================================
// USER AUTHENTICATION 

// User login
app.post("/api/login", [
  body("username").isAlphanumeric().isLength({ min: 3, max: 20 }),
  body("password").isLength({ min: 6, max: 100 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    const { username, password } = req.body;

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const fullUser = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (fullUser.rows.length == 0) return res.status(409).json({ error: "No user by that name exists" });

    const existingUser = fullUser.rows[0];
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) return res.status(401).json("Incorrect password");

    const token = jwt.sign(existingUser.id, process.env.JWT_SECRET);

    return res.status(200).json({ 
      token,
      user: {
        id: existingUser.id,
        username: existingUser.username,
        email: existingUser.email
      }
    });
  } catch (err) {
    return res.status(403).json({ error: 'Catch Error', details: err.message });
  }
});

// User registration
app.post("/api/register", [
  body("username").isAlphanumeric().isLength({ min: 3, max: 20 }),
  body("password").isLength({ min: 6, max: 100 }),
  body("email").isEmail(),
], async (req, res) => {
  const errors = validationResult(req);
  const { username, password, email } = req.body;

  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const existingUser = await pool.query("SELECT * FROM users WHERE email = $1 OR username = $2", [email, username]);
  if (existingUser.rows.length > 0) return res.status(409).json({ error: "Username or email already in use" });

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *",
      [username, hashedPassword, email]
    );
    res.json({ 
      message: "User added successfully!", 
      user: {
        id: result.rows[0].id,
        username: result.rows[0].username,
        email: result.rows[0].email
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating account" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



// =============================================
// ITEM LISTINGS

// get all items
app.get("/api/items", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT items.*, users.username as poster_name 
      FROM items 
      JOIN users ON items.poster_id = users.id
      ORDER BY items.id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});
