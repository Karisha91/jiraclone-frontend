import { useParams } from "react-router-dom";
import "./SettingsPage.css";
import { Link } from "react-router-dom";
import { getUserIdFromToken } from "../utils/auth";
import Navbar from "../components/Navbar";
import { createCheckoutSession } from "../services/CheckoutService";
import toast from "react-hot-toast";

function SettingsPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const userId = getUserIdFromToken();


  const handleUpgradeToPremium = async () => {
    try {
      const url = await createCheckoutSession();
      window.location.href = url;
    } catch {
      toast.error("Failed to start checkout session:");
    }
  }

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
          <button onClick={handleUpgradeToPremium} className="settings-page-card">
            <div className="settings-page-info">
              <h2>Upgrade to Premium</h2>
              <p>Unlock unlimited workspaces</p>
            </div>
            <span className="settings-page-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
);
}

export default SettingsPage;