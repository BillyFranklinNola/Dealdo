import React from "react";
import RegisterForm from "../components/UserForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register } from "../slices/authSlice";

const RegisterScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, isSuccess } = useSelector((state) => state.auth);

  const registerUser = async (userData) => {
    const response = await dispatch(register(userData));
    if (isSuccess) {
      console.log(response.payload);
      navigate("/");
    } else {
      const errorResponse = response;
      console.log(errorResponse);
      for (const key of Object.keys(errorResponse)) {
        toast.error(errorResponse[key].message);
      }
    }
  };
  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="viewport container-fluid col-10">
      <div className="col-lg-6 mx-auto">
        <h3 className="subNav my-4 mx-auto">New User:</h3>
        <div className="mt-3">
          <RegisterForm
            initialFirstName=""
            initialLastName=""
            initialEmail=""
            initialAddress=""
            initialPassword=""
            onSubmit={registerUser}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
