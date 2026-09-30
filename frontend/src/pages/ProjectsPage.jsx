import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');

    const [editingProject, setEditingProject] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3000/api/projects')
            .then(response=>{
                if (!response.ok){
                    throw new Error('Failed to load projects')
                }
                return response.json();
            })
            .then(data => {
                setProjects(data);
                setIsLoading(false);
            })
            .catch(error => {
                setError('Failed to load projects')
                setIsLoading(false);
            });
    }, []);

    const createProject = () => {
        setError(null);
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
            .then(response=>{
                if (!response.ok){
                    throw new Error('Failed to create project')
                }
                return response.json();
            })
            .then(data => {

                setProjects(prevProjects => [...prevProjects, data]);
                setIsProjectFormOpen(false);
                setProjectName('');
                setProjectDescription('');
            })
            .catch(error => {
                setError('Failed to create project')
            });
                
    }

    const updateProject =() =>{
        setError(null);
        if (!editingProject.name.trim()) {
            alert('Project name is required');
            return;
        }

        fetch(`http://localhost:3000/api/projects/${editingProject.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editingProject)
        })
            .then(response=>{
                if (!response.ok){
                    throw new Error('Failed to update projects')
                }
                return response.json();
            })
            .then(data => {
                setProjects(prevProjects => prevProjects.map(project => project.id === data.id ? data : project)
            );

                setEditingProject(null);
        })
            .catch(error => {
                setError('Failed to update projects');
            });
    };

    const deleteProject = (projectId) => {
        setError(null);
         fetch(`http://localhost:3000/api/projects/${projectId}`, {
            method: 'DELETE'
         })

         .then(response => {
            if (!response.ok){
                throw new Error('Failed to delete project');
            }

            setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
        })
        .catch(error => {
            setError('Failed to delete project');
        });
    }

    return (
        <div>
            <h1>Projects</h1>
            <button  className="add-task-button add-button" onClick={() => setIsProjectFormOpen(true)}>
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
                        maxLength={68}
                    />
                    </label>
                    <button className="button button-secondary" onClick={createProject}>
                        Create project
                    </button>

                    <button className="button button-danger" onClick={() => setIsProjectFormOpen(false)}>
                        Cancel
                    </button>
                </div>
            )}

            {isLoading && <p>Loading...</p>}

            {error && <p>{error}</p>}


            <div className="projects-container">
                {projects.map(project => (
                <div key={project.id} className="project-card">
                    <h2>
                         <Link to={`/projects/${project.id}`}>
                             {project.name}
                           </Link>
                    </h2>
                    <p>{project.description}</p>
                   
                   <div className="card-edit-button">
                    <button className="button button-primary" onClick={() => setEditingProject(project)}>
                        Edit
                    </button>
                    </div>

                    <div className="card-delete-button">
                        
                    <button className="button button-danger"  onClick={()=> {
                        const confirmed = window.confirm('Are you sure you want to delete this project?');

                        if(confirmed){
                            deleteProject(project.id);
                        }
                    }}>
                        Delete
                    </button>
                    </div>
                </div>
               ))}
            </div>

            {editingProject && (
                <div className="modal edit-project-modal" onClick={() => setEditingProject(null)}>
                  <div className="modal-content edit-project-modal-content" onClick={(event) => event.stopPropagation()}>  
                    <label>
                        Project name:
                        <input className="form-input" type="text" value={editingProject.name}
                            onChange={(event)=>setEditingProject({...editingProject,name: event.target.value})
                                }
                        />
                    </label>

                    <label>
                        Description:
                        <textarea className="form-textarea" maxLength={68} value={editingProject.description}
                            onChange={(event)=>setEditingProject({...editingProject,description: event.target.value})
                                }
                        />
                    </label>
                    <button className="button button-secondary" onClick={updateProject}>Save</button>
                    <button className="modal-close" onClick={()=>setEditingProject(null)}>
                        x
                    </button>
                  </div>  
                </div>
            )}
                   
        </div>
    );
}

export default ProjectsPage;