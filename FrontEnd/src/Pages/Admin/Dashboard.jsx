import axios from "axios";
import React, { useEffect, useState } from "react";
import SidebarCom from "../../Components/Admin/Sidebar";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [users, setUsers] = useState([]);
  const [shuffledImages, setShuffledImages] = useState([]);

  const totalAmounts = users.reduce(
    (acc, user) => {
        user.wallet?.transactions.forEach((transaction) => {
            if (transaction.type === "transfer" || transaction.type === "withdraw") {
                acc.withdrawTotal += transaction.amount; // Withdraw aur transfer ka sum
            } else if (transaction.type === "deposit") {
                acc.depositTotal += transaction.amount; // Deposit ka sum
            }
        });
        return acc;
    },
    { withdrawTotal: 0, depositTotal: 0 } // Initial values
);

const formatBalance = (balance) => {
    if (balance >= 1000000) {
      return (balance / 1000000).toFixed(1) + "M"; // 1M format
    } else if (balance >= 1000) {
      return (balance / 1000).toFixed(1) + "K"; // 1K format
    }
    return balance; // Agar 1000 se kam hai to as it is
  };
  

  useEffect(() => {
    const shuffleImages = () => {
      const images = users
        .map((user) => user.image) // Sirf images extract karo
        .sort(() => Math.random() - 0.5) // Shuffle karo
        .slice(0, 4); // Sirf pehli 4 images lo

      setShuffledImages(images);
    };

    shuffleImages(); // Pehli dafa shuffle karo

    const interval = setInterval(shuffleImages, 2000); // Har 5 sec bad shuffle karo

    return () => clearInterval(interval); // Cleanup jab component unmount ho
  }, [users]);

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
      <SidebarCom />

      {/* Main Content */}
      <div className="flex-1 p-6 sm:ml-64 bg-gray-900 min-h-screen">
        <div className="flex">
          <div className="flex items-center justify-between bg-gray-800 p-4 rounded-xl border border-gray-700 w-full mr-4">
            {/* Balance Section */}
            <div className="ml-4">
              <div>
                <span className="text-white font-bold text-3xl">
                  Transactions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-lg">+${formatBalance(totalAmounts.depositTotal)}</span>
                <span className="text-gray-400 text-base">•</span>
                <span className="text-red-400 text-lg">-${formatBalance(totalAmounts.withdrawTotal)}</span>
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
              <span className="text-white font-bold text-3xl">
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
              <span className="text-white font-bold text-3xl">+ 10k</span>
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
              <div className="text-lg">Hamza T.</div>
              <div className="text-xs text-gray-400">hamza@gmail.com</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="relative p-6 h-60 rounded-2xl shadow-lg bg-gray-900 backdrop-blur-lg border border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-95">
            <div className="absolute inset-0 w-full h-full rounded-3xl border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-lg"></div>
            <div className="relative z-10">
              <div className="text-gray-300 mb-4">
                <h2 className="text-2xl font-bold">Total User</h2>
              </div>
              <div className="flex -space-x-6">
                {[
                  "http://localhost:3000/Images/Uploads/b5eaaf47a6b6a2613758dc33.jpg",
                  "https://cdn.lazyshop.com/files/9b0d8bde-34c0-460a-b131-e7a87b1e0543/other/1c3ae43f29b810bfa0a80dc812078c73.jpg",
                  "https://img.freepik.com/premium-photo/beautiful-cute-anime-girl-innocent-anime-teenage_744422-6819.jpg?w=360",
                  "http://localhost:3000/Images/Uploads/b67ad2a0327430251ff1d623.avif",
                  "https://img.freepik.com/free-photo/medium-shot-anime-style-man-portrait_23-2151067428.jpg?semt=ais_hybrid",
                  "https://imgcdn.stablediffusionweb.com/2024/11/19/ed3ca70e-3c44-4209-aef0-566797f7b652.jpg",
                  "https://i.pinimg.com/736x/13/8c/93/138c93cd2cf946e4a58c04d77c347fb6.jpg",
                ].map((src, index) => (
                  <img
                    key={index}
                    className="w-14 h-14 border-2 border-white rounded-full"
                    src={src}
                    alt=""
                  />
                ))}
              </div>
              <Link to={"/admin/users"}>
              <div className="text-gray-300 mt-4">
                <p className="">
                  Manage All Users here <button ><i class="ri-arrow-right-s-line">{}</i></button>
                </p>
              </div>
              </Link>
              <h2 className="text-white text-4xl mt-2 font-bold">{formatBalance(users.length)}</h2>
            </div>
          </div>

          <div className="relative p-6 rounded-2xl shadow-lg bg-gray-900 backdrop-blur-lg border border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-95">
            <div className="absolute inset-0 w-full h-full rounded-3xl border-2 border-transparent bg-gradient-to-r from-green-500 to-blue-500 opacity-20 blur-lg"></div>
            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-bold text-white">23.2k</h2>
              <p className="text-gray-400 mt-2">Followers</p>
            </div>
          </div>

          <div className="relative p-6 rounded-2xl shadow-lg bg-gray-900 backdrop-blur-lg border border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-95">
            <div className="absolute inset-0 w-full h-full rounded-3xl border-2 border-transparent bg-gradient-to-r from-yellow-500 to-orange-500 opacity-20 blur-lg"></div>
            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-bold text-white">23.2k</h2>
              <p className="text-gray-400 mt-2">Followers</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Sidebar;
