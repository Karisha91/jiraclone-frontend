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
import { DndContext, useDroppable, DragOverlay } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

function calculatePositionForDrop(
  targetColumnIssues: Issue[],
  overId: string | number,
  movingDown: boolean,
): number {
  if (typeof overId === "string") {
    if (targetColumnIssues.length === 0) {
      return 1000;
    }
    const lastIssue = targetColumnIssues[targetColumnIssues.length - 1];
    return lastIssue.position + 1000;
  }

  const overIndex = targetColumnIssues.findIndex(
    (issue) => issue.id === overId,
  );

  if (overIndex === -1) {
    const lastIssue = targetColumnIssues[targetColumnIssues.length - 1];
    return lastIssue ? lastIssue.position + 1000 : 1000;
  }

  if (movingDown) {
    const cardBelow = targetColumnIssues[overIndex];
    const cardAfterThat = targetColumnIssues[overIndex + 1];
    return cardAfterThat
      ? (cardBelow.position + cardAfterThat.position) / 2
      : cardBelow.position + 1000;
  } else {
    const cardAbove = targetColumnIssues[overIndex - 1];
    const cardBelow = targetColumnIssues[overIndex];
    return cardAbove
      ? (cardAbove.position + cardBelow.position) / 2
      : cardBelow.position / 2;
  }
}

function DraggableIssueCard({ issue }: { issue: Issue }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: issue.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);

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
          onDragStart={(event) => {
            const draggedIssue = issues.find(
              (issue) => issue.id === Number(event.active.id),
            );
            setActiveIssue(draggedIssue ?? null);
          }}
          onDragEnd={(event) => {
            const { active, over } = event;

            if (!over) return;

            const issueId = Number(active.id);

            const newStatus =
              typeof over.id === "string"
                ? (over.id as Status)
                : issues.find((issue) => issue.id === over.id)?.status;

            if (!newStatus) return;

            const fullTargetColumn = grouped[newStatus];
            const draggedIssueOriginalIndex = fullTargetColumn.findIndex(
              (issue) => issue.id === issueId,
            );
            const overIndexInFullList = fullTargetColumn.findIndex(
              (issue) => issue.id === over.id,
            );
            const movingDown = draggedIssueOriginalIndex < overIndexInFullList;

            // Only now filter out the dragged issue, for the actual math.
            const targetColumnIssues = fullTargetColumn.filter(
              (issue) => issue.id !== issueId,
            );

            const newPosition = calculatePositionForDrop(
              targetColumnIssues,
              over.id,
              movingDown,
            );

            moveIssueToStatus(issueId, newStatus, newPosition).then(() => {
              setIssues((prevIssues) =>
                prevIssues.map((issue) =>
                  issue.id === issueId
                    ? { ...issue, status: newStatus, position: newPosition }
                    : issue,
                ),
              );
            });
            setActiveIssue(null);
          }}
        >
          <div className="board-columns">
            <DroppableColumn status={Status.TO_DO}>
              <h3 className="board-column-title">To Do</h3>
              <SortableContext items={grouped.TO_DO.map((issue) => issue.id)}>
                <div className="board-column-cards">
                  {grouped.TO_DO.map((issue) => (
                    <DraggableIssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
              </SortableContext>
            </DroppableColumn>

            <DroppableColumn status={Status.IN_PROGRESS}>
              <h3 className="board-column-title">In Progress</h3>
              <SortableContext
                items={grouped.IN_PROGRESS.map((issue) => issue.id)}
              >
                <div className="board-column-cards">
                  {grouped.IN_PROGRESS.map((issue) => (
                    <DraggableIssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
              </SortableContext>
            </DroppableColumn>

            <DroppableColumn status={Status.IN_REVIEW}>
              <h3 className="board-column-title">In Review</h3>
              <SortableContext
                items={grouped.IN_REVIEW.map((issue) => issue.id)}
              >
                <div className="board-column-cards">
                  {grouped.IN_REVIEW.map((issue) => (
                    <DraggableIssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
              </SortableContext>
            </DroppableColumn>

            <DroppableColumn status={Status.DONE}>
              <h3 className="board-column-title">Done</h3>
              <SortableContext items={grouped.DONE.map((issue) => issue.id)}>
                <div className="board-column-cards">
                  {grouped.DONE.map((issue) => (
                    <DraggableIssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
              </SortableContext>
            </DroppableColumn>
          </div>
          <DragOverlay>
    {activeIssue ? (
      <div className="board-card">
        <p className="board-card-title">{activeIssue.title}</p>
      </div>
    ) : null}
  </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

export default BoardPage;
