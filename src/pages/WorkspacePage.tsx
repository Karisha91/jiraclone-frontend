import "./WorkspacePage.css";
import { useEffect, useState } from "react";
import { createWorkspace, deleteWorkspace, getWorkspaces, Workspace } from "../services/WorkspaceService";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";


function WorkspacePage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);





  const handleDelete = async (workspaceId: number) => {
    setError(null)
    try {
      const response = await deleteWorkspace(workspaceId)
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
    setWorkspaces(workspaces.filter((space) => space.id !== workspaceId));
  } catch (error: unknown) {
      setError(`Error deleting project: ${error}`);
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    
      e.preventDefault()
      setError(null)
      if (!workspaceName || !description) {
        setError("Workspace name and description are required");
        return;
      }
        try {
        const response = await createWorkspace(workspaceName, description);

        if (!response.ok) {
          if (response.status === 403) {
            setError("You are not authorized to create a workspace");
          }
          else if (response.status === 400) {
            setError("Invalid workspace data");
          }
          else {
            setError("Something went wrong, please try again");
          }
          return;
        }
  
        const data = await response.json();
        setWorkspaces([...workspaces, data]);
        setWorkspaceName("");
        setDescription("");
      } catch (error: unknown) {
        setError(`Error creating project: ${error}`);
      }
      
  
      
    };

  useEffect(() => {
    setLoading(true);
    getWorkspaces().then((data) => {
      setWorkspaces(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="workspace-container">
        <div className="workspace-header">
          <h1>Workspace</h1>
          <p>Manage your workspaces</p>
        </div>
        {loading && <p className="workspace-empty">Loading workspaces...</p>}
        {!loading && workspaces.length === 0 && (
          <p className="workspace-empty">No workspaces found. Add one below.</p>
        )}

        <div className="workspace-grid">
          {workspaces.map((workspace) => (
            <div key={workspace.id} className="workspace-card">
              <Link
                to={`/workspace/${workspace.id}/projects`}
                onClick={() =>
                  localStorage.setItem("workspaceId", String(workspace.id))
                }
              >
                {workspace.name}
              </Link>
              <button
                className="delete-btn"
                onClick={() => handleDelete(workspace.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="add-workspace-form">
          <h3>Create your workspace</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Workspace name"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">Create workspace</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default WorkspacePage;
