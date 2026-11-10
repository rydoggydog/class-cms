# Web Design Club CMS

A small **Content Management System** (CMS) built from scratch in a 3-day web design unit.
Visitors read blog posts on the public side. Editors log in to a dashboard to **create, read, update, and delete** (CRUD) posts.

**Stack:** Node.js · Express · SQLite (built into Node) · EJS templates · bcryptjs · express-session

| Layer | Tool | Job |
|---|---|---|
| Front end | HTML + CSS (EJS templates) | What the visitor sees |
| Server | Node.js + Express | Receives requests, sends responses |
| Database | SQLite (`node:sqlite`) | Stores posts and users in one file, `cms.db` |
| Security | bcryptjs + express-session | Password hashing and login memory |

Want to see how it was built, step by step? Read **[WALKTHROUGH.md](WALKTHROUGH.md)**. Every `STEP x.y` in the walkthrough matches a comment in the code.

---

## Features

| URL | Who can visit | What it does |
|---|---|---|
| `/` | Everyone | Lists all posts, newest first |
| `/post/:id` | Everyone | Shows one full post (404 if it doesn't exist) |
| `/login` | Everyone | Login form |
| `/admin` | Logged-in only | Dashboard listing every post |
| `/admin/new` | Logged-in only | Write a new post |
| `/admin/edit/:id` | Logged-in only | Edit a post |
| `/admin/delete/:id` | Logged-in only (POST) | Delete a post |

---

## 1. Environment setup

You need two tools: **Node.js** (version **22.13 or newer**) and a code editor (**VS Code** is recommended). Git is optional; you only need it to clone the repo.

### Install VS Code
Download it from [code.visualstudio.com](https://code.visualstudio.com) and accept the default install options.
On a school computer without admin rights, choose the **User Installer**.

### Install Node.js
Node.js includes **npm**, which installs the project's packages.

**Windows**
1. Download the **LTS** `.msi` installer from [nodejs.org](https://nodejs.org).
2. Click Next through the installer. **Leave the box for "Automatically install the necessary tools" unchecked.** This project doesn't need those tools.
3. **Close VS Code completely and reopen it**, so it can find Node.

**macOS**
Download the **LTS** `.pkg` installer from [nodejs.org](https://nodejs.org) and run it.

**Linux (no admin rights needed)**
Download the **LTS** `linux-x64.tar.xz` file from [nodejs.org](https://nodejs.org), then:
```bash
mkdir -p ~/.local/node
tar -xJf node-v*-linux-x64.tar.xz -C ~/.local/node --strip-components=1
echo 'export PATH="$HOME/.local/node/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Check your install
Open a terminal (in VS Code: **Terminal → New Terminal**, or **Ctrl+`**) and run:
```bash
node -v
npm -v
```
Both should print a version number, and `node` must be **v22.13.0 or higher**.
SQLite is built into Node, so there's nothing else to install for the database.

---

## 2. Get the project and install packages

```bash
git clone https://github.com/rydoggydog/class-cms.git
cd class-cms
npm install
```

`npm install` reads `package.json` and downloads Express, EJS, express-session, and bcryptjs into `node_modules/`. That folder isn't in the repo, so this step rebuilds it.

Then run the **stack check**:
```bash
node check.js
```
You should see five `[ok]` lines and `Your stack is ready!`.
(On Node 22 you may also see an `ExperimentalWarning: SQLite` message. It's harmless.)

---

## 3. Seed the data

The database file `cms.db` **isn't included in the repo**, because it's data, not code. You create it on your own computer.

### Step 3a — Add sample posts
```bash
node seed.js
```
Output: `Added 4 posts`

What happens:
1. `seed.js` loads `db.js`, which **creates `cms.db`** and the `posts` and `users` tables if they don't exist yet.
2. It runs `DELETE FROM posts`, which **wipes every existing post**.
3. It inserts the sample posts listed in the `posts` array at the top of `seed.js`.

Because it clears the table first, **you can run it as many times as you like** and always end up with exactly the sample posts. It's also a quick way to reset the blog.

> **Careful:** running `seed.js` deletes any posts you wrote through the dashboard. It doesn't touch user accounts.

**Want your own sample posts?** Edit the `posts` array in `seed.js` (each entry is `['Title', 'Body text']`), save, and run `node seed.js` again.

> Post IDs keep counting up after a reseed (5, 6, 7…). `AUTOINCREMENT` never reuses a number, even after a delete. That's expected.

### Step 3b — Create an admin login
There's no sign-up page, so editors are created from the terminal:
```bash
node createuser.js admin yourpasswordhere
```
Output:
```
Created user: admin
Stored hash: $2b$10$...
```
Only the bcrypt **hash** is saved; the password itself is never stored.
Usernames must be unique, so running this again with the same name gives `UNIQUE constraint failed: users.username`. To add another editor, use a different name.

### Step 3c — Look inside the database (optional)
```bash
node show.js
```
This prints the `posts` and `users` tables as spreadsheets in the terminal. The comments in `show.js` include practice SQL queries to try.

---

## 4. Run the site

```bash
npm run dev
```
Open **http://localhost:3000** in your browser and click **Log in**.

| Command | What it does |
|---|---|
| `npm run dev` | Starts the server and **restarts it automatically** whenever you save a file |
| `npm start` | Starts the server once (stop with Ctrl+C and rerun after changes) |
| `Ctrl+C` | Stops the server |

> Sessions are kept in memory, so every restart (including the auto-restart when you save) **logs you out**. Just log in again.

### Quick start (all commands)
```bash
npm install
node check.js
node seed.js
node createuser.js admin yourpasswordhere
npm run dev
```

---

## Project structure

```
class-cms/
├── server.js          # Express app: middleware, login, and every route
├── db.js              # Opens cms.db and creates the posts + users tables
├── seed.js            # Resets posts to sample data
├── createuser.js      # Makes a login (stores a bcrypt hash)
├── show.js            # Prints the database tables
├── check.js           # Confirms every part of the stack is installed
├── public/
│   └── style.css      # Site styles (change the colour variables at the top)
├── views/             # EJS page templates
│   ├── index.ejs      # Home page (post list)
│   ├── post.ejs       # One post
│   ├── login.ejs      # Login form
│   ├── dashboard.ejs  # Admin post table
│   ├── edit.ejs       # Shared form for new + edit
│   └── partials/
│       ├── header.ejs # Top of every page + login-aware menu
│       └── footer.ejs # Bottom of every page
├── WALKTHROUGH.md     # Step-by-step build guide
└── package.json       # Project info, scripts, dependencies
```

---

## Troubleshooting

| You see… | Try this |
|---|---|
| `'node' is not recognized` / `node: command not found` | Close and reopen VS Code or the terminal. On Linux, make sure `~/.local/node/bin` is on your `PATH`. |
| `running scripts is disabled` (Windows PowerShell) | In the terminal panel, click the **↓** next to **+** and choose **Command Prompt**. |
| `Cannot find module 'express'` | You're in the wrong folder, or you skipped `npm install`. Run `pwd`; it should end in `class-cms`. |
| `no such table: posts` | Run `node seed.js` from inside the `class-cms` folder. |
| `Failed to lookup view "index"` | A template is misnamed or isn't inside `views/`. |
| `address already in use` | An old server is still running. Press **Ctrl+C** in that terminal. |
| `Could not find matching close tag for "<%#"` | An EJS comment contains `<%` or `%>`. Remove it from the comment. |
| Saved a change but nothing happened | Use `npm run dev`. Plain `node server.js` doesn't reload on save. |

---

## Known limitations (on purpose — this is a learning project)

This app runs on your own computer for practice. It is **not ready to host publicly** as-is. A real site would add:
- **HTTPS**, so passwords can't be read in transit
- the **session secret in an environment variable** instead of `server.js`
- **rate limiting** against password guessing
- **CSRF protection** on forms
- a **session store** that survives restarts
