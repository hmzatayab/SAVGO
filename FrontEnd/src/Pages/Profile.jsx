import React from "react";
import { Header } from "../Components/Header";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";

const ProfilePage = () => {
  return (
    <>
    <Header/>
    <div className="p-8 space-y-8 mt-28">
      {/* Profile Section */}
      <div className="bg-gray-700 shadow rounded-lg p-6 flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
        {/* User Info */}
        <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/f/f2/Robert_Downey_Jr._as_Tony_Stark_in_Avengers_Infinity_War.jpg"
            alt="User Profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
          />
          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-bold text-white">User Name</h1>
            <p className="text-sm text-gray-400">user.email@example.com</p>
            <Link
              to={"/update"}
              title="Edit Profile"
              className="inline-block mt-2"
            >
              <i className="ri-edit-2-fill text-white"></i>
            </Link>
          </div>
        </div>

        {/* Settings Icon */}
        <div className="flex justify-center lg:justify-end">
          <Link
            to={"/upload"}
            className="mx-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-all duration-300"
          >
            Upload Image
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gray-700 text-center rounded-lg p-4 shadow space-y-2 hover:shadow-lg hover:bg-gray-900 transition">
          <h2 className="text-xl font-bold text-white">1,234</h2>
          <p className="text-gray-400">Followers</p>
        </div>
        <div className="bg-gray-700 text-center rounded-lg p-4 shadow space-y-2 hover:shadow-lg hover:bg-gray-900 transition">
          <h2 className="text-xl font-bold text-white">567</h2>
          <p className="text-gray-400">Following</p>
        </div>
        <div className="bg-gray-700 text-center rounded-lg p-4 shadow space-y-2 hover:shadow-lg hover:bg-gray-900 transition">
          <h2 className="text-xl font-bold text-white">89</h2>
          <p className="text-gray-400">Total Likes</p>
        </div>
      </div>

      {/* User Posts Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Your Post's</h2>
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          style={{ columnFill: "auto" }}
        >
          {[1, 2, 3, 4].map((post, index) => (
            <div
              key={index}
              className="break-inside-avoid bg-gray-800 hover:bg-gray-900 shadow-lg rounded-lg overflow-hidden h-fit p-4"
            >
              {/* Post Image */}
              <div className="relative w-full pb-[140%] overflow-hidden rounded-lg">
                <img
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1736209359163-d61a35fc5640?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8"
                  alt="Post Image"
                />
              </div>

              {/* User Details & Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between mt-4">
                {/* User Profile */}
                <div className="flex items-center space-x-4">
                  <img
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                    src="https://upload.wikimedia.org/wikipedia/en/f/f2/Robert_Downey_Jr._as_Tony_Stark_in_Avengers_Infinity_War.jpg"
                    alt="User Profile"
                  />
                  <div>
                    <h3 className="text-white font-semibold text-sm sm:text-base lg:text-lg">
                      User Name
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      @username
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 sm:mt-0 sm:space-x-6 w-full sm:w-auto">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <i className="ri-heart-line ri-lg sm:ri-xl cursor-pointer"></i>
                    <span className="text-sm sm:text-base">12</span>
                  </div>
                  <i className="ri-download-2-line text-white ri-lg sm:ri-xl cursor-pointer"></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer></Footer>
    </div>
    </>
  );
};

export default ProfilePage;
