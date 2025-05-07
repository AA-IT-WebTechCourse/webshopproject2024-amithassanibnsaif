import React, { useEffect, useState } from "react";
import axios from "axios";

function MyItems() {
  const [onSale, setOnSale] = useState([]);
  const [sold, setSold] = useState([]);
  const [purchased, setPurchased] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setMessage("❌ You must be logged in to view your items.");
      return;
    }

    axios
      .get("http://localhost:8000/api/items/myitems/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        setOnSale(res.data.on_sale);
        setSold(res.data.sold);
        setPurchased(res.data.purchased);
      })
      .catch((err) => {
        setMessage("⚠️ Failed to load items.");
      });
  }, [token]);

  const renderTable = (items, title) => (
    <>
      <h4 className="mt-4">{title}</h4>
      {items.length > 0 ? (
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Description</th>
              <th>Date Added</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.title}</td>
                <td>${item.price}</td>
                <td>{item.stock}</td>
                <td>{item.description}</td>
                <td>{item.date_added?.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No items found.</p>
      )}
    </>
  );

  return (
    <div className="container mt-4">
      <h2>📋 My Items</h2>
      {message && <div className="alert alert-warning">{message}</div>}
      {renderTable(onSale, "🟢 On Sale")}
      {renderTable(sold, "✅ Sold")}
      {renderTable(purchased, "🛒 Purchased")}
    </div>
  );
}

export default MyItems;
