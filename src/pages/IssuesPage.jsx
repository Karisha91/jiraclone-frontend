import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./IssuesPage.css";
import { deleteIssue, getIssuesByProjectId, createIssue } from "../services/IssueService";

function IssuesPage() {
  const [issues, setIssues] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TO_DO");
  const [priority, setPriority] = useState("LOW");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const handleDeleteIssue = (issueId) => {
    deleteIssue(issueId).then(() => {
      setIssues(issues.filter((issue) => issue.id !== issueId));
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createIssue(title, description, status, priority, id)
      .then((response) => response.json())
      .then((data) => {
        setIssues([...issues, data]);
        setTitle("");
        setDescription("");
      });
  };

  useEffect(() => {
    setLoading(true);
      getIssuesByProjectId(id)
      .then((response) => response.json())
      .then((data) => {
        setIssues(data);
        setLoading(false);
      });
  }, [id]);

  return (
    <div>
      <Navbar />
      <div className="issues-container">
        <div className="issues-card">
          <h1>Issues Page</h1>
          {loading && <p>Loading issues...</p>}
          {!loading && issues.length === 0 && <p>No issues found for this project. Please add a new issue.</p>}
          <button className="delete-btn" onClick={() => navigate("/projects")}>
            Back to projects
          </button>

          {issues.map((issue) => (
            <div key={issue.id} className="issues-item">
              <Link to={`/issues/${issue.id}`}>{issue.title}</Link>
              <div className="issue-meta">
                <span
                  className={`badge ${
                    issue.status === "TO_DO" ? "badge-todo"
                      : issue.status === "IN_PROGRESS" ? "badge-inprogress"
                        : issue.status === "IN_REVIEW" ? "badge-inreview"
                          : "badge-done"
                  }`} >{issue.status}
                </span>
                <span className={`priority-badge ${
                    issue.priority === "LOW" ? "priority-low" 
                    : issue.priority === "MEDIUM" ? "priority-medium" 
                    : issue.priority === "HIGH" ? "priority-high" 
                    : "priority-critical"}`}>
                  {issue.priority}
                </span>
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDeleteIssue(issue.id)}
              >
                Delete
              </button>
            </div>
          ))}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Issue title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Issue description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="TO_DO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="DONE">Done</option>
            </select>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>

            <button type="submit">Create Issue</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default IssuesPage;
