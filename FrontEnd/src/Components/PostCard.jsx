import React, { useContext, useState } from "react";
import LikeButton from "./LikeButton";
import { Link } from "react-router-dom";
import "../index.css";
import { UserDataContext } from "../context/UserContext";

function PostCard({ posts }) {
  // console.log(posts.comments);
  
  const { user } = useContext(UserDataContext);

  return (
    <>
      {/* Post Card */}
      <div className="break-inside-avoid bg-gray-900 hover:bg-gray-950 shadow-lg rounded-lg overflow-hidden h-fit p-4 transition duration-500">
        {/* Post Image */}
        <div className="relative w-full pb-[140%] overflow-hidden rounded-lg cursor-pointer">
          <Link to={`/post/${posts._id}`}>
            <img
              className="absolute top-0 left-0 w-full h-full object-cover"
              src={posts.imageURL}
              alt="Post Image"
            />
          </Link>
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
                  {posts.userData.name
                    .split(" ") // Split name into words
                    .map((word, index) =>
                      index === 0 ? word : index === 1 ? `${word[0]}.` : ""
                    ) // First word as is, second word as first letter + dot
                    .join(" ") // Join words with space
                    .trim()}
                </h3>
                {/* <p className="text-gray-400 text-xs sm:text-sm italic">
                  @
                  {posts.userData.username.length > 10
                    ? posts.userData.username.slice(0, 10) + "..."
                    : posts.userData.username}
                </p> */}
                <i className="ri-user-line text-gray-400 "></i>
                <span className="text-sm text-gray-400 mr-2">
                  {" "}
                  {posts.userData.followers.length || 0} followers{" "}
                </span>
              </div>
            </div>
          </Link>

          {/* Actions (Like & Comment Icons) */}
          <div className="flex items-center justify-between mt-4 sm:mt-0 w-full sm:w-auto">
            {/* Like Button */}
            <div className="flex items-center bg-gray-800 px-4 py-2 rounded-full space-x-2 mr-2 ">
              <LikeButton
                postId={posts._id}
                initialLikes={posts.likes.length}
                isInitiallyLiked={
                  user?._id ? posts.likes.includes(user._id) : false
                }
              />
            </div>

            {/* Comment Icon */}
            <Link to={`/post/${posts._id}`}>
              <div className="flex items-center bg-gray-800 px-4 py-2 rounded-full space-x-2 cursor-pointer">
                <i className="ri-chat-1-line text-gray-400 ri-lg"></i>
                <span className="text-white font-semibold text-sm sm:text-base">
                  {posts.comments.length}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default PostCard;
