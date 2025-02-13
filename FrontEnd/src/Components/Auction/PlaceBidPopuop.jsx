// Standalone PlaceBidPopup Component
import { useState } from 'react';
import { useNotification } from "../../context/NotificationContext";

const PlaceBidPopup = ({ isOpen, onClose, handleBid, amount, setAmount, balance }) => {
    const { showNotification } = useNotification();
    const token = localStorage.getItem("token");
    
  if (!isOpen) return null;
    
  const bidPlace = (e) => {
    e.preventDefault();
    if (amount <= 0) {
        showNotification('Please enter a valid bid amount.');
      return;
    }

    if (amount > balance) {
        showNotification('Insufficient balance for bid.');
      return;
    }

    if (!token) {
        showNotification('You need to be logged in to perform this action.');
      return;
    }

    handleBid(amount);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="max-w-md w-full bg-gray-900 text-white p-8 rounded-lg shadow-lg relative">
        <h1 className="text-3xl font-bold mb-6 text-center">Place Bid</h1>
        <p className="text-center mb-4 text-lg font-semibold">Current Balance: ${balance}</p>
        <form onSubmit={handleBid} className="space-y-4 mb-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter bid amount"
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 outline-none placeholder-gray-400 transition-all duration-300"
            required
          />
          <input
            type="submit"
            onClick={bidPlace}
            value="Place Bid"
            className="w-full py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 text-white font-bold rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105"
          />
        </form>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-600 w-10 h-10 rounded-full"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default PlaceBidPopup;