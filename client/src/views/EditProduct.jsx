import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import "../styles/EditProduct.css";
import ProductForm from "../components/ProductForm";
import { useSelector } from "react-redux";

const EditProduct = ({ editProductOpen, closeEditProduct, product }) => {
  const loggedInUser = useSelector((state) => state.auth.user);
  const token = loggedInUser.token;
  const productProps = product;

  const editProduct = async (product) => {
    const { name, description, category, quantity, price, product_id } =
      product;
    const productData = {
      name,
      description,
      category,
      quantity,
      price,
      product_id,
    };
    console.log(productData);
    try {
      await axios.put("http://localhost:5000/api/products/edit", productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Product edited successfully!");
      closeEditProduct();
      window.location.reload();
    } catch (error) {
      console.log(error);
      const errors = error.response.data.error;
      errors.title && toast.error(errors.title[0]);
      errors.category && toast.error(errors.category[0]);
      errors.description && toast.error(errors.description[0]);
      errors.name && toast.error(errors.name[0]);
      errors.price && toast.error(errors.price[0]);
      errors.quantity && toast.error(errors.quantity[0]);
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
      <h1 className="text-center">Edit Product</h1>
      <ProductForm
        onSubmit={editProduct}
        isEditing={true}
        initialName={productProps.name}
        initialDescription={productProps.description}
        initialCategory={productProps.category}
        initialQuantity={productProps.quantity}
        initialPrice={productProps.price}
        initialProductID={product.product_id}
      />
    </Modal>
  );
};

export default EditProduct;
