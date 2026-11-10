// =====================================================================
// check.js  —  DAY 1, STEP 1.3: "Stack check: is everything installed?"
// ---------------------------------------------------------------------
// Purpose: load every piece of our stack one at a time. If a piece is
// missing, Node crashes on THAT line, so the error tells you exactly
// which package didn't install.
//
// Run it (STEP 1.4):   node check.js
// You want five [ok] lines and "Your stack is ready!"
// =====================================================================

// STEP 1.3a — Print the Node version (must be 22.13 or newer for SQLite)
console.log('Node version: ' + process.version);

// STEP 1.3b — Express: the server framework (the "waiter")
require('express');
console.log('[ok] express');

// STEP 1.3c — EJS: HTML templates with blanks (the "plating")
require('ejs');
console.log('[ok] ejs');

// STEP 1.3d — express-session: remembers who is logged in (used Day 3)
require('express-session');
console.log('[ok] express-session');

// STEP 1.3e — bcryptjs: scrambles (hashes) passwords (used Day 3)
require('bcryptjs');
console.log('[ok] bcryptjs');

// STEP 1.3f — SQLite: our database (the "pantry").
// It's BUILT INTO Node, so we never ran npm install for it.
// Watch the capital letters: DatabaseSync
const { DatabaseSync } = require('node:sqlite');
const testDb = new DatabaseSync(':memory:');   // a throwaway in-memory database
testDb.exec('CREATE TABLE test (id INTEGER)');  // prove SQL actually runs
console.log('[ok] sqlite');

console.log('Your stack is ready!');
