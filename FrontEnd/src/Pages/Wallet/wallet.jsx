import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import FinanceChart from "../../Components/FormChat";

function Wallet() {
  const [balance, setBalance] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);

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

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/wallet/transaction",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        setTransactionHistory(res.data.transactions || []); // Ensure it's an array
      } catch (error) {
        console.log(error);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    // Function to fetch the wallet balance
    const fetchBalance = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/wallet/balance`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        setBalance(response.data.balance);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="mt-28 text-white flex flex-col items-center py-5 px-4">
      <div className="w-full max-w-full p-10 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-gray-900 rounded-xl">
        {/* Left Section: Wallet Actions */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Balance Card */}
          <div className="relative p-6 rounded-xl shadow-lg bg-gray-800 border border-gray-700">
            <div className="absolute inset-0 w-full h-full rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 opacity-30 blur-lg"></div>
            <h2 className="text-4xl font-bold relative">${balance}</h2>
            <p className="text-gray-400 mt-2 relative">Total Balance</p>
          </div>

          {/* Total Transactions Card */}
          <div className="p-6 rounded-xl shadow-lg bg-gray-800 border border-gray-700 hover:shadow-2xl hover:scale-105 transition transform">
            <div className="absolute inset-0 w-full h-full rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-30 blur-lg"></div>
            <h2 className="text-4xl font-bold relative">
              {transactionHistory.length}
            </h2>
            <p className="text-gray-400 mt-2 relative">Total Transactions</p>
          </div>

          {/* Total Spent Amount Card */}
          <div className="p-6 rounded-xl shadow-lg bg-gray-800 border border-gray-700 hover:shadow-2xl hover:scale-105 transition transform">
            <div className="absolute inset-0 w-full h-full rounded-xl bg-gradient-to-r from-red-500 to-pink-500 opacity-30 blur-lg"></div>
            <h2 className="text-4xl font-bold relative">
              $
              {transactionHistory.reduce(
                (total, transaction) =>
                  transaction.type === "withdraw" ||
                  transaction.type === "transfer"
                    ? total + transaction.amount
                    : total,
                0
              )}
            </h2>
            <p className="text-gray-400 mt-2 relative">Total Spent</p>
          </div>

          {/* Withdraw Card */}
          <Link to="/withdraw">
            <div className="relative p-6 rounded-xl shadow-lg bg-gray-800 border border-gray-700 hover:shadow-2xl hover:scale-105 transition transform">
              <div className="absolute inset-0 w-full h-full rounded-xl bg-gradient-to-r from-red-500 to-pink-500 opacity-30 blur-lg"></div>
              <h2 className="text-2xl font-bold relative">Withdraw</h2>
              <p className="text-gray-400 mt-2 relative">Minimum $50</p>
            </div>
          </Link>

          {/* Deposit Card */}
          <Link to="/deposit">
            <div className="relative p-6 rounded-xl shadow-lg bg-gray-800 border border-gray-700 hover:shadow-2xl hover:scale-105 transition transform">
              <div className="absolute inset-0 w-full h-full rounded-xl bg-gradient-to-r from-green-400 to-blue-500 opacity-30 blur-lg"></div>
              <h2 className="text-2xl font-bold relative">Deposit</h2>
              <p className="text-gray-400 mt-2 relative">Minimum $1</p>
            </div>
          </Link>

          {/* Transfer Funds Card */}
          <Link to="/transfer">
            <div className="relative p-6 rounded-xl shadow-lg bg-gray-800 border border-gray-700 hover:shadow-2xl hover:scale-105 transition transform">
              <div className="absolute inset-0 w-full h-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-30 blur-lg"></div>
              <h2 className="text-2xl font-bold relative">Transfer Funds</h2>
              <p className="text-gray-400 mt-2 relative">Minimum $1</p>
            </div>
          </Link>
        </div>

        {/* Right Section: Transactions */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-xl font-bold mb-6">Transaction History</h3>
          <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            {transactionHistory.length > 0 ? (
              transactionHistory.map((transaction) => (
                <Link to={`/invoice/${transaction._id}`} key={transaction._id}>
                <div
                  key={transaction._id}
                  className="flex flex-col sm:flex-row items-center sm:justify-between bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition mt-2"
                >
                  {/* Left Section - User Details */}
                  <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                    {transaction.type === "transfer" ? (
                      <div className="flex items-center space-x-2 sm:space-x-4 w-full">
                        {/* Sender */}
                        <div className="flex items-center space-x-2">
                          <img
                            src={transaction.wallet.user.image}
                            alt="Sender Profile"
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-600"
                          />
                          <p className="text-sm sm:text-base font-semibold truncate max-w-[100px] sm:max-w-none">
                            {transaction.wallet.user?.name || "Unknown"}
                          </p>
                        </div>

                        <span className="text-gray-400 text-sm">➜</span>

                        {/* Recipient */}
                        <div className="flex items-center space-x-2">
                          <img
                            src={
                              transaction.recipientWallet?.user?.image ||
                              "/default-avatar.png"
                            }
                            alt="Recipient Profile"
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-600"
                          />
                          <p className="text-sm sm:text-base font-semibold truncate max-w-[100px] sm:max-w-none">
                            {transaction.recipientWallet?.user?.name ||
                              "Unknown"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <img
                          src={transaction.wallet.user.image}
                          alt="Profile"
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-600"
                        />
                        <div>
                          <p className="text-sm sm:text-base font-semibold">
                            {transaction.wallet.user?.name || "Unknown User"}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-400">
                            {transaction.type.charAt(0).toUpperCase() +
                              transaction.type.slice(1)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Section - Amount & Time */}
                  <div className="flex flex-col items-end text-right w-full sm:w-auto mt-2 sm:mt-0">
                    <div
                      className={`font-bold ${
                        transaction.type === "deposit"
                          ? "text-green-400"
                          : transaction.type === "transfer"
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {transaction.type === "deposit"
                        ? "+ "
                        : transaction.type === "transfer"
                        ? "⇄ "
                        : "- "}
                      ${transaction.amount}
                    </div>
                    <p className="text-xs font-normal text-gray-400">
                      {formatDistanceToNow(new Date(transaction.createdAt), {
                        addSuffix: false,
                      })}
                    </p>
                  </div>
                </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-400 text-center">
                No transactions found.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* New Section: Recent Purchases / Finance Graph */}
      <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-900 p-10 rounded-xl ">
        {/* Last Purchased Item */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Last Purchased Item",
              img: "http://localhost:3000/Images/Uploads/8e42e45f44817ac1481dc8ba.jpeg",
              description: "Bought: Premium Membership",
              amount: "$50",
            },
            {
              title: "Most Expensive Purchase",
              img: "http://localhost:3000/Images/Uploads/6dbc65cd1c49d694a8b886ea.jpeg",
              description: "Bought: VIP Access",
              amount: "$100",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hover:shadow-2xl transition-all transform hover:scale-[1.02]"
            >
              <h3 className="text-xl font-bold mb-4 text-white">
                {item.title}
              </h3>
              <div className="relative w-full h-60 overflow-hidden rounded-lg">
                <img
                  src={item.img}
                  alt={item.title}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
              <p className="text-gray-400 mt-3">{item.description}</p>
              <p className="text-lg font-semibold text-yellow-400">
                {item.amount}
              </p>
            </div>
          ))}
        </div>

        {/* Financial Graph */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          {/* <h3 className="text-xl font-bold mb-4">Finance Overview</h3>
          <Line data={financeData} /> */}
          <FinanceChart transactions={transactionHistory} />
        </div>
      </div>
    </div>
  );
}

export default Wallet;
