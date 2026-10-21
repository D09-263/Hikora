const db = require('../database/database');

function getTasksByProjectId(projectId) {
    return db.prepare('SELECT * FROM tasks WHERE projectId = ?').all(projectId);
}

function getTaskById(id) {
    return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
}

function createTask(projectId, title, description, status, priority, dueDate) {
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
        status,
        priority,
        dueDate || null,
        createdAt
    );

    return getTaskById(result.lastInsertRowid);
}

function updateTask(id, title, description, status, priority, dueDate) {
    db.prepare(`
        Update tasks
        SET title = ?,
            description = ?,
            status = ?,
            priority = ?,
            dueDate = ?
        WHERE id = ?
    `).run(
        title,
        description || null,
        status,
        priority,
        dueDate || null,
        id
    );

    return getTaskById(id);
}

function deleteTask(id) {
    const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);

    return result.changes > 0;
}

module.exports = {
    getTasksByProjectId,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};