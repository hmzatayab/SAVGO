import { Menu } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-white sm:hidden"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

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
                  to="/admin/users"
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
    </div>
  );
}

export default Sidebar;
