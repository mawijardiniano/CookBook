import React, { useState } from "react";
import LandingLogo from "../assets/landingLOGO.jpg";
import { Input } from "@/components/ui/input";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const SIGNUP_API = `${import.meta.env.VITE_SIGNUP_API}`;

  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
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
    <div className="w-90 h-screen flex flex-row items-center bg-white">
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="p-6">
          <p className="text-4xl font-bold">Welcome to CookBook</p>
          <div className="py-6 space-y-1">
            <Input
              type="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange('name')}
              className="border focus:border-black focus:outline-none border-slate-200 "
            />
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange('email')}
              className="border focus:border-black focus:outline-none border-slate-200 "
            />
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange('password')}
              className="border border-slate-200 focus:border-black focus:outline-none"
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
          <div className="py-6">
            <button className="bg-black text-white text-sm font-medium px-2 py-2 w-full rounded-md flex flex-row items-center justify-center">
              Continue with
              <span className="ml-2">
                <FaGoogle size={16} />
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center w-1/2">
        <img src={LandingLogo} />
      </div>
    </div>
  );
};

export default Signup;
