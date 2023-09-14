import React , { useState } from "react";
import cartIcon from "../images/cartIcon.png";
import profileIcon from "../images/profileIcon.png";
import plusIcon from "../images/plusIcon.png";
import { useNavigate } from "react-router-dom";

import "../styles/NavbarTop.css";
import ShoppingCart from "./ShoppingCart";

export default function NavbarTop() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const cartOpen = () => setOpen(true);
  const closeCart = () => setOpen(false);

  return (
    <div className="row navbar navbar-expand-xxl px-2 px-sm-4 py-4 m-3">
      <div className="d-flex align-items-center justify-content-between">
        <h1>Dealdo</h1>
        <form>
          <input type="text" placeholder="Search" className="searchbar" />
        </form>
        <div>
          <img src={plusIcon} className="icons me-3" onClick={() => navigate("/products/add") } alt="plus" />
          <img src={cartIcon} className="icons me-3" onClick={cartOpen} alt="shopping cart" />
          <img src={profileIcon} className="icons" alt="profile pic" />
        </div>
      </div>
      {open && <ShoppingCart isOpen={open} onClose={closeCart} />}
    </div>
  );
}
