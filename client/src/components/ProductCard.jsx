import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "../styles/ProductCard.css";
import ShoppingCart from "../views/ShoppingCart";
import axios from "axios";
import ReviewForm from "./ReviewForm";
import { Rating } from "react-simple-star-rating";
import ProductInfo from "./ProductInfo";
import EditProduct from "../views/EditProduct";
import { useNavigate } from "react-router-dom";

const ProductCard = (props) => {
  const [productUser, setProductUser] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [editProductOpen, setEditProductOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const { product } = props;
  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);
  const openReview = () => setReviewOpen(true);
  const closeReview = () => setReviewOpen(false);
  const openProduct = () => setProductOpen(true);
  const closeProduct = () => setProductOpen(false);
  const openEditProduct = () => setEditProductOpen(true);
  const closeEditProduct = () => setEditProductOpen(false);
  const navigate = useNavigate();
  const loggedInUser = useSelector((state) => state.auth.user);
  const token = loggedInUser.token;
  const user_id = loggedInUser.data.user_id;
  const product_id = product.product_id;

  useEffect(() => {
    async function getProductData() {
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
    getProductData();
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

  const itemsInCart = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/carts/view/active`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(response.data.data.products_in_cart);
      console.log(response.data.data.products_in_cart);
    } catch (error) {
      console.error("Error getting cart items:", error);
    }
  };

  const addToCart = async () => {
    const data = {
      product_id: product_id,
      user_id: user_id,
      quantity_to_purchase: 1,
    };

    try {
      await itemsInCart();
      console.log(product_id);
      console.log(cartItems);

      const productInCart = cartItems.some(
        (item) => item.product_id === product_id
      );

      console.log(productInCart);

      if (productInCart) {
        toast.error("Product already in cart");
      } else {
        const res = await axios.put(
          "http://localhost:5000/api/carts/add_product",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.status === 201) {
          openCart();
          toast.success("Product added to cart!");
        }
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Product already in cart");
    }
  };

  const deleteProduct = () => {
    try {
      axios.delete(
        `http://localhost:5000/api/products/delete/${product.product_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Product deleted!");
      window.location.reload();
    } catch (error) {
      console.log("Error deleting product", error);
    }
    navigate("/products");
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
      <p className="soldby">SOLD BY:</p>
      <p className="user">{productUser.first_name}</p>
      <a
        href="#"
        className="primary mx-auto"
        onClick={(e) => {
          e.preventDefault();
          openProduct();
        }}
      >
        More Details
      </a>
      {product.user_id === loggedInUser.data.user_id ? (
        <div className="d-flex justify-content-between mt-3">
          <a
            href="#"
            className="primary mx-auto"
            onClick={(e) => {
              e.preventDefault();
              openEditProduct();
            }}
          >
            Edit
          </a>
          <a
            href="#"
            className="primary mx-auto"
            onClick={(e) => {
              e.preventDefault();
              deleteProduct();
            }}
          >
            Delete
          </a>
        </div>
      ) : null}
      {cartOpen && <ShoppingCart cartOpen={cartOpen} closeCart={closeCart} />}
      {reviewOpen && (
        <ReviewForm
          reviewOpen={reviewOpen}
          closeReview={closeReview}
          product={product}
        />
      )}
      {productOpen && (
        <ProductInfo
          productOpen={productOpen}
          closeProduct={closeProduct}
          product={product}
        />
      )}
      {editProductOpen && (
        <EditProduct
          editProductOpen={editProductOpen}
          closeEditProduct={closeEditProduct}
          product={product}
        />
      )}
    </div>
  );
};

export default ProductCard;
