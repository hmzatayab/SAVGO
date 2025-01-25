import React from "react";
import { motion } from "framer-motion";

const NotificationBar = ({ message, imageUrl, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ duration: 0.3, ease: [0.6, -0.05, 0.01, 0.99] }}
      className="fixed bottom-4 right-4 max-w-sm bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-lg shadow-lg p-4 flex items-center space-x-4"
    >
      {/* Image or Default Icon */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Uploaded"
          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg hover:scale-105 transition-transform"
        />
      ) : (
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white text-lg font-bold shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25a3.75 3.75 0 00-7.5 0V9M8.25 15h7.5M4.5 12h15"
            />
          </svg>
        </div>
      )}

      {/* Message */}
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="text-gray-200 hover:text-white bg-gray-800 hover:bg-gray-600 rounded-full p-2 focus:outline-none shadow-md transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </motion.div>
  );
};

export default NotificationBar;
