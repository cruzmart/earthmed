import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLeaf, FaSeedling, FaDollarSign, FaBook, FaGlobe } from "react-icons/fa";

/**
 * Default plant object used when no plant data is provided.
 * @typedef {Object} Plant
 * @property {string} name - Common name of the plant.
 * @property {string} scientificName - Scientific name of the plant.
 * @property {string} imageUrl - URL of the plant image.
 * @property {string} description - Description of the plant.
 * @property {string} howToGrow - Instructions for growing the plant.
 * @property {string} healthBenefit - Health benefits associated with the plant.
 * @property {string} foundInNature - Regions where the plant is found in nature.
 * @property {string} citation - Source or reference for the plant information.
 * @property {number} cost - Approximate cost of the plant in USD.
 */
export const defaultPlant = {
  name: "Unknown Plant",
  scientificName: "N/A",
  imageUrl: "https://via.placeholder.com/150",
  description: "No description available.",
  howToGrow: "No growth instructions available.",
  healthBenefit: "No known health benefits.",
  foundInNature: "Unknown regions.",
  citation: "No citation available.",
  cost: 0,
};

/**
 * PlantProfileCard component displays detailed information about a plant,
 * including expandable sections for description and growth instructions.
 *
 * @param {Object} props - Component props.
 * @param {Plant} [props.plant=defaultPlant] - Plant data to display.
 * @returns {JSX.Element} Plant profile card component.
 */
export default function PlantProfileCard({ plant = defaultPlant }) {
  /** Whether the description section is expanded. */
  const [showDesc, setShowDesc] = useState(false);

  /** Whether the how-to-grow section is expanded. */
  const [showGrow, setShowGrow] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto bg-gradient-to-br from-emerald-50 to-green-100 rounded-3xl shadow-xl p-6 relative font-sans border border-emerald-200"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <img
          src={plant.imageUrl}
          alt={plant.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-emerald-200 shadow-md"
        />
        <div>
          <h1 className="text-2xl font-bold text-emerald-900">{plant.name}</h1>
          <p className="text-sm text-gray-500 italic">{plant.scientificName}</p>
        </div>
      </div>

      {/* Cost Badge */}
      <div className="absolute top-6 right-6">
        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-medium px-3 py-1 rounded-full shadow">
          <FaDollarSign /> ~{plant.cost} USD
        </span>
      </div>

      {/* Sections */}
      <div className="mt-6 space-y-4">
        {/* Health Benefit */}
        <div className="flex items-start gap-2">
          <FaLeaf className="text-emerald-700 mt-1" />
          <div>
            <h2 className="text-sm font-semibold text-emerald-900">Health Benefit</h2>
            <p className="text-sm text-gray-700 mt-1">{plant.healthBenefit}</p>
          </div>
        </div>

        {/* Expandable: Description */}
        <div>
          <button
            onClick={() => setShowDesc((s) => !s)}
            className="flex items-center justify-between w-full text-sm font-medium text-emerald-800 bg-white/60 px-3 py-2 rounded-lg shadow hover:bg-emerald-50 transition"
          >
            <span className="flex items-center gap-2">
              <FaBook /> Description
            </span>
            <span
              className={`${showDesc ? "rotate-180" : ""} inline-block transition-transform`}
            >
              ▼
            </span>
          </button>
          <AnimatePresence>
            {showDesc && (
              <motion.div
                key="desc"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2 overflow-hidden"
              >
                <div className="bg-white border border-emerald-200 p-3 rounded-lg text-sm text-gray-700">
                  {plant.description}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Expandable: How to Grow */}
        <div>
          <button
            onClick={() => setShowGrow((s) => !s)}
            className="flex items-center justify-between w-full text-sm font-medium text-emerald-800 bg-white/60 px-3 py-2 rounded-lg shadow hover:bg-emerald-50 transition"
          >
            <span className="flex items-center gap-2">
              <FaSeedling /> How to Grow
            </span>
            <span
              className={`${showGrow ? "rotate-180" : ""} inline-block transition-transform`}
            >
              ▼
            </span>
          </button>
          <AnimatePresence>
            {showGrow && (
              <motion.div
                key="grow"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2 overflow-hidden"
              >
                <div className="bg-white border border-emerald-200 p-3 rounded-lg text-sm text-gray-700">
                  {plant.howToGrow}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Found in Nature */}
        <div className="flex items-start gap-2">
          <FaGlobe className="text-emerald-700 mt-1" />
          <div>
            <h2 className="text-sm font-semibold text-emerald-900">Found in Nature</h2>
            <p className="text-sm text-gray-700 mt-1">{plant.foundInNature}</p>
          </div>
        </div>

        {/* Citation */}
        <div className="mt-3 text-xs text-gray-500 italic border-t border-emerald-200 pt-2">
          “{plant.citation}”
        </div>
      </div>
    </motion.div>
  );
}
