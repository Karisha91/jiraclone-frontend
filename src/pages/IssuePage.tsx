import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  getCommentsByIssueId,
  getIssueById,
  updateIssue,
  deleteComment,
  Issue,
  Comment,
  Status,
  Priority,
} from "../services/IssueService";
import "./IssuePage.css";
import { useNavigate } from "react-router-dom";

function IssuePage() {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [createComment, setCreateComment] = useState("");

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    getIssueById(Number(id))
      .then((data) => setIssue(data));
  }, []);

  useEffect(() => {
    getCommentsByIssueId(Number(id))
      
      .then((data) => setComments(data));
  }, [id]);

  const addComment = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: createComment, issue: { id: issue?.id } }),
    });
    if (response.ok) {
      const data = await response.json();
      setComments([...comments, data]);
      setCreateComment("");
    }
  };

  const update = async () => {
    if (!issue) return;
    updateIssue(
      issue.title,
      issue.description,
      issue.status,
      issue.priority,
      issue.id,
    ).then((res) => {
      if (res.ok) {
        setError("Update successful");
        setIsEditing(false);
      } else {
        setError("Failed to update issue");
      }
    });
  };

  const deleteCom = async (commentId: number) => {
    await deleteComment(commentId);
    setComments(comments.filter((comment) => comment.id !== commentId));
  };
  

  return (
    <div>
      <Navbar />
      <div className="issue-container">
        <div className="issue-card">
          <h1>Issue Page</h1>
          {error && <p style={{ color: "green" }}>{error}</p>}

          {issue && (
            <div>
              <h2>{issue.title}</h2>
              <p className="issue-detail">{issue.description}</p>
              <p className="issue-status">Status: {issue.status}</p>
              <p className="issue-status">Priority: {issue.priority}</p>
              <button onClick={() => setIsEditing(true)}>Edit issue</button>
              <button
                onClick={() => navigate(`/projects/${issue.projectId}/issues`)}
              >
                Back to Issues
              </button>
            </div>
          )}
          {isEditing && (
            <div>
              <input
                type="text"
                value={issue?.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIssue({ ...issue!, title: e.target.value })}
              />
              <textarea
                value={issue?.description}
                onChange={(e) =>
                  setIssue({ ...issue!, description: e.target.value })
                }
              />
              <select
                value={issue?.status}
                onChange={(e) => setIssue({ ...issue!, status: e.target.value as Status })}
              >
                <option value="TO_DO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="DONE">Done</option>
              </select>
              <select
                value={issue?.priority}
                onChange={(e) =>
                  setIssue({ ...issue!, priority: e.target.value as Priority })
                }
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
              <button onClick={update}>Save Changes</button>
            </div>
          )}
          <div>
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <p className="comment-author">{comment.author}</p>
                <p className="comment-content">{comment.content}</p>
                <p className="comment-date">
                  {new Date(comment.createdAt).toLocaleString('sr-RS', { timeZone: 'Europe/Belgrade' })}
                </p>
                <button
                  className="comment-delete-btn"
                  onClick={() => deleteCom(comment.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <input
            type="text"
            value={createComment}
            placeholder="Add comment..."
            onChange={(e) => setCreateComment(e.target.value)}
          />
          <button onClick={addComment}>
            Add comment
          </button>
        </div>
      </div>
    </div>
  );
}

export default IssuePage;
