import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LikeButton = ({ postId, initialLikes, isInitiallyLiked }) => {
  const navigate = useNavigate();

  // States
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(isInitiallyLiked);

  // Check if the user is authenticated
  const isAuthenticated = localStorage.getItem("token");

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
      console.error(
        "Error liking post:",
        error.response?.data || error.message
      );
      navigate("/login"); // Redirect to login if not authenticated
    }
  };

  // Reinitialize state if `isInitiallyLiked` changes (when page reloads)
  useEffect(() => {
    setLiked(isInitiallyLiked); // Update liked state on mount
    setLikes(initialLikes); // Update likes count on mount
  }, [initialLikes, isInitiallyLiked]);

  return (
    <div className="flex items-center space-x-2">
      {isAuthenticated ? (
        liked ? (
          <i
            className="ri-heart-fill ri-lg sm:ri-xl cursor-pointer text-red-500"
            onClick={handleLike}
          ></i>
        ) : (
          <i
            className="ri-heart-line ri-lg sm:ri-xl cursor-pointer text-gray-400"
            onClick={handleLike}
          ></i>
        )
      ) : (
        <i
          className="ri-heart-line ri-lg sm:ri-xl cursor-pointer text-gray-400"
          onClick={() => navigate("/login")}
        ></i>
      )}
      <span className="text-sm sm:text-base">{likes}</span>
    </div>
  );
};

export default LikeButton;
