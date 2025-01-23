import React from "react";

const NotificationBar = ({ message, imageUrl, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-gray-900 text-white rounded-lg shadow-lg p-4 flex items-center space-x-4 animate-slide-in">
      {/* Image */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Uploaded"
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
        />
      )}

      {/* Message */}
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white focus:outline-none"
      >
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default NotificationBar;
