import React, { useState } from "react";
import cartIcon from "../images/cartIcon.png";
import profileIcon from "../images/profileIcon.png";
import plusIcon from "../images/plusIcon.png";
import { useSelector } from 'react-redux'
import "../styles/NavbarTop.css";
import ShoppingCart from "../views/ShoppingCart";
import axios from "axios";
import CreateProductModal from "../views/CreateProductModal";
import UserProducts from "../views/UserProducts";


export default function NavbarTop() {
  const [cartOpen, setCartOpen] = useState(false);
  const [createProductOpen, setCreateProductOpen] = useState(false);
  const [userProductsOpen, setUserProductsOpen] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({ criteria: "" });
  const [searchResults, setSearchResults] = useState([]);
  const loggedInUser = useSelector((state) => state.auth.user);
  console.log(searchCriteria);

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);
  const openCreateProduct = () => setCreateProductOpen(true);
  const closeCreateProduct = () => setCreateProductOpen(false);
  const openUserProducts = () => setUserProductsOpen(true);
  const closeUserProducts = () => setUserProductsOpen(false);


  const searchProducts = async (e) => {
    e.preventDefault();

    const productIDs = new Set();

    try {
      const nameSearch = await axios.get(
        `http://localhost:5000/api/products/name/${searchCriteria.criteria}`
      );
      nameSearch.data.data.forEach((product) => {
        if (!productIDs.has(product.product_id)) {
          setSearchResults((prevResults) => [
            ...prevResults,
            ...nameSearch.data.data,
          ]);
          productIDs.add(product.product_id);
        }
      });
      console.log("Name search successful");
    } catch (error) {
      console.error("Error in name search:", error);
    }

    try {
      const categorySearch = await axios.get(
        `http://localhost:5000/api/products/category/${searchCriteria.criteria}`
      );
      categorySearch.data.data.forEach((product) => {
        if (!productIDs.has(product.product_id)) {
          setSearchResults((prevResults) => [
            ...prevResults,
            ...categorySearch.data.data,
          ]);
          productIDs.add(product.product_id);
        }
      });
    } catch (error) {
      console.error("Error in category search:", error);
    }

    try {
      const descriptionSearch = await axios.get(
        `http://localhost:5000/api/products/description/${searchCriteria.criteria}`
      );
      descriptionSearch.data.data.forEach((product) => {
        if (!productIDs.has(product.product_id)) {
          setSearchResults((prevResults) => [
            ...prevResults,
            ...descriptionSearch.data.data,
          ]);
          productIDs.add(product.product_id);
        }
      });
    } catch (error) {
      console.error("Error in description search:", error);
    }
  };

  console.log(searchResults);

  const changeHandler = (e) => {
    setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value });
  };

  return (
    <div className="row navbar navbar-expand-xxl px-2 px-sm-4 py-4 m-3">
      <div className="d-flex align-items-center justify-content-between">
        <h1>Dealdo</h1>
        <form className="d-flex align-items-center" onSubmit={searchProducts}>
          <input
            type="text"
            name="criteria"
            placeholder="Search"
            className="searchbar"
            onChange={changeHandler}
            value={searchCriteria.criteria}
          />
          <button type="submit" className="searchBtn">
            Submit
          </button>
        </form>
        <div>
          <img
            src={plusIcon}
            className="icons me-3"
            onClick={openCreateProduct}
            alt="plus"
          />
          <img
            src={cartIcon}
            className="icons me-3"
            onClick={openCart}
            alt="shopping cart"
          />
          <img src={profileIcon} className="icons" onClick={openUserProducts} alt="profile pic" />
        </div>
      </div>
      {userProductsOpen && <UserProducts isOpen={userProductsOpen} onClose={closeUserProducts} />}
      {cartOpen && <ShoppingCart isOpen={cartOpen} onClose={closeCart} />}
      {createProductOpen && <CreateProductModal isOpen={createProductOpen} onClose={closeCreateProduct} />}
    </div>
  );
}
