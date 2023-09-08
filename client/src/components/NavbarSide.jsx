import React from "react";
import cartIcon from "../images/cartIcon.png";
import profileIcon from "../images/profileIcon.png";
import "../styles/NavbarTop.css";


export default function NavbarTop() {
  return (
    <div className="col navbar navbar-expand-xxl bg-light px-2 px-sm-4 py-4 rounded border border-2 border-light m-3">
      <div className="d-flex align-items-center justify-content-between">
        <h2></h2>
        <div>
            <img src={cartIcon} className="icons me-4" alt="shopping cart" />
            <img src={profileIcon} className="icons" alt="profile pic" />
        </div>
      </div>
    </div>
  );
}
