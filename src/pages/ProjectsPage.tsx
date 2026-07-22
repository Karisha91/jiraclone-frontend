import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Projects.css";
import {
  deleteProject,
  createProject,
  Project,
} from "../services/ProjectService";
import { getAllProjectsByWorkspaceId } from "../services/WorkspaceService";

function ProjectsPage() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteProject(id);
      if (!response.ok) {
        if (response.status === 403) {
          setError("You are not authorized to delete this project");
        } else if (response.status === 404) {
          setError("Project not found");
        } else {
          setError("Something went wrong, please try again");
        }
        return;
      }
      setProjects(prev => prev.filter((project) => project.id !== id));
    } catch (error: unknown) {
      setError(`Error deleting project: ${error}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!projectName || !description) {
      setError("Project name and description are required");
      return;
    }
    if (workspaceId) {
      try {
      const response = await createProject(projectName, description, Number(workspaceId));

      if (!response.ok) {
        if (response.status === 403) {
          setError("You are not authorized to create a project");
        }
        else if (response.status === 400) {
          setError("Invalid project data");
        }
        else {
          setError("Something went wrong, please try again");
        }
        return;
      }

      const data = await response.json();
      setProjects([...projects, data]);
      setProjectName("");
      setDescription("");
    } catch (error: unknown) {
      setError(`Error creating project: ${error}`);
    }
    }

    
  };

  useEffect(() => {
    if (workspaceId) {
        setLoading(true);
        getAllProjectsByWorkspaceId(Number(workspaceId)).then((data) => {
            setProjects(data);
            setLoading(false);
        });
    }
}, [workspaceId]);

  return (
    <div>
      <Navbar />
      <div className="projects-container">
        <div className="projects-header">
          <h1>Projects</h1>
          <p>Manage your projects</p>
        </div>

        {loading && <p className="projects-empty">Loading projects...</p>}
        {!loading && projects.length === 0 && (
          <p className="projects-empty">No projects found. Add one below.</p>
        )}

        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <Link to={`/projects/${project.id}/issues`}>
                {project.projectName}
              </Link>
              <button
                className="delete-btn"
                onClick={() => handleDelete(project.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="add-project-form">
          <h3>New Project</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">Add Project</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;
