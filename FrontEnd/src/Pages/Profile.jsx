import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import { Loader } from "lucide-react";
import Skeleton from "../Components/Skeleton";
import LikeButton from "../Components/LikeButton";

const ProfilePage = () => {
  const token = localStorage.getItem("token");
  const { user } = useContext(UserDataContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/user/posts`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        setPosts(data.post.posts);
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
        <div className="bg-gray-700 shadow rounded-lg p-6 flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
          {/* User Info */}
          <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="relative w-24 h-24">
              {/* Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full p-1">
                <img
                  src={user.image}
                  alt="User Profile"
                  className="w-full h-full rounded-full object-cover bg-gray-700 shadow-lg"
                />
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full opacity-0 hover:opacity-100 transition-all duration-300">
                <i className="ri-camera-line text-white text-2xl"></i>
              </div>
            </div>
            <div className="text-center lg:text-left">
              <div className="flex items-center">
              <h1 className="text-3xl font-bold text-white">{user.name}</h1>
              <Link
                to={"/update"}
                state={{ from: "profile" }}
                title="Edit Profile"
                className="inline-block ml-3"
              >
                <i className="ri-edit-2-fill text-white"></i>
              </Link>
              </div>
              <div className="flex items-center">
                <i class="ri-mail-line text-white mr-2"></i>
                <p className="text-sm text-gray-400 italic">{user.email}</p>
              </div>
              {/* <p className="text-sm text-gray-400">
                {(() => {
                  const [username, domain] = user.email.split("@");
                  const hiddenUsername =
                    username[0] +
                    "*".repeat(username.length - 2) +
                    username[username.length - 1];
                  const hiddenDomain =
                    domain[0] +
                    "*".repeat(domain.indexOf(".")) +
                    domain.slice(domain.indexOf("."));
                  return `${hiddenUsername}@${hiddenDomain}`;
                })()}
              </p> */}

            </div>
          </div>

          {/* Settings Icon */}
          <div className="flex justify-center lg:justify-end">
            <Link
              to={"/upload"}
              state={{ from: "profile" }}
              className="mx-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-all duration-300"
            >
              Upload Image
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-gray-700 text-center rounded-lg p-4 shadow space-y-2 hover:shadow-lg hover:bg-gray-900 transition">
            <h2 className="text-xl font-bold text-white">1,234</h2>
            <p className="text-gray-400">Followers</p>
          </div>
          <div className="bg-gray-700 text-center rounded-lg p-4 shadow space-y-2 hover:shadow-lg hover:bg-gray-900 transition">
            <h2 className="text-xl font-bold text-white">567</h2>
            <p className="text-gray-400">Following</p>
          </div>
          <div className="bg-gray-700 text-center rounded-lg p-4 shadow space-y-2 hover:shadow-lg hover:bg-gray-900 transition">
            <h2 className="text-xl font-bold text-white">89</h2>
            <p className="text-gray-400">Total Likes</p>
          </div>
        </div>

        {/* User Posts Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Your Post's</h2>
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
                    <img
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      key={post._id}
                      src={post.imageURL}
                      alt="Post Image"
                    />
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
                    <div className="flex items-center justify-between mt-4 sm:mt-0 sm:space-x-6 w-full sm:w-auto">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <LikeButton
                          postId={post._id}
                          initialLikes={post.likes.length}
                          isInitiallyLiked={post.likes.includes(post.user)} // Pass logged-in user ID
                        />
                      </div>
                      <i className="ri-download-2-line text-white ri-lg sm:ri-xl cursor-pointer"></i>
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
