import { useState, useEffect } from "react";
import axios from "axios";

const CommentSection = ({ postId, user }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/c/${postId}`);
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };





  
  const handleLikeComment = async (commentId) => {
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/c/like/${commentId}`);
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId ? { ...c, likes: c.likes + 1 } : c
        )
      );
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleLikeReply = async (commentId, replyId) => {
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/c/reply/like/${commentId}/${replyId}`);
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? {
                ...c,
                replies: c.replies.map((r) =>
                  r._id === replyId ? { ...r, likes: r.likes + 1 } : r
                ),
              }
            : c
        )
      );
    } catch (error) {
      console.error("Error liking reply:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/c/${postId}`, {
        text: newComment,
        userId: user._id,
      });
      setComments([...comments, data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="mt-6 flex-1 flex flex-col">
      {/* Comments Header */}
      <div className="flex items-center mb-4 p-2 rounded-lg bg-gray-800">
        <div className="flex items-center bg-gray-900 px-4 py-2 rounded-full space-x-2 mr-3">
          <span className="text-sm sm:text-base font-semibold">Comments</span>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 pr-2">
        {comments.map((comment) => (
          <div key={comment._id} className="p-4 bg-gray-800 hover:bg-gray-950/50 transition-colors rounded-lg">
            <div className="flex items-start space-x-4">
              <img
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
                src={comment.userImage || "https://via.placeholder.com/50"}
                alt="Commenter"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-semibold text-gray-100">{comment.userName}</h4>
                  <span className="text-xs text-gray-400">• {new Date(comment.createdAt).toLocaleTimeString()}</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{comment.text}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <button onClick={() => handleLikeComment(comment._id)} className="text-sm text-red-400 hover:text-gray-200 transition-colors">
                    Like <span className="pl-1 text-white font-semibold">{comment.likes}</span>
                  </button>
                  <button className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
                    Reply
                  </button>
                </div>

                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="mt-4 pl-10 border-l border-gray-700">
                    {comment.replies.map((reply) => (
                      <div key={reply._id} className="flex items-start space-x-4 mb-3">
                        <img
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
                          src={reply.userImage || "https://via.placeholder.com/50"}
                          alt="Reply User"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-semibold text-gray-100">{reply.userName}</h4>
                            <span className="text-xs text-gray-400">• {new Date(reply.createdAt).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed">{reply.text}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <button onClick={() => handleLikeReply(comment._id, reply._id)} className="text-sm text-red-400 hover:text-gray-200 transition-colors">
                              Like <span className="pl-1 text-white font-semibold">{reply.likes}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleAddComment} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
          Post
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
