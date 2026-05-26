import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Projects.css";
import { deleteProject, createProject, getProjects, Project } from "../services/ProjectService";

function ProjectsPage() {

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

    const handleDelete = async (id: number) => 
      await deleteProject(id).then(() => {
      setProjects(projects.filter((project) => project.id !== id));
    });


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!projectName || !description) return;
    const response = await createProject(projectName, description);
    const data = await response.json();
       setProjects([...projects, data]);
      
  };


  useEffect(() => {
    setLoading(true);
    getProjects()
      .then((data) => {
        setProjects(data);
        setLoading(false);
      });
  }, []);

  
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
            <button className="delete-btn" onClick={() => handleDelete(project.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="add-project-form">
        <h3>New Project</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Project name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
          <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <button type="submit">Add Project</button>
        </form>
      </div>
    </div>
  </div>
);
}

export default ProjectsPage;
