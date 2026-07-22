import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MembersTable from "./MembersTable";
import {
  MemberSummary,
  getWorkspace,
  removeMember,
} from "../services/WorkspaceService";
import { useParams } from "react-router-dom";
import "./SettingsPage.css";

function SettingsPage() {
  const [members, setMembers] = useState<MemberSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [error, setError] = useState<string | null>(null);

  const handleRemoveMember = async ( username: string) => {
    try {
      const response = await removeMember(Number(workspaceId), username);
      if (!response.ok) {
        if (response.status === 403) {
          setError("You are not authorized to delete this member");
        } else if (response.status === 404) {
          setError("Member not found");
        } else {
          setError("Something went wrong, please try again");
        }
        return;
      }
      setMembers(prev => prev.filter((member) => member.username !== username));
    } catch (error: unknown) {
      setError(`Error removing member: ${error}`);
    }
  };

  useEffect(() => {
    setLoading(true);
    getWorkspace(Number(workspaceId)).then((data) => {
      setMembers(data.members);
      setLoading(false);
    });
  }, [workspaceId]);

  return (
    <div className="settings-container">
      <Navbar />
      <div className="settings-content">
        <div className="settings-header">
          <h1>Settings</h1>
          <p>Manage your workspace members</p>
        </div>
        {loading && <p className="settings-empty">Loading...</p>}
        <div className="settings-section">
          <h2>Members</h2>
          <MembersTable onRemove={handleRemoveMember} members={members} />
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
