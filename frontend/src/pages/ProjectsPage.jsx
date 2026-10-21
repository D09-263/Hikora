import { useEffect, useState } from 'react';
import {
    getProjects,
    createProject as createProjectRequest,
    updateProject as updateProjectRequest,
    deleteProject as deleteProjectRequest
} from '../services/projectsService';
import ProjectCard from '../components/ProjectCard';

function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');

    const [editingProject, setEditingProject] = useState(null);

    useEffect(() => {
        getProjects()
            .then(data => {
                setProjects(data);
                setIsLoading(false);
            })
            .catch(() => {
                setError('Failed to load projects');
                setIsLoading(false);
            });
    }, []);

    const createProject = () => {
        setError(null);

        if (!projectName.trim()) {
            alert('Project name is required');
            return;
        }

        createProjectRequest({
            name: projectName,
            description: projectDescription
        })
            .then(data => {
                setProjects(prevProjects => [...prevProjects, data]);
                setIsProjectFormOpen(false);
                setProjectName('');
                setProjectDescription('');
            })
            .catch(() => {
                setError('Failed to create project');
            });
    };

    const updateProject = () => {
        setError(null);

        if (!editingProject.name.trim()) {
            alert('Project name is required');
            return;
        }

        updateProjectRequest(editingProject.id, editingProject)
            .then(data => {
                setProjects(prevProjects =>
                    prevProjects.map(project =>
                        project.id === data.id ? data : project
                    )
                );

            setEditingProject(null);
        })
            .catch(() => {
                setError('Failed to update project');
            });
    };

    const deleteProject = (projectId) => {
        setError(null);

        deleteProjectRequest(projectId)
            .then(() => {
                setProjects(prevProjects =>
                    prevProjects.filter(project => project.id !== projectId)
                );
            })
            .catch(() => {
                setError('Failed to delete project');
            });
    };

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
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onEdit={setEditingProject}
                        onDelete={deleteProject}
                    />
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