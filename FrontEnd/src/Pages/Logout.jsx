import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

export const LogoutPage = () => {
  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_BASE_URL}/user/logout`, {
          withCredentials: true,
        });

        // Clear token from local storage
        localStorage.removeItem("token");

        // Clear user data from context
        setUser(null);

        // Redirect to login page
        navigate("/");
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };

    handleLogout();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Logging you out...</h1>
      </div>
    </div>
  );
};
