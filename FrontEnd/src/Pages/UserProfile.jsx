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

  useEffect(() => {
    if (token) {
      if (user.username === id) {
        return navigate("/dashboard");
      }
    }
  });

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
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 shadow-2xl rounded-2xl p-8 flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0">
        {/* User Info */}
        <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
          {/* Profile Picture with Gradient Border */}
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full p-1.5">
              <img
                src={userData.image}
                alt="User Profile"
                className="w-full h-full rounded-full object-cover bg-gray-700 shadow-xl"
              />
            </div>
          </div>

          {/* User Details */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start">
              <h1 className="text-4xl font-bold text-white">{userData.name}</h1>
            </div>
            <p className="text-sm text-gray-400 italic mt-2">
              @{userData.username}
            </p>

            {/* Bio Section */}
            <div className="mt-4 max-w-md">
              <p className="text-gray-300 text-sm">
                {userData.bio || "This user hasn't added a bio yet."}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Follow/Unfollow Button */}
          <button
            onClick={handleFollow}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            {isFollowing ? (
              <>
                <i className="ri-user-unfollow-line"></i>
                Unfollow
              </>
            ) : (
              <>
                <i className="ri-user-add-line"></i>
                Follow
              </>
            )}
          </button>

          {/* Message Button */}
          <Link
            to={"/chat"}
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <i className="ri-chat-3-line"></i>
            Message
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {/* Followers */}
        <Link to={`/followers/${userData._id}`}>
          <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-center rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <h2 className="text-3xl font-bold text-white">
              {followers.length}
            </h2>
            <p className="text-gray-400 mt-2">Followers</p>
          </div>
        </Link>

        {/* Following */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-center rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <h2 className="text-3xl font-bold text-white">{following.length}</h2>
          <p className="text-gray-400 mt-2">Following</p>
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
            All Post's
          </h2>
          <div className="absolute left-0 top-full mt-2 h-1 w-16 bg-gradient-to-r from-indigo-500 to-pink-500 rounded"></div>
        </div>
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
                  <Link to={`/post/${post._id}`}>
                    <img
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      key={post._id}
                      src={post.imageURL}
                      alt="Post Image"
                    />
                  </Link>
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
                        {userData.name
                          .split(" ") // Split name into words
                          .map((word, index) =>
                            index === 0
                              ? word
                              : index === 1
                              ? `${word[0]}.`
                              : ""
                          ) // First word as is, second word as first letter + dot
                          .join(" ") // Join words with space
                          .trim()}
                      </h3>
                      <p className="text-gray-400 text-xs sm:text-sm italic">
                        @
                        {userData.username.length > 10
                          ? userData.username.slice(0, 10) + "..."
                          : userData.username}
                      </p>
                    </div>
                  </div>
                  {/* <div className="flex items-center justify-between mt-4 sm:mt-0 sm:space-x-6 w-full sm:w-auto">
                    <LikeButton
                      postId={post._id}
                      initialLikes={post.likes.length}
                      isInitiallyLiked={post.likes.includes(post.user)}
                    />
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
  );
};

export default ProfilePage;
