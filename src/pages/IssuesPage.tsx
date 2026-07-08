import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./IssuesPage.css";
import {
  deleteIssue,
  getIssuesByProjectId,
  createIssue,
  Issue,
  Status,
  Priority,
  getAllDevelopers,
  User,
  assignDeveloperToIssue,
} from "../services/IssueService";
import { getUserIdFromToken, getUsernameFromToken } from "../utils/auth";

function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TO_DO");
  const [priority, setPriority] = useState("LOW");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [developers, setDevelopers] = useState<User[]>([]);
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const [selectedDeveloperId, setSelectedDeveloperId] = useState<number | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [showMyIssues, setShowMyIssues] = useState(false);
  
  const defaultAvatarUrl = "https://wp.cskejsaren.se/wp-content/uploads/2026/05/CS2-Default-Knife.webp";

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const filteredIssues = filter === "ALL" ? issues : issues.filter((issue) => issue.status === filter);
  const filteredIssuesByPriority = filterPriority === "ALL" ? filteredIssues : filteredIssues.filter((issue) => issue.priority === filterPriority);
  const filteredByAssignee = showMyIssues ? filteredIssuesByPriority.filter((issue) => { 
   return issue.assigneeUsername === getUsernameFromToken()}) : filteredIssuesByPriority;

  const handleToggleMyIssues = () => {
    setShowMyIssues(prev => !prev);
  };

  

  const handleDeleteIssue = async (issueId: number) => {
    try {
      const response = await deleteIssue(issueId);
      if (!response.ok) {
        setError(`You are not authorized to delete this issue: ${response.statusText}`
        );
        return;
      }
      setIssues(issues.filter((issue) => issue.id !== issueId));
    } catch (error: unknown) {
      setError(`Error deleting issue: ${error}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>,): Promise<void> => {
    e.preventDefault();
    if (!id) return;
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        setError("User ID not found");
        return;
      }
      const response = await createIssue(
        title,
        description,
        status as Status,
        priority as Priority,
        Number(id),
        userId,
      );
      if (!response.ok) {
        setError(`You are not authorized to create this issue: ${response.statusText}`
        );
        return;
      }

      const newIssue = await response.json();

      setIssues([...issues, newIssue]);
      setTitle("");
      setDescription("");
      setFilter("ALL");
      setFilterPriority("ALL");
    } catch (error: unknown) {
      setError(`Error creating issue: ${error}`);
    }
  };

  const getDevelopers = async () => {
    await getAllDevelopers().then((data) => {
      setDevelopers(data);
      setSelectedDeveloperId(data[0]?.id || null);
    });
  };

  const handleAssignDeveloper = async (issueId: number, developerId: number,) => {
    try {
      const response = await assignDeveloperToIssue(issueId, developerId);
      if (!response.ok) {
        setError(`You are not authorized to assign a developer to this issue: ${response.statusText}`
        );
        return;
      }
      const updatedIssue = await response.json();
      setIssues(
        issues.map((issue) => (issue.id === issueId ? updatedIssue : issue)),
      );
    } catch (error: unknown) {
      setError(`Error assigning developer: ${error}`);
    }
  };

  

  

  useEffect(() => {
    setLoading(true);
    getIssuesByProjectId(Number(id), currentPage).then((data) => {
      setTotalPages(data.totalPages);
      setIssues(data.content);
      setLoading(false);
    });
  }, [id, currentPage]);

  useEffect(() => {
    getDevelopers();
  }, []);

    

  return (
    <div>
      <Navbar />
      <div className="issues-container">
        <div className="issues-header">
          <h1>Issues</h1>
          <button className="back-btn" onClick={() => navigate("/projects")}>
            ← Back to Projects
          </button>
        </div>

        <div className="filter-section">
          <div>
            <p className="filter-label">Status</p>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filter === "ALL" ? "active" : ""}`}
                onClick={() => setFilter("ALL")}
              >
                All
              </button>
              <button
                className={`filter-btn ${filter === "TO_DO" ? "active" : ""}`}
                onClick={() => setFilter("TO_DO")}
              >
                To Do
              </button>
              <button
                className={`filter-btn ${filter === "IN_PROGRESS" ? "active" : ""}`}
                onClick={() => setFilter("IN_PROGRESS")}
              >
                In Progress
              </button>
              <button
                className={`filter-btn ${filter === "IN_REVIEW" ? "active" : ""}`}
                onClick={() => setFilter("IN_REVIEW")}
              >
                In Review
              </button>
              <button
                className={`filter-btn ${filter === "DONE" ? "active" : ""}`}
                onClick={() => setFilter("DONE")}
              >
                Done
              </button>
            </div>
          </div>
          <div>
            <p className="filter-label">Priority</p>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filterPriority === "ALL" ? "active" : ""}`}
                onClick={() => setFilterPriority("ALL")}
              >
                All
              </button>
              <button
                className={`filter-btn ${filterPriority === "LOW" ? "active" : ""}`}
                onClick={() => setFilterPriority("LOW")}
              >
                Low
              </button>
              <button
                className={`filter-btn ${filterPriority === "MEDIUM" ? "active" : ""}`}
                onClick={() => setFilterPriority("MEDIUM")}
              >
                Medium
              </button>
              <button
                className={`filter-btn ${filterPriority === "HIGH" ? "active" : ""}`}
                onClick={() => setFilterPriority("HIGH")}
              >
                High
              </button>
              <button
                className={`filter-btn ${filterPriority === "CRITICAL" ? "active" : ""}`}
                onClick={() => setFilterPriority("CRITICAL")}
              >
                Critical
              </button>
            </div>
             <p className="filter-label">Assigned to me</p>
             <button
               className={`filter-btn ${showMyIssues ? "active" : ""}`}
               onClick={handleToggleMyIssues}
             >
               My issues
             </button>

          </div>
        </div>

        {loading && <p className="issues-empty">Loading issues...</p>}
        {!loading && issues.length === 0 && (
          <p className="issues-empty">No issues found. Add one below.</p>
        )}

        <div className="issues-list">
          {filteredByAssignee.map((issue) => (
            
            
            <div key={issue.id} className="issues-item">
              <img
                  src={issue.reporterAvatarUrl || defaultAvatarUrl}
                  alt={issue.reporterUsername}
                  className="assignee-avatar"
                />
              
              <Link to={`/issues/${issue.id}`}>{issue.title}</Link>
              <div className="issue-meta">
                <span
                  className={`badge ${
                    issue.status === "TO_DO"
                      ? "badge-todo"
                      : issue.status === "IN_PROGRESS"
                        ? "badge-inprogress"
                        : issue.status === "IN_REVIEW"
                          ? "badge-inreview"
                          : "badge-done"
                  }`}
                >
                  {issue.status}
                </span>
                <span
                  className={`priority-badge ${
                    issue.priority === "LOW"
                      ? "priority-low"
                      : issue.priority === "MEDIUM"
                        ? "priority-medium"
                        : issue.priority === "HIGH"
                          ? "priority-high"
                          : "priority-critical"
                  }`}
                >
                  {issue.priority}
                </span>
                <span className="assignee-info">
                  {issue.assigneeUsername
                    ? `Assigned to: ${issue.assigneeUsername} `
                    : "Unassigned"}

                </span>
                
                <img
                  src={issue.assigneeAvatarUrl || defaultAvatarUrl}
                  alt={issue.assigneeUsername}
                  className="assignee-avatar"
                />
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDeleteIssue(issue.id)}
              >
                Delete
              </button>
              <button
                className="assign-btn"
                onClick={() => {
                  setSelectedIssueId(issue.id);
                }}
              >
                Assign
              </button>
              {issue.id === selectedIssueId && developers.length > 0 && (
                <div className="assign-developer">
                  <h5>Assign Developer</h5>
                  <select
                    value={selectedDeveloperId || ""}
                    onChange={(e) => {
                      setSelectedDeveloperId(Number(e.target.value));
                    }}
                  >
                    {developers.map((dev) => (
                      <option key={dev.id} value={dev.id}>
                        {dev.username}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={async () => {
                      await handleAssignDeveloper(
                        issue.id,
                        selectedDeveloperId!,
                      );
                      setSelectedIssueId(null);
                    }}
                  >
                    Confirm
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <span>
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages - 1}
          >
            Next
          </button>
        </div>
        {error && 
        <p className="error-message">{error}
        </p>}

        <div className="add-issue-form">
          <h3>New Issue</h3>
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
