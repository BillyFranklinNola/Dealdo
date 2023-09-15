import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import "../styles/EditProductModal.css";
import ProductForm from '../components/ProductForm';
import { useSelector } from 'react-redux'

export default function EditProduct({editProductOpen, closeEditProduct, product}) {
    const loggedInUser = useSelector((state) => state.auth.user);
    const token = loggedInUser.data.token;
    const { name, description, category, quantity, price, id } = product;
    const productData = {name, description, category, quantity, price, id};

    const editProduct = async () => {
      try {
        const newProduct = await axios.put(
          "http://localhost:5000/api/products/edit",
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(newProduct.data.data);
        const formData = new FormData();
        formData.append("file", productData.image);
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
    open={editProductOpen}
    onClose={closeEditProduct}
    center={true}
    classNames={{
      overlayAnimationIn: "enterOverlay",
      overlayAnimationOut: "leaveOverlay",
      modalAnimationIn: "enterModal",
      modalAnimationOut: "leaveModal",
    }}
    animationDuration={800}
  >
    <ProductForm onSubmit={editProduct} initialName={productData.name} initialDescription={productData.description} initialCategory={productData.category} initialQuantity={productData.quantity} initialPrice={productData.price} initialProductID={productData.id} />
  </Modal>
  );
}
