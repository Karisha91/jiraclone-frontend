import { useNavigate } from 'react-router-dom'


function DashboardPage() {

    const token = localStorage.getItem('token')
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))

    
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    const handleViewProjects = () => {
        navigate('/projects')
    }

    
    
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to Jira Clone {decoded.sub}!</p>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleViewProjects}>View Projects</button>
            
        </div>
    )
}

export default DashboardPage
