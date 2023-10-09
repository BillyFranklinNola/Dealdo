import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import Modal from "react-responsive-modal";
import ProductCard from "../components/ProductCard";
import "react-responsive-modal/styles.css";

const OrderHistory = ({ historyOpen, closeHistory }) => {
  const [paidProducts, setPaidProducts] = useState([]);
  const loggedInUser = useSelector((state) => state.auth.user);
  const token = loggedInUser.token;

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
  
  useEffect(() => {
    if (historyOpen) {
      getPaidProducts();
    }
  }, [historyOpen, token]);

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
        {paidProducts.map((product) => (
          <div key={product.product_id} className="d-flex my-5">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default OrderHistory;
