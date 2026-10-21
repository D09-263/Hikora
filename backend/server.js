require('dotenv').config();

const db = require('./database/database');
const projectRepository = require('./repositories/projectRepository');
const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 3000;

const app = express();


app.use(cors());
app.use(express.json());

function validateId(req, res, next){
    const id = req.params.id;
   
    if(!/^[1-9]\d*$/.test(id)) {
        return res.status(400).json({
            error: 'ID must be a positive number'
        })
    }

    next();
}

app.get('/', (req, res) => {
    res.send('BACKEND working');
});

app.get('/api/projects', (req, res) => {
    const projects = projectRepository.getAllProjects();

    res.json(projects);
});

app.get('/api/projects/:id', validateId, (req, res) => {
    const project = projectRepository.getProjectById(req.params.id);

    if (!project) {
        return res.status(404).json({
            error: 'Project not found'
        });
    }

    res.json(project);
});

app.get('/api/projects/:id/tasks', validateId, (req, res) => {
    const projectId = req.params.id;

    const tasks = db.prepare(`
        SELECT * FROM tasks
        WHERE projectId = ?
    `).all(projectId);

    res.json(tasks);
});



app.post('/api/projects', (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({
            error: 'Project name is required'
        });
    }

    if (description && description.length >68) {
        return res.status(400).json({
            error: 'Project description is too long'
        });
    }

    const project = projectRepository.createProject(name, description);

    res.status(201).json(project);
});

app.post('/api/projects/:id/tasks', validateId, (req, res) => {
    const projectId = req.params.id;
    const project = db.prepare('SELECT id FROM projects WHERE id = ?').get(projectId);

    if (!project) {
        return res.status(404).json({
            error: 'Project not found'
        });
    }

    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
        return res.status(400).json({
            error: 'Task title is required'
        });
    }

    const createdAt = new Date().toISOString();

    const result = db.prepare(`
        INSERT INTO tasks (
            projectId,
            title,
            description,
            status,
            priority,
            dueDate,
            createdAt
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
        projectId,
        title,
        description || null,
        status || 'Todo',
        priority || 'Medium',
        dueDate || null,
        createdAt
    );

    const task = db.prepare(`
        SELECT * FROM tasks WHERE id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json(task);
});

app.put('/api/projects/:id', validateId, (req, res) => {
    const { name, description } = req.body;
    const id = Number(req.params.id);

    if (!name) {
        return res.status(400).json({
            error: 'Project name is required'
        });
    }

    if (description && description.length > 68) {
        return res.status(400).json({
            error: 'Project description is too long'
        });
    }

    const existingProject = projectRepository.getProjectById(id);

    if (!existingProject) {
        return res.status(400).json({
            error: 'Project not found'
        });
    }

    const updateProject = projectRepository.updateProject(id, name, description);

    res.json(updateProject);
});

app.put('/api/tasks/:id', validateId, (req, res) => {
    const taskId = req.params.id;
    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
        return res.status(400).json({
            error: 'Task title is required'
        });
    }

    const result = db.prepare(`
        UPDATE tasks
        SET
            title = ?,
            description = ?,
            status = ?,
            priority = ?,
            dueDate = ?
        WHERE id = ?
    `).run(
        title,
        description || null,
        status || 'Todo',
        priority || 'Medium',
        dueDate || null,
        taskId
    );

    if (result.changes === 0) {
        return res.status(404).json({
            error: 'Task not found'
        });
    }

    const task = db.prepare(`
        SELECT * FROM tasks WHERE id = ?
    `).get(taskId);

    res.json(task);
});

app.delete('/api/projects/:id', validateId, (req, res) => {
    const id = Number(req.params.id);


    const deleted = projectRepository.deleteProject(id);

    if (!deleted){
        return res.status(404).json({
            error: 'Project not found'
        });
    }

    res.status(204).send();
});

app.delete('/api/tasks/:id', validateId, (req, res) => {
    const taskId = req.params.id;

    const result = db.prepare(`
        DELETE FROM tasks
        WHERE id = ?
    `).run(taskId);

    if (result.changes === 0) {
        return res.status(404).json({
            error: 'Task not found'
        });
    }

    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

