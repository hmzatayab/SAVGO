import React, { useState } from "react";

export const LoginPage = () => {
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    // Add your login logic here
    if (!username || !password) {
      setErrorMessage("Both fields are required!");
      return;
    }

    // Simulate successful login (replace with API logic)
    setErrorMessage(""); // Clear errors
    alert(`Welcome, ${username}!`);
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-900 text-white p-8 rounded-lg shadow-lg">
        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-6 text-center">Login User</h1>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 mb-4">
          {/* Username Input */}
          <input
            type="text"
            placeholder="Enter your Username"
            className="w-full px-4 py-2 bg-zinc-700 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 outline-none placeholder-gray-400 transition-all duration-300"
            name="username"
          />

          {/* Password Input */}
          <input
            type="password"
            placeholder="Enter your Password"
            className="w-full px-4 py-2 bg-zinc-700 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 outline-none placeholder-gray-400 transition-all duration-300"
            name="password"
          />

          {/* Submit Button */}
          <input
            type="submit"
            value="Login"
            className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105"
          />
        </form>

        {/* Error Message */}
        {errorMessage && (
          <div
            className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-300"
            role="alert"
          >
            <svg
              className="flex-shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Error</span>
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Registration Link */}
        <h6 className="my-6 text-center">
          Don't have an account?
          <a className="font-bold text-blue-500" href="/register">
            {" "}
            Register here
          </a>
        </h6>

        {/* Back Link */}
        <p className="text-center">
          <a href="/" className="text-blue-500 font-bold">
            Go Back
          </a>
        </p>
      </div>
    </div>
  );
};


