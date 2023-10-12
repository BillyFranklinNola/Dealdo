import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import Modal from "react-responsive-modal";
import ProductCard from "../components/ProductCard";
import "../styles/ShoppingCart.css";
import "react-responsive-modal/styles.css";
import OrderHistory from "./OderHistory";

const ShoppingCart = ({ cartOpen, closeCart }) => {
  const [activeProducts, setActiveProducts] = useState([]);
  const [cartID, setCartID] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const openHistory = () => setHistoryOpen(true);
  const closeHistory = () => setHistoryOpen(false);
  const loggedInUser = useSelector((state) => state.auth.user);
  const user_id = loggedInUser.data.user_id;
  const token = loggedInUser.token;

  useEffect(() => {
    async function getActiveProducts() {
      try {
        console.log(token);
        axios
          .get("http://localhost:5000/api/carts/view/active", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            console.log(response.data.data);
            setActiveProducts(response.data.data.products_in_cart);
            setCartID(response.data.data.cart_id);
          });
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    getActiveProducts();
  }, [token, user_id]);

  const emptyCart = async () => {
    try {
      axios.put("http://localhost:5000/api/carts/empty", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setActiveProducts([]);
    } catch (error) {
      console.log(error);
    }
  };

  const checkoutCart = async () => {
    try {
      axios.put("http://localhost:5000/api/carts/checkout", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setActiveProducts([]);
    } catch (error) {
      console.log(error);
    }
  };

  const changeHandler = (e, product) => {
    const newQuantity = e.target.value;
    console.log("new quantity:", newQuantity);
    const data = {
      product_id: product.product_id,
      cart_id: cartID.toString(),
      quantity_to_purchase: newQuantity,
    };
    try {
      axios.put("http://localhost:5000/api/carts/edit", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedProducts = activeProducts.map((p) => {
        if (p.product_id === product.product_id) {
          return { ...p, quantity_in_cart: newQuantity };
        }
        return p;
      });
      setActiveProducts(updatedProducts);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(activeProducts);
  

  return (
    <Modal
      open={cartOpen}
      onClose={closeCart}
      center={true}
      classNames={{
        overlayAnimationIn: "enterOverlay",
        overlayAnimationOut: "leaveOverlay",
        modalAnimationIn: "enterModal",
        modalAnimationOut: "leaveModal",
      }}
      animationDuration={800}
    >
      <h1 className="text-center">My Cart</h1>
      {activeProducts.length === 0 ?
      <h3 className="text-center my-5">- There are no products in your cart -</h3>
      : null}
      <div className="shoppingCartContainer">
        {activeProducts.map((product) => (
          <div key={product.product_id} className="d-flex my-5">
            <ProductCard product={product} />
            <div>
              <label htmlFor="quantity" className="mt-4">Qty:</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                style={{ width: "35px" }}
                value={product.quantity_in_cart}
                onChange={(e) => changeHandler(e, product)}
                className="ms-2"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-between">
        <button className="btn btn-secondary" onClick={emptyCart}>
          Empty Cart
        </button>
        <a href="#" 
        onClick={(e) => {
          e.preventDefault();
          openHistory();
        }}>
          View order history
        </a>
        <button className="btn btn-secondary" onClick={checkoutCart}>
          Checkout
        </button>
        {historyOpen && (
        <OrderHistory
          historyOpen={historyOpen}
          closeHistory={closeHistory}
        />
      )}
      </div>
    </Modal>
  );
};

export default ShoppingCart;
