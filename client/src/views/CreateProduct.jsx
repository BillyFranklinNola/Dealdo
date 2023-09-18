import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import "../styles/CreateProductModal.css";
import ProductForm from '../components/ProductForm';
import { useSelector } from 'react-redux'

export default function CreateProduct({isOpen, onClose}) {
    const loggedInUser = useSelector((state) => state.auth.user);
    const token = loggedInUser.token;

    const createProduct = async (product) => {
    const { userID, name, description, category, quantity, price, image } = product;
    const productData = {userID, name, description, category, quantity, price};
    console.log(image)
    console.log(token)
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
        console.log(newProduct.data.data);
        const formData = new FormData();
        formData.append("file", image);
        formData.append("product_id", newProduct.data.data.product_id);
        try {
          const newImage = await axios.post(
            `http://localhost:5000/api/img/products/upload`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(newImage);
        } catch (error) {
          console.log(error);
        }
        toast.success("Product added successfully!");
      } catch (error) {
        console.log(error);
        toast.error("Error adding product!");
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
    <ProductForm onSubmit={createProduct} isEditing={false} initialuserID="" initialName="" initialDescription="" initialCategory="" initialQuantity="" initialPrice="" initialImg_filenname=""/>
  </Modal>
  );
}
