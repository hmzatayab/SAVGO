// src/pages/Followers.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserCard from "../Components/userCard";

const Followers = () => {
  const { id } = useParams(); // Get the `id` from the URL
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch followers data from the API
    const fetchFollowers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/profile/${id}/followers`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch followers");
        }
        const data = await response.json();
        setFollowers(data.followers); // Set the followers data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [id]); // Re-fetch when the `id` changes

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 mt-28">
      <div className="relative mb-8 flex flex-col items-center text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          Followers
        </h2>
        <div className="mt-2 h-1 w-16 bg-gradient-to-r from-indigo-500 to-pink-500 rounded"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {followers.map((user) => (
          <UserCard
            key={user._id}
            user={{
              id: user._id,
              name: user.name,
              username: user.username, // Extract username from email
              avatar: user.image,
              posts: user.posts.length,
              followers: user.followers.length,
              likes: 0, // Add likes if available in the API response
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Followers;
