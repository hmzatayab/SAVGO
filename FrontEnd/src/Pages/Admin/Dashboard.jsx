import axios from "axios";
import { Menu } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const shuffledImages = users
    .map((user) => user.image) // Sirf images extract karo
    .sort(() => Math.random() - 0.5) // Shuffle karo
    .slice(0, 4); // Sirf pehli 4 images lo

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/api/users`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        setUsers(res.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    getUsers();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Toggle Button for Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-white sm:hidden"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform text-white bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 backdrop-blur-lg border-r border-gray-700 shadow-xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <div className="h-full flex flex-col justify-between px-3 py-6">
          <div>
            <Link to="/" className="flex items-center ps-2.5 mb-6">
              <img
                src="../../../public/logo.png"
                alt="Logo"
                className="w-32 lg:w-40 drop-shadow-lg"
              />
            </Link>
            <ul className="space-y-3 font-medium">
              <li>
                <Link
                  to="/admin"
                  className="flex items-center p-3 rounded-lg text-gray-200 hover:text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-500"
                >
                  <i className="ri-dashboard-line text-lg"></i>
                  <span className="ms-3">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/users"
                  className="flex items-center p-3 rounded-lg text-gray-200 hover:text-white transition-all duration-300 bg-gradient-to-r from-green-600 to-blue-500 hover:from-green-700 hover:to-blue-400"
                >
                  <i className="ri-group-line text-lg"></i>
                  <span className="ms-3">Users</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Logout Button - Last Item */}
          <div className="mt-auto">
            <Link
              to="/admin/logout"
              className="flex items-center p-3 rounded-lg text-gray-200 hover:text-white transition-all duration-300 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-400"
            >
              <i className="ri-logout-circle-line text-lg"></i>
              <span className="ms-3">Logout</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 sm:ml-64 bg-gray-900 min-h-screen">
        <div className="flex">
          <div className="flex items-center justify-between bg-gray-800 p-4 rounded-xl border border-gray-700 w-full mr-4">
            {/* Balance Section */}
            <div className="ml-4">
              <div>
                <span className="text-white font-bold text-3xl">Balance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-sm">+$ 203k</span>
                <span className="text-gray-400 text-sm">•</span>
                <span className="text-red-400 text-sm">-$ 203k</span>
              </div>
            </div>

            {/* User Group 1 */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {shuffledImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`User ${index}`}
                    className="w-14 h-14 border-2 border-white rounded-full"
                  />
                ))}
              </div>
              <span className="text-white font-bold text-2xl">
                + {users.length - 4}
              </span>
            </div>

            {/* User Group 2 */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[
                  "http://localhost:3000/Images/Uploads/b5eaaf47a6b6a2613758dc33.jpg",
                  "https://cdn.lazyshop.com/files/9b0d8bde-34c0-460a-b131-e7a87b1e0543/other/1c3ae43f29b810bfa0a80dc812078c73.jpg",
                  "https://img.freepik.com/premium-photo/beautiful-cute-anime-girl-innocent-anime-teenage_744422-6819.jpg?w=360",
                  "http://localhost:3000/Images/Uploads/b67ad2a0327430251ff1d623.avif",
                ].map((src, index) => (
                  <img
                    key={index}
                    className="w-14 h-14 border-2 border-white rounded-full"
                    src={src}
                    alt=""
                  />
                ))}
              </div>
              <span className="text-white font-bold text-2xl">+ 10k</span>
            </div>

            {/* Button */}
            <button className="bg-red-500 text-white font-semibold px-4 py-2 rounded-full hover:bg-red-600 transition mr-4">
              View Reports
            </button>
          </div>

          {/* User Profile Card */}
          <div className="p-6  bg-gray-800 rounded-xl border border-gray-700 text-white w-full sm:w-auto flex items-center gap-4">
            <img
              className="w-12 h-12 rounded-full border-2 border-gray-700"
              src="http://localhost:3000/Images/Uploads/b5eaaf47a6b6a2613758dc33.jpg"
              alt="Profile"
            />
            <div className="font-medium pr-8">
              <div className="text-lg">Jese Leos</div>
              <div className="text-xs text-gray-400">hamza@gmail.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
