import React from "react";
import CommentSkeleton from "./CommentSkeleton";

function PostDetailSkeleton() {
  return (
    <div className="flex flex-col md:flex-row rounded-xl lg:mx-60 items-center justify-end px-5 text-white bg-gray-900 animate-pulse">
      {/* Image Skeleton */}
      <div className="mb-4 md:mb-0 w-full md:w-[45%]">
        <div className="w-full max-h-[80vh] bg-gray-700 rounded-lg h-[300px]"></div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-grow space-y-6 px-4 md:px-8 lg:px-9 py-5">
        {/* Profile Skeleton */}
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gray-700 rounded-full"></div>
          <div>
            <div className="h-4 bg-gray-700 rounded-md w-24 mb-1"></div>
            <div className="h-3 bg-gray-700 rounded-md w-16"></div>
          </div>
        </div>

        {/* Title & Description Skeleton */}
        <div>
          <div className="h-6 bg-gray-700 rounded-md w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded-md w-full mt-2"></div>
          <div className="h-4 bg-gray-700 rounded-md w-5/6 mt-2"></div>
        </div>

        {/* Tags Skeleton */}
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-700 rounded-full"></div>
          <div className="h-6 w-16 bg-gray-700 rounded-full"></div>
          <div className="h-6 w-16 bg-gray-700 rounded-full"></div>
        </div>

        {/* Comments Skeleton */}
        <div className="space-y-4">
          <CommentSkeleton />
          <CommentSkeleton />
        </div>

        {/* Add Comment Skeleton */}
        <div className="mt-4 flex items-center space-x-2">
          <div className="h-10 w-full bg-gray-700 rounded-lg"></div>
          <div className="h-10 w-16 bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

export default PostDetailSkeleton;
