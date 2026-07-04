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
  PageResponse,
} from "../services/IssueService";
import "./IssuePage.css";
import { useNavigate } from "react-router-dom";

function IssuePage() {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [comments, setComments] = useState<PageResponse<Comment>>({
    content: [],
    totalPages: 0,
    totalElements: 0,
    pageNumber: 0,
    last: false,
    first: true,
});

  const [createComment, setCreateComment] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    getIssueById(Number(id))
      .then((data) => setIssue(data));
  }, []);

  useEffect(() => {
    getCommentsByIssueId(Number(id), currentPage)
      
      .then((data) => setComments({
    ...data,
    content: [...comments.content, ...data.content]
}));
}, [id, currentPage]);

  const addComment = async () => {

    try {const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: createComment, issue: { id: issue?.id } }),
    });
   if (!response.ok) {
      setError(`You are not authorized to create this comment: ${response.statusText}`);
      return;
    }
    const data = await response.json();
      setComments({
        ...comments,
        content: [...comments.content, data],
        totalElements: comments.totalElements + 1,
      });
      setCreateComment("");
    } catch (error: unknown) {
      setError(`Error creating comment: ${error}`);
    }

  }
    

  const update = async () => {
    if (!issue) return;
    try {
      const response = await updateIssue(
      issue.title,
      issue.description,
      issue.status,
      issue.priority,
      issue.id,
    )
    if (!response.ok) {
      setError(`You are not authorized to update this issue: ${response.statusText}`);
      return;

    }
    setSuccessMessage("Update successful");
        setIsEditing(false);

  } catch (error: unknown) {
      setError(`Error updating issue: ${error}`);
    }

  };

  const deleteCom = async (commentId: number) => {
    try {
      const response = await deleteComment(commentId);
      if (!response.ok) {
        setError(`You are not authorized to delete this comment: ${response.statusText}`);
        return;
      }
      setComments({
      ...comments,
      content: comments.content.filter((comment: Comment) => comment.id !== commentId),
      totalElements: comments.totalElements - 1,
    });
    } catch (error: unknown) {
      setError(`Error deleting comment: ${error}`);
    }
    
  };

  return (
  <div>
    <Navbar />
    <div className="issue-container">
      <div className="issue-header">
        <h1>Issue Details</h1>
        {issue && (
          <button className="back-btn" onClick={() => navigate(`/projects/${issue.projectId}/issues`)}>
            ← Back to Issues
          </button>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-msg">{successMessage}</p>}

      {issue && !isEditing && (
        <div className="issue-details-card">
          <h2>{issue.title}</h2>
          <p className="issue-description">{issue.description}</p>
          <div className="issue-badges">
            <span className="issue-badge issue-badge-status">{issue.status}</span>
            <span className="issue-badge issue-badge-priority">{issue.priority}</span>
          </div>
          <div className="issue-actions">
            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Issue</button>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="edit-form-card">
          <h3>Edit Issue</h3>
          <input
            type="text"
            value={issue?.title}
            onChange={(e) => setIssue({ ...issue!, title: e.target.value })}
          />
          <textarea
            value={issue?.description}
            onChange={(e) => setIssue({ ...issue!, description: e.target.value })}
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
            onChange={(e) => setIssue({ ...issue!, priority: e.target.value as Priority })}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
          <button className="save-btn" onClick={update}>Save Changes</button>
        </div>
      )}

      <div className="comments-section">
        <h3>Comments</h3>
        {comments.content.map((comment) => (
          <div key={comment.id} className="comment-item">
            <p className="comment-author">{comment.author}</p>
            <p className="comment-content">{comment.content}</p>
            <p className="comment-date">
              {new Date(comment.createdAt).toLocaleString('sr-RS', { timeZone: 'Europe/Belgrade' })}
            </p>
            <button className="comment-delete-btn" onClick={() => deleteCom(comment.id)}>Delete</button>
          </div>
        ))}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={comments.last}
          >
            Show more...
          </button>
        </div>
        <div className="add-comment">
          <input
            type="text"
            value={createComment}
            placeholder="Add a comment..."
            onChange={(e) => setCreateComment(e.target.value)}
          />
          <button onClick={addComment}>Post</button>
        </div>
      </div>
    </div>
  </div>
);
}

export default IssuePage;
