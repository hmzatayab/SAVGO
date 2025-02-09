import React, { useEffect, useState } from "react";
import SidebarCom from "../../Components/Admin/Sidebar";
import UserCard from "../../Components/Admin/UserCard";
import axios from "axios";

function Users() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  // 🔹 Multi-field filtering: Username, Name, Email, _id
  const filteredUsers = users.filter((user) =>
    [user.username, user.name, user.email, user._id].some((field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <>
      <div className="flex h-screen">
        <SidebarCom />
        <div className="flex-1 p-6 sm:ml-64 min-h-screen">
          <div className="mb-8">
            <form className="flex items-center max-w-lg mx-auto">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 21 21"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11.15 5.6h.01m3.337 1.913h.01m-6.979 0h.01M5.541 11h.01M15 15h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 2.043 11.89 9.1 9.1 0 0 0 7.2 19.1a8.62 8.62 0 0 0 3.769.9A2.013 2.013 0 0 0 13 18v-.857A2.034 2.034 0 0 1 15 15Z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search by Username, Name, Email or ID..."
                  required
                />
              </div>
            </form>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center text-gray-500 mt-4">
              No users found.
            </div>
          ) : (
            <div className="flex flex-wrap -mx-2">
              {filteredUsers.map((user) => (
                <div
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-2"
                  key={user._id}
                >
                  <UserCard
                    user={{
                      id: user._id,
                      name: user.name,
                      username: user.username,
                      email: user.email,
                      avatar: user.image,
                      posts: user.posts.length,
                      followers: user.followers.length,
                      following: user.following.length,
                      balance: user.wallet?.balance || 0,
                      withdraw: user.wallet?.transactions
                        ? user.wallet.transactions
                            .filter((t) => t.type === "withdraw") // Sirf withdraw filter karo
                            .reduce((total, t) => total + t.amount, 0) // Sum of withdraw amounts
                        : 0, // Agar transactions nahi hain toh 0

                      deposit: user.wallet?.transactions
                        ? user.wallet.transactions
                            .filter((t) => t.type === "deposit")
                            .reduce((total, t) => total + t.amount, 0)
                        : 0,

                      transfer: user.wallet?.transactions
                        ? user.wallet.transactions
                            .filter((t) => t.type === "transfer")
                            .reduce((total, t) => total + t.amount, 0)
                        : 0,

                      transactions: user.wallet?.transactions
                        ? user.wallet.transactions.length
                        : 0,

                      bio: user.bio,
                      likes: 0,
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Users;
