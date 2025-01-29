import React, { useContext, useState } from "react";
import LikeButton from "./LikeButton";
import { Link } from "react-router-dom";
import "../index.css";
import AnimationWrapper from "../Components/Animations";
import { UserDataContext } from "../context/UserContext";

function PostCard({ posts }) {

  const { user } = useContext(UserDataContext);
  // console.log(user._id);

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
            <div
              className="flex items-center bg-gray-800 px-4 py-2 rounded-full space-x-2 cursor-pointer"
              onClick={openImage}
            >
              <i className="ri-chat-1-line text-gray-400 ri-lg"></i>
              <span className="text-white font-semibold text-sm sm:text-base">
                2.1k
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Enlarged Image */}
      {isImageOpen && (
        <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 w-full 
                   overflow-y-auto max-h-screen sm:max-h-full"
        onClick={closeImage} // Close modal when clicking outside
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} // Hide scrollbar for Firefox & Edge
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
              className="rounded-lg max-w-5xl w-full mx-auto relative px-5 py-8 flex flex-col md:flex-row bg-gray-900 text-white"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              {/* Post Image */}
              <div className="flex-shrink-0 w-full md:w-2/5 mb-6 md:mb-0">
                <button
                  onClick={closeImage}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-all duration-200"
                >
                  &times;
                </button>

                <img
  className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
  src={posts.imageURL}
  alt="Post Image"
/>

              </div>

              {/* Right Section */}
              <div className="flex-grow space-y-6 px-4 md:pl-8">
                {/* Profile Section */}
                <div className="flex items-center space-x-4">
                  <Link to={`/profile/${posts.userData.username}`}>
                    <img
                      className="w-14 h-14 rounded-full object-cover"
                      src={posts.userData.image}
                      alt="Profile"
                    />
                  </Link>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {posts.userData.name}
                    </h3>
                    <p className="text-sm text-gray-400 italic">
                      @{posts.userData.username}
                    </p>
                  </div>
                </div>

                {/* Post Title and Description */}
                <div>
                  <h2 className="text-2xl font-bold">{posts.title}</h2>
                  <p className="text-gray-300 mt-2 leading-relaxed">
                    {posts.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                    #Tag1
                  </span>
                  <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                    #Tag2
                  </span>
                  <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                    #Tag3
                  </span>
                </div>

                {/* Comments Section */}
                <div>
                  <div className="flex items-center mb-4 p-2 rounded-lg bg-gray-800">
                    <div className="flex items-center bg-gray-900 px-4 py-2 rounded-full space-x-2 mr-3">
                      <span className="text-sm sm:text-base font-semibold ">
                        Comments
                      </span>
                    </div>

                    <div className="flex items-center bg-gray-900 px-4 py-2 rounded-full space-x-2 ">
                      <LikeButton
                        postId={posts._id}
                        initialLikes={posts.likes.length}
                        isInitiallyLiked={
                          user?._id ? posts.likes.includes(user._id) : false
                        }
                      />
                    </div>

                    <div className="flex items-center bg-gray-900 px-4 py-2 rounded-full space-x-2 ml-3">
                      <i className="ri-chat-1-line text-gray-400 ri-lg"></i>
                      <span className="text-white font-semibold text-sm sm:text-base">
                        2.1k
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 pr-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                    {/* Single Comment */}
                    

                    <div className="flex items-start space-x-4 p-4 bg-gray-800 hover:bg-gray-950/50 transition-colors rounded-lg">
                      {/* User Avatar */}
                      <img
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
                        src={posts.userData.image}
                        alt="Commenter"
                      />

                      {/* Comment Content */}
                      <div className="flex-1">
                        {/* User Info */}
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-semibold text-gray-100">
                            Jane Doe
                          </h4>
                          <span className="text-xs text-gray-400">
                            • 2 hours ago
                          </span>
                        </div>

                        {/* Comment Text */}
                        <p className="text-sm text-gray-300 leading-relaxed">
                          This is a comment on the post. It can span multiple
                          lines and will wrap naturally within the container.
                        </p>

                        {/* Comment Actions (Like, Reply, etc.) */}
                        <div className="flex items-center space-x-4 mt-2">
                          <button className="text-sm text-red-400 hover:text-gray-200 transition-colors">
                            Like{" "}
                            <span className="pl-1 text-white font-semibold">
                              2.1k
                            </span>
                          </button>
                          <button className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Another Comment */}
                    <div className="flex flex-col space-y-4 p-4 bg-gray-800 hover:bg-gray-950/50 transition-colors rounded-lg">
                      {/* Parent Comment */}
                      <div className="flex items-start space-x-4">
                        {/* User Avatar */}
                        <img
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
                          src={posts?.userData?.image || "/default-profile.png"} // Fallback added
                          alt="Commenter"
                        />

                        {/* Comment Content */}
                        <div className="flex-1">
                          {/* User Info */}
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-semibold text-gray-100">
                              Jane Doe
                            </h4>
                            <span className="text-xs text-gray-400">
                              • 2 hours ago
                            </span>
                          </div>

                          {/* Comment Text */}
                          <p className="text-sm text-gray-300 leading-relaxed">
                          This is a comment on the post. It can span multiple
                          lines and will wrap naturally within the container.
                          </p>

                          {/* Comment Actions (Like, Reply, etc.) */}
                          <div className="flex items-center space-x-4 mt-2">
                            <button className="text-sm text-red-400 hover:text-gray-200 transition-colors">
                              Like{" "}
                              <span className="pl-1 text-white font-semibold">
                                2.1k
                              </span>
                            </button>
                            <button className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
                              Reply
                            </button>
                          </div>

                          {/* ✅ Nested Comment Below Parent Comment */}
                          <div className="mt-4 pl-10 border-l border-gray-700">
                            {/* Reply Comment */}
                            <div className="flex items-start space-x-4">
                              {/* Reply User Avatar */}
                              <img
                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
                                src={
                                  posts?.userData?.image ||
                                  "/default-profile.png"
                                } // Fallback added
                                alt="Reply User"
                              />

                              {/* Reply Content */}
                              <div className="flex-1">
                                {/* User Info */}
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="text-sm font-semibold text-gray-100">
                                    John Doe
                                  </h4>
                                  <span className="text-xs text-gray-400">
                                    • 1 hour ago
                                  </span>
                                </div>

                                {/* Reply Text */}
                                <p className="text-sm text-gray-300 leading-relaxed">
                                  This is a nested reply to the comment.
                                </p>

                                {/* Reply Actions */}
                                <div className="flex items-center space-x-4 mt-2">
                                  <button className="text-sm text-red-400 hover:text-gray-200 transition-colors">
                                    Like{" "}
                                    <span className="pl-1 text-white font-semibold">
                                      500
                                    </span>
                                  </button>
                                  {/* <button className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
                                    Reply
                                  </button> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* <div className="flex items-start space-x-4">
                      <img
                        className="w-10 h-10 rounded-full object-cover"
                        src={posts.userData.image}
                        alt="Commenter"
                      />
                      <div className="bg-gray-800 px-4 py-2 rounded-lg w-full">
                        <h4 className="text-sm font-medium">Emily Smith</h4>
                        <p className="text-sm text-gray-300">
                          Great post! Thanks for sharing.
                        </p>
                      </div>
                    </div> */}
                  </div>

                  {/* Add Comment */}
                  <div className="mt-4 flex items-center space-x-2">
                    <input
                      type="text"
                      className="flex-grow px-4 py-2 border border-gray-700 bg-gray-800 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Write a comment..."
                    />
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </AnimationWrapper>
        </div>
      )}
    </>
  );
}

export default PostCard;
