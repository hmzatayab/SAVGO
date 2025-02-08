import React, { useState } from "react";
import { useNotification } from "../../context/NotificationContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AnimationWrapper from "../../Components/Animations";

export const AdminLogin = () => {
  const [email, setEmail] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      showNotification("Both fields are required!");
      return;
    }

    const adminLogin = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/login`,
        adminLogin,
        { withCredentials: true }
      );

      if (response.status === 200) {
        const { admin, token } = response.data;

        localStorage.setItem("adminToken", token);
        localStorage.setItem("admin", JSON.stringify(admin));
        setTimeout(() => {
          showNotification("Logged In Administration Section Successfully!");
        }, 1000);
        navigate("/admin");
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Login failed");
    }

    setEmail("");
    setPassword("");
  };

  return (
    <AnimationWrapper
      initial={{ opacity: 0, scale: 0.5 }}
      exit={{ opacity: 0, scale: 0.5 }}
    >
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="max-w-md w-full lg:bg-gray-900 text-white p-8 rounded-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">Login User</h1>

          <form onSubmit={handleLogin} className="space-y-4 mb-4">
            {/* Username Input */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 outline-none placeholder-gray-400 transition-all duration-300"
            />

            {/* Password Input */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 outline-none placeholder-gray-400 transition-all duration-300"
            />

            {/* Submit Button */}
            <input
              type="submit"
              value="Login"
              className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105"
            />
          </form>

          {/* <h6 className="my-6 text-center">
            Don't have an account?
            <Link to={"/register"} className="font-bold text-blue-500">
              {" "}
              Register here
            </Link>
          </h6>

          <p className="text-center">
            <Link to={"/"} className="text-blue-500 font-bold">
              Go Back
            </Link>
          </p> */}
        </div>
      </div>
    </AnimationWrapper>
  );
};
