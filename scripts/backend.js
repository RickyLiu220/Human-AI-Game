import express from "express";
import bcrypt from "bcrypt";
import sqlite3 from "sqlite3";
import cors from "cors";
import fetch from "node-fetch";



const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./users.db");

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    passwordHash TEXT,
    highscore INTEGER
  )
`);


db.run(`
  CREATE TABLE IF NOT EXISTS responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT
  )
`);


const responses = [
  "We need bold action on climate, healthcare, and economic justice. The future is shaped by what we do today—let’s fight for it together. #ClimateAction #GreenNewDeal #ForThePeople",
  "Every vote matters, every voice counts. We cannot wait for change to come to us—we have to demand it. #VotingMatters #PowerToThePeople",
  "Housing is a human right. We need policies that protect renters and make sure everyone has a safe place to call home. #HousingForAll",
  "Healthcare is not a privilege, it’s a right. Let’s fight for Medicare for All and a system that works for everyone. #MedicareForAll",
  "Our planet is on fire. Bold climate action isn’t optional—it’s necessary. #GreenNewDeal #ClimateJustice",
  "Income inequality is tearing our communities apart. We need policies that put working people first. #EconomicJustice",
  "Education should empower, not burden. We need free public college and student debt relief. #EducationForAll"
]

responses.forEach((text) => {
  db.run(`INSERT OR IGNORE INTO responses (text) VALUES (?)`, [text]);
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
  
    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
      if (err) return res.json({ success: false});
  
      if (!user) {
        // No user found
        return res.json({ success: false });
      }
  
      // Compare password with hash
      const match = await bcrypt.compare(password, user.passwordHash);
  
      if (match) {
        res.json({ success: true, id: user.id, highscore: user.highscore});
      } else {
        res.json({ success: false });
      }
    });
  });

  app.post("/signUp", (req, res) => {
    const {email, password} = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
      if (row) {
        return res.json({success: false, result: "Email already in use!"});
      }
    
      const hash = await bcrypt.hash(password, 10);
      const initScore = 0;

      db.run(
        `INSERT into users (email, passwordHash, highscore) VALUES (?, ?, ?)`,
        [email, hash, initScore],
        function (err) {
          return res.json({
            success: true, result: "Account created successfully!", userId: this.lastID, highscore: initScore 
          });
        }
      );

    });

  });
  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  app.get("/getPost", async (req, res) => {
    try {
      const response = await fetch(
        "https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=aoc.bsky.social&limit=20"
      );
      const data = await response.json();

      const randomIndex = Math.floor(Math.random() * data.feed.length);

      const post = data.feed[randomIndex].post.record.text;

      res.json({ text:post });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  app.get("/getAI", (req, res) => {
    db.get(
      `SELECT text FROM responses ORDER BY RANDOM() LIMIT 1`,
      [],
      (err, row) => {
        if (err) {
          return res.status(500).json({ error: "Database error" });
        }
        if (!row) {
          return res.status(404).json({ error: "No responses found" });
        }
        res.json({ text: row.text });
      }
    );
  });

  app.post("/updateScore", (req, res) => {
    const { userId, newScore } = req.body;
    console.log("Score: " + newScore);
    console.log("ID: " + userId);
    db.run(
      `UPDATE users 
      SET highscore = ? 
      WHERE id = ? AND (highscore IS NULL OR ? > highscore)`,
      [newScore, userId, newScore],
      function (err) {
        if (err) {
          return res.json({ success: false });
        } else {
          res.json({ success: true});
        }
      });
    });
  
    app.post("/getScore", (req, res) => {
      const { userId } = req.body;
  
      db.get(`SELECT highscore FROM users WHERE id = ?`, [userId], (err, row) => {
          if (err) {
              console.error(err);
              return res.json({ success: false });
          }
  
          if (!row) {
              return res.json({ success: false, message: "User not found" });
          }
  
          res.json({ success: true, highscore: row.highscore });
      });
  });


