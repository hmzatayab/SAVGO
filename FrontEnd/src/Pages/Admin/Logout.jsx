import React, { useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useNotification } from "../../context/NotificationContext";
import { Loader } from "lucide-react";
import AnimationWrapper from "../../Components/Animations";

export const AdminLogout = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/logout`, {
          withCredentials: true,
        });

        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        setTimeout(() => {
          showNotification("Logout successfully!");
        }, 1000);
        navigate("/");

      } catch (error) {
        showNotification(`Error during logout: ${error}`);
      }
    };

    handleLogout();
  }, [navigate]);

  return (
    <AnimationWrapper>
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
    </AnimationWrapper>
  );
};
