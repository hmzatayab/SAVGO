import React, { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";

export const LoginPage = () => {
  const [username, setUsername] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation
    if (!username || !password) {
      setErrorMessage("Both fields are required!");
      return;
    }

    const userLogin = {
      username,
      password,
    };

    try {
      const response = await axios.post( `${import.meta.env.VITE_BASE_URL}/user/login`, userLogin, { withCredentials: true } );
      
      if (response.status === 200) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        navigate("/profile");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed");
    }

    // Reset form fields
    setUsername("");
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-900 text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Login User</h1>

        <form onSubmit={handleLogin} className="space-y-4 mb-4">
          {/* Username Input */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your Username"
            className="w-full px-4 py-2 bg-zinc-700 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 outline-none placeholder-gray-400 transition-all duration-300"
          />

          {/* Password Input */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your Password"
            className="w-full px-4 py-2 bg-zinc-700 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 outline-none placeholder-gray-400 transition-all duration-300"
          />

          {/* Submit Button */}
          <input
            type="submit"
            value="Login"
            className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105"
          />
        </form>

        {/* Error Message */}
        {errorMessage && (
          <div
            className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-300"
            role="alert"
          >
            <svg
              className="flex-shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Error</span>
            <div>{errorMessage}</div>
          </div>
        )}

        <h6 className="my-6 text-center">
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
        </p>
      </div>
    </div>
  );
};
