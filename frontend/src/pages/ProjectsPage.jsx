import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');

    const [editingProject, setEditingProject] = useState(null);

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

    const updateProject =() =>{
        fetch(`http://localhost:3000/api/projects/${editingProject.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editingProject)
        })
            .then(response => response.json())
            .then(data => {
                setProjects(prevProjects => prevProjects.map(project => project.id === data.id ? data : project)
            );

                setEditingProject(null);
        })
            .catch(error => {
                console.error('ERROR:',error);
            });
    };

    const deleteProject = (projectId) => {
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
            console.error('ERROR', error);
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
                   
                   <div className="card-edit-button">
                    <button className="button button-primary" onClick={() => setEditingProject(project)}>
                        Edit
                    </button>
                    </div>

                    <div className="card-delete-button">
                        
                    <button className="button button-secondary"  onClick={()=> {
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
                <div className="modal edit-project-modal">
                  <div className="modal-content edit-project-modal-content">  
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
                    <button onClick={updateProject}>Save</button>
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