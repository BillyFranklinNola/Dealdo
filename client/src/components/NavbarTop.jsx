import React from "react";
import cartIcon from "../images/cartIcon.png";
import profileIcon from "../images/profileIcon.png";
import plusIcon from "../images/plusIcon.png";
import { useNavigate } from "react-router-dom";

import "../styles/NavbarTop.css";

export default function NavbarTop() {
  const navigate = useNavigate();
  return (
    <div className="row navbar navbar-expand-xxl px-2 px-sm-4 py-4 m-3">
      <div className="d-flex align-items-center justify-content-between">
        <h1>Dealdo</h1>
        <form>
          <input type="text" placeholder="Search" className="searchbar" />
        </form>
        <div>
          <img src={plusIcon} className="icons me-3" onClick={() => navigate("/products/add") } alt="plus" />
          <img src={cartIcon} className="icons me-3" alt="shopping cart" />
          <img src={profileIcon} className="icons" alt="profile pic" />
        </div>
      </div>
    </div>
  );
}
