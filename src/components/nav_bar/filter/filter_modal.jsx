import { FaTimes, FaCheck, FaTimesCircle } from "react-icons/fa";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LeafImg from "../../../assets/leaflog.svg";

export default function FilterModal({ initialFilters, onApply, onClose }) {
  const [tempFilters, setTempFilters] = useState(initialFilters);

  const handleChange = (label, value) => {
    if (label === "Cost") {
      setTempFilters((prev) => ({ ...prev, [label]: Number(value) }));
    } else {
      setTempFilters((prev) => ({ ...prev, [label]: value }));
    }
  };

  const handleClear = () => {
    setTempFilters({
      Name: "",
      Benefit: "",
      Description: "",
      Location: "",
      Cost: 0,
    });
  };

  const handleApply = () => {
    const cleanedFilters = {
      Name: tempFilters.Name || "",
      Benefit: tempFilters.Benefit || "",
      Description: tempFilters.Description || "",
      Location: tempFilters.Location || "",
      Cost: Number(tempFilters.Cost) || 0,
    };

    onApply(cleanedFilters);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="fixed z-50 top-6 right-5 bg-white rounded-2xl shadow-xl border border-gray-100 w-96 p-6"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          <FaTimes size={16} />
        </button>

        {/* Leaf Image + Animation Of The Leaf*/}
        <motion.img
          src={LeafImg}
          alt="Leaf Icon"
          initial={{ rotate: -20, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-10 h-10 object-contain mb-4 mx-auto"
        />

        {/* Filter Rows + Animation for each row */}
        <div className="space-y-3">
          {["Name", "Benefit", "Description", "Location"].map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="flex items-center justify-between"
            >
              <label className="text-sm font-medium text-gray-700 w-24">
                {label}:
              </label>
              <input
                type="text"
                value={tempFilters[label]}
                onChange={(e) => handleChange(label, e.target.value)}
                placeholder={`Enter ${label}`}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-1 text-sm"
              />
            </motion.div>
          ))}

          {/* Cost Range Filter + Also animation of it */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col"
          >
            <label className="text-sm font-medium text-gray-700 mb-1">
              Cost:
            </label>
            <input
              type="range"
              min="0"
              max="500"
              value={tempFilters.Cost}
              onChange={(e) => handleChange("Cost", e.target.value)}
              className="w-full"
            />
            <span className="text-sm text-gray-600 mt-1">
              Max Cost (USD): ${tempFilters.Cost}
            </span>
          </motion.div>

          {/* Apply and Clear Buttons  w/ Animation too*/}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 flex justify-between"
          >
            <button
              onClick={handleClear}
              className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              <FaTimesCircle className="mr-2" /> Clear
            </button>

            <button
              onClick={handleApply}
              className="flex items-center px-3 py-2 bg-blue-600 text-black rounded-lg hover:bg-blue-700 transition"
            >
              <FaCheck className="mr-2" /> Apply
            </button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
