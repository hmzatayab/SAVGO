import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import PasswordStrengthMeter from "../Components/PasswordMeter";
import AnimationWrapper from "../Components/Animations";

const RegisterPage = () => {
  const [username, setUsername] = React.useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Image, setImage] = useState("");
  const [errors, setErrors] = useState({});
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const { user } = useContext(UserDataContext);

  const validateInputs = () => {
    let errors = {};
    if (!username.trim() || username.length < 4 || username.length > 20) {
      errors.username = "Username must be between 3-20 characters";
    }
    if (!name.trim() || name.length < 5 || name.length > 50) {
      errors.name = "Name must be between 3-30 characters";
    }
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      errors.email = "Enter a valid email address";
    }
    if (
      !password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$/)
    ) {
      errors.password =
        "Password must be 8-20 characters with a number & special character";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      showNotification(Object.values(errors).join("\n"));
      return;
    }
    try {
      const newUser = {
        username,
        name,
        email,
        password,
        image: Image,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/register`,
        newUser
      );

      if (response.status === 201) {
        setTimeout(() => {
          showNotification("User Registered Successfully!");
        }, 1000);
        navigate("/");
      } else {
        showNotification("Unexpected response format");
      }

      setEmail("");
      setName("");
      setPassword("");
      setUsername("");
      setImage("");
    } catch (error) {
      showNotification("An error occurred during registration.");
    }
  };

  return (
    <AnimationWrapper initial={{ opacity: 0, scale: 0.5 }}>
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="max-w-md w-full lg:bg-gray-900 text-white p-8 rounded-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">Create User</h1>
          <form onSubmit={handleRegister} className="space-y-4">
            {["username", "name", "email", "password"].map((field) => (
              <input
                key={field}
                type={field === "password" ? "password" : "text"}
                value={eval(field)}
                onChange={(e) =>
                  eval(`set${field.charAt(0).toUpperCase() + field.slice(1)}`)(
                    e.target.value
                  )
                }
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className={`w-full px-4 py-2 bg-gray-800 text-white rounded-lg outline-none placeholder-gray-400 transition-all duration-300 ${
                  errors[field]
                    ? "border-2 border-red-500"
                    : "focus:ring-4 focus:ring-indigo-500"
                }`}
              />
            ))}
            <PasswordStrengthMeter password={password} />
            <input
              type="submit"
              value="Create"
              className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105"
            />
          </form>
          <h6 className="my-6 text-center">
            Already have an account?
            <Link
              to="/login"
              className="font-bold text-indigo-500 hover:underline"
            >
              {" "}
              Login here
            </Link>
            <p className="text-blue-500">
              <Link to="/" className="font-bold hover:underline">
                Go Back
              </Link>
            </p>
          </h6>
        </div>
      </div>
    </AnimationWrapper>
  );
};

export default RegisterPage;
