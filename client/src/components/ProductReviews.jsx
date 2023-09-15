import React from "react";
import Modal from "react-responsive-modal";
import "../styles/ProductReviews.css";
import "react-responsive-modal/styles.css";
import { Rating } from "react-simple-star-rating";
import {format} from 'date-fns'

function ProductReviews({ productReviewsOpen, closeProductReviews, product }) {
  const thisProduct = product;
  console.log(thisProduct.reviews);


  function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    return format(date, 'MM-dd-yyyy');
  }

  return (
    <Modal
      open={productReviewsOpen}
      onClose={closeProductReviews}
      center={true}
      classNames={{
        overlayAnimationIn: "enterOverlay",
        overlayAnimationOut: "leaveOverlay",
        modalAnimationIn: "enterModal",
        modalAnimationOut: "leaveModal",
      }}
      animationDuration={800}
    >
      <div className="reviewsModalBody">
        <div className="d-flex align-items-center">
          <img
            src={`http://localhost:5000/api/img/products/${thisProduct.img_filename}`}
            className="reviewImg me-3"
            alt="product"
          />
          <h2>{thisProduct.name}</h2>
        </div>
        {thisProduct.reviews.map((review) => (
          <div>
            <div className="review mt-4">
              <div className="d-flex justify-content-between align-items-center">
                <p className="reviewName">
                  {review.creator.first_name}'s review:
                </p>
                <p>{formatDateTime(review.created_at)}</p>
              </div>
              <Rating initialValue={review.rating} readonly={true} size={20} />
              <p className="mt-2">{review.content}</p>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default ProductReviews;
