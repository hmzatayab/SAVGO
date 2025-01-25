import React, { useState } from "react";
import { useNotification } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import AnimationWrapper from "../Components/Animations";

function UploadImage() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [imageFile, setImageFile] = useState(null);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!imageFile) {
      showNotification("Please upload an image file!");
      return;
    }

    const formData = new FormData();
    formData.append("imageUpload", imageFile);

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
          showNotification(
            "Image uploaded successfully!",
            URL.createObjectURL(imageFile)
          );
        }, 1000);
        navigate("/");
      } else {
        const errorData = await response.json();
        showNotification(errorData.message);
      }
    } catch (error) {
      showNotification("An error occurred while uploading the image.");
    }

    setImageFile(null);
    e.target.reset();
  };

  return (
    <AnimationWrapper
      initial={{ opacity: 0, scale: 0.5 }}
      exit={{ opacity: 0, scale: 0.5 }}
    >
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="max-w-md w-full lg:bg-gray-900 sm:bg-gray-800 text-white p-8 rounded-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">Upload Image</h1>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            encType="multipart/form-data"
          >
            {/* Upload Image Input */}
            <input
              autoComplete="off"
              className="mb-6 block w-full text-sm text-gray-50 border border-gray-300 rounded-lg cursor-pointer bg-gray-700 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="file_input"
              type="file"
              name="imageUpload"
              onChange={handleFileChange}
            />

            {/* Submit Button */}
            <input
              type="submit"
              value="Upload"
              className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105"
            />
          </form>
          <h6 className="my-6 text-center font-thin text-gray-600">
            SVG, PNG, or JPG (Ratio 9:16)
          </h6>
          <p className="text-blue-500 text-center">
            <button onClick={() => navigate(-1)}>
              <strong>Go Back</strong>
            </button>
          </p>
        </div>
      </div>
    </AnimationWrapper>
  );
}

export default UploadImage;
