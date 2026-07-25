import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  getIssueById,
  updateIssue,
  Issue,
  Status,
  Priority,
} from "../services/IssueService";
import "./IssuePage.css";
import { useNavigate } from "react-router-dom";
import CommentSection from "./CommentSection";
import toast from 'react-hot-toast';

function IssuePage() {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  

  useEffect(() => {
    getIssueById(Number(id)).then((data) => setIssue(data));
  }, []);

  

  
  const update = async () => {
    if (!issue) return;
    try {
      const response = await updateIssue(
        issue.title,
        issue.description,
        issue.status,
        issue.priority,
        issue.id,
      );
      if (!response.ok) {
        if (response.status === 403) {
          toast.error("You are not authorized to update this issue");
        } else {
          toast.error("Something went wrong, please try again");
        }
        return;
      }
      toast.success("Update successful");
      setIsEditing(false);
    } catch (error: unknown) {
      toast.error(`Error updating issue: ${error}`);
    }
  };

 

  return (
    <div>
      <Navbar />
      <div className="issue-container">
        <div className="issue-header">
          <h1>Issue Details</h1>
          {issue && (
            <button
              className="back-btn"
              onClick={() => navigate(`/projects/${issue.projectId}/issues`)}
            >
              ← Back to Issues
            </button>
          )}
        </div>

        

        {issue && !isEditing && (
          <div className="issue-details-card">
            <h2>{issue.title}</h2>
            <p className="issue-description">{issue.description}</p>
            <div className="issue-badges">
              <span className="issue-badge issue-badge-status">
                {issue.status}
              </span>
              <span className="issue-badge issue-badge-priority">
                {issue.priority}
              </span>
            </div>
            <div className="issue-actions">
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                Edit Issue
              </button>
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
              onChange={(e) =>
                setIssue({ ...issue!, description: e.target.value })
              }
            />
            <select
              value={issue?.status}
              onChange={(e) =>
                setIssue({ ...issue!, status: e.target.value as Status })
              }
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
            <button className="save-btn" onClick={update}>
              Save Changes
            </button>
          </div>
        )}

        <CommentSection issueId={Number(id)} />
      </div>
    </div>
  );
}

export default IssuePage;
