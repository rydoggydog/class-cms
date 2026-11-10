# Class CMS — Step-by-Step Walkthrough

Every step below has a matching `STEP x.y` comment in the code.
In VS Code press **Ctrl+Shift+F** and search for `STEP 2.14` (for example) to jump straight to it.

Step numbers: the first number is the **day**, the second is the **step in that day**.

> **Terminal setup on this computer:** Node was installed into your home folder.
> Before using `node`/`npm` in a new terminal, run:
> `export PATH="$HOME/.local/node/bin:$PATH"`

---

## Day 1 — What is a stack? Set up yours

**Our stack:** Node.js (the kitchen) · Express (the waiter) · SQLite (the pantry) · EJS (the plating)

| Step | Where | What you'd type / do | What it teaches |
|---|---|---|---|
| 1.1 | Terminal | `mkdir class-cms`, `cd class-cms`, `pwd`, `npm init -y` | `package.json` is the project's ID card |
| 1.2 | Terminal | `npm install express` then `npm install ejs express-session bcryptjs` | `node_modules/` = other people's code. Never edit it or submit it |
| 1.3 | `check.js` | Require each package and print `[ok]` | First "type it yourself" file. Watch the capitals in `DatabaseSync` |
| 1.4 | Terminal | `node check.js` | Five `[ok]` lines and "Your stack is ready!" |
| 1.5 | `server.js` | `require('express')`, `app`, `PORT` | `app` is the server; the port is the "door number" |
| 1.6 | `server.js` | `app.get('/', …)` sends Hello | **The pattern for the whole unit: method + path + function** |
| 1.7 | `server.js` | `app.listen(PORT, …)` | The terminal looks "stuck" because the server is waiting for requests |
| 1.8 | Terminal/browser | `node server.js` → visit `localhost:3000`, then `/anything` | No matching route → Express sends a **404** "Cannot GET" |
| 1.9 | `package.json` | Replace `"test"` with `"start"` and `"dev": "node --watch server.js"` | Node reads your file **once**. `npm run dev` restarts it on every save |
| 1.10 | `server.js` | (stretch) `/about` route | Same pattern again |
| 1.11 | `.gitignore` | `node_modules/` and `cms.db` | Don't commit downloaded code or data |

**Stopping point:** the browser shows **Hello from my server!**

> `package.json` can't hold comments (JSON doesn't allow them), so step 1.9 is documented here only.

---

## Day 2 — Give the blog a memory

### Phase 3: the database
| Step | Where | What you'd type / do | What it teaches |
|---|---|---|---|
| 2.1 | `db.js` | `new DatabaseSync('cms.db')` | SQLite is built into Node; the database is one file |
| 2.2 | `db.js` | `CREATE TABLE IF NOT EXISTS posts (…)` in **backticks** | Table, row, column, and the **primary key** |
| 2.3 | `db.js` | `module.exports = db;` then `node db.js` | `cms.db` appears. Only this file opens the database |
| 2.4 | `seed.js` | The `posts` array of `[title, body]` | Sample data |
| 2.5 | `seed.js` | `prepare('INSERT … VALUES (?, ?)')` + a `for…of` loop | The **C** in CRUD |
| 2.6 | `seed.js` | `DELETE FROM posts` *above* the insert | Running seed twice gave duplicates. Make scripts **idempotent** |
| 2.7 | `show.js` | `SELECT * FROM posts` + `console.table` | The **R** in CRUD |
| 2.8 | `show.js` | SQL lab queries (listed in comments) | `WHERE`, `ORDER BY`, `LIMIT`, `LIKE` |

**Why `?`:** never glue user input into SQL text. With `?`, whatever a visitor types is treated only as data, which blocks SQL injection.

> Noticed the IDs started at 5 after reseeding? `AUTOINCREMENT` never reuses a number, even after a `DELETE`.

