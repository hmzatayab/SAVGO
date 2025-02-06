import React, { useState, useContext } from "react";
import { useNotification } from "../../context/NotificationContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../../context/UserContext";
import AnimationWrapper from "../../Components/Animations";

export const WithdrawPage = () => {
  const [amount, setAmount] = useState(""); // State for withdrawal amount
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleWithdraw = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      showNotification("Please enter a valid amount to withdraw.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/wallet/withdraw",
        { amount },
        { headers: { Authorization: `Bearer ${token}` } },
        { withCredentials: true }
      );

      if (response.status === 200) {
        showNotification("Withdrawal Successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Withdrawal failed");
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
          <h1 className="text-3xl font-bold mb-6 text-center">Withdraw Funds</h1>

          <form onSubmit={handleWithdraw} className="space-y-4 mb-4">
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
              value="Withdraw"
              className="w-full py-2 bg-gradient-to-r from-red-500 to-yellow-500 hover:from-yellow-500 hover:to-red-500 text-white font-bold rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105"
            />
          </form>

          <h6 className="my-6 text-center">
            Want to deposit funds? 
            <Link to="/deposit" className="font-bold text-blue-500">
              Deposit here
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
