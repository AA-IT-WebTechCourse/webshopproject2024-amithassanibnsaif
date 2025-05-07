import React, { useState, useEffect } from "react";
import axios from "axios";

function PopulateDB() {
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);

  // ✅ Fetch tables on page load
  useEffect(() => {
    fetchTables();
  }, []);

  const populateDB = async () => {
    try {
      await axios.post("http://localhost:8000/api/items/populate/", {
        confirm: "yes",
      });
      setMessage("✅ Database populated.");
      fetchTables();
    } catch (err) {
      setMessage(
        "❌ Failed to populate: " +
          (err.response?.data?.error || "Unknown error")
      );
    }
  };

  const deleteDB = async () => {
    try {
      await axios.delete("http://localhost:8000/api/items/populate/");
      setMessage("🗑️ Database deleted.");
      setUsers([]);
      setItems([]);
    } catch (err) {
      setMessage(
        "❌ Failed to delete: " + (err.response?.data?.error || "Unknown error")
      );
    }
  };

  const fetchTables = async () => {
    try {
      const userRes = await axios.get(
        "http://localhost:8000/api/items/allusers/"
      );
      const itemRes = await axios.get(
        "http://localhost:8000/api/items/allitems/"
      );
      setUsers(userRes.data);
      setItems(itemRes.data);
    } catch (err) {
      setMessage("❌ Failed to fetch tables.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>🛠️ Populate / Delete Database</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="mb-3">
        <button className="btn btn-success me-3" onClick={populateDB}>
          ⚙️ Populate DB
        </button>
        <button className="btn btn-danger" onClick={deleteDB}>
          🗑️ Delete All
        </button>
      </div>

      {users.length > 0 && (
        <>
          <h4>👤 Users</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={idx}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-muted">
            ℹ️ Use password <code>pass(user number)</code> to log in as each
            user.
          </p>
        </>
      )}

      {items.length > 0 && (
        <>
          <h4>📦 Products</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Title</th>
                <th>Seller</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Date Added</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i, idx) => (
                <tr key={idx}>
                  <td>{i.title}</td>
                  <td>{i.seller}</td>
                  <td>${i.price}</td>
                  <td>{i.stock}</td>
                  <td>{i.status}</td>
                  <td>{i.date_added?.slice(0, 10) || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default PopulateDB;
