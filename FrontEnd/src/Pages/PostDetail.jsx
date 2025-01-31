import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import { useNotification } from "../context/NotificationContext";
import LikeButton from "../Components/LikeButton";
import Skeleton from "../Components/Skeleton";
import PostCard from "../Components/PostCard";
import PostDetailSkeleton from "../Components/Skeleton/PostDetailSkeleton";
import axios from "axios";

function PostDetail() {
  const { id } = useParams();
  const { showNotification } = useNotification();
  const token = localStorage.getItem("token");
  const [allPosts, setAllPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [userData, setUserData] = useState(null);
  const [comments, setComments] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserDataContext);

  const formatCommentTime = (createdAt) => {
    const now = new Date();
    const commentDate = new Date(createdAt);

    // Calculate the difference in milliseconds
    const diff = now - commentDate;

    // Convert to days, hours, and minutes
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    // If the difference is more than 24 hours, show "X days"
    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }

    // If less than 24 hours, show hours and minutes
    return `${hours}h ${minutes}m ago`;
  };

  // Fetching comments for the post
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/c/${id}`,
          { headers: { Authorization: token ? `Bearer ${token}` : "" } }
        );
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (post) {
      fetchComments();
    }
  }, [post, id, token]);

  // Liking a comment
  const likeComment = async (commentId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/c/like/${commentId}`,
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, likes: comment.likes + 1 }
            : comment
        )
      );
    } catch (error) {
        showNotification("Error liking comment:", error)
    }
  };

  // Liking a reply
  const likeReply = async (commentId, replyId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/c/reply/like/${commentId}/${replyId}`,
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      // Update reply like count here if needed
    } catch (error) {
        showNotification("Error liking reply:", error)
    //   console.error("Error liking reply:", error);
    }
  };

  // Adding a new comment
  const addComment = async (content) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/c/${id}`,
        { text: content }, // Send `text` instead of `content`
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      // Update the comments state with the new comment from the response
      if (response.data.newComment) {
        setComments((prevComments) => {
          const updatedComments = [response.data.newComment, ...prevComments];
        //   console.log("Updated Comments:", updatedComments);
          return updatedComments;
        });
      }
    } catch (error) {
        showNotification("Error adding comment:", error)
    //   console.error("Error adding comment:", error);
    }
  };

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/user/all-posts`,
          { headers: { Authorization: token ? `Bearer ${token}` : "" } }
        );
        const data = await response.json();
        setAllPosts(data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    getAllPosts();
  }, [token]);

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/profile/post/${id}`
      );
      const data = await response.json();
      setUserData(data.user);
      setFollowers(data.user.followers);
      setPost(data);
    };

    fetchPost();
  }, [id]);

  //   console.log(userData);

  if (!post) {
    return <PostDetailSkeleton></PostDetailSkeleton>;
  }

  return (
    <>
      <div className="mt-28">
        <div className="flex flex-col md:flex-row rounded-xl lg:mx-60 items-stretch px-5 text-white">
          {/* Image Section */}
          <div className="w-full md:w-[45%] bg-gray-900 rounded-xl p-5 mr-3 flex items-center justify-center">
            <img
              className="w-full max-h-[80vh] object-contain rounded-xl"
              src={post.imageURL}
              alt="Post Image"
            />
          </div>

          {/* Content Section */}
          <div className="flex-grow bg-gray-900 rounded-xl p-5 flex flex-col mt-4 md:mt-0">
            {/* Profile Section */}
            <div className="flex items-center space-x-4">
              <Link to={`/profile/${userData.username}`}>
                <img
                  className="w-14 h-14 rounded-full object-cover"
                  src={userData.image}
                  alt="Profile"
                />
              </Link>
              <div>
                <h3 className="text-lg font-semibold">{userData.name}</h3>
                <p className="text-sm text-gray-400 italic">
                  @{userData.username}
                </p>
              </div>
              <div className="flex mt-[-20px] space-x-1 ">
                <i className="ri-user-line text-gray-400 "></i>
                <span className="text-sm text-gray-400">
                  {userData.followers.length || 0} followers
                </span>
              </div>
            </div>

            {/* Post Title and Description */}
            <div className="mt-6">
              <h2 className="text-2xl font-bold">{post.title}</h2>
              <p className="text-gray-300 mt-2 leading-relaxed">
                {post.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {post?.tags &&
                post.tags.length > 0 &&
                JSON.parse(post.tags[0]).map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
            </div>

            {/* Comments Section */}
            <div className="mt-6 flex-1 flex flex-col">
              <div className="flex items-center mb-4 p-2 rounded-lg bg-gray-800">
                <div className="flex items-center bg-gray-900 px-4 py-2 rounded-full space-x-2 mr-3">
                  <span className="text-sm sm:text-base font-semibold">
                    Comments
                  </span>
                </div>
                <div className="flex items-center bg-gray-900 px-4 py-2 rounded-full space-x-2">
                  <LikeButton
                    postId={post._id}
                    initialLikes={post.likes.length}
                    isInitiallyLiked={
                      user?._id ? post.likes.includes(user._id) : false
                    }
                  />
                </div>
                <div className="flex items-center bg-gray-900 px-4 py-2 rounded-full space-x-2 ml-3">
                  <i className="ri-chat-1-line text-gray-400 ri-lg"></i>
                  <span className="text-white font-semibold text-sm sm:text-base">
                    {comments.length}
                  </span>
                </div>
              </div>

              {/* Comments List */}
              <div
                className="space-y-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 pr-2"
                style={{ maxHeight: "300px" }}
              >
                {comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex items-start space-x-4 p-4 bg-gray-800 hover:bg-gray-950/50 transition-colors rounded-lg"
                  >
                    {/* Parent Comment */}
                    <img
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
                      src={
                        comment.user?.image || "https://via.placeholder.com/150"
                      }
                      alt="Commenter"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-semibold text-gray-100">
                          {comment.user?.name || "Anonymous"}
                        </h4>
                        <span className="text-xs text-gray-400">
                          • {formatCommentTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {comment.text}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <button
                          onClick={() => likeComment(comment._id)}
                          className="text-sm text-red-400 hover:text-gray-200 transition-colors"
                        >
                          Like{" "}
                          <span className="pl-1 text-white font-semibold">
                            {comment.likes?.length || 0}
                          </span>
                        </button>
                        <button className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
                          Reply
                        </button>
                      </div>

                      {/* Nested Replies Section */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 pl-10 border-l border-gray-700">
                          {comment.replies.map((reply) => (
                            <div
                              key={reply._id}
                              className="flex items-start space-x-4 mt-4"
                            >
                              <img
                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
                                src={
                                  reply.user?.image ||
                                  "https://via.placeholder.com/150"
                                }
                                alt="Reply User"
                              />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="text-sm font-semibold text-gray-100">
                                    {reply.user?.name || "Anonymous"}
                                  </h4>
                                  <span className="text-xs text-gray-400">
                                    • {formatCommentTime(reply.createdAt)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-300 leading-relaxed">
                                  {reply.text}
                                </p>
                                <div className="flex items-center space-x-4 mt-2">
                                  <button
                                    onClick={() =>
                                      likeReply(comment._id, reply._id)
                                    }
                                    className="text-sm text-red-400 hover:text-gray-200 transition-colors"
                                  >
                                    Like{" "}
                                    <span className="pl-1 text-white font-semibold">
                                      {reply.likes?.length || 0}
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Comment Section */}
              <div className="mt-4 flex items-center space-x-2">
                <input
                  type="text"
                  className="flex-grow px-4 py-2 border border-gray-700 bg-gray-800 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write a comment..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      addComment(e.target.value.trim());
                      e.target.value = ""; // Clear input field after submission
                    }
                  }}
                />
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                  onClick={() => {
                    const input = document.querySelector("input");
                    if (input.value.trim()) {
                      addComment(input.value.trim());
                      input.value = ""; // Clear input field after submission
                    }
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="mt-6">
            <div className="relative mb-8 flex flex-col items-center text-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                Related Posts
              </h2>
              <div className="mt-2 h-1 w-16 bg-gradient-to-r from-indigo-500 to-pink-500 rounded"></div>
            </div>

            {loading ? (
              <Skeleton length="8" />
            ) : allPosts.length === 0 ? (
              <p className="text-gray-400">No posts available.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {allPosts
                  .filter((post) => post._id !== id) // Jo ID params mai hai us post ko hata do
                  .sort(() => Math.random() - 0.5) // Random shuffle
                  .slice(0, 12) // Sirf pehle 12 posts select karna
                  .map((post) => (
                    <PostCard posts={post} key={post._id} />
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default PostDetail;
