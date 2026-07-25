import { useEffect, useState } from "react";
import {
  getCommentsByIssueId,
  deleteComment,
  Comment,
  PageResponse,
} from "../services/IssueService";
import "./IssuePage.css";
import AddCommentForm from "./AddCommentForm";
import toast from 'react-hot-toast';

function CommentSection({
  issueId,
}: {
issueId: number;
}) {


const [currentPage, setCurrentPage] = useState(0);
const [comments, setComments] = useState<PageResponse<Comment>>({
    content: [],
    totalPages: 0,
    totalElements: 0,
    pageNumber: 0,
    last: false,
    first: true,
  });
  const defaultAvatarUrl =
    "https://wp.cskejsaren.se/wp-content/uploads/2026/05/CS2-Default-Knife.webp";



const addComment = async (comment: string):  Promise<boolean>  => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: comment,
            issueId: issueId
          }),
        },
      );
      if (!response.ok) {
        if (response.status === 403) {
          toast.error("You are not authorized to create a comment");
        } else if (response.status === 400) {
          toast.error("Invalid comment data");
        }
        else {
          toast.error("Something went wrong, please try again");
        }
        return false;
      }
      const data = await response.json();
      toast.success("Comment added!")
      setComments({
        ...comments,
        content: [...comments.content, data],
        totalElements: comments.totalElements + 1,
      });
      return true;
    } catch (error: unknown) {
      toast.error(`Error creating comment: ${error}`);
      return false;
    }
  };





 const deleteCom = async (commentId: number) => {
    try {
      const response = await deleteComment(commentId);
      if (!response.ok) {
        if (response.status === 403) {
          toast.error("You are not authorized to delete this comment");
        } else {
          toast.error("Something went wrong, please try again");
        }
        return;
      }
      toast.success("Comment removed!")
      setComments({
        ...comments,
        content: comments.content.filter(
          (comment: Comment) => comment.id !== commentId,
        ),
        totalElements: comments.totalElements - 1,
      });
    } catch (error: unknown) {
      toast.error(`Error deleting comment: ${error}`);
    }
  };


useEffect(() => {
    getCommentsByIssueId(Number(issueId), currentPage).then((data) =>
      setComments({
        ...data,
        content: [...comments.content, ...data.content],
      }),
    );
  }, [issueId, currentPage]);



    return (
        <div className="comments-section">
          <h3>Comments</h3>
          
          {comments.content.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-left">
                <img
                  src={comment.authorAvatarUrl || defaultAvatarUrl}
                  alt={comment.author || "Comment author"}
                  className="comment-assignee-avatar"
                />
              </div>
              <div className="comment-content-wrapper">
                <p className="comment-author">{comment.author}</p>
                <p className="comment-content">{comment.content}</p>
                <p className="comment-date">
                  {new Date(comment.createdAt).toLocaleString("sr-RS", {
                    timeZone: "Europe/Belgrade",
                  })}
                </p>
              </div>
              <button
                className="comment-delete-btn"
                onClick={() => deleteCom(comment.id)}
              >
                Delete
              </button>
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
          <AddCommentForm addComment={addComment} />
        </div>
    )
}

export default CommentSection;