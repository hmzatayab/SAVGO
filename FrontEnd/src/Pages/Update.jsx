import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import axios from "axios";
import AnimationWrapper from "../Components/Animations";

const UpdatePage = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(""); // Store the image URL
  const [file, setFile] = useState(null); // Store the image file
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  

  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5173";

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(`${BASE_URL}/user/profile`, {
          headers,
        });

        const user = response.data.user;

        setUsername(user.username);
        setName(user.name);
        setBio(user.bio || "");

        // Check if image exists, then prepend BASE_URL
        if (user.image) {
          setImage(user.image); // Permanent image URL
        }
      } catch (err) {
        showNotification(`Error fetching user details: ${err.message}`);
      }
    };

    fetchUserDetails();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file); // Store the file
      setImage(URL.createObjectURL(file)); // Temporarily show image
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    if (file) {
      formData.append("imageUpload", file); // Append image file
    }

    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(`${BASE_URL}/user/update`, formData, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        const updatedUser = response.data.updatedUser;
        setImage(`${BASE_URL}${updatedUser.image}`); // Update image URL with the new one
        showNotification("User updated successfully!");
        navigate("/");
      } else {
        showNotification("Unexpected response format");
      }
    } catch (err) {
      showNotification(`Update error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimationWrapper
      initial={{ opacity: 0, scale: 0.5 }}
      exit={{ opacity: 0, scale: 0.5 }}
    >
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="max-w-md w-full lg:bg-gray-900 text-white p-8 rounded-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">Update Profile</h1>

          {/* Profile image with file upload button */}
          <div className="relative w-32 h-32 mx-auto mb-4">
            <img
              src={image}
              alt="Profile"
              className="w-full h-full object-cover rounded-full border-4 border-indigo-500"
            />
            <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer">
              <i className="ri-edit-2-line text-white"></i>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Update Profile form */}
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              type="text"
              value={username}
              readOnly
              placeholder="Username"
              className="w-full px-4 py-2 bg-zinc-700 text-gray-400 rounded-lg outline-none placeholder-gray-400"
            />

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your Name"
              className="w-full px-4 py-2 bg-zinc-700 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 outline-none placeholder-gray-400"
            />

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Enter your Bio"
              className="w-full px-4 py-2 bg-zinc-700 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 outline-none placeholder-gray-400"
              rows="3"
            ></textarea>

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </form>

          {/* Back button */}
          <h6 className="my-6 text-center">
            <button
              onClick={() => navigate(-1)}
              className="text-blue-500 font-bold hover:underline"
            >
              Go Back
            </button>
          </h6>
        </div>
      </div>
    </AnimationWrapper>
  );
};

export default UpdatePage;