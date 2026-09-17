import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ProjectDetailsPage() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3000/api/projects/${id}`)
            .then(response => response.json())
            .then(data => {
                setProject(data);
            });
        fetch(`http://localhost:3000/api/projects/${id}/tasks`)
             .then(response => response.json())
            .then(data => {
                setTasks(data);
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
            <h2>Tasks</h2>
        
        <div className="tasks-container">
            {tasks.map(task => (
                <div className="task-card" key={task.id}>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <p>Status: <span>{task.status}</span> | Priority: <span>{task.priority}</span></p>
                    <p>Due date: {task.dueDate || '—'}</p>
                </div>
            ))}
        </div>
    </div>
);}


export default ProjectDetailsPage;