import React, { useState } from "react";
import LikeButton from "./LikeButton";
import { Link } from "react-router-dom";
import AnimationWrapper from "../Components/Animations";

function PostCard({ posts }) {

  const [isImageOpen, setIsImageOpen] = useState(false);

  // Function to open the image modal
  const openImage = () => {
    setIsImageOpen(true);
  };

  // Function to close the image modal
  const closeImage = () => {
    setIsImageOpen(false);
  };

  return (
    <>
      {/* Post Card */}
      <div className="break-inside-avoid bg-gray-900 hover:bg-gray-950 shadow-lg rounded-lg overflow-hidden h-fit p-4 transition duration-500">
        {/* Post Image */}
        <div
          className="relative w-full pb-[140%] overflow-hidden rounded-lg cursor-pointer"
          onClick={openImage} // Open image when clicked
        >
          <img
            className="absolute top-0 left-0 w-full h-full object-cover"
            src={posts.imageURL}
            alt="Post Image"
          />
        </div>

        {/* User Details & Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-between mt-4">
          {/* User Profile */}
          <Link to={`/profile/${posts.userData.username}`}>
            <div className="flex items-center space-x-4">
              <img
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 cursor-pointer"
                src={posts.userData.image}
                alt="User Profile"
              />
              <div>
                <h3 className="text-white font-semibold text-sm sm:text-base lg:text-lg">
                  {posts.userData.name.length > 5
                    ? posts.userData.name.slice(0, 5) + "..."
                    : posts.userData.name}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm italic">
                  @
                  {posts.userData.username.length > 10
                    ? posts.userData.username.slice(0, 10) + "..."
                    : posts.userData.username}
                </p>
              </div>
            </div>
          </Link>

          {/* Actions (Like & Download Icons) */}
          <div className="flex items-center justify-between space-x-6 mt-4 sm:mt-0 sm:space-x-6 w-full sm:w-auto">
            {/* Like Button */}
            <div className="flex items-center space-x-2 text-gray-400">
              <LikeButton
                postId={posts._id}
                initialLikes={posts.likes.length}
                isInitiallyLiked={posts.likes.includes(posts.user)} // Pass logged-in user ID
              />
            </div>
            {/* Download Icon */}
            <i className="ri-download-2-line text-white ri-lg sm:ri-xl cursor-pointer"></i>
          </div>
        </div>
      </div>

      {/* Modal for Enlarged Image */}
      {isImageOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 h-full w-full"
          onClick={closeImage} // Close modal when clicking outside
        >
          {/* Wrapping only the modal content in AnimationWrapper */}
          <AnimationWrapper
            initial={{ opacity: 0, scale: 0.8 }} // Starts slightly zoomed-out
            animate={{ opacity: 1, scale: 1 }} // Zooms to normal size
            exit={{ opacity: 0, scale: 1.2 }} // Zooms out slightly on close
            transition={{
              duration: 0.3,
              ease: [0.42, 0, 0.58, 1], // Custom cubic-bezier easing
            }}
          >
            <div
              className="bg-gray-900 bg-opacity-50 rounded-lg max-w-md w-full relative px-7"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              {/* Close button at top right corner of the screen */}
              <button
                onClick={closeImage}
                className="fixed top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all duration-200"
              >
                &times;
              </button>

              <img
                className="w-full h-auto object-contain rounded-lg"
                src={posts.imageURL}
                alt="Post Image"
              />
            </div>
          </AnimationWrapper>
        </div>
      )}
    </>
  );
}

export default PostCard;
