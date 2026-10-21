 # Hikora mobile app

Hikora is a project and task management application built to make it easier to organize projects and keep track of everyday tasks.
Users can create projects, add tasks, update their status and priority, set due dates, and edit or delete existing items.

#Technology stack

React and Vite — frontend
React Router — navigation
Node.js and Express — backend
SQLite and better-sqlite3 — databaseкогда сервер запустился, открой в браузере ссылку

# Launch preparation

Make sure you have Node.js, npm, and Git installed on your computer.

```bash
git clone https://github.com/D09-263/Hikora.git
cd Hikora
```
# Install dependencies

```bash
npm install
npm install --prefix frontend
npm install --prefix backend
```

# Environment setup

Create a .env file in both the frontend and backend folders; you can find configuration examples in the .env.example files.

Make sure the frontend API URL is set to http://localhost:3000 and the backend port is set to 3000.

# Аpplication launch

From the project's root directory using the command:

```bash
npm run dev
```

 launches both the frontend and the backend.

 Once the servers are running, open http://localhost:5173/ in your browser.