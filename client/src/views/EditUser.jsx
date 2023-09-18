import React from "react";
import UserForm from "../components/UserForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register } from "../slices/authSlice";

const RegisterScreen = (userData, editUserOpen, closeEditUser) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, isSuccess } = useSelector((state) => state.auth);

  const editUser = async (userData) => {
    // Need an api end point to implement
  };
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <Modal
    open={editUserOpen}
    onClose={closeEditUser}
    center={true}
    classNames={{
      overlayAnimationIn: "enterOverlay",
      overlayAnimationOut: "leaveOverlay",
      modalAnimationIn: "enterModal",
      modalAnimationOut: "leaveModal",
    }}
    animationDuration={800}
  >
    <UserForm onSubmit={editUser} initialFirst_Name={userData.first_name} initialLastName={userData.last_name}  />
  </Modal>
  );
}
