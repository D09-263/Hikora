const db = require('./database/database');
const express = require('express');

const port = 3000;

const app = express();

app.use(express.json());



app.get('/', (req, res) => {
    res.send('BACKEND working');
});

app.get('/api/projects', (req, res) => {
    const projects = db.prepare('SELECT * FROM projects').all();

    res.json(projects);
});

app.get('/api/projects/:id', (req, res) => {
    const project = db.prepare(`
        SELECT * FROM projects WHERE id = ?
    `).get(req.params.id);

    if (!project) {
        return res.status(404).json({
            error: 'Project not found'
        });
    }

    res.json(project);
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

app.put('/api/projects/:id', (req, res) => {
    const { name, description } = req.body;
    const projectId = req.params.id;

    if (!name) {
        return res.status(400).json({
            error: 'Project name is required'
        });
    }

    const result = db.prepare(`
        UPDATE projects
        SET name = ?, description = ?
        WHERE id = ?
    `).run(name, description || null, projectId);

    if (result.changes === 0) {
        return res.status(404).json({
            error: 'Project not found'
        });
    }

    const project = db.prepare(`
        SELECT * FROM projects WHERE id = ?
    `).get(projectId);

    res.json(project);
});

app.delete('/api/projects/:id', (req, res) => {

    const projectId = req.params.id;


    const result = db.prepare(`
        DELETE FROM projects
        WHERE id = ?
    `).run(projectId);

    if (result.changes === 0) {
        return res.status(404).json({
            error: 'Project not found'
        });
    }

    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

