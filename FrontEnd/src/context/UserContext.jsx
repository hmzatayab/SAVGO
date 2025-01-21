import React, { createContext, useState, useEffect } from "react";

export const UserDataContext = createContext();

export default function UserContext({ children }) {
  const [user, setUser] = useState(() => {
    // Get user from localStorage and parse it
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // useEffect(() => {
  //   // Update localStorage whenever user changes
  //   if (user) {
  //     localStorage.setItem("user", JSON.stringify(user));
  //   } else {
  //     localStorage.removeItem("user");
  //   }
  // }, [user]);

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
}
