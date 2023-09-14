import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ReviewForm from "./ReviewForm";
import { Rating } from "react-simple-star-rating";
import Modal from "react-responsive-modal";
import ShoppingCart from "./ShoppingCart";
import axios from "axios";
import "../styles/ProductInfo.css";
import "react-responsive-modal/styles.css";

export default function ProductInfo({productOpen, closeProduct, thisProduct}) {
  const [productUser, setProductUser] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const product = thisProduct;
  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);
  const openReview = () => setReviewOpen(true);
  const closeReview = () => setReviewOpen(false);
  const loggedInUser = useSelector((state) => state.auth.user);
  const token = loggedInUser.token;
  const user_id = loggedInUser.data.user_id;
  const product_id = product.product_id;
  console.log(product);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/${product.user_id}`
        );
        const data = await response.json();
        setProductUser(data.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchData();
  }, []);

  //   const productRating = () => {
  //     let rating = 0;
  //     let count = 0;
  //     try {
  //         const allProducts = axios.get("http://localhost:5000/api/products");
  //         setProducts(allProducts.data.data);
  //         product.reviews.forEach((review) => {
  //           rating += review.rating;
  //           count++;
  //         }
  //       );
  //     } catch (error) {
  //       console.error("Error getting rating", error);
  //     }
  //     return rating / count
  //   }

  const addToCart = () => {
    const data = {
      product_id: product_id,
      user_id: user_id,
      quantity_to_purchase: 1,
    };
    try {
      axios.put("http://localhost:5000/api/carts/add_product", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Product added to cart!");
      openCart();
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  return (
      <Modal
        open={productOpen}
        onClose={closeProduct}
        center={true}
        classNames={{
          overlayAnimationIn: "enterOverlay",
          overlayAnimationOut: "leaveOverlay",
          modalAnimationIn: "enterModal",
          modalAnimationOut: "leaveModal",
        }}
        animationDuration={800}
      >
        <div className="productModalBody">
        <h2 className="ms-2">{product.name}</h2>
        <p className="fullDescription">{product.description}</p>
        <img
          src={`http://localhost:5000/api/img/products/${product.img_filename}`}
          className="image"
          alt="product"
        />
        <div className="priceline">
          <p className="price align-baseline">${product.price}</p>
          <button
            className="btn btn-warning align-baseline"
            onClick={addToCart}
          >
            Add to Cart
          </button>
        </div>
        <div className="reviewline">
          <Rating initialValue={5} readonly={true} size={20} />
          <a href="#" className="primary" onClick={openReview}>
            Leave Review
          </a>
        </div>
        <p className="soldby">SOLD BY:</p>
        <p className="user">{productUser.first_name}</p>
        </div>
        {cartOpen && <ShoppingCart cartOpen={cartOpen} closeCart={closeCart} />}
        {reviewOpen && <ReviewForm reviewOpen={reviewOpen} closeReview={closeReview} product={product} />}
      </Modal>
  );
}
