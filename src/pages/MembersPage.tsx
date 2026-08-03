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
import "./MembersPage.css";
import AddMemberForm from "./AddMemberForm";
import toast from 'react-hot-toast';

function MembersPage() {
  const [members, setMembers] = useState<MemberSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const { workspaceId } = useParams<{ workspaceId: string }>();



  const handleRemoveMember = async (username: string) => {
    try {
      const response = await removeMember(Number(workspaceId), username);
      if (!response.ok) {
        if (response.status === 403) {
          toast.error("You are not authorized to delete this member");
        } else if (response.status === 404) {
          toast.error("Member not found");
        } else {
          toast.error("Something went wrong, please try again");
        }
        return;
      }
      toast.success("Member removed from workspace!")
      setMembers((prev) =>
        prev.filter((member) => member.username !== username),
      );
    } catch (error: unknown) {
      toast.error(`Error removing member: ${error}`);
    }
  };

  const handleAddMember = async (username: string): Promise<boolean> => {
    try {
      const response = await addMemberToWorkspace(
        Number(workspaceId),
        username,
      );
      if (!response.ok) {
        if (response.status === 401) {
          const message = await response.text();
          toast.error(message);
        }
       else if (response.status === 403) {
          toast.error("You are not authorized to add this member");
        } else if (response.status === 404) {
          toast.error("Member not found");
        } else if (response.status === 409) {
          toast.error("User is already a member of this workspace");
        } else {
          toast.error("Something went wrong, please try again");
        }
        return false;
      }
      const data = await response.json();
      setMembers((prev) => [...prev, data]);
      toast.success(`${username} added to workspace!`)
      return true;
    } catch (error: unknown) {
      toast.error(`Error adding member: ${error}`);
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
    <div className="members-page-container">
      <Navbar />
      <div className="members-page-header">
        <h1>Members</h1>
      </div>
      {loading && <p className="members-page-empty">Loading...</p>}
      <div className="members-page-section">
        <h2>Members</h2>
        <MembersTable onRemove={handleRemoveMember} members={members} />
      </div>
      <AddMemberForm addMember={handleAddMember} />
    </div>
);
}

export default MembersPage;
