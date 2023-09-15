import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "../styles/ProductCard.css";
import ShoppingCart from "./ShoppingCart";
import axios from "axios";
import ReviewForm from "./ReviewForm";
import { Rating } from "react-simple-star-rating";
import ProductInfo from "./ProductInfo";
import EditProduct from "../views/EditProduct";

export default function ProductCard(props) {
  const [productUser, setProductUser] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [editProductOpen, setEditProductOpen] = useState(false);
  // const [products, setProducts] = useState([]); 
  const { product } = props;
  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);
  const openReview = () => setReviewOpen(true);
  const closeReview = () => setReviewOpen(false);
  const openProduct = () => setProductOpen(true);
  const closeProduct = () => setProductOpen(false);
  const openEditProduct = () => setEditProductOpen(true);
  const closeEditProduct = () => setEditProductOpen(false);
  const loggedInUser = useSelector((state) => state.auth.user);
  const token = loggedInUser.token;
  const user_id = loggedInUser.data.user_id;
  const product_id = product.product_id;

  console.log(token);
  console.log(product.product_id);
  console.log(loggedInUser.data.user_id);
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
  }, [product.user_id]);

  const productRating = () => {
    let rating = 0;
    let count = 0;
  
    try {
      product.reviews.forEach((review) => {
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
    <div className="card m-3">
      <h2 className="ms-2">{product.name}</h2>
      
      <p className="description">{product.description}</p>
      <img
        src={`http://localhost:5000/api/img/products/${product.img_filename}`}
        className="image"
        alt="product"
      />
      <div className="priceline">
        <p className="price align-baseline">${product.price}</p>
        <button className="btn btn-warning align-baseline" onClick={addToCart}>
          Add to Cart
        </button>
      </div>
      <div className="reviewline">
        <Rating
          initialValue={productRating()}
          readonly={true}
          size={20}
        />
        <a href="#" className="primary" onClick={(e) => {e.preventDefault(); openReview()}}>
          Leave Review
        </a>
      </div>
      <p className="soldby">SOLD BY:</p>
      <p className="user">{productUser.first_name}</p>
      <a href="#" className="primary mx-auto" onClick={(e) => {e.preventDefault(); openProduct()}}>
          More Details
        </a>
        <a href="#" className="primary mx-auto" onClick={(e) => {e.preventDefault(); openEditProduct()}}>
          Edit
        </a>
      {cartOpen && <ShoppingCart cartOpen={cartOpen} closeCart={closeCart} />}
      {reviewOpen && <ReviewForm reviewOpen={reviewOpen} closeReview={closeReview} product={product} />}
      {productOpen && <ProductInfo productOpen={productOpen} closeProduct={closeProduct} product={product} />}
      {editProductOpen && <EditProduct editProductOpen={editProductOpen} closeEditProduct={closeEditProduct} product={product} />}
    </div>
  );
}
