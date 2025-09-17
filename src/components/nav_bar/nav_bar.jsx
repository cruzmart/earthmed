import { useState } from "react";
import LeafImg from "../../assets/leaflog.svg";
import { FaFilter, FaBars, FaHome, FaUser, FaHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function NavBar({ isOpen, setIsOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navClasses = `${isOpen ? "blur-sm pointer-events-none" : ""} fixed top-0 left-0 right-0 z-40 bg-lime-100`;

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
      <div className="relative h-20 flex items-center justify-center px-4">
        {/* Left: Hamburger Menu */}
        <div className="absolute left-0 flex items-center gap-2">
          <div className="relative">
            {/* Hamburger Button */}
            <FaBars
              className="w-7 h-7 text-black cursor-pointer hover:text-green-600 transition-colors"
              onClick={() => setMenuOpen((prev) => !prev)}
            />

            {/* Bubble Menu */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-10 left-0 bg-white shadow-md rounded-xl p-3 flex flex-col gap-3"
                >
                  {/*These are what is inside the hamburger button. motion.button allows the creation and animation of the bubble*/}
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
                      className="flex items-center gap-2 text-gray-700 hover:text-green-600 text-sm"
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
          <img src={LeafImg} alt="Leaf" className="w-6 h-6 object-contain" />
          <span className="text-xl font-bold text-gray-800">EarthMed</span>
        </div>

        {/* Right: FilterBox Position */}
        <div className="absolute right-0 flex items-center p-10">
          <FaFilter
            className="w-6 h-6 text-black hover:text-green-600 transition-colors"
            onClick={() => setIsOpen(true)}
          />
        </div>
      </div>
    </nav>
  );
}
