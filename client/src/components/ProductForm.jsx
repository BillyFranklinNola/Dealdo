import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProductForm = (props) => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;  
  console.log(token);

  const {
    initialuserID,
    initialName,
    initialDescription,
    initialCategory,
    initialQuantity,
    initialPrice,
    initialImg_filenname,
  } = props;

  const [formState, setFormState] = useState({
    userID: initialuserID,
    name: initialName,
    description: initialDescription,
    category: initialCategory,
    quantity: initialQuantity,
    price: initialPrice,
    img_filenname: initialImg_filenname,
    isSubmitted: false,
  });

  const {
    userID,
    name,
    description,
    category,
    quantity,
    price,
    img_filenname,
  } = formState;

  const changeHandler = (e) => {
    setFormState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    console.log(formState);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const productData = {
      userID,
      name,
      description,
      category,
      quantity,
      price,
      img_filenname,
    };
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
      setProduct(newProduct.data.product);
      setAllProducts([...allProducts, newProduct.data.product]);
      toast.success("Product added successfully!");
      navigate("/products");
    } catch (error) {
      console.log(error);
      toast.error("Error adding product!");
    }
  };
  return (
    <div className="container-fluid">
      <div className="panelBackground text-secondary mx-auto p-3 border border-2 border-dark rounded">
        <form className="mx-auto" onSubmit={onSubmitHandler}>
          <div className="row form-group align-items-center mt-4">
            <label
              htmlFor="name"
              className="col-4 col-lg-3 col-form-label me-2"
            >
              Product Title:
            </label>
            <div className="col-7 col-lg-8">
              <input
                type="text"
                name="name"
                id="name"
                className="form-control"
                onChange={changeHandler}
              />
            </div>
          </div>
          <div className="row form-group align-items-center mt-4">
            <label
              htmlFor="description"
              className="col-4 col-lg-3 col-form-label me-2"
            >
              Description:
            </label>
            <div className="col-7 col-lg-8">
              <input
                type="text"
                name="description"
                id="description"
                className="form-control"
                onChange={changeHandler}
              />
            </div>
          </div>
          <div className="row form-group align-items-center mt-4">
            <label
              htmlFor="category"
              className="col-3 col-lg-2 col-form-label me-2"
            >
              Category:
            </label>
            <div className="col-8 col-lg-9">
              <select
                name="category"
                id="category"
                className="form-control"
                onChange={changeHandler}
              >
                <option value="" disabled selected>
                  Select a category
                </option>
                <option value="home_and_garden">Home and Garden</option>
                <option value="electronics">Electronics</option>
                <option value="health_and_wellness">Health and Wellness</option>
                <option value="automotive">Automotive</option>
                <option value="pet_care">Pet Care</option>
                <option value="clothing_and_apparel">
                  Clothing and Apparel
                </option>
                <option value="musical_equipment">Musical Equipment</option>
                <option value="arts_and_crafts">Arts and Crafts</option>
              </select>
            </div>
          </div>
          <div className="row form-group align-items-center mt-4">
            <label
              htmlFor="quantity"
              className="col-4 col-lg-3 col-form-label me-2"
            >
              Quantity:
            </label>
            <div className="col-7 col-lg-8">
              <input
                type="number"
                name="quantity"
                id="quantity"
                className="form-control"
                onChange={changeHandler}
              />
            </div>
          </div>
          <div className="row form-group align-items-center mt-4">
            <label
              htmlFor="price"
              className="col-4 col-lg-3 col-form-label me-2"
            >
              Price:
            </label>
            <div className="col-7 col-lg-8">
              <input
                type="number"
                name="price"
                id="price"
                pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$"
                className="form-control"
                onChange={changeHandler}
              />
            </div>
          </div>
          <div className="row form-group align-items-center mt-4">
            <label
              htmlFor="image"
              className="col-4 col-lg-3 col-form-label me-2"
            >
              Image:
            </label>
            <div className="col-7 col-lg-8">
              <input
                type="file"
                accept=".pdf, .png, .jpg, .jpeg, .gif"
                name="image"
                id="image"
                className="form-control"
                onChange={changeHandler}
              />
            </div>
          </div>
          <button input type="submit" className="btn btn-warning mt-4 mb-3">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
