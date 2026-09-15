const db = require('./database/database');
const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('BACKEND working');
});

app.get('/api/projects', (req, res) => {
    const projects = db.prepare('SELECT * FROM projects').all();

    res.json(projects);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});