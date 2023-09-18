import React, { useState, useEffect } from "react";
import Modal from "react-responsive-modal";
import "../styles/ShoppingCart.css";
import "react-responsive-modal/styles.css";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { useSelector } from "react-redux";
import {toast} from "react-toastify"

function ShoppingCart({ cartOpen, closeCart }) {
  const [activeProducts, setActiveProducts] = useState([]);
  const [paidProducts, setPaidProducts] = useState([]);
  const [cartID, setCartID] = useState = ('')
  const loggedInUser = useSelector((state) => state.auth.user);
  const user_id = loggedInUser.data.user_id;
  const token = loggedInUser.token;
  const [quantity_to_purchase, setQuantityToPurchase] = useState(1);
  console.log("active products:", activeProducts);
  console.log("paid products:", paidProducts);
  console.log("cart id:", cartID);

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
            setCartID(response.data.data.cart_id)
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
  setQuantityToPurchase(e.target.value);
  const data = {
    product_id: product.id,
    cart_id: cartID,
    quantity_to_purchase: quantity_to_purchase,
  };
  
  if (data.quantity_to_purchase > product.quantity) {
    toast.error('Not enough inventory')
  } else {
    try {
      axios.put("http://localhost:5000/api/carts/edit", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}

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
      <div className="modalBody d-flex">
        {activeProducts.map((product) => (
          <div key={product.id}>
            <ProductCard product={product} />
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={quantity_to_purchase}
              onChange={(e) => changeHandler(e, product)}
            />
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
}

export default ShoppingCart;
