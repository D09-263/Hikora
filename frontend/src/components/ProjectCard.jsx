import {Link} from 'react-router-dom';

function ProjectCard({project, onEdit, onDelete}) {
    const handleDelete = () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this project?'
        );

        if (confirmed) {
            onDelete(project.id);
        }
    };

    return (
        <div className="project-card">
            <h2>
                <Link to={`/projects/${project.id}`}>
                    {project.name}
                </Link>
            </h2>

            <p>{project.description}</p>

            <div className="card-edit-button">
                <button className="button button-primary" onClick={() => onEdit(project)}>
                    Edit
                </button>
            </div>

            <div className="card-delete-button">
                <button className="button button-danger" onClick={handleDelete}>
                    Delete
                </button>
            </div>
        </div>
    );
}

export default ProjectCard;