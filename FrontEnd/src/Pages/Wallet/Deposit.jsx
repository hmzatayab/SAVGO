import React, { useState, useContext } from "react";
import { useNotification } from "../../context/NotificationContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../../context/UserContext";
import AnimationWrapper from "../../Components/Animations";

export const DepositPage = () => {
  const [amount, setAmount] = useState(""); // State for deposit amount
  const { showNotification } = useNotification();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleDeposit = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      showNotification("Please enter a valid amount to deposit.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/wallet/deposit",
        { amount },
        { headers: { Authorization: `Bearer ${token}` } },
        { withCredentials: true }
      );

      if (response.status === 200) {
        showNotification("Deposit Successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Deposit failed");
    }

    setAmount(""); // Reset the input field
  };

  return (
    <AnimationWrapper
      initial={{ opacity: 0, scale: 0.5 }}
      exit={{ opacity: 0, scale: 0.5 }}
    >
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="max-w-md w-full lg:bg-gray-900 text-white p-8 rounded-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">Deposit Funds</h1>

          <form onSubmit={handleDeposit} className="space-y-4 mb-4">
            {/* Amount Input */}
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 outline-none placeholder-gray-400 transition-all duration-300"
            />

            {/* Submit Button */}
            <input
              type="submit"
              value="Deposit"
              className="w-full py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 text-white font-bold rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105"
            />
          </form>

          <h6 className="my-6 text-center">
            Want to withdraw funds?
            <Link to="/withdraw" className="font-bold text-blue-500 ml-1">
              Withdraw here
            </Link>
          </h6>

          <p className="text-center">
            <Link to="/dashboard" className="text-blue-500 font-bold">
              Go Back to Dashboard
            </Link>
          </p>
        </div>
      </div>
    </AnimationWrapper>
  );
};
