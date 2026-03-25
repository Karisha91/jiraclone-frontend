import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


function IssuesPage() {

    const [issues, setIssues] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("TO_DO");
    const [priority, setPriority] = useState("LOW");


    const { id } = useParams();

    const handleDeleteIssue = (issueId) => {
        fetch(`http://localhost:8080/api/issues/${issueId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }).then(() => {
            setIssues(issues.filter((issue) => issue.id !== issueId));
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:8080/api/issues", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, description, status, priority, project: { id: id } }),
        })
        .then((response) => response.json())
        .then((data) => {
            setIssues([...issues, data]);
            setTitle("");
            setDescription("");
        });
    };


useEffect(() => {
    fetch(`http://localhost:8080/api/issues/project/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    })  .then((response) => response.json())
        .then((data) => {
            setIssues(data);
        });     
}, [id]);


  return (
    <div>
      <h1>Issues Page</h1>
      
        {issues.map((issue) => (
            <div key={issue.id}>
                <h2>{`Title: ${issue.title}`}</h2>
                <h4>{`Status: ${issue.status}, Priority: ${issue.priority}`}</h4>
                <p>{issue.description}</p>
                <button onClick={() => handleDeleteIssue(issue.id)}>delete</button>
            </div>
        ))}

        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Issue title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder="Issue description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="TO_DO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="DONE">Done</option>
            </select>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
            </select>
            
            <button type="submit">Create Issue</button>
        </form>

    </div>
  );
}

export default IssuesPage;