import axios from "axios";

const REG_URL = "http://localhost:5000/api/users/register";
const LOGIN_URL = "http://localhost:5000/api/users/login";

const register = async (userData) => {
  const response = await axios.post(REG_URL, userData);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  console.log(response);
  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(LOGIN_URL, userData);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  console.log(response);
  return response.data;
};

const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
