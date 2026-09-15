const db = require('./database/database');
const express = require('express');

const app = express();

app.use(express.json());

const port = 3000;

app.get('/', (req, res) => {
    res.send('BACKEND working');
});

app.get('/api/projects', (req, res) => {
    const projects = db.prepare('SELECT * FROM projects').all();

    res.json(projects);
});

app.post('/api/projects', (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({
            error: 'Project name is required'
        });
    }

    const createdAt = new Date().toISOString();

    const result = db.prepare(`
        INSERT INTO projects (name, description, createdAt)
        VALUES (?, ?, ?)
    `).run(name, description || null, createdAt);

    const project = db.prepare(`
        SELECT * FROM projects WHERE id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json(project);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});