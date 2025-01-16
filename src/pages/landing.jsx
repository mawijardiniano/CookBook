import React, { useState } from "react";
import LandingLogo from "../assets/landingLOGO.jpg";
import { Input } from "@/components/ui/input";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GoogleLoginButton from "../components/googleLogin";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function Landing() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const LOGIN_API = import.meta.env.VITE_LOGIN_API;
  const GOOGLE_LOGIN = import.meta.env.VITE_GOOGLE_LOGIN;
  const navigate = useNavigate();

  const handleEmailChange = (value) => setEmail(value);
  const handlePasswordChange = (value) => setPassword(value);

  const handleLogin = async () => {
    try {
      const response = await axios.post(LOGIN_API, { email, password });

      console.log("Response from backend:", response.data);

      if (response.data && response.data.data) {
        const { token, userId, name, email } = response.data.data;
        if (!token || !userId) {
          console.error("Token or user data is missing");
          return;
        }

        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify({ userId, name, email }));

        console.log("Login successful, token and user data stored:", {
          token,
          user: { userId, name, email },
        });

        navigate("/home");
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
    }
  };

  const createAccount = () => {
    navigate("/signup");
  };

  const handleLoginSuccess = async (response) => {
    try {
      const token = response.credential;

      const { data } = await axios.post(GOOGLE_LOGIN, {
        token: token,
      });

      localStorage.setItem("authToken", data.token);
      localStorage.setItem(
        "googleUser",
        JSON.stringify({ name: data.name, email: data.email, _id: data._id })
      );

      const googleUser = JSON.parse(localStorage.getItem("googleUser"));

      console.log(googleUser);

      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleLoginFailure = (error) => {
    console.error("Login Failed:", error);
    alert("Login failed. Please try again.");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      <div className="flex items-center justify-center md:w-1/2 w-full p-4 md:p-0">
        <img
          src={LandingLogo}
          alt="Landing Logo"
          className="w-2/3 md:w-full max-w-xs md:max-w-md"
        />
      </div>

      <div className="flex items-center justify-center md:w-1/2 w-full p-4 md:p-12">
        <div className="w-full max-w-md space-y-6">
          <p className="text-3xl md:text-4xl font-bold">
            Welcome to CookBook
          </p>

          <div className="space-y-1">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className="w-full border border-slate-300 p-2 rounded focus:outline-none focus:ring focus:ring-black"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className="w-full border border-slate-300 p-2 rounded focus:outline-none focus:ring focus:ring-black"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Login
          </button>
          <button
            onClick={createAccount}
            className="w-full text-sm text-gray-600 mt-2 hover:underline flex justify-end items-end"
          >
            Create Account
          </button>

          <div className="flex items-center mt-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <GoogleOAuthProvider clientId="144695496725-qsqbpkfb3nhr5f844jkf05sjpt1u17mc.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginFailure}
              theme="filled_blue"
              text="Continue with Google"
            />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
}
