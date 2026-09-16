import { useEffect, useState } from 'react';

function ProjectsPage() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/projects')
            .then(response => response.json())
            .then(data => {
                setProjects(data);
            });
    }, []);

    return (
        <div>
            <h1>Projects</h1>

            {projects.map(project => (
                <div key={project.id}>
                    <h2>{project.name}</h2>
                    <p>{project.description}</p>
                </div>
            ))}
        </div>
    );
}

export default ProjectsPage;