import { getUserIdFromToken, getUsernameFromToken } from "../utils/auth";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import "./ProfilePage.css";

function ProfilePage() {
  const defaultAvatar =
    "https://wp.cskejsaren.se/wp-content/uploads/2026/05/CS2-Default-Knife.webp";
  const [currentUsername, setCurrentUsername] = useState(
    getUsernameFromToken(),
  );
  const userId = getUserIdFromToken();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState<string>(currentUsername ?? "");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [isOldPasswordValid, setIsOldPasswordValid] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");

  const getUserAvatar = async (userId: number) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/${userId}/avatar`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    return response.text();
  };

  const isPasswordValid = async (oldPassword: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}/valid-password`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ oldPassword }),
        },
      );
      if (response.ok) {
        const valid = await response.json();
        if (valid) {
          setIsOldPasswordValid(true);
          setIsChangingPassword(false);
          return true;
        }
        toast.error("Old password is incorrect");
        setIsOldPasswordValid(false);
        return false;
      }
      return false;
    } catch {
      setIsOldPasswordValid(false);
      return false;
    }
  };

  const changePassword = async (newPassword: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}/change-password`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword }),
        },
      );
      if (response.ok) {
        const newToken = await response.text();
        localStorage.setItem("token", newToken);
        toast.success("Password updated");
        setIsChangingPassword(false);
        setIsOldPasswordValid(false);
        setOldPassword("");
        setNewPassword("");
        setRepeatNewPassword("");
      }
    } catch {
      toast.error("Failed to change password");
    }
  };

  const changeUsername = async (newUsername: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/${userId}/username`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "text/plain",
        },
        body: newUsername,
      },
    );
    if (response.ok) {
      const newToken = await response.text();
      localStorage.setItem("token", newToken);
      setCurrentUsername(getUsernameFromToken());
      toast.success("Username updated");
      setIsEditing(false);
    }
    return response;
  };

  const uploadAvatar = async (avatar: File) => {
    const formData = new FormData();
    formData.append("avatar", avatar);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/${userId}/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      },
    );
    if (response.ok) {
      toast.success("Avatar uploaded successfully");
      return response.text();
    }
    toast.error("Failed to upload avatar");
    return null;
  };

  useEffect(() => {
    if (userId == null) return;
    getUserAvatar(userId)
      .then((url) => setAvatarUrl(url))
      .catch(() => toast.error("Failed to load avatar"));
  }, []);

  return (
    <div className="profile-container">
      <Navbar />
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-card-body">
            <img
              src={avatarUrl || defaultAvatar}
              alt="Profile avatar"
              className="profile-avatar"
            />
            {!isEditing && !isChangingPassword && !isOldPasswordValid && (
              <h2 className="profile-username">{currentUsername}</h2>
            )}

            {isEditing && (
              <div className="edit-username-card">
                <h4>Change username</h4>
                <h2 className="profile-username">{currentUsername}</h2>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
                <button onClick={() => changeUsername(newUsername)}>
                  Apply
                </button>
              </div>
            )}

            {isChangingPassword && (
              <div className="change-password-card">
                <h4>Enter old password</h4>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <button onClick={() => isPasswordValid(oldPassword)}>
                  Verify
                </button>
              </div>
            )}

            {isOldPasswordValid && (
              <div className="change-password-card">
                <h4>New password</h4>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <h4>Repeat new password</h4>
                <input
                  type="password"
                  value={repeatNewPassword}
                  onChange={(e) => setRepeatNewPassword(e.target.value)}
                />
                <button
                  onClick={() => {
                    if (newPassword !== repeatNewPassword) {
                      toast.error("Passwords do not match");
                      return;
                    }
                    changePassword(newPassword);
                  }}
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          <div className="profile-actions">
            <input
              type="file"
              id="avatar-upload"
              style={{ display: "none" }}
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = await uploadAvatar(file);
                  if (url) setAvatarUrl(url);
                }
              }}
            />
            <label htmlFor="avatar-upload" className="profile-action-btn">
              Upload Avatar
            </label>
            <button
              onClick={() => {
                setIsEditing(true);
                setIsChangingPassword(false);
                setIsOldPasswordValid(false);
              }}
            >
              Change Username
            </button>
            <button
              onClick={() => {
                setIsChangingPassword(true);
                setIsEditing(false);
                setIsOldPasswordValid(false);
              }}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
