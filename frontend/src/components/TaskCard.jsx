function TaskCard({
    task,
    descriptionRef,
    isDescriptionOverflowing,
    onShowDescription,
    onEdit,
    onDelete
}) {
    const handleDelete = () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this task?'
        );

        if (confirmed) {
            onDelete(task.id);
        }
    };

    return (
        <div className="task-card">
            <h3>{task.title}</h3>

            <div
                ref={descriptionRef}
                className="task-description-wrapper"
            >
                <p className="task-description">
                    {task.description}
                </p>

                {isDescriptionOverflowing && (
                    <span
                        className="description-more"
                        onClick={() => onShowDescription(task)}
                    >
                        ...
                    </span>
                )}
            </div>

            <div className="task-meta">
                <div>
                    <span className="meta-label">Status</span>
                    <span
                        className={`task-status ${task.status.toLowerCase().replace(' ', '-')}`}
                    >
                        {task.status}
                    </span>
                </div>

                <div>
                    <span className="meta-label">Priority</span>
                    <span
                        className={`task-priority ${task.priority.toLowerCase()}`}
                    >
                        {task.priority}
                    </span>
                </div>
            </div>

            <div className="task-due-date">
                <span className="meta-label">Due date</span>
                <span>{task.dueDate || '-'}</span>
            </div>

            <div className="card-edit-button">
                <button
                    className="button button-primary"
                    onClick={() => onEdit(task)}
                >
                    Edit
                </button>
            </div>

            <div className="card-delete-button">
                <button
                    className="button button-danger"
                    onClick={handleDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default TaskCard;