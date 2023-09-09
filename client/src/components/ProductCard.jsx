import React from "react";
import "../styles/ProductCard.css";
import product1 from "../images/product1.jpg";

export default function ProductCard() {
  return (
    <div className="card m-3">
      <h2 className="ms-2">Product Title</h2>
      <p className="description">
        Cool looking but dysfunctional water bottle with a bunch of stuff you
        don't need
      </p>
      <img src={product1} className="image" alt="product" />
      <div className="priceline">
        <p className="price align-baseline">$9.99</p>
        <button className="btn btn-warning align-baseline">Add to Cart</button>
      </div>
      <div className="reviewline">
        <p className="">- No reviews -</p>
        <a href="" className="primary">
          Leave Review
        </a>
      </div>
      <p className="soldby">SOLD BY:</p>
      <p className="user">BigPoppa274</p>
    </div>
  );
}
