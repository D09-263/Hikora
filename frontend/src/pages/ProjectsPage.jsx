import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

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
                    <h2>
                         <Link to={`/projects/${project.id}`}>
                             {project.name}
                           </Link>
                    </h2>
                    <p>{project.description}</p>
                </div>
            ))}
        </div>
    );
}

export default ProjectsPage;