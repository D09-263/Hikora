import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ProjectDetailsPage() {
    const { id } = useParams();
    const [project, setProject] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/api/projects/${id}`)
            .then(response => response.json())
            .then(data => {
                setProject(data);
            });
    }, [id]);

    return (
        <div>
            <h1>Project Details Page</h1>

            {project && (
                <div>
                    <h2>{project.name}</h2>
                    <p>{project.description}</p>
                </div>
            )}
        </div>
    );
}

export default ProjectDetailsPage;