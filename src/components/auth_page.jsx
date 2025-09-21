import { useState } from "react";
import { motion } from "framer-motion";

import LeafImg from "../assets/leaflog.svg";

/**
 * Authentication page component.
 *
 * Handles login, signup, and guest mode with smooth animations.
 *
 * @param {Object} props - Component props
 * @param {(user: object | null) => void} props.onAuthSuccess - Callback triggered on successful login, signup, or guest mode.
 * - Receives the user object when logged in or `null` when continuing as guest.
 * @returns {JSX.Element} The rendered authentication page.
 */
export default function AuthPage({ onAuthSuccess }) {
  /** Whether the user is in login mode (true) or signup mode (false). */
  const [isLogin, setIsLogin] = useState(true);

  /**
   * Form state for authentication.
   * @type {{ firstName: string, lastName: string, username: string, password: string }}
   */
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });

  /** Error message for failed authentication. */
  const [error, setError] = useState("");

  /**
   * Handle input field changes.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event.
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Handle form submission for login/signup.
   * @param {React.FormEvent<HTMLFormElement>} e - Form submission event.
   */
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

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      localStorage.setItem("user", data.user);
      onAuthSuccess?.(data.user); // pass user_id back up
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Handle guest login (no authentication).
   * Clears any stored user session and sets user to null.
   */
  const handleGuest = () => {
    localStorage.removeItem("user");
    onAuthSuccess?.(null);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-green-200 to-emerald-300">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <img src={LeafImg} alt="Leaf" className="w-14 h-14" />
          <h1 className="mt-3 text-3xl font-extrabold text-emerald-900">
            {isLogin ? "Welcome Back!" : "Join EarthMed"}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
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

          {/* Submit button */}
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
