
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'
import { getProjects, Project } from '../services/ProjectService';
import { getAllIssues, Issue } from '../services/IssueService';
import "./DashboardPage.css";
import { Link } from 'react-router-dom';

function DashboardPage() {

    const [issues, setIssues] = useState<Issue[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);

    const token = localStorage.getItem('token')
    const payload = token ? token.split('.')[1] : ''
    const decoded = payload ? JSON.parse(atob(payload)) : { sub: 'User' }


    useEffect(() => {
        getProjects()
        .then(data => setProjects(data))
    }, [])
    useEffect(() => {
        getAllIssues()
        .then(data => setIssues(data))
    }, [])



    
    return (
        <div className="dashboard-container">
    <Navbar />
    <h1>Dashboard</h1>
    <p>Welcome back, {decoded.sub}!</p>
    <div className="stats-grid">
        <div className="stat-card">
            <Link to="/projects" >
            <h3>Total Projects</h3>
            </Link>
            <span>{projects.length}</span>
            
        </div>
        <div className="stat-card">
            <Link to="/projects">
            <h3>Total Issues</h3>
            </Link>
            <span>{issues.length}</span>
        </div>
        <div className="stat-card todo">
            <h3>To Do</h3>
            <span>{issues.filter(i => i.status === "TO_DO").length}</span>
        </div>
        <div className="stat-card inprogress">
            <h3>In Progress</h3>
            <span>{issues.filter(i => i.status === "IN_PROGRESS").length}</span>
        </div>
        <div className="stat-card inreview">
            <h3>In Review</h3>
            <span>{issues.filter(i => i.status === "IN_REVIEW").length}</span>
        </div>
        <div className="stat-card done">
            <h3>Done</h3>
            <span>{issues.filter(i => i.status === "DONE").length}</span>
        </div>
    </div>
</div>
    )
}

export default DashboardPage
