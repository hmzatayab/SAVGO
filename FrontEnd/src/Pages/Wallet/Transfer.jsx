import React, { useState, useEffect, useContext } from "react";
import { useNotification } from "../../context/NotificationContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AnimationWrapper from "../../Components/Animations";
import { UserDataContext } from "../../context/UserContext";

export const TransferPage = () => {
  const [step, setStep] = useState(1); // To track the current step of the transfer
  const [amount, setAmount] = useState(""); // State for transfer amount
  const [recipient, setRecipient] = useState(""); // State for recipient username
  const [recipientUser, setRecipientUser] = useState(null); // Selected recipient user data
  const [userList, setUserList] = useState([]); // List of all users for search
  const { showNotification } = useNotification();
  const token = localStorage.getItem("token");
  const { user } = useContext(UserDataContext);
  const navigate = useNavigate();

  // Fetch list of users (excluding current user)
  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Exclude the current user
        const users = response.data.user.filter(
          (user) => user._id !== response.data.currentUserId
        );
        setUserList(users);
      } catch (error) {
        showNotification(
          error.response?.data?.message || "Failed to fetch users"
        );
      }
    };
    fetchUserList();
  }, [token]);

  // Handle recipient selection
  const handleRecipientSearch = (username) => {
    const selectedUser = userList.find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
    setRecipientUser(selectedUser); // Store selected user
  };

  // Handle Next button click (proceed to Step 2)
  const handleNext = () => {
    if (!recipientUser) {
      showNotification("Please select a valid recipient.");
      return;
    }
    if (recipientUser._id === user._id) {
      showNotification(
        "You cannot transfer to yourself. Please select another user."
      );
      return;
    }

    setStep(2); // Move to the next step
  };

  // Handle fund transfer
  const handleTransfer = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      showNotification("Please enter a valid amount to transfer.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/wallet/transfer",
        { amount, recipient: recipientUser._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        showNotification("Transfer Successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Transfer failed");
    }

    setAmount(""); // Reset the amount input
    setRecipient(""); // Reset recipient input
    setStep(1); // Go back to Step 1 if needed
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <AnimationWrapper
      initial={{ opacity: 0, scale: 0.5 }}
      exit={{ opacity: 0, scale: 0.5 }}
    >
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="max-w-md w-full lg:bg-gray-900 text-white p-8 rounded-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Transfer Funds
          </h1>

          {/* Step 1: Recipient Username Input */}
          {step === 1 && (
            <div>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="space-y-4 mb-4"
              >
                {/* Recipient Username Input */}
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => {
                    setRecipient(e.target.value);
                    handleRecipientSearch(e.target.value); // Search recipient by username
                  }}
                  placeholder="Enter recipient's username"
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 outline-none placeholder-gray-400 transition-all duration-300"
                />

                {/* Display the selected recipient (if available) */}
                {recipientUser && (
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <img
                      src={
                        recipientUser.image || "https://via.placeholder.com/50"
                      } // Use placeholder if no avatar is available
                      alt="Recipient Avatar"
                      className="rounded-full w-12 h-12"
                    />

                    {/* Username */}
                    <div>
                      <p className="font-bold">{recipientUser.username}</p>

                      {/* Followers count */}
                      <p className="text-sm text-gray-400">
                        Followers: {recipientUser.followers.length}
                      </p>
                    </div>

                    {/* Optional icon (if needed, such as a message or like icon) */}
                    <div className="text-xl text-blue-500">
                      {/* Example icon (can be replaced with any icon) */}
                      <i className="fas fa-user-friends"></i>{" "}
                      {/* Add FontAwesome or any icon library */}
                    </div>
                  </div>
                )}

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full py-2 bg-gradient-to-r from-blue-500 to-green-500 hover:from-green-500 hover:to-blue-500 text-white font-bold rounded-lg cursor-pointer transition-all duration-300"
                >
                  Next
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Transfer Amount and Avatars */}
          {step === 2 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                {/* Sender Avatar (logged-in user) */}
                <div className="flex items-center space-x-4">
                  <img
                    src={user.image} // Replace with logged-in user's avatar
                    alt="Sender Avatar"
                    className="rounded-full w-12 h-12"
                  />
                  <span className="text-white font-bold">Sender</span>
                </div>

                {/* Transfer Icon */}
                <div className="text-center text-2xl">➔</div>

                {/* Recipient Avatar */}
                <div className="flex items-center space-x-4">
                  {recipientUser ? (
                    <>
                      <img
                        src={
                          recipientUser.image ||
                          "https://via.placeholder.com/50"
                        } // Replace with recipient's avatar
                        alt="Recipient Avatar"
                        className="rounded-full w-12 h-12"
                      />
                      <span className="text-white font-bold">
                        {recipientUser.username}
                      </span>
                    </>
                  ) : (
                    <span className="text-white">Select recipient</span>
                  )}
                </div>
              </div>

              {/* Transfer Amount Input */}
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount to transfer"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 outline-none placeholder-gray-400 transition-all duration-300"
              />

              {/* Transfer Button */}
              <button
                type="submit"
                onClick={handleTransfer}
                className="w-full mt-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 hover:from-green-500 hover:to-blue-500 text-white font-bold rounded-lg cursor-pointer transition-all duration-300"
              >
                Transfer
              </button>
              <button
                type="submit"
                onClick={handleBack}
                className="w-full mt-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 hover:from-green-500 hover:to-blue-500 text-white font-bold rounded-lg cursor-pointer transition-all duration-300"
              >
                Back
              </button>
            </div>
          )}

          <h6 className="my-6 text-center">
            Want to deposit funds?
            <Link to="/deposit" className="font-bold text-blue-500 ml-1">
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
