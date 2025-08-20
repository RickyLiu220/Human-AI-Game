const express = require("express");
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./users.db");

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    passwordHash TEXT
  )
`);

const testEmail = "test@example.com";
const testPassword = "1234";

bcrypt.hash(testPassword, 10, (err, hash) => {
    if (err) throw err;
    db.run(
      `INSERT OR IGNORE INTO users (email, passwordHash) VALUES (?, ?)`,
      [testEmail, hash]
    );
  });

app.post("/login", (req, res) => {
    const { email, password } = req.body;
  
    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, row) => {
      if (err) return res.status(500).json({ success: false, message: "DB error" });
  
      if (!row) {
        // No user found
        return res.json({ success: false });
      }
  
      // Compare password with hash
      const match = await bcrypt.compare(password, row.passwordHash);
  
      if (match) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    });
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });