import { use, useEffect, useState } from "react";
import { data, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getCommentsByIssueId, getIssueById, updateIssue } from "../services/IssueService";
import "./IssuePage.css";
import { useNavigate } from "react-router-dom";




function IssuePage() {
    const [issue, setIssue] = useState(null);
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");
    const { id } = useParams();
    const [comments, setComments] = useState([]);
    const [createComment, setCreateComment] = useState("");

useEffect(() => {
    getIssueById(id)
    .then(response => response.json())
    .then(data => setIssue(data))
    
}, []);

useEffect(() => {
    getCommentsByIssueId(id)
    .then(response => response.json())
    .then(data => setComments(data))
    
}, [id]);


const addComment = () => {
    fetch("http://localhost:8080/api/comments", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: createComment, issue: { id: issue.id } }),
    }).then((res) => {
        if (res.ok) {
            res.json().then((data) => {
                setComments([...comments, data]);
                setCreateComment("");
            });
        }
    });
};


const update = () => {
    updateIssue(issue.title, issue.description, issue.status, issue.priority, issue.id)
    .then((res) => {
        if (res.ok) {
            setError("Update successful");
            setIsEditing(false);
        } else {
            setError("Failed to update issue");
        }

    });
}

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
                    <p>{issue.description}</p>
                    <p>Status: {issue.status}</p>
                    <p>Priority: {issue.priority}</p>
                    <button onClick={() => setIsEditing(true)}>Edit issue</button>
                    <button onClick={() => navigate(`/projects/${issue.projectId}/issues`)}>Back to Issues</button>
                </div>  
            )}
            {isEditing && (
                <div>
                    <input type="text" value={issue.title} onChange={(e) => setIssue({ ...issue, title: e.target.value })} />
                    <textarea value={issue.description} onChange={(e) => setIssue({ ...issue, description: e.target.value })} />
                    <select value={issue.status} onChange={(e) => setIssue({ ...issue, status: e.target.value })}>
                        <option value="TO_DO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="IN_REVIEW">In Review</option>
                        <option value="DONE">Done</option>
                    </select>
                    <select value={issue.priority} onChange={(e) => setIssue({ ...issue, priority: e.target.value })}>
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
                        <p>{comment.content}</p> 
                        <p>{new Date(comment.createdAt).toLocaleString()}</p>
                        <p>{comment.author}</p>

                        
                    </div>
                ))}
            </div>
            
            <input type="text" value={createComment} onChange={(e) => setCreateComment(e.target.value)} />
            <button placeholder="Enter comment..." onClick={addComment}>Add comment</button>
            </div>
            </div>
            
            
        </div>
    );
}

export default IssuePage;