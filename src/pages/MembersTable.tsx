import "./MembersTable.css";
import { MemberSummary } from "../services/WorkspaceService";


function MembersTable({ members, onRemove }: { members: MemberSummary[], onRemove: (username: string ) => void }) {
  return (
    <table className="members-table">
      <thead>
        <tr>
          <th>Avatar</th>
          <th>Username</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member: MemberSummary) => (
          <tr key={member.id}>
            <td>
              {member.avatarUrl ? (
                <img
                  src={member.avatarUrl}
                  alt={member.username}
                  className="member-avatar"
                />
              ) : (
                <div className="member-avatar-placeholder">
                  {member.username.charAt(0).toUpperCase()}
                </div>
              )}
            </td>
            <td>{member.username}</td>
            <td>
              <button className="remove-member-btn" onClick={() => onRemove(member.username)}>Remove</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default MembersTable;
