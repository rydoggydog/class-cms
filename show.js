// =====================================================================
// show.js  —  DAY 2: look inside a table
// Run it with:  node show.js
// =====================================================================

// STEP 2.7 — Ask the database for every row and print it like a spreadsheet
const db = require('./db');

// .all() returns every matching row as an array of objects.
const rows = db.prepare('SELECT * FROM posts').all();
console.table(rows);

// STEP 3.4 — (Day 3) Peek at the users table too.
// The deck has you CHANGE the query above to 'SELECT * FROM users'.
// We print both here so you can see each table.
// Where's the password? It isn't stored, only the hash.
const users = db.prepare('SELECT * FROM users').all();
console.table(users);

// ---------------------------------------------------------------------
// STEP 2.8 — SQL LAB: swap the text inside prepare('…') for each of these.
// Predict first, then run, then check.
//
//   SELECT title FROM posts
//   SELECT * FROM posts WHERE id = 2
//   SELECT * FROM posts ORDER BY id DESC
//   SELECT * FROM posts LIMIT 2
//   SELECT * FROM posts WHERE title LIKE '%Meeting%'
//
// Your turn — only the body of the last post:
//   SELECT body FROM posts ORDER BY id DESC LIMIT 1
// ---------------------------------------------------------------------
