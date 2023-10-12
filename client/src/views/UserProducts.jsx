import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Modal from "react-responsive-modal";
import ProductCard from "../components/ProductCard";
import "../styles/UserProducts.css";
import "react-responsive-modal/styles.css";

function UserProducts({ isOpen, onClose }) {
  const [userProducts, setUserProducts] = useState([]);
  const loggedInUser = useSelector((state) => state.auth.user);
  const user_id = loggedInUser.data.user_id;

  useEffect(() => {
    async function getUserProducts() {
      try {
        axios
          .get(`http://localhost:5000/api/products/user/${user_id}`)
          .then((response) => {
            console.log(response.data.data);
            setUserProducts(response.data.data);
          });
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    getUserProducts();
  }, [user_id]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      center={true}
      classNames={{
        overlayAnimationIn: "enterOverlay",
        overlayAnimationOut: "leaveOverlay",
        modalAnimationIn: "enterModal",
        modalAnimationOut: "leaveModal",
      }}
      animationDuration={800}
    >
      <h1 className="text-center mb-5 mt-3">My Products:</h1>
      <div className="modalBody">
        {userProducts.map((product) => (
          <div className="d-flex">
            <ProductCard key={product.id} product={product} />
            <h5 className="ms-3 mt-3">Qty In Stock: {product.quantity}</h5>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default UserProducts;
