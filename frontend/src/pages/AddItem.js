import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddItem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("❌ You must be logged in to add an item.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/items/add/",
        {
          title,
          description,
          price,
          stock,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      setMessage("✅ Item added successfully!");
      setTitle("");
      setDescription("");
      setPrice("");
      setStock("");
      navigate("/");
    } catch (error) {
      setMessage("❌ Failed to add item.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New Item</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            className="form-control"
            type="text"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            className="form-control"
            type="number"
            value={price}
            required
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Stock</label>
          <input
            className="form-control"
            type="number"
            value={stock}
            required
            onChange={(e) => setStock(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Item
        </button>
      </form>
    </div>
  );
}

export default AddItem;
