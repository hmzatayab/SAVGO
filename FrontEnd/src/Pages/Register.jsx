import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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

  const navigate = useNavigate();

  const { user } = useContext(UserDataContext);

  const handleRegister = async (e) => {
    e.preventDefault();

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
        console.log("User registered:", response.data);
        toast.success("User Register Successfully!");
        navigate("/");
        console.log(user);
      } else {
        throw new Error("Unexpected response format");
      }
      setEmail("");
      setName("");
      setPassword("");
      setUsername("");
      setImage("");
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      alert("An error occurred during registration.");
    }
  };

  return (
    <AnimationWrapper initial={{ opacity: 0, scale: 0.5,}}>
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <div className="max-w-md w-full lg:bg-gray-900 text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Create User</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Username Input */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 outline-none placeholder-gray-400 transition-all duration-300"
            name="username"
          />

          {/* Name Input */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 outline-none placeholder-gray-400 transition-all duration-300"
            name="name"
          />

          {/* Email Input */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 outline-none placeholder-gray-400 transition-all duration-300"
            name="email"
          />

          {/* Password Input */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 outline-none placeholder-gray-400 transition-all duration-300"
            name="password"
          />

          {/* Profile Image Input */}
          {/* <input
            type="text"
            value={Image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Enter your Profile Image URL"
            className="w-full px-4 py-2 bg-zinc-700 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 outline-none placeholder-gray-400 transition-all duration-300"
            name="image"
          /> */}
          {/* <p className='text-red-500 font-semibold mt-2'>error</p> */}
					<PasswordStrengthMeter password={password} />

          {/* Submit Button */}
          <input
            type="submit"
            value="Create"
            className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105"
          />
        </form>

        <h6 className="my-6 text-center">
          Already have an account?
          <Link
            to={"/login"}
            className="font-bold text-indigo-500 hover:underline"
          >
            {" "}
            Login here
          </Link>
          <p className="text-blue-500">
            <Link to={"/"} className="font-bold hover:underline">
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
