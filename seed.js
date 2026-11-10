// =====================================================================
// seed.js  —  DAY 2: fill the posts table with sample (test) data
// Run it with:  node seed.js
// =====================================================================

// STEP 2.4 — Load our shared database and list some sample posts
const db = require('./db');   // ./ means "a file in this same folder"

// An array of arrays: each inner array is [title, body].
const posts = [
  ['Welcome to the Club Blog', 'This is the very first post on our brand new CMS.'],
  ['Meeting Times', 'We meet every Tuesday after school in room 114.'],
  ['Spring Project Ideas', 'Vote for your favorite project idea at the next meeting.'],
  // STEP 2.18 (stretch) — a fourth post of our own
  ['Show and Tell Friday', 'Bring a site you built this month and show it off to the club.']
];

// STEP 2.6 — Clear the table first so this script is safe to run twice.
// (Without this line, running seed.js twice gave us SIX posts — each run
//  added three more rows. Engineering habit: make scripts idempotent.)
db.exec('DELETE FROM posts');

// STEP 2.5 — Insert the rows
// prepare() builds the SQL once. Each ? is a blank filled in by run().
const insert = db.prepare('INSERT INTO posts (title, body) VALUES (?, ?)');

// for...of loops over the array; [title, body] unpacks each inner array.
for (const [title, body] of posts) {
  insert.run(title, body);   // first ? = title, second ? = body
}

console.log('Added ' + posts.length + ' posts');
