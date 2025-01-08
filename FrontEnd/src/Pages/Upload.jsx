import React, { useState } from "react";

function UploadImage() {
  const [imageFile, setImageFile] = useState(null);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please upload an image file!");
      return;
    }

    const formData = new FormData();
    formData.append("imageUpload", imageFile);

    try {
      const response = await fetch("/profile/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Image uploaded successfully!");
      } else {
        alert("Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("An error occurred while uploading the image.");
    }

    // Reset the file input
    setImageFile(null);
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-900 text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Upload Image</h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          {/* Upload Image Input */}
          <input
            autocomplete="off"
            className="mb-6 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
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
          <a href="/">
            <strong>Go Back</strong>
          </a>
        </p>
      </div>
    </div>
  );
}

export default UploadImage;
