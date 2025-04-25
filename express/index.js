const express = require("express");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const escape = require("pg-escape");
const path = require("path");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const dotenvResult = require('dotenv').config({ path: path.join(__dirname, '.env') });

const multer = require("multer");

// Set up Multer to store files in /uploads directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });


const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url, req.headers['content-type'], req.body);
  next();
});



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


app.post(
  "/api/login",
  [
    body("username").trim().isAlphanumeric().isLength({ min: 3, max: 20 }),
    body("password").isLength({ min: 6, max: 100 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      let { username, password } = req.body;
      console.log(username, password)

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const checkQuery = "SELECT * FROM users WHERE username = $1";
      const fullUser = await pool.query(checkQuery, [username]);
      if (fullUser.rows.length == 0) {
        return res.status(409).json({ error: "No user by that name exists" });
      }
      existingUser = fullUser.rows[0]

      const passwordMatch = await bcrypt.compare(password, existingUser.password);
      if (!passwordMatch) {
        return res.status(401).json("Incorrect password")
      }

      const token = jwt.sign(
        existingUser.id,
        process.env.JWT_SECRET, // a secret key stored in your env
      );
  
      return res.status(200).json({ token: token });
    }
    catch(err) {
      return res.status(403).json({ error: 'Catch Error', details: err.message });
    }
  }
);

app.post(
  "/api/register",
  [
    body("username").isAlphanumeric().isLength({ min: 3, max: 20 }),
    body("password").isLength({ min: 6, max: 100 }),
    body("email").contains("@"),
  ],
  async (req, res) => {
    console.log("handling submit")
    const errors = validationResult(req);
    let { username, password, email } = req.body;
    // username = escape.literal(username);

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

app.post("/api/upload", upload.single("image"), async (req, res) => {
  const { item_name, description, poster_id } = req.body;
  const imagePath = req.file ? req.file.filename : null;

  if (!item_name || !description || !poster_id || !imagePath) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO trade_items (item_name, description, image_path, poster_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [item_name, description, imagePath, poster_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Database error" });
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


