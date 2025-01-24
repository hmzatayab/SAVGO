import React from "react";
import LikeButton from "./LikeButton";

function PostCard({ posts }) {
  return (
    <>
      <div className="break-inside-avoid bg-gray-900 hover:bg-gray-950 shadow-lg rounded-lg overflow-hidden h-fit p-4 transition duration-500">
        {/* Post Image */}
        <div className="relative w-full pb-[140%] overflow-hidden rounded-lg">
          <img
            className="absolute top-0 left-0 w-full h-full object-cover"
            src={posts.imageURL}
            alt="Post Image"
          />
        </div>

        {/* User Details & Actions */}
        <div className="flex flex-col items-center mt-4 sm:flex-row sm:justify-between sm:space-x-4 sm:flex-nowrap">
          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <img
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
              src={posts.userData.image}
              alt="User Profile"
            />
            <div className="hidden lg:block">
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

          {/* Actions */}
          <div className="flex items-center justify-between mt-4 sm:mt-0 sm:space-x-6 w-full sm:w-auto">
            <div className="flex items-center space-x-2 text-gray-400">
              <LikeButton
                postId={posts._id}
                initialLikes={posts.likes.length}
                isInitiallyLiked={posts.likes.includes(posts.user)} // Pass logged-in user ID
              />
            </div>
            <i className="ri-download-2-line text-white ri-lg sm:ri-xl cursor-pointer"></i>
          </div>
        </div>
      </div>
    </>
  );
}

export default PostCard;
