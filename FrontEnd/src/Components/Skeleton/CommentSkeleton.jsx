import React from "react";

function CommentSkeleton() {
  return (
    <div className="flex items-start space-x-4 p-4 bg-gray-800 hover:bg-gray-950/50 transition-colors rounded-lg animate-pulse">
      {/* Profile Image Skeleton */}
      <div className="w-12 h-12 rounded-full bg-gray-700"></div>

      {/* Comment Content Skeleton */}
      <div className="flex-1">
        <div className="h-4 bg-gray-700 rounded-md w-24 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded-md w-32"></div>
        <div className="h-4 bg-gray-700 rounded-md w-full mt-2"></div>
        <div className="h-4 bg-gray-700 rounded-md w-3/4 mt-2"></div>

        {/* Buttons Skeleton */}
        <div className="flex items-center space-x-4 mt-2">
          <div className="h-6 w-16 bg-gray-700 rounded-md"></div>
          <div className="h-6 w-16 bg-gray-700 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}

export default CommentSkeleton;
