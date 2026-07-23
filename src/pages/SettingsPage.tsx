import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MembersTable from "./MembersTable";
import {
  MemberSummary,
  getWorkspace,
  removeMember,
  addMemberToWorkspace,
} from "../services/WorkspaceService";
import { useParams } from "react-router-dom";
import "./SettingsPage.css";
import AddMemberForm from "./AddMemberForm";

function SettingsPage() {
  const [members, setMembers] = useState<MemberSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  const onSuccess = (username: string) => {
    setSuccessMsg(`Successfully added ${username}!`);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleRemoveMember = async (username: string) => {
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
      setMembers((prev) =>
        prev.filter((member) => member.username !== username),
      );
    } catch (error: unknown) {
      setError(`Error removing member: ${error}`);
    }
  };

  const handleAddMember = async (username: string): Promise<boolean> => {
    try {
      const response = await addMemberToWorkspace(
        Number(workspaceId),
        username,
      );
      if (!response.ok) {
        if (response.status === 403) {
          setError("You are not authorized to add this member");
        } else if (response.status === 404) {
          setError("Member not found");
        } else if (response.status === 409) {
          setError("User is already a member of this workspace");
        } else {
          setError("Something went wrong, please try again");
        }
        return false;
      }
      const data = await response.json();
      setMembers((prev) => [...prev, data]);
      return true;
    } catch (error: unknown) {
      setError(`Error adding member: ${error}`);
      return false;
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
        <div>
          {error && <p className="error-message">{error}</p>}
          {successMsg && <p className="success-msg">{successMsg}</p>}
          <AddMemberForm addMember={handleAddMember} onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
