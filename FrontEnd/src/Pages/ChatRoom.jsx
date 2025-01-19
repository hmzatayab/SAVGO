import React, { useState } from "react";
import { Link } from "react-router-dom";

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "Bonnie Green",
      time: "11:46",
      text: "That's awesome. I think our users will really appreciate the improvements.",
      status: "Delivered",
    },
    {
      id: 2,
      user: "You",
      time: "11:50",
      text: "Thanks! Let me know if you have any more suggestions.",
      status: "Read",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const users = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        user: "You",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: newMessage,
        status: "Sent",
      },
    ]);
    setNewMessage("");
  };

  return (
    <div className="flex h-screen bg-gray-800">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-900 border-r border-gray-700">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-white">Users</h2>
        </div>
        <div className="p-4 bg-gray-900 flex items-center gap-2 rounded-lg">
          {/* Search Icon */}

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow p-2 bg-gray-800 text-white rounded-lg outline-none placeholder-gray-500"
          />

          {/* Clear Button */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-gray-400 hover:text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <div></div>
        </div>

        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-700 ${
                selectedUser?.id === user.id ? "bg-gray-700" : ""
              } text-white`}
            >
              {/* Profile Image with Online/Offline Badge */}
              <div className="relative">
                <img
                  className="w-10 h-10 rounded-full"
                  src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  alt={`${user.name}'s Avatar`}
                />
                <span
                  className={`absolute top-0 left-7 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white dark:border-gray-800 ${
                    user.isOnline ? "bg-green-400" : "bg-gray-400"
                  }`}
                ></span>
              </div>

              {/* User Name */}
              <div class="font-medium dark:text-white">
                <div>Jese Leos</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  Joined in August 2014
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-grow">
        {/* Top Bar */}
        <div className="p-4 bg-gray-900 flex items-center">
          <Link
            to={"/"}
            className="mr-4 p-2 bg-gray-700 text-white rounded-full"
            onClick={() => setSelectedUser(null)}
          >
            Back
          </Link>
          <h2 className="text-lg font-semibold text-white">
            {selectedUser ? selectedUser.name : "Select a user"}
          </h2>
        </div>

        {/* Chat Messages */}
        <div className="flex-grow p-4 overflow-y-auto bg-gray-800">
          {selectedUser ? (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2.5 mb-4 ${
                  message.user === "You" ? "justify-end" : ""
                }`}
              >
                {message.user !== "You" && (
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    alt="User Avatar"
                  />
                )}
                <div
                  className={`flex flex-col gap-1 max-w-[320px] ${
                    message.user === "You" ? "bg-blue-600" : "bg-gray-700"
                  } p-4 rounded-e-xl rounded-es-xl`}
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold text-white">
                      {message.user}
                    </span>
                    <span className="text-sm font-normal text-gray-400">
                      {message.time}
                    </span>
                  </div>
                  <p className="text-sm font-normal text-white">
                    {message.text}
                  </p>
                  <span className="text-sm font-normal text-gray-400">
                    {message.status}
                  </span>
                </div>
                {message.user === "You" && (
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    alt="Your Avatar"
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400">
              Please select a user to start chatting.
            </p>
          )}
        </div>

        {/* Typing Input */}
        {selectedUser && (
          <div className="p-4 bg-gray-900 flex items-center gap-3">
            {/* Emoji/Icon Button */}
            <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 text-gray-400 hover:text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.364 5.636a4.5 4.5 0 00-6.364 0L4.636 13a4.5 4.5 0 106.364 6.364L16.95 13.414a2.5 2.5 0 10-3.536-3.536l-5.657 5.657"
                />
              </svg>
            </button>

            {/* Message Input Field */}
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full p-3 bg-gray-800 text-white rounded-full pl-10 outline-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />
              {/* Icon Inside Input */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 20.25c4.97 0 9-4.03 9-9m-9 9c-4.97 0-9-4.03-9-9m9 9V12m0 0L8.25 8.25m3.75 3.75L15.75 8.25"
                />
              </svg>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6 text-white transform rotate-180"
              >
                <path d="M2 12l19.5-9-4.5 9 4.5 9z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
