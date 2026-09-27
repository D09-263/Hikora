import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');

    useEffect(() => {
        fetch('http://localhost:3000/api/projects')
            .then(response => response.json())
            .then(data => {
                setProjects(data);
            });
    }, []);

    const createProject = () => {
        if (!projectName.trim()) {
            alert('Project name is required');
            return;
        }
         fetch('http://localhost:3000/api/projects', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: projectName,
                description: projectDescription
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);

                setProjects(prevProjects => [...prevProjects, data]);
                setIsProjectFormOpen(false);
                setProjectName('');
                setProjectDescription('');
            })
            .catch(error => {
                console.error('ERROR:', error);
            });
                
    }

    return (
        <div>
            <h1>Projects</h1>
            <button  className="add-task-button" onClick={() => setIsProjectFormOpen(true)}>
                Add project
            </button>
            {isProjectFormOpen && (
                <div className="project-form">
                    <label>
                        Project name:
                    <input className="form-input" type="text" placeholder="Enter project name"
                        value={projectName}
                        onChange={(event) => setProjectName(event.target.value)}
                    />
                    </label>
                    <label>Description
                    <textarea className="form-textarea" placeholder="Enter project description"
                        value={projectDescription}
                        onChange={(event) => setProjectDescription(event.target.value)}
                    />
                    </label>
                    <button onClick={createProject}>
                        Create project
                    </button>

                    <button onClick={() => setIsProjectFormOpen(false)}>
                        Cancel
                    </button>
                </div>
            )}


            <div className="projects-container">
                {projects.map(project => (
                <div key={project.id} className="project-card">
                    <h2>
                         <Link to={`/projects/${project.id}`}>
                             {project.name}
                           </Link>
                    </h2>
                    <p>{project.description}</p>
                </div>
               ))}
            </div>
        </div>
    );
}

export default ProjectsPage;