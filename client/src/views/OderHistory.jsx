import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Modal from "react-responsive-modal";
import ProductCard from "../components/ProductCard";
import "react-responsive-modal/styles.css";

const OrderHistory = ({ historyOpen, closeHistory }) => {
  const [paidCarts, setPaidCarts] = useState([]);
  const loggedInUser = useSelector((state) => state.auth.user);
  const token = loggedInUser.token;

  const getPaidCarts = async () => {
    try {
      axios
        .get("http://localhost:5000/api/carts/view/paid", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data.data);
          setPaidCarts(response.data.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (historyOpen) {
      getPaidCarts();
    }
  }, [historyOpen, token]);

  function formatDate(dateTimeString) {
    const date = new Date(dateTimeString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }

  console.log(paidCarts);

  return (
    <Modal
      open={historyOpen}
      onClose={closeHistory}
      center={true}
      classNames={{
        overlayAnimationIn: "enterOverlay",
        overlayAnimationOut: "leaveOverlay",
        modalAnimationIn: "enterModal",
        modalAnimationOut: "leaveModal",
      }}
      animationDuration={800}
    >
      <h1 className="text-center">Past Orders:</h1>
      <div className="orderHistoryContainer">
        {paidCarts.map(
          (paidCart) =>
            paidCart.products_in_cart.length > 0 && (
              <div key={paidCart.cart_id} className="my-5">
                <h3 className="mb-4 text-center">Ordered on {formatDate(paidCart.created_at)}:</h3>
                {paidCart.products_in_cart.map((product) => (
                  <div className="d-flex">
                  <ProductCard key={product.product_id} product={product}  />
                  <h5 className="ms-3 mt-3">Qty: {product.quantity_in_cart}</h5>
                  </div>
                ))}
              </div>
            )
        )}
      </div>
    </Modal>
  );
};

export default OrderHistory;
