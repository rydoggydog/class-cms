// =====================================================================
// createuser.js  —  DAY 3: make an admin login from the terminal
// Run it with:  node createuser.js <username> <password>
//   example:    node createuser.js admin yourpasswordhere
// =====================================================================

// STEP 3.2 — Read the username and password from the command line
const bcrypt = require('bcryptjs');   // the password scrambler
const db = require('./db');

// process.argv = the words typed on the command line:
//   [0] = node   [1] = createuser.js   [2] = username   [3] = password
const username = process.argv[2];
const password = process.argv[3];

// Guard: if either is missing, explain how to use the script and quit.
if (!username || !password) {
  console.log('Usage: node createuser.js <username> <password>');
  process.exit(1);   // 1 = "ended with a problem"
}

// STEP 3.3 — Hash the password and save ONLY the hash
// hashSync(password, 10): the 10 is the "cost" — how slow (and so how hard
// to guess) the scramble is. bcrypt also adds random salt, so the same
// password gives a different hash every time.
const hash = bcrypt.hashSync(password, 10);

// The ? placeholders keep user input as plain data (no SQL injection).
db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, hash);

console.log('Created user: ' + username);
console.log('Stored hash: ' + hash);
