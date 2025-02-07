import React from "react";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

function Wallet() {
  const balance = 1250.0;

  const financeData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Balance Trend",
        data: [1000, 1200, 1100, 1300, 1250],
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="mt-28 text-white flex flex-col items-center py-5 px-4">
      <div className="w-full max-w-full p-10 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-gray-900 rounded-xl">
        {/* Left Section: Wallet Actions */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Balance Card */}
          <div className="relative p-6 rounded-xl shadow-lg bg-gray-800 border border-gray-700">
            <div className="absolute inset-0 w-full h-full rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 opacity-30 blur-lg"></div>
            <h2 className="text-4xl font-bold">${balance}</h2>
            <p className="text-gray-400 mt-2">Total Balance</p>
          </div>

          {/* Action Cards */}
          {[
            {
              title: "Withdraw",
              desc: "Minimum $50",
              link: "/withdraw",
              gradient: "from-red-500 to-pink-500",
            },
            {
              title: "Deposit",
              desc: "Minimum $1",
              link: "/deposit",
              gradient: "from-green-400 to-blue-500",
            },
            {
              title: "Transfer Funds",
              desc: "Minimum $1",
              link: "/transfer",
              gradient: "from-blue-500 to-purple-500",
            },
          ].map((item, index) => (
            <Link key={index} to={item.link}>
              <div className="relative p-6 rounded-xl shadow-lg bg-gray-800 border border-gray-700 hover:shadow-2xl hover:scale-105 transition transform">
                <div
                  className={`absolute inset-0 w-full h-full rounded-xl bg-gradient-to-r ${item.gradient} opacity-30 blur-lg`}
                ></div>
                <h2 className="text-2xl font-bold">{item.title}</h2>
                <p className="text-gray-400 mt-2">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Section: Transactions */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-xl font-bold mb-6">Last Transactions</h3>
          <div className="space-y-4 overflow-y-auto max-h-[155px] pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src="https://via.placeholder.com/40"
                    alt="Profile"
                    className="w-10 h-10 rounded-full border border-gray-600"
                  />
                  <div>
                    <p className="font-semibold">Hamza T.</p>
                    <p className="text-sm text-gray-400">
                      {idx % 2 === 0 ? "Received" : "Sent"}
                    </p>
                  </div>
                </div>
                <div
                  className={`font-bold ${
                    idx % 2 === 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {idx % 2 === 0 ? "+ $500" : "- $200"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Section: Recent Purchases / Finance Graph */}
      <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-900 p-10 rounded-xl ">
        {/* Last Purchased Item */}
        <div className="flex gap-4">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4">Last Purchased Item</h3>
            <img
              src="http://localhost:3000/Images/Uploads/8e42e45f44817ac1481dc8ba.jpeg"
              alt="Last Purchase"
              className="rounded-lg w-auto h-96"
            />
            <p className="text-gray-400 mt-2">Bought: Premium Membership</p>
            <p className="text-gray-400">Amount: $50</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4">Last Purchased Item</h3>
            <img
              src="http://localhost:3000/Images/Uploads/8e42e45f44817ac1481dc8ba.jpeg"
              alt="Last Purchase"
              className="rounded-lg w-auto h-96"
            />
            <p className="text-gray-400 mt-2">Bought: Premium Membership</p>
            <p className="text-gray-400">Amount: $50</p>
          </div>
        </div>

        {/* Financial Graph */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-xl font-bold mb-4">Finance Overview</h3>
          <Line data={financeData} />
        </div>
      </div>
    </div>
  );
}

export default Wallet;
