import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import Skeleton from "../Components/Skeleton";
import LikeButton from "../Components/LikeButton";

const ProfilePage = () => {
  const { id } = useParams();
  const { user } = useContext(UserDataContext);
  const [userData, setUserData] = useState({});
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/profile/${id}`);
        const data = await response.json();
        setUserData(data.user); 
        setPosts(data.user.posts)
        setFollowers(data.user.followers)
        setFollowing(data.user.following)
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [id]);

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
                  src={userData.image}
                  alt="User Profile"
                  className="w-full h-full rounded-full object-cover bg-gray-700 shadow-lg"
                />
              </div>
            </div>
            <div className="text-center lg:text-left">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold text-white">{userData.name}</h1>
              </div>
              <div className="flex items-center">
                <p className="text-sm text-gray-400 italic">@{userData.username}</p>
              </div>
            </div>
          </div>

          {/* Settings Icon */}
          <div className="flex justify-center lg:justify-end">
            <Link
              to={"/chat"}
              state={{ from: "profile" }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-all duration-300"
            >
              Follow
            </Link>
            <Link
              to={"/chat"}
              state={{ from: "profile" }}
              className="ml-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-all duration-300"
            >
              Message
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-gray-700 text-center rounded-lg p-4 shadow space-y-2 hover:shadow-lg hover:bg-gray-900 transition">
            <h2 className="text-xl font-bold text-white">{followers.length}</h2>
            <p className="text-gray-400">Followers</p>
          </div>
          <div className="bg-gray-700 text-center rounded-lg p-4 shadow space-y-2 hover:shadow-lg hover:bg-gray-900 transition">
            <h2 className="text-xl font-bold text-white">{following.length}</h2>
            <p className="text-gray-400">Following</p>
          </div>
          <div className="bg-gray-700 text-center rounded-lg p-4 shadow space-y-2 hover:shadow-lg hover:bg-gray-900 transition">
            <h2 className="text-xl font-bold text-white">89</h2>
            <p className="text-gray-400">Total Likes</p>
          </div>
        </div>

        {/* User Posts Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">All Post's</h2>
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
                        src={userData.image}
                        alt="User Profile"
                      />
                      <div>
                        <h3 className="text-white font-semibold text-sm sm:text-base lg:text-lg">
                          {userData.name.length > 5
                            ? userData.name.slice(0, 5) + "..."
                            : userData.name}
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm italic">
                          @
                          {userData.username.length > 10
                            ? userData.username.slice(0, 10) + "..."
                            : userData.username}
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
