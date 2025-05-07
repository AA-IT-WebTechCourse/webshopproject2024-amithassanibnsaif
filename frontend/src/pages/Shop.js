import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

function Shop() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/items/allitems/");
      setItems(res.data);
    } catch (err) {
      console.error("❌ Failed to load items");
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchItems();
      if (token) {
        try {
          const res = await axios.get("http://localhost:8000/api/items/cart/", {
            headers: { Authorization: `Token ${token}` },
          });
          setCart(res.data);
        } catch (err) {
          console.error("❌ Failed to load cart");
        }
      }
    };
    load();
  }, [token]);

  const addToCart = async (itemId, seller) => {
    if (!token) return alert("Login to add to cart");
    if (username === seller) return alert("❌ You cannot add your own item!");
    try {
      await axios.post(
        "http://localhost:8000/api/items/cart/",
        { item_id: itemId },
        { headers: { Authorization: `Token ${token}` } }
      );
      Swal.fire({
        icon: "success",
        title: "✅ Added to cart!",
        timer: 1500,
        showConfirmButton: false,
      });
      const res = await axios.get("http://localhost:8000/api/items/cart/", {
        headers: { Authorization: `Token ${token}` },
      });
      setCart(res.data);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "❌ Failed to add to cart",
        text: err.response?.data?.error || "Unknown error",
      });
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete("http://localhost:8000/api/items/cart/", {
        headers: { Authorization: `Token ${token}` },
        data: { item_id: itemId },
      });
      const res = await axios.get("http://localhost:8000/api/items/cart/", {
        headers: { Authorization: `Token ${token}` },
      });
      setCart(res.data);
    } catch (err) {
      console.error("❌ Failed to remove item from cart");
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/items/checkout/",
        {},
        { headers: { Authorization: `Token ${token}` } }
      );

      if (res.data.status === "success") {
        Swal.fire("✅ Purchase complete!");
        fetchItems();
        const updatedCart = await axios.get(
          "http://localhost:8000/api/items/cart/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setCart(updatedCart.data);
        setShowCart(false);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        const issues = err.response.data.issues;

        for (const i of issues) {
          if (i.reason === "Out of stock") {
            Swal.fire({
              icon: "error",
              title: "❌ Out of Stock",
              text: `The item "${i.title}" is out of stock. Please remove the item.`,
            });
            return;
          }
        }

        const priceIssues = issues.filter((i) => i.reason === "Price changed");
        if (priceIssues.length > 0) {
          let message = "⚠️ These item prices have changed:\n";
          priceIssues.forEach((i) => {
            message += `- ${i.title}: new price $${i.new_price}\n`;
          });
          Swal.fire("⚠️ Price Mismatch", message, "warning");
        }
      } else {
        Swal.fire("❌ Checkout failed", "Something went wrong", "error");
      }
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const res = await axios.get(
        `http://localhost:8000/api/items/search/?q=${searchQuery}`
      );
      setItems(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) {
      if (err.response?.status === 404) {
        Swal.fire({
          icon: "error",
          title: "❌ Product not found",
          text: `No item matching "${searchQuery}"`,
        });
        setItems([]);
      } else {
        Swal.fire("❌ Error searching product");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>🛍️ WebShop Items</h2>

      <form
        className="mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <input
          className="form-control"
          type="text"
          placeholder="🔍 Search by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="mt-2">
          <button type="submit" className="btn btn-primary me-2">
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setSearchQuery("");
                fetchItems();
              }}
            >
              Reset
            </button>
          )}
        </div>
      </form>

      {token && (
        <button
          className="btn btn-outline-primary mb-3"
          onClick={() => setShowCart(true)}
        >
          🛒 View Cart ({cart.length})
        </button>
      )}

      <div className="row">
        {items.length > 0 ? (
          items.map((item) => (
            <div className="col-md-4 mb-4" key={item.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p>{item.description}</p>
                  <p>Price: ${parseFloat(item.price).toFixed(2)}</p>
                  <p>Stock: {item.stock}</p>
                  <p>Date Added: {item.date_added?.slice(0, 10)}</p>
                  <Link
                    to={`/item/${item.id}`}
                    className="btn btn-primary me-2"
                  >
                    View
                  </Link>
                  {item.status === "on-sale" ? (
                    <button
                      className="btn btn-success"
                      onClick={() => addToCart(item.id, item.seller)}
                    >
                      ➕ Add to Cart
                    </button>
                  ) : (
                    <button className="btn btn-secondary" disabled>
                      Sold
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-muted">No items to display.</p>
          </div>
        )}
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">🛒 Your Cart</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCart(false)}
                ></button>
              </div>
              <div className="modal-body">
                {cart.length === 0 ? (
                  <p>Your cart is empty.</p>
                ) : (
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((ci, idx) => (
                        <tr key={idx}>
                          <td>{ci.item.title}</td>
                          <td>${parseFloat(ci.item.price).toFixed(2)}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => removeFromCart(ci.item.id)}
                            >
                              ❌
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowCart(false)}
                >
                  Close
                </button>
                <button className="btn btn-success" onClick={handleCheckout}>
                  💳 Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Shop;
