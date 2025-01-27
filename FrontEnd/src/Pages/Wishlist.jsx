import React, { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "../Components/Skeleton"; // Assuming Skeleton is a reusable component
import PostCard from "../Components/PostCard"; // Assuming PostCard is used to display individual posts

const Wishlist = () => {
  const [wishlistPosts, setWishlistPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.error("Error fetching wishlist:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 mt-28">
      <h1 className="text-2xl font-bold text-gray-700 mb-4">My Wishlist</h1>
      {loading ? (
        <Skeleton length="8" />
      ) : wishlistPosts.length === 0 ? (
        <p className="text-gray-400">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {wishlistPosts.map((post) => (
            <PostCard posts={post} key={post._id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
