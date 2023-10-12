import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register, reset } from "../slices/authSlice";
import UserForm from "../components/UserForm";
import { toast } from "react-toastify";

const RegisterScreen = () => {
  const { isLoading, isSuccess, isError, errors } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const registerUser = async (userData) => {
    dispatch(register(userData));
  };

  useEffect(() => {
    if (isSuccess) {
      console.log("Registration was successful");
      toast.success("Registration Successful");
      navigate("/");
      dispatch(reset());
    }
    if (isError) {
      if (!errors) {
        toast.error("Please complete all fields");
      } else {
        if (errors.first_name) {
          toast.error(errors.first_name[0]);
        } else if (errors.last_name) {
          toast.error(errors.last_name[0]);
        } else if (errors.email) {
          toast.error(errors.email[0]);
        } else if (errors.address) {
          toast.error(errors.address[0]);
        } else if (errors.password) {
          toast.error(errors.password[0]);
        }
      }
      dispatch(reset());
    }
  }, [dispatch, isSuccess, isError, navigate, errors]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="viewport container-fluid col-10">
      <div className="col-lg-6 mx-auto">
        <h3 className="subNav my-4 ms-3">Register:</h3>
        <div className="mt-3">
          <UserForm
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
