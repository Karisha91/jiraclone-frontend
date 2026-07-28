import { getUserIdFromToken, getUsernameFromToken } from "../utils/auth";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRef } from "react";
import Navbar from "../components/Navbar";
import "./ProfilePage.css";

function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const defaultAvatar =
    "https://wp.cskejsaren.se/wp-content/uploads/2026/05/CS2-Default-Knife.webp";
  const [currentUsername, setCurrentUsername] = useState(
    getUsernameFromToken(),
  );
  const userId = getUserIdFromToken();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState<string>(currentUsername ?? "");

  const getUserAvatar = async (userId: number) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/${userId}/avatar`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    const url = await response.text();
    return url;
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
      toast.success("Avatar uploaded successful");
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
            {!isEditing && (
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
            <button onClick={() => setIsEditing(true)}>Change username</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
