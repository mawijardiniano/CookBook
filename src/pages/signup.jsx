import React, { useState } from "react";
import LandingLogo from "../assets/landingLOGO.jpg";
import { Input } from "@/components/ui/input";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const SIGNUP_API = `${import.meta.env.VITE_SIGNUP_API}`;
  const GOOGLE_LOGIN = import.meta.env.VITE_GOOGLE_LOGIN;

  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
  };

  const handleLoginSuccess = async (response) => {
    try {
      const { data } = await axios.post(GOOGLE_LOGIN, {
        token: response.credential,
      });
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("googleUser", JSON.stringify(data));
      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoginFailure = (error) => {
    console.error(error);
    alert("Google Login failed. Please try again.");
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post(SIGNUP_API, { name, email, password });
      console.log(response);
      navigate("/");
    } catch (error) {}
  };

  const handleLogin = () => {
    navigate("/");
  };

  return (
    <div className="h-screen flex flex-col-reverse md:flex-row  bg-white">
      <div className="flex items-center justify-center md:w-1/2 w-full p-4 md:p-0">
        <div className="w-full max-w-md space-y-6">
          <p className=" text-3xl md:text-4xl font-bold">Welcome to CookBook</p>
          <div className="space-y-1">
            <Input
              type="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange("name")}
              className="w-full border border-slate-300 p-2 rounded focus:outline-none focus:ring focus:ring-black"
            />
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange("email")}
              className="w-full border border-slate-300 p-2 rounded focus:outline-none focus:ring focus:ring-black"
            />
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange("password")}
              className="w-full border border-slate-300 p-2 rounded focus:outline-none focus:ring focus:ring-black"
            />
          </div>

          <button
            onClick={handleSignup}
            className="bg-black text-white text-sm font-medium px-2 py-2 w-full rounded-md"
          >
            Signup
          </button>
          <button className="flex w-full items-center justify-center text-sm py-2">
            Already have an account?
            <span className="font-medium ml-2" onClick={handleLogin}>
              Login
            </span>
          </button>
          <div className="flex flex-row items-center">
            <div className="border-t-2 border-gray-200 flex-1"></div>
            <p className="mx-4">or</p>
            <div className="border-t-2 border-gray-200 flex-1"></div>
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
      <div className="flex items-center justify-center md:w-1/2 w-full p-4 md:p-0">
        <img
          src={LandingLogo}
          alt="Landing Logo"
          className="w-2/3 md:w-full max-w-xs md:max-w-md"
        />
      </div>
    </div>
  );
};

export default Signup;
