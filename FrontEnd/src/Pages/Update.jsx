import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import AnimationWrapper from "../Components/Animations";

const UpdatePage = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the token from localStorage or another source
        const headers = {
          Authorization: `Bearer ${token}`, // Include the token in the correct format
        };
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`, { headers });

        const user = response.data.user;

        setUsername(user.username); // Set logged-in username (non-editable)
        setName(user.name);
        setEmail(user.email);
        setImage(user.image);
      } catch (err) {
        toast.error(`Error fetching user details: ${err.message}`);
        setError("Failed to load user details. Please try again.");
      }
    };

    fetchUserDetails();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedUser = { name, email, image };
      const token = localStorage.getItem("token"); // Get token from localStorage

      const response = await axios.post( `${import.meta.env.VITE_BASE_URL}/user/update`, updatedUser,
        {
          headers: { Authorization: `Bearer ${token}` }, // Pass token in headers
        }
      );

      if (response.status === 200) {
        toast.success("User Updated successfully!");
        navigate("/");
      } else {
        toast.error("Unexpected response format");
      }
    } catch (err) {
      toast.error(`Update error: ${err.message}`);
      setError("An error occurred while updating. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimationWrapper initial={{ opacity: 0, scale: 0.5,}} exit={{ opacity: 0, scale: 0.5,}}>
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-900 text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Update User</h1>

        {error && (
          <p className="text-red-500 text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Username Input */}
          <input
            type="text"
            value={username}
            readOnly
            placeholder="Username"
            className="w-full px-4 py-2 bg-zinc-700 text-gray-400 rounded-lg outline-none placeholder-gray-400"
          />

          {/* Name Input */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your Name"
            className="w-full px-4 py-2 bg-zinc-700 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 outline-none placeholder-gray-400"
            name="name"
          />

          {/* Email Input */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Your Email"
            className="w-full px-4 py-2 bg-zinc-700 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 outline-none placeholder-gray-400"
            name="email"
          />

          {/* Profile Image Input */}
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Enter your Profile Image URL"
            className="w-full px-4 py-2 bg-zinc-700 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 outline-none placeholder-gray-400"
            name="image"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </form>

        <h6 className="my-6 text-center">
          <button to="/" onClick={() => navigate(-1)} className="text-blue-500 font-bold hover:underline">
            Go Back
          </button>
        </h6>
      </div>
    </div>
    </AnimationWrapper>
  );
};

export default UpdatePage;
