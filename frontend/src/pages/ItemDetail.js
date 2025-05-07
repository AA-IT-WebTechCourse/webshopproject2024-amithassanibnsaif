import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/items/${id}/`)
      .then((res) => setItem(res.data))
      .catch((err) => setError("❌ Failed to load item."));
  }, [id]);

  const handleEdit = () => {
    axios
      .put(
        `http://localhost:8000/api/items/${id}/edit/`,
        {
          price: newPrice,
          stock: newStock,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((res) => {
        Swal.fire("✅ Item updated successfully!");
        setEditing(false);
        window.location.reload();
      })
      .catch((err) => {
        Swal.fire("❌ Failed to update.");
        console.error(err);
      });
  };

  if (error)
    return <div className="alert alert-danger mt-4 container">{error}</div>;
  if (!item) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h2 className="card-title">{item.title}</h2>
        <p>
          <strong>Description:</strong> {item.description}
        </p>
        <p>
          <strong>Price:</strong> ${parseFloat(item.price).toFixed(2)}
        </p>
        <p>
          <strong>Date Added:</strong> {item.date_added}
        </p>
        <p>
          <strong>Status:</strong> {item.status}
        </p>
        <p>
          <strong>Stock:</strong> {item.stock}
        </p>
        <p>
          <strong>Seller:</strong> {item.seller}
        </p>

        {item.seller === username && (
          <>
            <button
              onClick={() => setEditing(true)}
              className="btn btn-warning"
            >
              ✏️ Edit Price/Stock
            </button>

            {editing && (
              <div className="mt-3">
                <label>New Price: </label>
                <input
                  type="number"
                  step="0.01"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="form-control mb-2"
                />
                <label>New Stock: </label>
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="form-control mb-2"
                />
                <button onClick={handleEdit} className="btn btn-success me-2">
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ItemDetail;
