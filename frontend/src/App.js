import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ItemDetail from "./pages/ItemDetail";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyItems from "./pages/MyItems";
import AddItem from "./pages/AddItem";
import PopulateDB from "./pages/PopulateDB";
import Account from "./pages/Account";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/myitems" element={<MyItems />} />
        <Route path="/additem" element={<AddItem />} />
        <Route path="/populatedb" element={<PopulateDB />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </Router>
  );
}

export default App;
