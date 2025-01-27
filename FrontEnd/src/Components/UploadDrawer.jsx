import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext"; // Adjust according to your actual hook location

const UploadDrawer = ({ open, onClose }) => {
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  // Handle image upload
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!imageFile) {
      showNotification("Please upload an image file!");
      return;
    }

    // Convert tags to an array
    const tagsArray = tags.split(",").map(tag => tag.trim());

    const formData = new FormData();
    formData.append("imageUpload", imageFile);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", JSON.stringify(tagsArray));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/profile/upload`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setTimeout(() => {
          showNotification("Image uploaded successfully!", URL.createObjectURL(imageFile));
        }, 1000);
        navigate("/"); // Redirect after upload
      } else {
        const errorData = await response.json();
        // showNotification(errorData.message);
      }
    } catch (error) {
      showNotification("An error occurred while uploading the image.");
    }

    // Reset form fields
    setImageFile(null);
    setTitle("");
    setDescription("");
    setTags("");
    e.target.reset(); // Reset form values
    onClose(); // Close the drawer
  };

  // Handle image removal
  const removeImage = () => {
    setImageFile(null);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"} backdrop-blur-md`}
        onClick={onClose} // Close when clicked outside
      ></div>

      {/* Drawer Content */}
      <div
        className={`fixed bottom-0 left-0 w-full bg-gray-900 p-6 transition-transform transform ${open ? "translate-y-0" : "translate-y-full"} z-50 rounded-tl-xl rounded-tr-xl shadow-2xl`}
      >
        <div className="flex justify-between items-center">
          <div className="relative mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              UPLOAD IMAGE
            </h2>
            <div className="absolute left-0 top-full mt-2 h-1 w-16 bg-gradient-to-r from-indigo-500 to-pink-500 rounded"></div>
          </div>
          <button
            onClick={onClose}
            className="text-white text-3xl font-semibold hover:text-red-500 transition"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Section: Image Upload */}
          <div className="flex flex-col items-center justify-center bg-gray-800 p-4 rounded-lg shadow-lg">
            {!imageFile ? (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full lg:h-96 sm:h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-900 transition-all duration-500"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                    <p className="text-xs text-gray-400">SVG, PNG, or JPG (Ratio 9:16)</p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all duration-300"
                >
                  &times;
                </button>
              </div>
            )}
          </div>

          {/* Right Section: Form Inputs */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
              {/* Title */}
              <div>
                <label className="text-white block text-sm mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 outline-none placeholder-gray-400 transition-all duration-300"
                  placeholder="Enter a title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-white block text-sm mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 outline-none placeholder-gray-400 transition-all duration-300"
                  rows="4"
                  placeholder="Describe your image"
                  required
                ></textarea>
              </div>

              {/* Tags */}
              <div>
                <label className="text-white block text-sm mb-2">Tags (separate with commas)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 outline-none placeholder-gray-400 transition-all duration-300"
                  placeholder="Enter tags separated by commas"
                />
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-md hover:from-blue-600 hover:to-indigo-700 transition-all ease-in-out duration-300 shadow-lg"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadDrawer;
