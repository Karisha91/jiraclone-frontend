
import Navbar from '../components/Navbar'


function DashboardPage() {

    const token = localStorage.getItem('token')
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))


    
    return (
        <div>
            <Navbar />
            <h1>Dashboard</h1>
            <p>Welcome to Jira Clone {decoded.sub}!</p>

        </div>
    )
}

export default DashboardPage
