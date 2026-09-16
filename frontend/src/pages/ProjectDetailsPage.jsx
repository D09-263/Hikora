import { useParams } from 'react-router-dom';

function ProjectDetailsPage() {
    const { id } = useParams();

    return (
        <div>
            <h1>Project Details Page</h1>
            <p>Project ID: {id}</p>
        </div>
    );
}

export default ProjectDetailsPage;