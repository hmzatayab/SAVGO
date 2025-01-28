import React, { useState, useContext } from "react";
import { Avatar, Dropdown } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";

export const Header = () => {
  const token = localStorage.getItem("token");
  const { user } = useContext(UserDataContext);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <div className="fixed top-0 left-0 w-full bg-gray-800 z-50">
      <nav className="bg-gray-900 border border-gray-700 backdrop-blur rounded-lg m-5 ">
        <div className="flex flex-wrap justify-between items-center max-w-screen-xl mx-auto px-4 py-3">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="../../public/logo.png"
              alt="Logo"
              className="w-36"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-4 ">
            <Link to={"/wishlist"}>
              <MenuButton label="Wishlist" icon="ri-heart-line" />
            </Link>
            <Link to={"/pricing"}>
              <MenuButton label="Pricing" icon="ri-price-tag-3-line" />
            </Link>
            <Link to={"/chat"}>
              <MenuButton label="Messages" icon="ri-chat-1-line" />
            </Link>
          </div>

          {token ? (
            <div className="flex justify-end space-x-4 lg:w-[176px]">
              <Dropdown
                label={<Avatar alt="User settings" img={user.image} rounded />}
                arrowIcon={false}
                inline
              >
                <Dropdown.Header className="w-40">
                  <span className="block text-base font-bold">
                    {user.name.length > 5
                      ? user.name.slice(0, 5) + "..."
                      : user.name}
                  </span>
                  <span className="block truncate text-sm font-normal italic">
                    @
                    {user.username.length > 15
                      ? user.username.slice(0, 15) + "..."
                      : user.username}
                  </span>
                </Dropdown.Header>
                <Dropdown.Item>
                  <Link to={"/dashboard"}>Profile</Link>
                </Dropdown.Item>
                <Dropdown.Item>Settings</Dropdown.Item>
                <Dropdown.Item>Earnings</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item>
                  <Link to={"/logout"}>Sign out</Link>
                </Dropdown.Item>
              </Dropdown>
              {/* Mobile Menu Button */}
              <div className="flex justify-center items-center">
                <button
                  className="lg:hidden text-white bg-gray-700 p-2 rounded-lg"
                  onClick={toggleDrawer}
                >
                  <i className="ri-menu-line text-2xl"></i>
                </button>
                <Link to={"/logout"} className="hidden sm:flex lg:block">
                  <i className="ri-logout-circle-r-line text-xl text-red-500 hover:text-red-600 hover:scale-110 transition-all duration-300"></i>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <h4 className="text-white">
                <Link
                  to={"/login"}
                  className="text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                >
                  Login
                </Link>
                <Link
                  to={"/register"}
                  className="text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                >
                  Sign Up
                </Link>
              </h4>
            </div>
          )}
        </div>
      </nav>

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 dark:bg-gray-800 p-6 transform ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-40`}
      >
        <div className="flex justify-between items-center mb-6">
          <h5 className="text-gray-500 dark:text-gray-200 font-semibold">
            Menu
          </h5>
          <button
            onClick={toggleDrawer}
            className="text-gray-500 dark:text-gray-400"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>
        <div className="flex flex-col space-y-4">
          <Link to={"/wishlist"}>
            <MenuButton label="Wishlist" icon="ri-heart-line" />
          </Link>
          <Link to={"/pricing"}>
            <MenuButton label="Pricing" icon="ri-price-tag-3-line" />
          </Link>
          <Link to={"/chat"}>
            <MenuButton label="Messages" icon="ri-chat-1-line" />
          </Link>
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
