import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import Modal from "react-responsive-modal";
import ProductForm from "../components/ProductForm";
import "react-responsive-modal/styles.css";
import "../styles/CreateProduct.css";

const CreateProduct = ({ isOpen, onClose }) => {
  const [productID, setProductID] = useState(null);
  const loggedInUser = useSelector((state) => state.auth.user);
  const token = loggedInUser.token;

  const createProduct = async (product) => {
    const { userID, name, description, category, quantity, price} = product;
    const productData = {userID, name, description, category, quantity, price};
    console.log(token);
    console.log(productData);
    console.log(product.image);
    try {
      const newProduct = await axios.post(
        "http://localhost:5000/api/products/create",
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(newProduct);
      setProductID(newProduct.data.data.product_id);
      toast.success("Product added successfully!");
      onClose();
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error("Error adding product!");
    }
    try {
      const formData = new FormData();
      console.log(product.image);
      console.log(productID);
      formData.append("file", product.image);
      formData.append("product_id", productID);
      await axios.post(
        'http://localhost:5000/api/img/products/upload',
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Image added successfully!")
    } catch (error) {
      console.log(error);
      toast.error("Error adding image!");
    }
  };

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
      <ProductForm
        onSubmit={createProduct}
        isEditing={false}
        initialuserID=""
        initialName=""
        initialDescription=""
        initialCategory=""
        initialQuantity=""
        initialPrice=""
        initialImg_filenname=""
      />
    </Modal>
  );
}

export default CreateProduct;
