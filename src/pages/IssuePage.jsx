import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getIssueById, updateIssue } from "../services/IssueService";



function IssuePage() {
    const [issue, setIssue] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");
    const { id } = useParams();

useEffect(() => {
    getIssueById(id)
    .then(response => response.json())
    .then(data => setIssue(data))
    
}, []);


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
            <h1>Issue Page</h1>
            {error && <p style={{ color: "green" }}>{error}</p>}
                
            {issue && (
                <div>
                    
                    <h2>{issue.title}</h2>
                    <p>{issue.description}</p>
                    <p>Status: {issue.status}</p>
                    <p>Priority: {issue.priority}</p>
                    <button onClick={() => setIsEditing(true)}>Edit issue</button>
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

        </div>
    );
}

export default IssuePage;