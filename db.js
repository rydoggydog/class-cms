// =====================================================================
// db.js  —  DAY 2: "One file talks to the database"
// ---------------------------------------------------------------------
// Only THIS file knows how the database is opened. Every other file
// just says  require('./db')  — define it once, reuse it everywhere
// (C.R.A.P.: Repetition).
//
//   server.js / seed.js / show.js  ->  db.js  ->  cms.db (file on disk)
// =====================================================================

// STEP 2.1 — Open the database
// node:sqlite is BUILT INTO Node (no npm install needed).
const { DatabaseSync } = require('node:sqlite');

// cms.db is a plain file. SQLite creates it the first time this runs.
const db = new DatabaseSync('cms.db');

// STEP 2.2 — Create the posts table
// The quotes here are BACKTICKS ( ` ), the key left of 1. Backticks let a
// string span multiple lines.
//   IF NOT EXISTS ............ safe to run again and again
//   PRIMARY KEY AUTOINCREMENT  unique id that counts up by itself (1, 2, 3…)
//   NOT NULL ................. the column can't be empty
//   DEFAULT .................. SQLite fills it in for us
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// STEP 3.1 — (Day 3) Create the users table
//   UNIQUE ....... no two users can share a username
//   password_hash  we NEVER store the password itself, only its hash
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
  )
`);

// STEP 2.3 — Share the database with other files
// Whatever we put in module.exports is what  require('./db')  hands back.
// Test this step with:  node db.js   (prints nothing; cms.db appears)
module.exports = db;
