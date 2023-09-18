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
    const token = loggedInUser.token;
    console.log(product)
    const { name, description, category, quantity, price, product_id } = product;
      const productData = {name, description, category, quantity, price, product_id};
    console.log(token)
    console.log(productData)
    

    const editProduct = async () => {
    
      try {
        await axios.put(
          "http://localhost:5000/api/products/edit",
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Product edited successfully!");
      } catch (error) {
        console.log(error);
        toast.error("Error editing product!");
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
    <ProductForm onSubmit={editProduct} isEditing={true} initialName={productData.name} initialDescription={productData.description} initialCategory={productData.category} initialQuantity={productData.quantity} initialPrice={productData.price} initialProductID={productData.id} />
  </Modal>
  );
}
