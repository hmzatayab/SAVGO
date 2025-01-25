import React, { createContext, useContext, useState } from "react";
import NotificationBar from "../Components/Notification";

// Create the Context
const NotificationContext = createContext();

// Create a Provider Component
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
    imageUrl: "",
  });

  // Function to show a notification
  const showNotification = (message, imageUrl = "") => {
    setNotification({ visible: true, message, imageUrl });
    setTimeout(() => {
      setNotification({ visible: false, message: "", imageUrl: "" });
    }, 4000); // Auto-hide after 4 seconds
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification.visible && (
        <NotificationBar
          message={notification.message}
          imageUrl={notification.imageUrl}
          onClose={() => setNotification({ visible: false })}
        />
      )}
    </NotificationContext.Provider>
  );
};

// Custom Hook for using the context
export const useNotification = () => useContext(NotificationContext);
