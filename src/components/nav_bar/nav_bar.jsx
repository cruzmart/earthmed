import { useState } from "react";
import LeafImg from "../../assets/leaflog.svg";
import { FaFilter, FaBars, FaHome, FaUser, FaHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function NavBar({ isOpen, setIsOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navClasses = `${isOpen ? "blur-sm pointer-events-none" : ""} 
    fixed top-0 left-0 right-0 z-40 
    bg-gradient-to-r from-lime-100 via-emerald-100 to-lime-200 
    shadow-md rounded-b-2xl`;

  // Animation variants for bubble buttons
  const itemVariants = {
    hidden: { scale: 0, opacity: 0, y: 20 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, type: "spring", stiffness: 300, damping: 15 },
    }),
    exit: { scale: 0, opacity: 0, y: 20, transition: { duration: 0.15 } },
  };

  return (
    <nav className={navClasses}>
      <div className="relative h-20 flex items-center justify-center px-6">
        {/* Left: Hamburger Menu */}
        <div className="absolute left-4 flex items-center">
          <div className="relative">
           {/* When you hover to the button have a little zoom in animation*/}
            <motion.div
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              className="p-2 rounded-full bg-white shadow hover:bg-emerald-50 cursor-pointer"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <FaBars className="w-6 h-6 text-emerald-700" />
            </motion.div>

            {/* Bubble Menu*/}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-12 left-0 bg-white shadow-lg rounded-xl p-3 flex flex-col gap-3"
                >
                  {[
                    { icon: <FaHome />, label: "Home" },
                    { icon: <FaUser />, label: "Login" },
                    { icon: <FaHeart />, label: "Favorites" },
                  ].map((item, i) => (
                    <motion.button
                      key={item.label}
                      custom={i}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 hover:translate-x-1 transition-transform text-sm"
                    >
                      {item.icon} {item.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Center: Logo & Title */}
        <div className="flex items-center gap-2">
          <img src={LeafImg} alt="Leaf" className="w-7 h-7 object-contain" />
          <span className="text-2xl font-bold text-emerald-900">EarthMed</span>
        </div>

        {/* Right: Filter Icon*/}
        <div className="absolute right-6 flex items-center">
         {/*Add a little animation when the mouse gets close to it*/}
          <motion.div
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-white shadow hover:bg-emerald-50 cursor-pointer"
            onClick={() => setIsOpen(true)}>
            <FaFilter className="w-5 h-5 text-emerald-700" />
          </motion.div>
        </div>
      </div>
    </nav>
  );
}
