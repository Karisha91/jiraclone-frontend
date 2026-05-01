import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProjectsPage from "./pages/ProjectsPage";
import IssuesPage from "./pages/IssuesPage";
import RegisterPage from "./pages/RegisterPage";
import IssuePage from "./pages/IssuePage";
import { Navigate } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          }
        />
        
            <Route path="/issues/:id" element={
              <ProtectedRoute>
                 <IssuePage />
              </ProtectedRoute>
             } 
              
              />
          

        <Route
          path="/projects/:id/issues"
          element={
            <ProtectedRoute>
              <IssuesPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
