import React, {useState} from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-responsive-modal";
import StarRating from "./StarRating";
import "react-responsive-modal/styles.css";
import "../styles/ReviewForm.css";

const ReviewForm = ({ reviewOpen, closeReview, product }) => {
  const thisProduct = product;
  const [reviewData, setReviewData] = useState({});
  const loggedInUser = useSelector((state) => state.auth.user);
  const token = loggedInUser.token;
  const user_id = loggedInUser.data.user_id;
  const navigate = useNavigate();
  console.log(reviewData);

  const changeHandler = (e) => {
    setReviewData({ ...reviewData, [e.target.name]: e.target.value });
  }

  const handleRating = (r) => {
    setReviewData({ ...reviewData, rating: r });
  }

  const submitReview = () => {
    console.log(user_id)
    console.log(thisProduct.product_ID)
    console.log(reviewData.content)
    console.log(reviewData.rating)

    const data = {
      user_id: user_id,
      product_id: thisProduct.product_id,
      content: reviewData.content,
      rating: reviewData.rating,
    };
    try {
      axios.post("http://localhost:5000/api/reviews/create", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Review submitted!");
      closeReview();
      navigate("/products?refresh=true")
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="modalBody">
      <Modal
        open={reviewOpen}
        onClose={closeReview}
        center={true}
        classNames={{
          overlayAnimationIn: "enterOverlay",
          overlayAnimationOut: "leaveOverlay",
          modalAnimationIn: "enterModal",
          modalAnimationOut: "leaveModal",
        }}
        animationDuration={800}
      >
        <h1 className="text-center mt-2">Leave a Review</h1>
        <div className="text-secondary p-3 border border-2 border-dark rounded m-4">
          <div className="d-flex">
            <img
              src={`http://localhost:5000/api/img/products/${thisProduct.img_filename}`}
              className="reviewImg"
              alt="product"
            />
            <h3>{thisProduct.name}</h3>
          </div>
          <form>
            <div className="form-group">
              <label htmlFor="content">Review</label>
              <textarea
                className="form-control"
                name="content"
                id="content"
                rows="3"
                onChange={changeHandler}
              />
            </div>
            <div className="my-2">
              <StarRating handleRating={handleRating}/>
            </div>
            <button type="submit" className="btn btn-primary" onClick={submitReview}>
              Submit
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default ReviewForm;
