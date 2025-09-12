import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// These is going to be used for debugging purposes
const defaultPlant = {
  name: "Lavender",
  scientificName: "Lavandula angustifolia",
  imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Lavandula_angustifolia_%28closeup%29.jpg",
  description: "Lavender has slender purple flowers and a calming, sweet fragrance commonly used in aromatherapy.",
  howToGrow: "Plant lavender in well‑drained soil under full sunlight. Water sparingly and avoid over‑fertile soils. Prune after flowering to keep shape.",
  foundInNature: "Native to the Mediterranean region; commonly found on sunny, rocky slopes and scrublands.",
  citation: '"Lavender (Lavandula)." Encyclopedia of Herbs, 2021.'
};

export default function PlantProfileCardAnimated({ plant = defaultPlant }) {
  const [showDesc, setShowDesc] = useState(false);
  const [showGrow, setShowGrow] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 relative font-sans"
    >
      <img
        src={plant.imageUrl}
        alt={plant.name}
        className="w-24 h-24 rounded-full object-cover absolute top-6 right-6"
      />

      <div className="pr-32">
        <h1 className="text-2xl font-semibold">{plant.name}</h1>
        <p className="text-sm text-gray-500 italic mt-1">{plant.scientificName}</p>
      </div>

      <div className="mt-4 space-y-4">
        {/* Description toggle with animation */}
        <div>
          <button
            onClick={() => setShowDesc(s => !s)}
            className="text-sm font-medium text-blue-600 hover:underline inline-flex items-center gap-2"
          >
            Description
            <span className={`${showDesc ? 'rotate-180' : ''} inline-block transition-transform`}>&#9660;</span>
          </button>
          <AnimatePresence>
            {showDesc && (
              <motion.div
                key="desc"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2 overflow-hidden"
              >
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm text-gray-700">
                  {plant.description}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* How to Grow toggle with animation */}
        <div>
          <button
            onClick={() => setShowGrow(s => !s)}
            className="text-sm font-medium text-blue-600 hover:underline inline-flex items-center gap-2"
          >
            How to Grow
            <span className={`${showGrow ? 'rotate-180' : ''} inline-block transition-transform`}>&#9660;</span>
          </button>
          <AnimatePresence>
            {showGrow && (
              <motion.div
                key="grow"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2 overflow-hidden"
              >
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm text-gray-700">
                  {plant.howToGrow}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Found in Nature</h2>
          <p className="text-sm text-gray-700 mt-1">{plant.foundInNature}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Citation</h2>
          <p className="text-sm italic text-gray-600 mt-1">{plant.citation}</p>
        </div>
      </div>
    </motion.div>
  );
}
