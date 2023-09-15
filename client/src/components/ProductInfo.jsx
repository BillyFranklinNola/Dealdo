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
import ProductReviews from "./ProductReviews";

export default function ProductInfo({ productOpen, closeProduct, product }) {
  const [productUser, setProductUser] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [productReviewsOpen, setProductReviewsOpen] = useState(false);
  const thisProduct = product;
  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);
  const openReview = () => setReviewOpen(true);
  const closeReview = () => setReviewOpen(false);
  const openProductReviews = () => setProductReviewsOpen(true);
  const closeProductReviews = () => setProductReviewsOpen(false);
  const loggedInUser = useSelector((state) => state.auth.user);
  const token = loggedInUser.token;
  const user_id = loggedInUser.data.user_id;
  const product_id = thisProduct.product_id;
  console.log(product);
  console.log(thisProduct);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/${thisProduct.user_id}`
        );
        const data = await response.json();
        setProductUser(data.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchData();
  }, []);

  const productRating = () => {
    let rating = 0;
    let count = 0;

    try {
      thisProduct.reviews.forEach((review) => {
        rating += review.rating;
        count += 1;
      });
    } catch (error) {
      console.error("Error getting ratings", error);
    }
    console.log(rating);
    console.log(count);
    return count > 0 ? rating / count : 0;
  };

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
        <h2 className="ms-2">{thisProduct.name}</h2>
        <p className="fullDescription">{thisProduct.description}</p>
        <img
          src={`http://localhost:5000/api/img/products/${thisProduct.img_filename}`}
          className="image"
          alt="product"
        />
        <div className="priceline">
          <p className="price align-baseline">${thisProduct.price}</p>
          <button
            className="btn btn-warning align-baseline"
            onClick={addToCart}
          >
            Add to Cart
          </button>
        </div>
        <div className="reviewline">
          <Rating initialValue={productRating()} readonly={true} size={20} />
          <a
            href="#"
            className="primary"
            onClick={(e) => {
              e.preventDefault();
              openReview();
            }}
          >
            Leave Review
          </a>
        </div>
        <a
          href="#"
          className="primary"
          onClick={(e) => {
            e.preventDefault();
            openProductReviews();
          }}
        >
          See Reviews
        </a>
        <p className="soldby">SOLD BY:</p>
        <p className="user">{productUser.first_name}</p>
      </div>
      {cartOpen && <ShoppingCart cartOpen={cartOpen} closeCart={closeCart} />}
      {reviewOpen && (
        <ReviewForm
          reviewOpen={reviewOpen}
          closeReview={closeReview}
          product={product}
        />
      )}
      {productReviewsOpen && (
        <ProductReviews
          productReviewsOpen={productReviewsOpen}
          closeProductReviews={closeProductReviews}
          product={thisProduct}
        />
      )}
    </Modal>
  );
}
