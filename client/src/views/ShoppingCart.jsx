import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import Modal from "react-responsive-modal";
import ProductCard from "../components/ProductCard";
import "../styles/ShoppingCart.css";
import "react-responsive-modal/styles.css";

const ShoppingCart = ({ cartOpen, closeCart }) => {
  const [activeProducts, setActiveProducts] = useState([]);
  const [paidProducts, setPaidProducts] = useState([]);
  const [cartID, setCartID] = useState("");
  const loggedInUser = useSelector((state) => state.auth.user);
  const user_id = loggedInUser.data.user_id;
  const token = loggedInUser.token;
  console.log("active products:", activeProducts);
  console.log("paid products:", paidProducts);
  console.log("cart id:", cartID);
  console.log(token);

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

  const getPaidProducts = async () => {
    try {
      axios
        .get("http://localhost:5000/api/carts/view/paid", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data.data);
          setPaidProducts(response.data.data.products_in_cart);
        });
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
      <div className="modalBody d-flex">
        {activeProducts.map((product) => (
          <div key={product.product_id} className="productContainer">
            <ProductCard product={product} />
            <div>
              <label htmlFor="quantity" className="me-2">Qty:</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                style={{ width: "35px" }}
                value={product.quantity_in_cart}
                onChange={(e) => changeHandler(e, product)}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-between">
        <button className="btn btn-secondary" onClick={emptyCart}>
          Empty Cart
        </button>
        <a href="#" onClick={getPaidProducts}>
          View order history
        </a>
        <button className="btn btn-secondary" onClick={checkoutCart}>
          Checkout
        </button>
      </div>
    </Modal>
  );
};

export default ShoppingCart;
