import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function ProjectsPage() {

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);


  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api/projects/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(() => {
      setProjects(projects.filter((project) => project.id !== id));
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/api/projects", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: projectName, description }),
    })
      .then((response) => response.json())
      .then((data) => {
        setProjects([...projects, data]);
      });
  };


  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8080/api/projects", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      });
  }, []);

  
  return (
    <div>
      <Navbar />
      <h1>Projects</h1>
      <p>This is the Projects page.</p>
      {loading && <p>Loading projects...</p>}
      {projects.map((project) => (
        <div key={project.id}>
          <Link to={`/projects/${project.id}/issues`}>
            {project.projectName}
          </Link>
          <button onClick={() => handleDelete(project.id)}>Delete</button>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ProjectsPage;
