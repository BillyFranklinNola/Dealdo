import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cartIcon from "../images/cartIcon.png";
import profileIcon from "../images/profileIcon.png";
import plusIcon from "../images/plusIcon.png";
import "../styles/NavbarTop.css";
import ShoppingCart from "../views/ShoppingCart";
import axios from "axios";
import UserProducts from "../views/UserProducts";
import CreateProduct from "../views/CreateProduct";
import { toast } from "react-toastify";

export default function NavbarTop() {
  const [cartOpen, setCartOpen] = useState(false);
  const [createProductOpen, setCreateProductOpen] = useState(false);
  const [userProductsOpen, setUserProductsOpen] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({ criteria: "" });
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  console.log(searchCriteria);

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);
  const openCreateProduct = () => setCreateProductOpen(true);
  const closeCreateProduct = () => setCreateProductOpen(false);
  const openUserProducts = () => setUserProductsOpen(true);
  const closeUserProducts = () => setUserProductsOpen(false);

  const searchProducts = async (e) => {
    e.preventDefault();
    setSearchResults([]);
    let hasError = false;
  
    if (!searchCriteria.criteria) {
      toast.error("Please enter search criteria");
      return;
    }
  
    const productIDs = new Set();
    try {
      const [nameSearch, categorySearch, descriptionSearch] = await Promise.all([
        axios.get(`http://localhost:5000/api/products/name/${searchCriteria.criteria}`),
        axios.get(`http://localhost:5000/api/products/category/${searchCriteria.criteria}`),
        axios.get(`http://localhost:5000/api/products/description/${searchCriteria.criteria}`)
      ]);
  
      [nameSearch, categorySearch, descriptionSearch].forEach((search) => {
        search.data.data.forEach((product) => {
          if (!productIDs.has(product.product_id)) {
            setSearchResults((prevResults) => [
              ...prevResults,
              ...search.data.data,
            ]);
            productIDs.add(product.product_id);
          }
        });
      });
      navigate('/results', {state: {searchResults}})
    } catch (error) {
      console.error("Error in search:", error);
      toast.error("An error occurred while searching.");
      hasError = true;
    }
  
    if (!hasError && searchResults.length === 0) {
      toast.error("No results, please refine your search");
      navigate("/products");
    }
  };
  
  

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
          <img
            src={profileIcon}
            className="icons"
            onClick={openUserProducts}
            alt="profile pic"
          />
        </div>
      </div>
      {userProductsOpen && (
        <UserProducts isOpen={userProductsOpen} onClose={closeUserProducts} />
      )}
      {cartOpen && ( 
        <ShoppingCart isOpen={cartOpen} onClose={closeCart} />
      )}
      {createProductOpen && (
        <CreateProduct isOpen={createProductOpen} onClose={closeCreateProduct} />
      )}
    </div>
  );
}
