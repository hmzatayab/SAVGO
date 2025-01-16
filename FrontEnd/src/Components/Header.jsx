import React from "react";
import { Avatar, Dropdown } from "flowbite-react";
import { Link } from "react-router-dom";

export const Header = () => {
  const token = localStorage.getItem("token")
  
  return (
    <div className="sticky top-0 z-50 bg-gray-800 shadow-md p-5">
      <nav className="bg-gray-900 border-gray-700 rounded-lg">
        <div className="flex flex-wrap justify-between items-center max-w-screen-xl mx-auto px-4 py-3">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgkbZeqDj7ZDAyBOeCx3b-uwUeFMN2N5CYroiABbvjSPxCJv9PZnb2DLKbwR4RZD0IR3nE9W9wV72EfWY28kKFJM5EhuyAS5d_QtlCvGBCU0EfaQfzRaazQldvUjSOrOdaZqOmlvftp5e-u33Q98Ifdsv-lJ_OJ9wn-ylV4FQrEWHOD6tE6Gbg20SjQXAxE/s16000/RCanvas.png"
              alt="Logo"
              className="w-44"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-4">
            <MenuButton label="Wishlist" icon="ri-heart-line" />
            <MenuButton label="Pricing" icon="ri-price-tag-3-line" />
            <MenuButton label="Messages" icon="ri-chat-1-line" />
          </div>

          {/* Profile Section */}
          {/* <div className="flex justify-end space-x-4 w-[176px]">
            <Dropdown
              className="bg-gray-700"
              label={
                <Avatar
                  alt="User settings"
                  img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  rounded
                />
              }
              arrowIcon={false}
              inline
            >
              <Dropdown.Header className="text-white bg-gray-700">
                <span className="block text-sm">Bonnie Green</span>
                <span className="block truncate text-sm font-medium">
                  name@flowbite.com
                </span>
              </Dropdown.Header>
              <Dropdown.Item className="text-white hover:text-black">
                <Link to={"/profile"}>Dashboard</Link>
              </Dropdown.Item>
              <Dropdown.Item className="text-white hover:text-black">
                Settings
              </Dropdown.Item>
              <Dropdown.Item className="text-white hover:text-black">
                Earnings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="text-white hover:text-black">
                <Link to={"/logout"}>Sign out</Link>
              </Dropdown.Item>
            </Dropdown>
          </div> */}

          {token ? (
            <div className="flex justify-end space-x-4 w-[176px]">
              <Dropdown
                className="bg-gray-700"
                label={
                  <Avatar
                    alt="User settings"
                    img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    rounded
                  />
                }
                arrowIcon={false}
                inline
              >
                <Dropdown.Header className="text-white bg-gray-700">
                  <span className="block text-sm">Bonnie Green</span>
                  <span className="block truncate text-sm font-medium">
                    name@flowbite.com
                  </span>
                </Dropdown.Header>
                <Dropdown.Item className="text-white hover:text-black">
                  <Link to={"/profile"}>Dashboard</Link>
                </Dropdown.Item>
                <Dropdown.Item className="text-white hover:text-black">
                  Settings
                </Dropdown.Item>
                <Dropdown.Item className="text-white hover:text-black">
                  Earnings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="text-white hover:text-black">
                  <Link to={"/logout"}>Sign out</Link>
                </Dropdown.Item>
              </Dropdown>
            </div>
          ) : (
            <div>
              <h4 className="text-white">
                <Link to={"/login"}>Please Login</Link>
              </h4>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className="flex justify-center lg:hidden py-3">
        <div className="flex space-x-2">
          <MenuButton label="Wishlist" icon="ri-heart-line" />
          <MenuButton label="Pricing" icon="ri-price-tag-3-line" />
          <MenuButton label="Messages" icon="ri-chat-1-line" />
        </div>
      </div>
    </div>
  );
};

// Reusable MenuButton Component
const MenuButton = ({ label, icon, notificationCount }) => {
  return (
    <button className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-600 rounded-md hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-blue-500">
      <i className={`${icon} me-2`}></i>
      {label}
      {notificationCount && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
          {notificationCount}
        </span>
      )}
    </button>
  );
};
