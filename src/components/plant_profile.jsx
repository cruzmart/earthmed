
import React, { useState } from "react";

// Made by ChatGPT just for my learning, not going to end up using this in the end product, but
// to study how to make <div> blocks better svg.
// Using this for debugging purposes. 
const defaultPlant = {
  name: "Lavender",
  scientificName: "Lavandula angustifolia",
  imageUrl:
    "https://upload.wikimedia.org/wikipedia/commons/3/3d/Lavandula_angustifolia_%28closeup%29.jpg",
  description:
    "Lavender has slender purple flowers and a calming, sweet fragrance commonly used in aromatherapy.",
  howToGrow:
    "Plant lavender in well‑drained soil under full sunlight. Water sparingly and avoid over‑fertile soils. Prune after flowering to keep shape.",
  foundInNature:
    "Native to the Mediterranean region; commonly found on sunny, rocky slopes and scrublands.",
  citation: '"Lavender (Lavandula)." Encyclopedia of Herbs, 2021.'
};

export default function PlantProfileCard({ plant = defaultPlant }) {
  const [showDesc, setShowDesc] = useState(false);
  const [showGrow, setShowGrow] = useState(false);

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 relative font-sans">
      {/* top-right circular image */}
      <img
        src={plant.imageUrl}
        alt={plant.name}
        className="w-24 h-24 rounded-full object-cover absolute top-6 right-6"
        style={{ border: 0 }}
      />

      {/* header (leave room for image) */}
      <div className="pr-32">
        <h1 className="text-2xl font-semibold">{plant.name}</h1>
        <p className="text-sm text-gray-500 italic mt-1">{plant.scientificName}</p>
      </div>

      <div className="mt-4 space-y-4">
        {/* Description toggle */}
        <div>
          <button
            aria-expanded={showDesc}
            aria-controls="desc-panel"
            onClick={() => setShowDesc((s) => !s)}
            className="text-sm font-medium text-blue-600 hover:underline inline-flex items-center gap-2"
          >
            Description
            <svg
              className={`w-4 h-4 transition-transform ${showDesc ? 'transform rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.2 8.29a.75.75 0 01.03-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div
            id="desc-panel"
            className={`mt-2 overflow-hidden transition-all duration-300 ${
              showDesc ? "max-h-80" : "max-h-0"
            }`}
          >
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm text-gray-700">
              {plant.description}
            </div>
          </div>
        </div>

        {/* How to Grow toggle */}
        <div>
          <button
            aria-expanded={showGrow}
            aria-controls="grow-panel"
            onClick={() => setShowGrow((s) => !s)}
            className="text-sm font-medium text-blue-600 hover:underline inline-flex items-center gap-2"
          >
            How to Grow
            <svg
              className={`w-4 h-4 transition-transform ${showGrow ? 'transform rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.2 8.29a.75.75 0 01.03-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div
            id="grow-panel"
            className={`mt-2 overflow-hidden transition-all duration-300 ${
              showGrow ? "max-h-80" : "max-h-0"
            }`}
          >
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm text-gray-700">
              {plant.howToGrow}
            </div>
          </div>
        </div>

        {/* Found in Nature */}
        <div>
          <h2 className="text-sm font-semibold">Found in Nature</h2>
          <p className="text-sm text-gray-700 mt-1">{plant.foundInNature}</p>
        </div>

        {/* Citation */}
        <div>
          <h2 className="text-sm font-semibold">Citation</h2>
          <p className="text-sm italic text-gray-600 mt-1">{plant.citation}</p>
        </div>
      </div>
    </div>
  );
}