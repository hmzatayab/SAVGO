import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "../Components/Skeleton"; // Assuming Skeleton is a reusable component
import { Link } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import LikeButton from "../Components/LikeButton";

const Wishlist = () => {
  const [wishlistPosts, setWishlistPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserDataContext);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/profile/wishlist`, // Replace with your API route
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWishlistPosts(response.data.wishlist || []);
      } catch (error) {
        console.error(
          "Error fetching wishlist:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  return (
    <div className="mx-auto px-4 py-6 mt-28">
      {/* <div className="relative mb-8 flex flex-col items-center text-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                Wishlist
              </h2>
              <div className="mt-2 h-1 w-16 bg-gradient-to-r from-indigo-500 to-pink-500 rounded"></div>
            </div> */}
      {loading ? (
        <Skeleton length="8" />
      ) : wishlistPosts.length === 0 ? (
        <p className="text-gray-400">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {wishlistPosts.map((post, index) => (
            <div
              key={index}
              className="bg-gray-900 hover:bg-gray-950 shadow-lg rounded-lg overflow-hidden p-4 transition duration-500"
            >
              <div className="relative w-full pb-[140%] overflow-hidden rounded-lg">
                <Link to={`/post/${post._id}`}>
                  <img
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    key={post._id}
                    src={post.imageURL}
                    alt="Post Image"
                  />
                </Link>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                  <img
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                    src={post.user.image}
                    alt="User Profile"
                  />
                  <div>
                    <h3 className="text-white font-semibold text-sm sm:text-base lg:text-lg">
                      {post.user.name
                        .split(" ") // Split name into words
                        .map((word, index) =>
                          index === 0 ? word : index === 1 ? `${word[0]}.` : ""
                        ) // First word as is, second word as first letter + dot
                        .join(" ") // Join words with space
                        .trim()}
                    </h3>
                    {/* <p className="text-gray-400 text-xs sm:text-sm italic">
                      @
                      {post.user.username.length > 10
                        ? post.user.username.slice(0, 10) + "..."
                        : post.user.username}
                    </p> */}
                    <i className="ri-user-line text-gray-400 "></i>
                    <span className="text-sm text-gray-400 mr-2">
                      {" "}
                      {post.user.followers.length || 0} followers{" "}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 sm:mt-0 w-full sm:w-auto">
                  {/* Like Button */}
                  <div className="flex items-center bg-gray-800 px-4 py-2 rounded-full space-x-2 mr-2 ">
                    <LikeButton
                      postId={post._id}
                      initialLikes={post.likes.length}
                      isInitiallyLiked={
                        post.user?._id ? post.likes.includes(user._id) : false
                      }
                    />
                  </div>

                  {/* Comment Icon */}
                  <Link to={`/post/${post._id}`}>
                    <div className="flex items-center bg-gray-800 px-4 py-2 rounded-full space-x-2 cursor-pointer">
                      <i className="ri-chat-1-line text-gray-400 ri-lg"></i>
                      <span className="text-white font-semibold text-sm sm:text-base">
                        {post.comments.length}
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
