import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./BoardPage.css";
import {
  getIssuesByProjectIdForBoard,
  Issue,
  Status,
} from "../services/IssueService";

function groupIssuesByStatus(issues: Issue[]): Record<Status, Issue[]> {
  const grouped: Record<Status, Issue[]> = {
    TO_DO: [],
    IN_PROGRESS: [],
    IN_REVIEW: [],
    DONE: [],
  };

  for (const issue of issues) {
    grouped[issue.status].push(issue);
  }
  grouped.TO_DO.sort((a, b) => a.position - b.position);
  grouped.IN_PROGRESS.sort((a, b) => a.position - b.position);
  grouped.IN_REVIEW.sort((a, b) => a.position - b.position);
  grouped.DONE.sort((a, b) => a.position - b.position);

  return grouped;
}

function BoardPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getIssuesByProjectIdForBoard(Number(id)).then((data) => {
      setIssues(data);
      setLoading(false);
    });
  }, [id]);

  const grouped = groupIssuesByStatus(issues);

  return (
    <div>
      <Navbar />
    <div className="board-container">
      
      <div className="board-header">
        <h1>Board</h1>
      </div>

      {loading && <p>Loading board...</p>}

      <div className="board-columns">
        <div className="board-column">
          <h3 className="board-column-title">To Do</h3>
          <div className="board-column-cards">
            {grouped.TO_DO.map((issue) => (
              <div key={issue.id} className="board-card">
                <p className="board-card-title">{issue.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="board-column">
          <h3 className="board-column-title">In Progress</h3>
          <div className="board-column-cards">
            {grouped.IN_PROGRESS.map((issue) => (
              <div key={issue.id} className="board-card">
                <p className="board-card-title">{issue.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="board-column">
          <h3 className="board-column-title">In Review</h3>
          <div className="board-column-cards">
            {grouped.IN_REVIEW.map((issue) => (
              <div key={issue.id} className="board-card">
                <p className="board-card-title">{issue.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="board-column">
          <h3 className="board-column-title">Done</h3>
          <div className="board-column-cards">
            {grouped.DONE.map((issue) => (
              <div key={issue.id} className="board-card">
                <p className="board-card-title">{issue.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default BoardPage;