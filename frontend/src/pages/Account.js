import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Account() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8000/api/users/change_password/",
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      Swal.fire("✅ Password changed!");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      Swal.fire("❌ Failed", err.response?.data?.error || "Try again", "error");
    }
  };

  return (
    <div className="container mt-4">
      <h3>🔐 Change Password</h3>
      <form onSubmit={handleSubmit}>
        <label>Old Password:</label>
        <input
          type="password"
          className="form-control mb-2"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <label>New Password:</label>
        <input
          type="password"
          className="form-control mb-3"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit" className="btn btn-warning">
          Update Password
        </button>
      </form>
    </div>
  );
}

export default Account;
