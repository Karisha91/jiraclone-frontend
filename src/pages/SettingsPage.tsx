import { useParams } from "react-router-dom";
import "./SettingsPage.css";
import { Link } from "react-router-dom";
import { getUserIdFromToken } from "../utils/auth";
import Navbar from "../components/Navbar";

function SettingsPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const userId = getUserIdFromToken();

  return (
    <div className="settings-page-container">
      <Navbar />
      <div className="settings-page-content">
        <div className="settings-page-header">
          <h1>Settings</h1>
          <p>Manage your workspace and profile</p>
        </div>
        <div className="settings-page-sections">
          <Link to={`/workspace/${workspaceId}/members`} className="settings-page-card">
            <div className="settings-page-info">
              <h2>Members</h2>
              <p>Add or remove workspace members</p>
            </div>
            <span className="settings-page-arrow"></span>
          </Link>
          <Link to={`/profile/${userId}`} className="settings-page-card">
            <div className="settings-page-info">
              <h2>Profile</h2>
              <p>Change your avatar and account details</p>
            </div>
            <span className="settings-page-arrow"></span>
          </Link>
        </div>
      </div>
    </div>
);
}

export default SettingsPage;