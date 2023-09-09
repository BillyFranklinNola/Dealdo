import axios from "axios";

const REG_URL = "/api/users/register";
const LOGIN_URL = "/api/users/login";

const register = async (userData) => {
  const response = await axios.post(REG_URL, userData);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(LOGIN_URL, userData, {
    withCredentials: true,
  });
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
