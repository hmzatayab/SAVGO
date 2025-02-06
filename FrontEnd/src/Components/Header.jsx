import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";

export const Header = () => {
  const token = localStorage.getItem("token");
  const { user } = useContext(UserDataContext);
  const [balance, setBalance] = useState(0);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  useEffect(() => {
    // Function to fetch the wallet balance
    const fetchBalance = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/wallet/balance`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // assuming the token is stored in localStorage
            },
          }
        );
        setBalance(response.data.balance); // Assuming the API returns a `balance` field
      } catch (err) {
        console.log(err);
      }
    };

    fetchBalance();
  }, []);

  const formatFollowers = (count) => {
    if (count >= 10000) {
      return (count / 1000).toFixed(0) + "k";
    } else if (count >= 1000) {
      return count.toLocaleString();
    }
    return count;
  };

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
              className="w-28 lg:w-36"
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
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <div className="flex items-center h-[60px] bg-gray-800 p-3 rounded-xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out w-[140px] md:w-[160px] lg:w-[160px]">
                  {/* Profile Image with Circular Gradient Border */}
                  <div className="relative w-12 h-12">
                    <div className="w-full h-full rounded-full p-[2px] bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
                      <img
                        src={user.image}
                        alt="User Avatar"
                        className="w-full h-full object-cover rounded-full border-2 border-gray-800"
                      />
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex flex-col ml-3 ">
                    <span className="text-gray-200 text-sm font-semibold truncate">
                      {user.name
                        .split(" ")
                        .map((word, index) =>
                          index === 0 ? word : index === 1 ? `${word[0]}.` : ""
                        )
                        .join(" ")
                        .trim()}
                    </span>

                    {/* Money Icon and Balance */}
                    <div className="flex items-center text-gray-400 text-xs space-x-1">
                      <i className="ri-wallet-2-line text-blue-500 text-sm"></i>{" "}
                      {/* Money Icon */}
                      <span className="font-medium text-white">
                        {balance ? `$${balance.toFixed(2)}` : "$0.00"}{" "}
                        {/* User Balance */}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Menu Button */}
              <div className="flex justify-center items-center ml-3 lg:hidden">
                <button
                  className="text-white bg-gray-700 p-3 rounded-xl hover:bg-gray-600 transition"
                  onClick={toggleDrawer}
                >
                  <i className="ri-menu-line text-xl"></i>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex space-x-4">
              <h4 className="text-white">
                <Link
                  to={"/login"}
                  className="text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                >
                  Login
                </Link>
                <Link
                  to={"/register"}
                  className="text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
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
        } transition-transform duration-300 z-40 lg:hidden`}
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
