import { MemberSummary } from "../services/WorkspaceService";
import { useState } from "react";

function AddMemberForm({
  addMember,
  onSuccess,
}: {
  addMember: (username: string) => Promise<boolean>;
  onSuccess: (onSuccess: string) => void;
}) {
  const [username, setUsername] = useState("");

  return (
    <div className="add-member-form">
      <h3>Add member</h3>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const success = await addMember(username);
          console.log('====================================');
          console.log(success);
          console.log('====================================');
          if (success) {
            onSuccess(username);
            setUsername("");
          }
        }}
      >
        <input
          type="text"
          placeholder="member username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button type="submit">Add member</button>
      </form>
    </div>
  );
}

export default AddMemberForm;
