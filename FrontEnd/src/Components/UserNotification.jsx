import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";

const NotificationDropdown = ({ notifications }) => {
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Check if there are any unread notifications
  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.isRead
  );

  const handleNotificationClick = async (notificationId) => {
    try {
      await axios.put(`http://localhost:3000/n/${notificationId}/read`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // ✅ Function to get Icon & Color based on notification type
  const getNotificationIcon = (type) => {
    const icons = {
      message: {
        icon: <i className="ri-mail-fill text-white text-[10px]"></i>,
        bg: "bg-blue-500",
      },
      follow: {
        icon: <i className="ri-user-add-fill text-white text-[10px]"></i>,
        bg: "bg-green-500",
      },
      like: {
        icon: <i className="ri-heart-fill text-white text-[10px]"></i>,
        bg: "bg-red-500",
      },
      comment: {
        icon: <i className="ri-chat-3-fill text-white text-[10px]"></i>,
        bg: "bg-purple-500",
      },
      mention: {
        icon: <i className="ri-at-line text-white text-[10px]"></i>,
        bg: "bg-yellow-500",
      },
      withdraw: {
        icon: (
          <i className="ri-arrow-right-down-fill text-white text-[10px]"></i>
        ),
        bg: "bg-gray-500",
      },
      deposit: {
        icon: <i className="ri-bank-fill text-white text-[10px]"></i>,
        bg: "bg-green-600",
      },
      transfer: {
        icon: (
          <i className="ri-arrow-left-right-line text-white text-[10px]"></i>
        ),
        bg: "bg-blue-600",
      },
      other: {
        icon: <i className="ri-information-fill text-white text-[10px]"></i>,
        bg: "bg-gray-400",
      },
    };
    return icons[type] || icons.other;
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* 🔔 Notification Button */}
      <button
        className="relative inline-flex items-center bg-gray-800 px-4 h-[60px] rounded-xl text-gray-400 hover:text-white focus:outline-none"
        type="button"
      >
        <i className="ri-notification-4-fill text-2xl relative"></i>

        {/* 🔴 Red Dot (If Unread Notifications Exist) */}
        {hasUnreadNotifications && (
          <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 border-2 border-gray-900 rounded-full"></div>
        )}
      </button>

      {/* 🔽 Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-gray-900 text-white rounded-2xl shadow-lg z-50 overflow-hidden">
          <div className="block px-4 py-3 font-medium text-center bg-gray-700">
            Notifications
          </div>

          {/* 🔥 Scrollable Notifications List */}
          <div className="divide-y divide-gray-700 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No new notifications
              </div>
            ) : (
              notifications.map((notification, index) => {
                const { icon, bg } = getNotificationIcon(notification.type);
                return (
                  <div className="flex" key={index}>
                    <div>
                      <Link
                        to={notification.link}
                        className="flex px-4 py-3 hover:bg-gray-900 transition"
                        onClick={() =>
                          handleNotificationClick(notification._id)
                        }
                      >
                        <div className="shrink-0 relative">
                          <Link to={`/profile/${notification.sender.username}`}>
                            <img
                              className="rounded-full w-11 h-11"
                              src={notification.sender.image}
                              alt="Notification"
                            />
                          </Link>
                          {/* ✅ ICON Dynamic Based on Type */}
                          <div
                            className={`absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 rounded-full ${bg}`}
                          >
                            {icon}
                          </div>
                        </div>
                        <div className="w-full ps-3">
                          <div className="text-gray-300 text-sm mb-1.5">
                            {notification.message}
                            {!notification.isRead && (
                              <i className="ri-circle-fill text-red-500 text-[10px] ml-1"></i>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
                              { addSuffix: true }
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <a
            href="#"
            className="block py-3 text-sm font-medium text-center bg-gray-700 hover:bg-gray-700 transition"
          >
            <div className="inline-flex items-center">
              <svg
                className="w-4 h-4 me-2 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 14"
              >
                <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
              </svg>
              View all
            </div>
          </a>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