### Phase 4: the pages
| Step | Where | What you'd type / do | What it teaches |
|---|---|---|---|
| 2.9 | `server.js` | Delete the Hello and About routes | Scaffolding is temporary |
| 2.10 | Explorer | Make `views/`, `views/partials/`, `public/`; put `style.css` in `public/` | Project layout |
| 2.11 | `server.js` | `require('./db')`, `app.set('view engine','ejs')`, `express.static('public')` | Templates + static files |
| 2.12 | `views/partials/header.ejs` | DOCTYPE, head, site header, opening `<main>` | Partials: change once, update every page |
| 2.13 | `views/partials/footer.ejs` | Close `</main>`, footer, `</body></html>` | |
| 2.14 | `server.js` | `app.get('/')` → `res.render('index', { posts })` | Data + template = page |
| 2.15 | `views/index.ejs` | `if` for empty, `forEach` card per post | `<%= %>` prints, `<% %>` runs, `<%- include %>` pastes |
| 2.16 | `server.js` | `app.get('/post/:id')` + 404 | `:id` is a blank in the URL; `.get()` returns one row |
| 2.17 | `views/post.ejs` | Full post + back link | |
| 2.18 | `seed.js` | (stretch) a 4th post | |

**Stopping point:** the home page lists posts, each title opens its page, and `/post/99` returns a 404.

**Trace one request:** Browser `GET /post/2` → Express matches the route → SQLite `SELECT … WHERE id = 2` → one row → EJS fills the template → the browser shows HTML.

---

## Day 3 — Lock the door

**Authentication** = who are you? **Authorization** = what are you allowed to do?

### Phase 5: login
| Step | Where | What you'd type / do | What it teaches |
|---|---|---|---|
| 3.1 | `db.js` | `users` table with `UNIQUE` username and `password_hash` | Store **hashes**, never passwords |
| 3.2 | `createuser.js` | Read `process.argv[2]` and `[3]`, print usage if missing | Command-line arguments |
| 3.3 | `createuser.js` | `bcrypt.hashSync(password, 10)` → INSERT | One-way scramble with salt |
| 3.4 | Terminal | `node createuser.js admin <password>`, then `node show.js` | Run it twice → `UNIQUE constraint failed` |
| 3.5 | `server.js` | require `express-session` and `bcryptjs` | |
| 3.6 | `server.js` | `urlencoded`, `session(…)`, `res.locals.user` middleware | Form data → `req.body`; the cookie holds only a random ID |
| 3.7 | `views/login.ejs` | Login form with an error box | Input `name` → `req.body` key |
| 3.8 | `views/partials/header.ejs` | Login-aware `<nav>` | Templates can use `if` |
| 3.9 | `server.js` | `GET /login` and `POST /login` with `compareSync` | Success → session + **302** redirect |
| 3.10 | `server.js` | `requireLogin` + a temporary `/admin` | The bouncer sits between the path and the function |
| 3.11 | `server.js` | `POST /logout` → `session.destroy` | Why logout is a POST |

### Phase 6: the admin side (CRUD)
| Step | Where | What you'd type / do | CRUD |
|---|---|---|---|
| 3.12 | `server.js` | Real `/admin` dashboard route | **R**ead |
| 3.13 | `views/dashboard.ejs` | Frame + table header | |
| 3.14 | `views/dashboard.ejs` | One row per post; Edit link + Delete form | |
| 3.15 | `server.js` | `GET` + `POST /admin/new` | **C**reate |
| 3.16 | `views/edit.ejs` | One form for new *and* edit, using `? :` | |
| 3.17 | `server.js` | `GET` + `POST /admin/edit/:id` | **U**pdate |
| 3.18 | `server.js` | `POST /admin/delete/:id` | **D**elete |

**Security moment:** a post titled `<script>alert('hacked!')</script>` shows as plain text because `<%= %>` escapes `<` to `&lt;`.

### Full test checklist (all verified passing)
- [x] Logged out: `/admin` redirects to `/login`
- [x] A wrong password shows the error; the right password opens the dashboard
- [x] Create a post → it appears on the public home page
- [x] Edit a post → the change shows everywhere
- [x] Delete a post → its page now returns 404
- [x] Log out works

---

## Run it
```
export PATH="$HOME/.local/node/bin:$PATH"
cd ~/repos/CMSProject/class-cms
npm run dev
```
Open http://localhost:3000 and log in with **admin / clubpass123** (a practice account).
To reset the posts, run `node seed.js`.
To make another login: `node createuser.js <name> <password>`.

## Gotcha found while building
Inside an EJS comment `<%# … %>`, never type `<%` or `%>`. EJS treats them as real tags, and you get **"Could not find matching close tag"**.
