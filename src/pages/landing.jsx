import React, { useState } from "react";
import LandingLogo from "../assets/landingLOGO.jpg";
import { Input } from "@/components/ui/input";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import GoogleLoginButton from "../components/googleLogin";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
export default function Landing() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const LOGIN_API = "http://localhost:5000/api/user/login";
const GOOGLE_LOGIN = "http://localhost:5000/api/user/google-login"
  const navigate = useNavigate();


  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };


  const handleLogin = async () => {
    try {
      const response = await axios.post(LOGIN_API, { email, password });
  
      console.log('Response from backend:', response.data);
  
      if (response.data && response.data.data) {
        const { token, userId, name, email } = response.data.data;

        console.log('Received token:', token);
        console.log('Received user data:', { userId, name, email });
  
        if (!token || !userId) {
          console.error('Token or user data is missing');
          return;
        }

        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify({ userId, name, email }));
  
        console.log("Login successful, token and user data stored:", { token, user: { userId, name, email } });
  
        navigate("/home");
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
    }
  };
  
  const createAccount = () => {
    navigate("/signup");
  }

  const handleLoginSuccess = async (response) => {
    try {
      const token = response.credential;  
  
      const { data } = await axios.post(GOOGLE_LOGIN, {
        token: token, 
      });
  
      localStorage.setItem('authToken', data.token);
 // Storing the user data in localStorage
localStorage.setItem('googleUser', JSON.stringify({  name: data.name, email: data.email,  _id: data._id }));

// Retrieving the user data from localStorage
const googleUser = JSON.parse(localStorage.getItem('googleUser'));

// Log the retrieved user data
console.log(googleUser);

      navigate("/home");
      
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };
  
  const handleLoginFailure = (error) => {
    console.error('Login Failed:', error);
    alert('Login failed. Please try again.');
  };
  

  return (
    <div className="w-90 h-screen flex flex-row items-center bg-white">
      <div className="flex items-center justify-center w-1/2">
        <img src={LandingLogo} />
      </div>
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="p-6">
          <p className="text-4xl font-bold">Welcome to CookBook</p>
          <div className="py-6 space-y-1">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className="border focus:border-black focus:outline-none border-slate-200 "
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className="border border-slate-200 focus:border-black focus:outline-none"
            />
          </div>

          <button
            onClick={handleLogin}
            className="bg-black text-white text-sm font-medium px-2 py-2 w-full rounded-md"
          >
            Login
          </button>
          <button onClick={createAccount} className="flex justify-end w-full items-end text-sm py-2">
            Create Account
          </button>
          <div className="flex flex-row items-center">
            <div className="border-t-2 border-gray-200 flex-1"></div>
            <p className="mx-4">or</p>
            <div className="border-t-2 border-gray-200 flex-1"></div>
          </div>
          <div className="py-6">
          <GoogleOAuthProvider clientId="144695496725-qsqbpkfb3nhr5f844jkf05sjpt1u17mc.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginFailure}
          theme="filled_blue"
          text="Sign in with Google"
          width="300"
        />
      </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
