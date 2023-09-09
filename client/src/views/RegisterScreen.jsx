import React from "react";
import RegisterForm from "../components/UserForm";

const RegisterScreen = () => {
  return (
    <div className="viewport container-fluid col-10">
      <div className="col-lg-6 mx-auto">
        <h3 className="subNav my-4 mx-auto">New User:</h3>
        <div className="mt-3">
          <RegisterForm
            initialFirstName=""
            initialLastName=""
            initialEmail=""
            initialInstrument=""
            initialPassword=""
            initialConfirmPassword=""
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
