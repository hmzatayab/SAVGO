import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import Skeleton from "../Components/Skeleton";
import LikeButton from "../Components/LikeButton";
import UploadDrawer from "../Components/UploadDrawer";

const ProfilePage = () => {
  const token = localStorage.getItem("token");
  const { user, setUser } = useContext(UserDataContext);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Function to open the upload drawer
  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  // Function to close the upload drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/user/posts`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();

        setPosts(data.post.posts);
        setFollowers(user.followers);
        setFollowing(user.following);
        setUser(data.post);
        setLoading(false);
      } catch (error) {
        console.error("Error Get posts:", error);
        setLoading(false);
      }
    };
    getPosts();
  }, []);
  return (
    <>
      <div className="p-8 space-y-8 mt-28">
        {/* Profile Section */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 shadow-2xl rounded-2xl p-8 flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0">
          {/* User Info */}
          <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Profile Picture with Gradient Border */}
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full p-1.5">
                <img
                  src={user.image}
                  alt="User Profile"
                  className="w-full h-full rounded-full object-cover bg-gray-700 shadow-xl"
                />
              </div>
              {/* Hover Effect for Profile Picture */}
              <Link to={'/update'}>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full opacity-0 hover:opacity-100 transition-all duration-300 cursor-pointer">
                <i className="ri-camera-line text-white text-3xl"></i>
              </div>
              </Link>
            </div>

            {/* User Details */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start">
                <h1 className="text-4xl font-bold text-white">{user.name}</h1>
                <Link
                  to={"/update"}
                  state={{ from: "dashboard" }}
                  title="Edit Profile"
                  className="ml-3 hover:scale-110 transition-transform duration-300"
                >
                  <i className="ri-edit-2-fill text-white text-2xl"></i>
                </Link>
              </div>
              <p className="text-sm text-gray-400 italic mt-2">{user.email}</p>

              {/* Bio Section */}
              <div className="mt-4 max-w-md">
                <p className="text-gray-300 text-sm">
                  {user.bio || "Add a bio to tell people more about yourself."}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Upload Image Button */}
            <button
              onClick={openDrawer}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <i className="ri-upload-cloud-2-line"></i>
              Upload Image
            </button>
            <UploadDrawer open={isDrawerOpen} onClose={closeDrawer} />

            {/* Logout Button */}
            <Link
              to={"/logout"}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <i className="ri-logout-box-r-line"></i>
              Logout
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {/* Followers */}
          <Link to={`/followers/${user._id}`}>
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-center rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <h2 className="text-3xl font-bold text-white">
                {followers.length}
              </h2>
              <p className="text-gray-400 mt-2">Followers</p>
            </div>
          </Link>

          {/* Following */}
          <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-center rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <h2 className="text-3xl font-bold text-white">
              {following.length}
            </h2>
            <p className="text-gray-400 mt-2">Following</p>
          </div>

          {/* Profile Views */}
          <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-center rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <h2 className="text-3xl font-bold text-white">1.2K</h2>
            <p className="text-gray-400 mt-2">Profile Views</p>
          </div>

          {/* Total Sales */}
          <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-center rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <h2 className="text-3xl font-bold text-white">$5.6K</h2>
            <p className="text-gray-400 mt-2">Total Sales</p>
          </div>
        </div>

        {/* User Posts Section */}
        <div>
          <div className="relative mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Your Post's
            </h2>
            <div className="absolute left-0 top-full mt-2 h-1 w-16 bg-gradient-to-r from-indigo-500 to-pink-500 rounded"></div>
          </div>
          {loading ? (
            <Skeleton />
          ) : posts.length === 0 ? (
            <p className="text-gray-400">No posts available.</p>
          ) : (
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              style={{ columnFill: "auto" }}
            >
              {posts.map((post, index) => (
                <div
                  key={index}
                  className="break-inside-avoid bg-gray-900 hover:bg-gray-950 shadow-lg rounded-lg overflow-hidden h-fit p-4 transition duration-500"
                >
                  {/* Post Image */}
                  <div className="relative w-full pb-[140%] overflow-hidden rounded-lg">
                    <Link to={`/post/${post._id}`}>
                      <img
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        key={post._id}
                        src={post.imageURL}
                        alt="Post Image"
                      />
                    </Link>
                  </div>

                  {/* User Details & Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-4">
                    {/* User Profile */}
                    <div className="flex items-center space-x-4">
                      <img
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                        src={user.image}
                        alt="User Profile"
                      />
                      <div>
                        <h3 className="text-white font-semibold text-sm sm:text-base lg:text-lg">
                          {user.name.length > 5
                            ? user.name.slice(0, 5) + "..."
                            : user.name}
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm italic">
                          @
                          {user.username.length > 10
                            ? user.username.slice(0, 10) + "..."
                            : user.username}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    {/* <div className="flex items-center justify-between mt-4 sm:mt-0 sm:space-x-6 w-full sm:w-auto">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <LikeButton
                          postId={post._id}
                          initialLikes={post.likes.length}
                          isInitiallyLiked={
                            user?._id ? post.likes.includes(user._id) : false
                          }
                        />
                      </div>
                      <i className="ri-download-2-line text-white ri-lg sm:ri-xl cursor-pointer"></i>
                    </div> */}
                    <div className="flex items-center justify-between mt-4 sm:mt-0 w-full sm:w-auto">
                      {/* Like Button */}
                      <div className="flex items-center bg-gray-800 px-4 py-2 rounded-full space-x-2 mr-2 ">
                        <LikeButton
                          postId={post._id}
                          initialLikes={post.likes.length}
                          isInitiallyLiked={
                            user?._id ? post.likes.includes(user._id) : false
                          }
                        />
                      </div>

                      {/* Comment Icon */}
                      <Link to={`/post/${post._id}`}>
                        <div className="flex items-center bg-gray-800 px-4 py-2 rounded-full space-x-2 cursor-pointer">
                          <i className="ri-chat-1-line text-gray-400 ri-lg"></i>
                          <span className="text-white font-semibold text-sm sm:text-base">
                            {post.comments.length}
                          </span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
