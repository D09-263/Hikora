import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

function ProjectDetailsPage() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);

    const descriptionRefs = useRef({});
    const [overflowingTasks, setOverflowingTasks] = useState({});
    const [selectedTask, setSelectedTask] = useState(null);
    console.log('SELECTED TASK:', selectedTask);

    const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskPriority, setTaskPriority] = useState('Low');
    const [taskStatus, setTaskStatus] = useState('Todo');
    const [taskDueDate, setTaskDueDate] = useState('');
    const manualCreateTask = () => {
        if (!taskTitle.trim()) {
            alert('Task title is required');
                return;
        }

        const newTask = {
        title: taskTitle,
        description: taskDescription,
        priority: taskPriority,
        status: taskStatus,
        dueDate: taskDueDate
        }
        console.log(newTask);

        fetch(`http://localhost:3000/api/projects/${id}/tasks`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        })
            .then(response => {
                console.log('STATUS:', response.status);
                return response.json();
            })
            .then(data => {
                console.log('DATA:', data);
                setTasks(prevTasks => [...prevTasks, data]);

                setIsTaskFormOpen(false);

                setTaskTitle('');
                setTaskDescription('');
                setTaskPriority('Medium');
                setTaskStatus('Todo');
                setTaskDueDate('');
            })
            .catch(error => {
                console.error('ERROR:', error);
            });
    };

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

    useEffect(() => {
        const result = {};

        tasks.forEach(task => {
            const element = descriptionRefs.current[task.id];

            if (element) {
                result[task.id] = element.scrollHeight > element.clientHeight;
            } 
        });

        setOverflowingTasks(result);
    }, [tasks]);

    return (
        <div>
            {project && <h1>{project.name}</h1>}

            {project && (
                <div className="project-info">
                    <p>{project.description}</p>
                </div>
            )}

        <div className="tasks-section">
            <h2 className="tasks-title">Tasks</h2>
            <button className="add-task-button" onClick={() => setIsTaskFormOpen(true)}>
                Add task     
            </button>

            {isTaskFormOpen && (
                <div className="task-form-modal">
                    <h3>Add task</h3>

                    <label>
                        Task title
                        <input type="text" placeholder="Enter task title"
                        value={taskTitle}
                        onChange={(event)=> setTaskTitle(event.target.value)}/>
                    </label>

                    <label>
                        Description
                        <textarea placeholder="Enter task description"
                         value={taskDescription}
                        onChange={(event)=> setTaskDescription(event.target.value)}/>
                    </label>

                    <label>
                        Priority
                        <select value={taskPriority}
                        onChange={(event)=> setTaskPriority(event.target.value)}>

                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </label>

                    <label>
                        Status
                        <select value={taskStatus}
                        onChange={(event)=> setTaskStatus(event.target.value)}>

                            <option value="Todo">Todo</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </label>

                    <label>
                        Due Date
                        <input type="date"
                        value={taskDueDate}
                        onChange={(event)=> setTaskDueDate(event.target.value)}/>
                    </label>

                    <button onClick={manualCreateTask}>      
                        Create task
                    </button>

                    <button onClick={() => setIsTaskFormOpen(false)}>
                        Cancel 
                    </button>
                </div>
            )}

        {selectedTask && (
            <div className="task-modal"
                 onClick={() => setSelectedTask(null)}
            >
                <div className="task-modal-content"
                     onClick={(event) => event.stopPropagation()}
                >
                    <h2>{selectedTask.title}</h2>
                    <button className="task-modal-close" 
                        onClick = {() => setSelectedTask(null)}>
                            x
                        </button>
                    <p>{selectedTask.description}</p>
                </div>
            </div>
        )} 
        
        <div className="tasks-container">
           {tasks.map(task => (
                <div className="task-card" key={task.id}>
                     <h3>{task.title}</h3>
                    <div ref={(element) => {
                            descriptionRefs.current[task.id] = element;
                            }}
                         className="task-description-wrapper">
                        <p 
                            className="task-description"
                        >
                            {task.description}
                        </p>
                        {overflowingTasks[task.id] && (
                            <span className="description-more"
                                onClick={() => { console.log('CLICKED:', task);
                                    setSelectedTask(task);
                                }}
                            >...</span>
                        )}
                    </div>
                    <div className="task-meta">
                        <div>
                            <span className="meta-label">Status</span>
                            <span className={`task-status ${task.status.toLowerCase().replace(' ', '-')}`}>
                                {task.status}</span>
                        </div>
                        <div>
                            <span className="meta-label">Priority</span>
                            <span className={`task-priority ${task.priority.toLowerCase()}`}>
                                {task.priority}</span>
                        </div>
                    </div>
                        <div className="task-due-date">
                            <span className="meta-label">Due date</span>
                            <span>{task.dueDate || '-'}</span>
                        </div>
                </div>
              ))}
            </div>
        </div>
    </div>
);}


export default ProjectDetailsPage;