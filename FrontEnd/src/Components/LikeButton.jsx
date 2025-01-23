import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LikeButton = ({ postId, initialLikes, isInitiallyLiked }) => {
    const navigate = useNavigate()
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(isInitiallyLiked);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated.");

      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/profile/like/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update likes count and state from the server response
      const updatedLikes = response.data.post.likes;
      setLikes(updatedLikes.length);
      setLiked(!liked);
    } catch (error) {
      console.error("Error liking post:", error.response?.data || error.message);
      navigate("/login")
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* {!liked ? (
        <i
          className="ri-heart-fill ri-lg sm:ri-xl cursor-pointer text-red-500"
          onClick={handleLike}
        ></i>
      ) : (
        <i
          className="ri-heart-line ri-lg sm:ri-xl cursor-pointer text-gray-400"
          onClick={handleLike}
        ></i>
      )} */}
      <i
          className="ri-heart-fill ri-lg sm:ri-xl cursor-pointer text-red-500"
          onClick={handleLike}
        ></i>
      <span className="text-sm sm:text-base">{likes}</span>
    </div>
  );
};

export default LikeButton;


