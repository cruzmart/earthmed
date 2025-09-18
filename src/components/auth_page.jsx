import React, { useState } from "react";
import { motion } from "framer-motion";

import LeafImg from "../assets/leaflog.svg"
import { data } from "framer-motion/client";

export default function AuthPage({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ firstName: "", lastName: "", username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = isLogin ? "/api/login" : "/api/signup";
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      
      if (!response.ok) {throw new Error(data.error || "Something went wrong")};


      localStorage.setItem("user_id", data.user.id);
      onAuthSuccess?.(data.user.id); // pass userId back up
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGuest = () => {
    localStorage.removeItem("user_id"); // clear any user session
    onAuthSuccess?.(null); // guest mode
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <img src={LeafImg} alt="Leaf" className="w-12 h-12" />
          <h1 className="mt-2 text-2xl font-bold text-emerald-900">
            {isLogin ? "Welcome Back!" : "Join EarthMed"}
          </h1>
          <p className="text-sm text-gray-600">
            {isLogin
              ? "Log in to continue exploring plants."
              : "Sign up to save your favorites."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none"
                required
              />
            </>
          )}

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none"
            required
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* The submit button when you fill the info and click 'submit'*/}
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-emerald-600 text-black py-3 rounded-xl shadow-md hover:bg-emerald-700 transition"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </motion.button>
        </form>

        {/* Guest + Switch */}
        <div className="mt-6 flex flex-col items-center space-y-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleGuest}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl shadow hover:bg-gray-300 transition"
          >
            Continue as Guest
          </motion.button>

          <p className="text-sm text-gray-600">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
            <button
              className="text-emerald-700 font-semibold hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
