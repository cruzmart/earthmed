import { useState } from "react";
import LeafImg from "../../assets/leaflog.svg";
import { FaFilter, FaBars, FaHome, FaUser, FaHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

/**
 * NavBar Component
 *
 * Displays the top navigation bar with logo, hamburger menu, welcome message,
 * filter button, and navigation options (Home, Login/Sign Out, Favorites).
 * Uses Framer Motion for animations.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the filter modal is open (to blur navbar)
 * @param {Function} props.setIsOpen - Function to open/close the filter modal
 * @param {Object|null} props.user - Logged-in user object or null if guest
 * @param {Function} props.onLoginClick - Callback for login button
 * @param {Function} props.onSignOut - Callback for sign out button
 * @param {Function} props.onNavigate - Callback for page navigation ("home" | "favorites")
 * @returns {JSX.Element} The navigation bar
 */
export default function NavBar({
  isOpen,
  setIsOpen,
  user,
  onLoginClick,
  onSignOut,
  onNavigate,
}) {
  // Local state to track hamburger menu open/close
  const [menuOpen, setMenuOpen] = useState(false);

  // Classes for the navbar container, includes blur effect if filter modal is open
  const navClasses = `${isOpen ? "blur-sm pointer-events-none" : ""} 
    fixed top-0 left-0 right-0 z-40 
    bg-gradient-to-r from-lime-100 via-emerald-100 to-lime-200 
    shadow-md rounded-b-2xl`;

  // Framer Motion animation variants for menu items
  const itemVariants = {
    hidden: { scale: 0, opacity: 0, y: 20 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08, // stagger items
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    }),
    exit: { scale: 0, opacity: 0, y: 20, transition: { duration: 0.15 } },
  };

  return (
    <nav className={navClasses}>
      <div className="relative h-20 flex items-center justify-center px-6">
        {/* Welcome message */}
        {user && (
          <div className="absolute left-14 top-1 text-emerald-800 font-semibold">
            Welcome {user.firstName} {user.lastName}!
          </div>
        )}

        {/* Left side: Hamburger menu */}
        <div className="absolute left-4 flex items-center">
          <div className="relative">
            {/* Hamburger icon with animation */}
            <motion.div
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              className="p-2 rounded-full bg-white shadow hover:bg-emerald-50 cursor-pointer"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <FaBars className="w-6 h-6 text-emerald-700" />
            </motion.div>

            {/* Dropdown menu */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-12 left-0 bg-white shadow-lg rounded-xl p-3 flex flex-col gap-3"
                >
                  {/* Home button */}
                  <motion.button
                    custom={0}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={() => {
                      onNavigate("home"); // navigate to home page
                      setMenuOpen(false); // close menu
                    }}
                    className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition text-sm"
                  >
                    <FaHome /> Home
                  </motion.button>

                  {/* Login or Sign Out button depending on user state */}
                  {user ? (
                    <motion.button
                      custom={1}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      onClick={onSignOut}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 transition text-sm"
                    >
                      <FaUser /> Sign Out
                    </motion.button>
                  ) : (
                    <motion.button
                      custom={1}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      onClick={onLoginClick}
                      className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition text-sm"
                    >
                      <FaUser /> Login
                    </motion.button>
                  )}

                  {/* Favorites button (only for logged-in users) */}
                  {user && (
                    <motion.button
                      custom={2}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      onClick={() => {
                        onNavigate("favorites"); // navigate to favorites page
                        setMenuOpen(false); // close menu
                      }}
                      className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition text-sm"
                    >
                      <FaHeart /> Favorites
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Center logo */}
        <div className="flex items-center gap-2">
          <img src={LeafImg} alt="Leaf" className="w-7 h-7 object-contain" />
          <span className="text-2xl font-bold text-emerald-900">EarthMed</span>
        </div>

        {/* Right side: Filter button */}
        <div className="absolute right-6 flex items-center">
          <motion.div
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-white shadow hover:bg-emerald-50 cursor-pointer"
            onClick={() => setIsOpen(true)} // open filter modal
          >
            <FaFilter className="w-5 h-5 text-emerald-700" />
          </motion.div>
        </div>
      </div>
    </nav>
  );
}
