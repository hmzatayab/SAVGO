import React from "react";

function Skeleton(props) {
  const length = props.length
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-800 animate-pulse shadow-lg rounded-lg overflow-hidden h-fit p-4"
        >
          {/* Skeleton Image */}
          <div className="relative w-full pb-[140%] bg-gray-700 rounded-lg"></div>

          {/* Skeleton User Details */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 space-y-2 sm:space-y-0">
            {/* User Skeleton Profile */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gray-700"></div>
              <div>
                <div className="h-4 bg-gray-700 rounded-md w-24 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded-md w-16"></div>
              </div>
            </div>

            {/* Skeleton Actions */}
            <div className="flex items-center justify-between mt-4 sm:mt-0 sm:space-x-6 w-full sm:w-auto">
              <div className="h-6 w-6 bg-gray-700 rounded-md"></div>
              <div className="h-6 w-6 bg-gray-700 rounded-md"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
