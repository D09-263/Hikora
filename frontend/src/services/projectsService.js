import API_URL from '../api';

export const getProjects = () => {
    return fetch(`${API_URL}/api/projects`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load projects');
            }

            return response.json();
        });
};

export const createProject = (projectData) => {
    return fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create project');
            }

            return response.json();
        });
};

export const updateProject = (projectId, projectData) => {
    return fetch(`${API_URL}/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update project');
            }

            return response.json();
        });
};

export const deleteProject = (projectId) => {
    return fetch(`${API_URL}/api/projects/${projectId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete project');
            }
        });
};