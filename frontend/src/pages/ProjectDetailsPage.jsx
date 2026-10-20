import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    getProject,
    getProjectTasks,
    createTask as createTaskRequest,
    updateTask as updateTaskRequest,
    deleteTask as deleteTaskRequest
} from '../services/projectDetailsService';
import TaskCard from '../components/TaskCard';


function ProjectDetailsPage() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [isProjectLoading, setIsProjectLoading] = useState(true);
    const [isTasksLoading, setIsTasksLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projectError, setProjectError] = useState(null);
    const [tasksError, setTasksError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All')

    const descriptionRefs = useRef({});
    const [overflowingTasks, setOverflowingTasks] = useState({});
    const [selectedTask, setSelectedTask] = useState(null);
    const [editingTask, setEditingTask] = useState(null);

    const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskPriority, setTaskPriority] = useState('Low');
    const [taskStatus, setTaskStatus] = useState('Todo');
    const [taskDueDate, setTaskDueDate] = useState('');

    useEffect(() => {
        setProjectError(null);
        setTasksError(null);
        setIsProjectLoading(true);
        setIsTasksLoading(true);
        
        getProject(id)
            .then(data => {
                setProject(data);
                setIsProjectLoading(false);
            })
            .catch(() => {
                setProjectError('Failed to load project name');
                setIsProjectLoading(false);
            })
        getProjectTasks(id)
            .then(data => {
                setTasks(data);
                setIsTasksLoading(false);
            })
            .catch(() => {
                setTasksError('Failed to load tasks')
                setIsTasksLoading(false);
            });
    }, [id]);

    const deleteTask = (taskId) => {
        setError(null);
        deleteTaskRequest(taskId)
        .then(() => {
            setTasks(prevTasks => 
                prevTasks.filter(task => task.id !== taskId)
            );
        })
        .catch(() => {
                setError('Failed to delete tasks')
            });
    }

    const manualCreateTask = () => {
        setError(null);
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
        };

        createTaskRequest(id, newTask)
            .then(data => {

                setTasks(prevTasks => [...prevTasks, data]);

                setIsTaskFormOpen(false);

                setTaskTitle('');
                setTaskDescription('');
                setTaskPriority('Low');
                setTaskStatus('Todo');
                setTaskDueDate('');
            })
            .catch(error => {
                setError('Failed to create task')
            });
    };

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

    const filteredTasks = filterStatus === 'All'
                ? tasks
                : tasks.filter(task => task.status === filterStatus);

    return (
        <div>
            <Link to="/" className="back-button">
                ← Back to projects
            </Link>
            {isProjectLoading && <h1>Loading project...</h1>}

            {!isProjectLoading && projectError && (
                <h1>{projectError}</h1>
            )}

            {!isProjectLoading && !projectError && project && (
                <h1 className="project-title">{project.name}</h1> 
            )}

            {project && (
                <div className="project-info">
                    <p>{project.description}</p>
                </div>
            )}

        <div className="tasks-section">
            <h2 className="tasks-title">Tasks</h2>
            <button className="add-task-button add-button" onClick={() => setIsTaskFormOpen(true)}>
                Add task     
            </button>

            {isTaskFormOpen && (
                <div className="task-form-modal">
                    <h3>Add task</h3>

                    <label>
                        Task title
                        <input className = "form-input" type="text" placeholder="Enter task title"
                        value={taskTitle}
                        onChange={(event)=> setTaskTitle(event.target.value)}/>
                    </label>

                    <label>
                        Description
                        <textarea className = "form-textarea" placeholder="Enter task description"
                         value={taskDescription}
                        onChange={(event)=> setTaskDescription(event.target.value)}/>
                    </label>

                    <label>
                        Priority
                        <select value={taskPriority}
                        onChange={(event)=> setTaskPriority(event.target.value)}>

                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
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

                    <button className="button button-secondary" onClick={manualCreateTask}>      
                        Create task
                    </button>

                    <button className="button button-danger" onClick={() => setIsTaskFormOpen(false)}>
                        Cancel 
                    </button>
                </div>
            )}

            {error && <p>{error}</p>}

        {selectedTask && (
            <div className="modal"
                 onClick={() => setSelectedTask(null)}
            >
                <div className="modal-content"
                     onClick={(event) => event.stopPropagation()}
                >
                    <h2>{selectedTask.title}</h2>
                    <button className="modal-close" 
                        onClick = {() => setSelectedTask(null)}>
                            x
                        </button>
                    <p>{selectedTask.description}</p>
                </div>
            </div>
        )} 

        {editingTask && (
            <div className="modal"
                 onClick={() => setEditingTask(null)}
            >
                <div className="modal-content"
                     onClick={(event) => event.stopPropagation()}
                >
                    <h2>Edit task</h2>
                  <div className="edit-task-form">
                        <label>
                            Title
                            <input  type="text"
                        className = "form-input"
                        value={editingTask.title}
                        onChange={(event) => setEditingTask({...editingTask, title: event.target.value})}
                    />
                    </label>

                    <label>
                        Description
                    
                    <textarea
                        className="form-textarea"
                        value={editingTask.description}
                        onChange={(event) => setEditingTask({...editingTask, description: event.target.value})
                    }
                    />
                    </label>

                    <label>
                        Status
                        <select
                            value={editingTask.status}
                            onChange={(event) => setEditingTask({...editingTask, status: event.target.value})
                           }
                        >

                            <option value="Todo">Todo</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </label>

                    <label>
                        Priority
                        <select
                            value={editingTask.priority}
                            onChange={(event) => setEditingTask({...editingTask, priority: event.target.value})
                          }
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>

                        </select>
                    </label>

                    <label>
                        Due Date
                        <input type="date"
                            value={editingTask.dueDate || ''}
                            onChange={(event) => setEditingTask({...editingTask, dueDate: event.target.value})}
                        />
                    </label>

                    <button className="button button-secondary" onClick = {() =>{
                        if (!editingTask.title.trim()) {
                            alert('Task title is required');
                            return;
                        }

                        updateTaskRequest(editingTask.id, editingTask)
                            .then(data => {

                                setTasks(prevTasks => 
                                    prevTasks.map(task => 
                                        task.id === data.id ? data : task
                                    )
                                );

                                setEditingTask(null);
                            }) 
                            .catch(error => {
                                setError('Failed to update task');
                            })
                    }}>
                        Save
                    </button>
                       
                    

                    <button className="modal-close" 
                        onClick = {() => setEditingTask(null)}>
                            x
                        </button>
                </div>
              </div>
            </div>
        )} 
        
        <div className="task-filter">
            <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
                <option value="All">All</option>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
            </select>
        </div>
    
            {isTasksLoading && <p>Loading tasks...</p>}
            
            {!isTasksLoading && tasksError && (
                <p>{tasksError}</p>
            )}

            {!isTasksLoading && !tasksError &&  (

                <div className="tasks-container">
                   {filteredTasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            descriptionRef={(element) => {
                                descriptionRefs.current[task.id] = element;
                            }}
                            isDescriptionOverflowing={overflowingTasks[task.id]}
                            onShowDescription={setSelectedTask}
                            onEdit={setEditingTask}
                            onDelete={deleteTask}
                        />
                    ))}
                </div>
                )}
        </div>
    </div>
);}



export default ProjectDetailsPage;