import React, { useState, useEffect } from 'react'
import Modal from 'react-responsive-modal';
import '../styles/ShoppingCart.css'
import 'react-responsive-modal/styles.css'
import axios from "axios";
import ProductCard from "./ProductCard";
import { useSelector } from 'react-redux'

function ShoppingCart({cartOpen, closeCart}) {
  const [activeProducts, setActiveProducts] = useState([]);
  const loggedInUser = useSelector((state) => state.auth.user);
  const user_id = loggedInUser.data.user_id;
  const token = loggedInUser.token;
  console.log(token);
  console.log(loggedInUser.data.user_id);

  useEffect(() => {
    async function getActiveProducts() {
      try {
        console.log(token)
        axios.get("http://localhost:5000/api/carts/view/active", user_id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((response) => {
          console.log(response.data.data);
          setActiveProducts(response.data.data);
        });
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    getActiveProducts();
  }, [token, user_id]);

  return (
    <Modal
        open={cartOpen}
        onClose={closeCart}
        center={true}
        classNames={{
          overlayAnimationIn: 'enterOverlay',
          overlayAnimationOut: 'leaveOverlay',
          modalAnimationIn: 'enterModal',
          modalAnimationOut: 'leaveModal',
        }}
        animationDuration={800}
      >
        <div className="modalBody d-flex">
        {activeProducts.map((product) => (
          <ProductCard key={product.id} product={product}/>
        ))}
        </div>
      </Modal>
  );
};

export default ShoppingCart
