// src/components/UserCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const UserCard = ({ user }) => {

    const formatBalance = (balance) => {
        if (balance >= 1000000) {
          return (balance / 1000000).toFixed(1) + "M"; // 1M format
        } else if (balance >= 1000) {
          return (balance / 1000).toFixed(1) + "K"; // 1K format
        }
        return balance; // Agar 1000 se kam hai to as it is
      };

  return (
    <div className="mb-2">
      <div className="flex flex-col items-center p-6 border border-gray-700 shadow-2xl rounded-2xl hover:shadow-2xl transition-transform bg-gradient-to-br from-gray-800 to-gray-900 text-white transform hover:scale-95 duration-300">
        <Link to={`/profile/${user.username}`} target="_blank" className="relative group">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full border-4 border-indigo-500 shadow-md group-hover:rotate-6 transition-transform duration-300"
          />
          <div className="absolute inset-0 rounded-full bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <p className="text-sm font-bold text-white">View Profile</p>
          </div>
        </Link>

        <h3 className="text-2xl font-bold mt-4">{user.name}</h3>
        <div className="flex"><p className="text-gray-400 mr-2 italic">@{user.username} </p><i class="ri-separator text-gray-400 mr-2"></i>
        <p className="text-gray-400 ">{user.email}</p></div>

        <div className="bg-gray-700 p-3 rounded-lg w-full text-center mt-2">
          <p className="text-sm text-gray-300 font-medium">{user.bio || "No bio available."}</p>
        </div>

        <div className="flex justify-around w-full mt-4">
          <div className="text-center">
            <p className="text-xl font-extrabold text-indigo-400">
              {formatBalance(user.posts)}
            </p>
            <p className="text-sm text-gray-500">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-extrabold text-green-400">
             {formatBalance(user.followers)}
            </p>
            <p className="text-sm text-gray-500">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-extrabold text-pink-400">{formatBalance(user.following)}</p>
            <p className="text-sm text-gray-500">Followings</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-extrabold text-pink-400">{formatBalance(user.balance)}</p>
            <p className="text-sm text-gray-500">Balance</p>
          </div>
        </div>

        <div className="flex justify-around w-full mt-4">
          <div className="text-center">
            <p className="text-xl font-extrabold text-pink-400">{formatBalance(user.withdraw)}</p>
            <p className="text-sm text-gray-500">withdraw</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-extrabold text-green-400">
              {formatBalance(user.deposit)}
            </p>
            <p className="text-sm text-gray-500">Deposit</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-extrabold text-pink-400">{formatBalance(user.transfer)}</p>
            <p className="text-sm text-gray-500">Tansfer</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-extrabold text-indigo-400">{formatBalance(user.transactions)}</p>
            <p className="text-sm text-gray-500">Transactions</p>
          </div>
        </div>

        <div className="w-full bg-gray-800 p-4 rounded-xl mt-6 shadow-inner">
          <h4 className="text-lg font-semibold text-yellow-400 text-center">
            Earnings
          </h4>
          <p className="text-2xl font-bold text-center text-green-500 mt-1">
            $2.3k
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
