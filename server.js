// =====================================================================
// server.js  —  the heart of the CMS (built across all 3 days)
// ---------------------------------------------------------------------
// Run it:   npm run dev     (restarts itself every time you save)
//      or:  node server.js  (must Ctrl+C and rerun after each change)
// Then visit http://localhost:3000
//
// Every route follows ONE pattern:   app.METHOD(PATH, [guard], FUNCTION)
//
//   URL              Who can visit     Step
//   /                Everyone          2.14
//   /post/:id        Everyone          2.16
//   /login           Everyone          3.9
//   /admin           Logged-in only    3.12
//   /admin/new       Logged-in only    3.15
//   /admin/edit/:id  Logged-in only    3.17
//   /admin/delete/:id (POST only)      3.18
// =====================================================================


// ---------------------------------------------------------------------
// STEP 1.5 — Set up: load our tools
// (Day 2 added db in STEP 2.11; Day 3 added session + bcrypt in STEP 3.5)
// ---------------------------------------------------------------------
const express = require('express');               // STEP 1.5 — the server framework
const session = require('express-session');       // STEP 3.5 — login memory (sessions + cookie)
const bcrypt = require('bcryptjs');               // STEP 3.5 — checks passwords against hashes
const db = require('./db');                       // STEP 2.11 — our shared SQLite database

const app = express();                            // STEP 1.5 — our server object
const PORT = 3000;                                // STEP 1.5 — the "door number"


// ---------------------------------------------------------------------
// STEP 2.11 — Wire up the pages
// ---------------------------------------------------------------------
app.set('view engine', 'ejs');      // build pages from templates in views/
app.use(express.static('public'));  // serve files in public/ as they are (style.css)


// ---------------------------------------------------------------------
// STEP 3.6 — Middleware: code that runs on EVERY request, before the route
// ---------------------------------------------------------------------

// STEP 3.6a — Turn submitted form data into req.body
// (without this, req.body.username would be undefined)
app.use(express.urlencoded({ extended: false }));

// STEP 3.6b — Turn on sessions. The browser gets a cookie holding only a
// random ID; the server keeps the note "this ID = admin" in its memory.
// (A real site would keep the secret out of the code — see Day 3 "What we
//  left out".)
app.use(session({
  secret: 'change-this-secret',   // used to sign the cookie
  resave: false,                  // don't re-save sessions that didn't change
  saveUninitialized: false        // don't make a session until someone logs in
}));

// STEP 3.6c — Make "user" available in EVERY template (header.ejs uses it)
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;   // logged-in user, or null
  next();                                       // "keep going to the route"
});


// ---------------------------------------------------------------------
// STEP 3.10a — The bouncer: requireLogin
// Put it between the path and the route function. If you're not logged
// in, you get redirected (302) to /login and the route never runs.
// ---------------------------------------------------------------------
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();   // logged in, let them through
}


// =====================================================================
// SCAFFOLDING HISTORY (removed in STEP 2.9 — kept here only as notes)
// Day 1 STEP 1.6 "Hello" route:
//   app.get('/', (req, res) => {
//     res.send('<h1>Hello from my server!</h1>');
//   });
// Day 1 STEP 1.10 (stretch) About route:
//   app.get('/about', (req, res) => {
//     res.send('<h1>About the Web Design Club</h1>');
//   });
// =====================================================================


// =====================================================================
// PUBLIC ROUTES (Day 2) — anyone can visit
// =====================================================================

// STEP 2.14 — Home page: list every post, newest first
app.get('/', (req, res) => {
  // Read (the R in CRUD): ask the database for all posts
  const posts = db.prepare('SELECT * FROM posts ORDER BY id DESC').all();
  // Fill views/index.ejs with that data. { posts } is short for { posts: posts }
  res.render('index', { posts });
});

// STEP 2.16 — One post. :id is a blank: /post/2 sets req.params.id to '2'
app.get('/post/:id', (req, res) => {
  // The ? keeps the visitor's URL text as plain DATA (no SQL injection).
  // .get() returns ONE row, or undefined if there isn't one.
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) {
    return res.status(404).send('Post not found');   // a real 404
  }
  res.render('post', { post });
});


// =====================================================================
// LOGIN ROUTES (Day 3, Phase 5) — authentication: "who are you?"
// =====================================================================

// STEP 3.9a — GET /login: show the empty form (no error yet)
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// STEP 3.9b — POST /login: check the username and password
app.post('/login', (req, res) => {
  // Pull the two form fields out of req.body (needs STEP 3.6a)
  const { username, password } = req.body;

  // Find the user by name
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  // Found them AND the typed password matches the stored hash?
  // compareSync hashes what they typed and compares the two scrambles.
  if (user && bcrypt.compareSync(password, user.password_hash)) {
    // Success: write the session note, then redirect (a 302!) to the dashboard
    req.session.user = { id: user.id, username: user.username };
    return res.redirect('/admin');
  }

  // Failure: show the form again. We don't say WHICH part was wrong.
  res.render('login', { error: 'Wrong username or password.' });
});

// STEP 3.11 — Log out: throw away the server's note about you.
// It's a POST because it changes something (links/GET can be prefetched).
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});


// =====================================================================
// ADMIN ROUTES (Day 3, Phase 6) — authorization: "what may you do?"
// Every one of these has requireLogin in the middle.
//
// Pattern: GET = show a page.  POST = change something, then REDIRECT
// (so refreshing the page doesn't resubmit the form).
// =====================================================================

// STEP 3.10b (temporary, replaced by STEP 3.12) was:
//   app.get('/admin', requireLogin, (req, res) => {
//     res.send('<h1>Welcome, ' + req.session.user.username + '</h1>');
//   });

// STEP 3.12 — Dashboard (READ): same as the home page, but behind the bouncer
app.get('/admin', requireLogin, (req, res) => {
  const posts = db.prepare('SELECT * FROM posts ORDER BY id DESC').all();
  res.render('dashboard', { posts });
});

// STEP 3.15a — CREATE, part 1: show an empty form (post: null = "new")
app.get('/admin/new', requireLogin, (req, res) => {
  res.render('edit', { post: null });
});

// STEP 3.15b — CREATE, part 2: receive the form and INSERT a row
app.post('/admin/new', requireLogin, (req, res) => {
  const { title, body } = req.body;
  db.prepare('INSERT INTO posts (title, body) VALUES (?, ?)').run(title, body);
  res.redirect('/admin');
});

// STEP 3.17a — UPDATE, part 1: show the form filled with the existing post
app.get('/admin/edit/:id', requireLogin, (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) {
    return res.status(404).send('Post not found');
  }
  res.render('edit', { post });
});

// STEP 3.17b — UPDATE, part 2: save the changes.
// The ? blanks fill IN ORDER: title, body, then the id for the WHERE.
// (UPDATE without a WHERE would change EVERY row!)
app.post('/admin/edit/:id', requireLogin, (req, res) => {
  const { title, body } = req.body;
  db.prepare('UPDATE posts SET title = ?, body = ? WHERE id = ?').run(title, body, req.params.id);
  res.redirect('/admin');
});

// STEP 3.18 — DELETE: POST only, never a GET link
// (browsers, prefetchers, and bots follow links — they'd delete posts!)
app.post('/admin/delete/:id', requireLogin, (req, res) => {
  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  res.redirect('/admin');
});


// ---------------------------------------------------------------------
// STEP 1.7 — Start listening. This stays at the very BOTTOM.
// It never "finishes"; it waits for requests (Ctrl+C stops it).
// ---------------------------------------------------------------------
app.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT);
});
