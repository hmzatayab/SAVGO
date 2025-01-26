import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import Skeleton from "../Components/Skeleton";
import LikeButton from "../Components/LikeButton";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";

const ProfilePage = () => {
  const { user } = useContext(UserDataContext);
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const { showNotification } = useNotification();
  const [userData, setUserData] = useState({});
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    if(token){
      if(user.username === id){
        return navigate("/dashboard")
      }
    }
  })

  // Follow/Unfollow Logic
  const handleFollow = async () => {
    try {
      const targetId = userData._id; // Directly use userData._id
      const userId = user._id;

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/profile/follow`,
        { userId, targetId }, // userId from URL params and targetId from userData
        { headers: { Authorization: `Bearer ${token}` } }
      );

    
      if (response.status === 200) {
        const { followers: updatedFollowers } = response.data.user;
        setFollowers(updatedFollowers);
        const isNowFollowing = updatedFollowers.includes(user._id);
        setIsFollowing(isNowFollowing);
        showNotification(response.data.message);
      }
    } catch (error) {
      console.error(error);
      showNotification("Please Logged In First");
    }
  };

  // useEffect(() => {
  //   if(!token){
  //     const loggedInUserId = user._id;
  //   const isUserFollowing = followers.includes(loggedInUserId);
  //   setIsFollowing(isUserFollowing);
  //   }
  // }, [followers, user._id]);


  useEffect(() => {
    if (token && user) {
      const loggedInUserId = user._id;
      const isUserFollowing = followers.includes(loggedInUserId);
      setIsFollowing(isUserFollowing);
    }
  }, [followers, user, token]);


  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/profile/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = response.data;
        setUserData(data.user);
        setPosts(data.user.posts);
        setFollowers(data.user.followers);
        setFollowing(data.user.following);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [id, token]);

  return (
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
              <p className="text-sm text-gray-400 italic">
                @{userData.username}
              </p>
            </div>
          </div>
        </div>

        {/* Settings Icon */}
        <div className="flex justify-center lg:justify-end">
          <button
            onClick={handleFollow}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-all duration-300"
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
          <Link
            to={"/chat"}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {posts.map((post, index) => (
              <div
                key={index}
                className="bg-gray-900 hover:bg-gray-950 shadow-lg rounded-lg overflow-hidden p-4 transition duration-500"
              >
                <div className="relative w-full pb-[140%] overflow-hidden rounded-lg">
                  <img
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    key={post._id}
                    src={post.imageURL}
                    alt="Post Image"
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between mt-4">
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
                  <div className="flex items-center justify-between mt-4 sm:mt-0 sm:space-x-6 w-full sm:w-auto">
                    <LikeButton
                      postId={post._id}
                      initialLikes={post.likes.length}
                      isInitiallyLiked={post.likes.includes(post.user)}
                    />
                    <i className="ri-download-2-line text-white ri-lg sm:ri-xl cursor-pointer"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
