import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import { Loader } from "lucide-react";

export const LogoutPage = () => {
  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_BASE_URL}/user/logout`, {
          withCredentials: true,
        });

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null); // Reset user context
        navigate("/");

      } catch (error) {
        console.error("Error during logout:", error);
      }
    };

    handleLogout();
  }, [navigate, setUser]);

  return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  );
};
