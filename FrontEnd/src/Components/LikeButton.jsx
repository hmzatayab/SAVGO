import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNotification } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

const LikeButton = ({ postId, initialLikes }) => {
  const navigate = useNavigate();

  // States
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false); // Initially false
  const { showNotification } = useNotification();

  // Check if the user is authenticated
  const isAuthenticated = localStorage.getItem("token");

  // Function to fetch the initial liked status
  const fetchLikedStatus = async () => {
    if (!isAuthenticated) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/profile/like/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLiked(response.data.isLikedByCurrentUser); // Backend response sets liked status
    } catch (error) {
      console.error("Error fetching liked status:", error.response?.data || error.message);
    }
  };

  // Function to handle like/unlike
  const handleLike = async () => {
    try {
      if (!isAuthenticated) throw new Error("User not authenticated.");

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
      console.error("Error liking post:", error.response?.data || error.message);
      navigate("/login"); // Redirect to login if not authenticated
    }
  };

  // Fetch initial liked status on component mount
  useEffect(() => {
    fetchLikedStatus();
  }, [postId]);

  return (
    <div className="flex items-center space-x-2">
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
          onClick={() => showNotification("Please Logged In First")}
        ></i>
      )}
      <span className="text-sm sm:text-base">{likes}</span>
    </div>
  );
};

export default LikeButton;

