const express = require("express");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const escape = require("pg-escape");
const path = require("path");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const dotenvResult = require('dotenv').config({ path: path.join(__dirname, '.env') });
const multer = require("multer");
const fs = require("fs");

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
  ssl: false
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });


app.post(
  "/api/validate",
  [
    body("token"),
  ],
  async (req, res) => {
    const { token } = req.body;
    try {
      console.log("Token:", token)
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (!payload) throw new Error("Invalid token")
      res.status(200).json({ ok: true, username: payload.username, userid: payload.userId });
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
});

app.post(
  "/api/login",
  [
    body("username").isAlphanumeric().isLength({ min: 3, max: 20 }),
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
        process.env.JWT_SECRET,
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

app.post(
    "/api/postText",
    async (req, res) => {
        const errors = validationResult(req);
        let {matchedId, text, index, username} = req.body;

        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        try {
          const result = await pool.query(
            "INSERT INTO chatlogs (matched_id, text, index, username) VALUES ($1, $2, $3, $4) RETURNING *",
            [matchedId, text, index, username]
          );
          res.json({ message: "Text posted successfully." });
        } catch (err) {
          console.error("Database error:", err);
          res.status(500).json({ error: "Database error" });
        }
    }
);

app.post(
    "/api/getTexts",
    async (req, res) => {
        try {
            const result = await pool.query("SELECT text FROM chatlogs WHERE matched_id = $1",
                [req.body.matchedId]);
            const result2 = await pool.query("SELECT index FROM chatlogs WHERE matched_id = $1",
                [req.body.matchedId]);
            const result3 = await pool.query("SELECT username FROM chatlogs WHERE matched_id = $1",
                [req.body.matchedId]);

            const objects = [];
            for (let i = 0; i < result.rows.length; i++) {
                objects.push({ "text": result.rows[i].text, "index": result2.rows[i].index, "username": result3.rows[i].username });
            }
            res.json(objects);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Database error" });
        }
    }
);

app.post(
    "/api/getIndices",
    async (req, res) => {
        try {
            const result = await pool.query("SELECT index FROM chatlogs WHERE matched_id = $1",
                [req.body.matchedId]);
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Database error" });
        }
    }
);

// Get matches for user
app.post(
    "/api/getMatches",
    async (req, res) => {
        try {
            const result = await pool.query("SELECT id FROM matches WHERE user_1 = $1 OR user_2 = $1",
                [req.body.userId]);

            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Database error" });
        }
    }
);

app.post("/api/upload", upload.single("image"), async (req, res) => {
  let { item_name, description, poster_id } = req.body;
  const imagePath = req.file ? req.file.filename : null;

  if (!item_name || !description || !poster_id || !imagePath) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO items (item_name, description, image_path, poster_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [item_name, description, imagePath, poster_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

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
  
// =============================================
// SWIPES

app.post("/api/swipes", async (req, res) => {
  try {
    const { item_id, poster_id, liker_id } = req.body;
    
    const checkSwipeQuery = `
      SELECT * FROM swipes
      WHERE liker_id = $1 AND item_id = $2
    `;
    const existingSwipe = await pool.query(checkSwipeQuery, [liker_id, item_id]);
    if (existingSwipe.rows.length > 0) {
      return res.status(200).json({ message: "Swipe already recorded." });
    }

    const result = await pool.query(
      "INSERT INTO swipes (poster_id, liker_id, item_id) VALUES ($1, $2, $3) RETURNING *",
      [poster_id, liker_id, item_id]
    );

    // check for match
    const checkMatchQuery = `
      SELECT s1.item_id as item1, s2.item_id as item2
      FROM swipes s1
      JOIN swipes s2 ON s1.poster_id = s2.liker_id AND s1.liker_id = s2.poster_id
      WHERE s1.liker_id = $1 AND s2.liker_id = $2
    `;
    const matchResult = await pool.query(checkMatchQuery, [liker_id, poster_id]);

    if (matchResult.rows.length > 0) {
      // create match record
      const match = matchResult.rows[0];
      
      const [user1, user2] = [poster_id, liker_id];
      const [item1, item2] = [match.item1, match.item2] 

      const existingMatch = await pool.query(
        "SELECT * FROM matches WHERE (user_1 = $1 AND user_2 = $2) OR (user_1 = $2 AND user_2 = $1)",
        [user1, user2]
      );

      if (existingMatch.rows.length === 0) {
        await pool.query(
          "INSERT INTO matches (user_1, user_2, item_id_1, item_id_2) VALUES ($1, $2, $3, $4)",
          [user1, user2, item1, item2]
        );
      }

      return res.status(201).json({
        swipe: result.rows[0],
        match: true,
        matchedUser: poster_id,
        matchedItems: { item1, item2 }
      });
    }

    res.status(201).json({
      swipe: result.rows[0],
      match: false
    });

  } catch (err) {
    console.error("Error processing swipe:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.use(express.static(path.join(__dirname, '../build')));
  
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

