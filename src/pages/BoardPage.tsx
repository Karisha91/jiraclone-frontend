import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./BoardPage.css";
import {
  getIssuesByProjectIdForBoard,
  Issue,
  moveIssueToStatus,
  Status,
} from "../services/IssueService";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

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

function DraggableIssueCard({ issue }: { issue: Issue }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${issue.id}`,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="board-card"
    >
      <p className="board-card-title">{issue.title}</p>
    </div>
  );
}

function DroppableColumn({
  status,
  children,
}: {
  status: Status;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div ref={setNodeRef} className="board-column">
      {children}
    </div>
  );
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
        <DndContext
          onDragEnd={(event) => {
            const { active, over } = event;

            if (!over) return;

            const issueId = Number(active.id);
            const newStatus = over.id as Status;

            moveIssueToStatus(issueId, newStatus).then(() => {
              setIssues((prevIssues) =>
                prevIssues.map((issue) =>
                  issue.id === issueId
                    ? { ...issue, status: newStatus }
                    : issue,
                ),
              );
            });
          }}
        >
          <div className="board-columns">
            <DroppableColumn status={Status.TO_DO}>
              <h3 className="board-column-title">To Do</h3>
              <div className="board-column-cards">
                {grouped.TO_DO.map((issue) => (
                  <DraggableIssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            </DroppableColumn>

            <DroppableColumn status={Status.IN_PROGRESS}>
              <h3 className="board-column-title">In Progress</h3>
              <div className="board-column-cards">
                {grouped.IN_PROGRESS.map((issue) => (
                  <DraggableIssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            </DroppableColumn>

            <DroppableColumn status={Status.IN_REVIEW}>
              <h3 className="board-column-title">In Review</h3>
              <div className="board-column-cards">
                {grouped.IN_REVIEW.map((issue) => (
                  <DraggableIssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            </DroppableColumn>

            <DroppableColumn status={Status.DONE}>
              <h3 className="board-column-title">Done</h3>
              <div className="board-column-cards">
                {grouped.DONE.map((issue) => (
                  <DraggableIssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            </DroppableColumn>
          </div>
        </DndContext>
      </div>
    </div>
  );
}

export default BoardPage;
