import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNotification } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

const LikeButton = ({ postId, initialLikes, isInitiallyLiked }) => {
  const navigate = useNavigate();

  // States
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(isInitiallyLiked); // Set initial liked state
  const { showNotification } = useNotification();

  // Check if the user is authenticated
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  // Function to handle like/unlike
  const handleLike = async () => {
    if (!isAuthenticated) {
      showNotification("Please log in first.");
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/profile/like/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update likes count and state from the server response
      const updatedLikes = response.data.post.likes.length;
      const isLikedByCurrentUser = response.data.post.isLikedByCurrentUser;

      setLikes(updatedLikes); // Update likes count
      setLiked(isLikedByCurrentUser); // Update liked state
    } catch (error) {
      console.error(
        "Error liking post:",
        error.response?.data || error.message
      );
    }
  };

  function formatCount(count) {
    if (count >= 1_000_000) {
      return (count / 1_000_000).toFixed(1) + "M"; // 1M format
    } else if (count >= 1_000) {
      return (count / 1_000).toFixed(1) + "k"; // 1k format
    }
    return count.toString(); // Default number
  }

  return (
    <div className="flex items-center space-x-1 jus">
      {isAuthenticated ? (
        <i
          className={`ri-lg sm:ri-xl cursor-pointer ${
            liked ? "ri-heart-fill text-red-500" : "ri-heart-line text-red-400"
          }`}
          onClick={handleLike}
        ></i>
      ) : (
        <i
          className="ri-heart-line ri-lg sm:ri-xl cursor-pointer text-red-400"
          onClick={() => showNotification("Please log in first.")}
        ></i>
      )}
      <span className="text-sm sm:text-base font-semibold text-white">
        {formatCount(likes)}
      </span>
    </div>
  );
};

export default LikeButton;
