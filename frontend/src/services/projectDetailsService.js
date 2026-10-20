import API_URL from '../api';

export const getProject = (projectId) => {
    return fetch(`${API_URL}/api/projects/${projectId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load project name');
            }
            return response.json();
        });
};

export const getProjectTasks = (projectId) => {
    return fetch (`${API_URL}/api/projects/${projectId}/tasks`)
        .then(response => {
            if (!response.ok){
                throw new Error('Failed to load project tasks');
            }
            return response.json();
        });
};

export const createTask = (projectId, taskData) => {
    return fetch(`${API_URL}/api/projects/${projectId}/tasks`,{
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(taskData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create task');
            }
            return response.json();
        });
};

export const updateTask = (taskId, taskData) => {
    return fetch(`${API_URL}/api/tasks/${taskId}`,{
        method: 'PUT',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(taskData)
        })
       .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update task');
            }
            return response.json();
        });
};

export const deleteTask = (taskId) => {
    return fetch(`${API_URL}/api/tasks/${taskId}`,{
        method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
        });
};
