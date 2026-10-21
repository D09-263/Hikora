const db = require('../database/database')

function getAllProjects() {
    return db.prepare('SELECT * FROM projects').all();
}

function getProjectById(id) {
    return db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
}

function createProject(name, description) {
    const createdAt = new Date().toISOString();

     const result = db.prepare(`
        INSERT INTO projects (name, description, createdAt)
        VALUES (?, ?, ?)
    `).run(name, description || null, createdAt);
    
    return db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
}

function updateProject(id, name, description) {
    db.prepare(`
        UPDATE projects
        SET name = ?, description = ?
        WHERE id = ?
    `).run(name, description || null, id);

    return getProjectById(id);
}

function deleteProject(id) {
    const result = db.prepare('DELETE FROM projects WHERE id = ?').run(id);

    return result.changes > 0;
}

module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
};

