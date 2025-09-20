import { FaHeart } from "react-icons/fa";

/**
 * FavoritesModal component
 *
 * This component displays detailed information about a single plant in a modal popup.
 * It includes the plant's image, name, description, scientific name, health benefits,
 * where it’s found, and price. Users can close the modal or remove the plant from favorites.
 *
 * @param {Object} props - The props object passed from the parent component
 * @param {Object} props.plant - The plant object to display in the modal
 * @param {string} props.plant.name - The common name of the plant
 * @param {string} props.plant.imageUrl - URL of the plant's image
 * @param {string} props.plant.description - Short description of the plant
 * @param {string} [props.plant.scientificName] - Optional scientific name
 * @param {string} [props.plant.healthBenefit] - Optional health benefit
 * @param {string} [props.plant.foundInNature] - Optional location where the plant is found
 * @param {number} props.plant.cost - Price of the plant in USD
 * @param {function} props.onClose - Function to call when closing the modal
 * @param {function} [props.onUnfavorite] - Optional function to call to remove the plant from favorites
 *
 * @returns {JSX.Element|null} The modal JSX or null if no plant is provided
 */
export default function FavoritesModal({ plant, onClose, onUnfavorite }) {
  // If no plant is provided, don't render the modal
  if (!plant) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#f5f3eb] rounded-2xl shadow-lg max-w-3xl w-full flex overflow-hidden animate-fadeIn">
        {/* Left side: Plant Image */}
        <div className="w-1/2 bg-green-50">
          <img
            src={plant.imageUrl}
            alt={plant.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right side: Plant Information */}
        <div className="w-1/2 p-6 flex flex-col justify-between">
          {/* Header: Plant name and close button */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-green-800">{plant.name}</h2>
            <button
              onClick={onClose} // Calls the function from props to close modal
              className="text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Description & optional details */}
          <p className="text-gray-700 mb-3">{plant.description}</p>
          {plant.scientificName && (
            <p className="text-sm text-gray-500 italic mb-2">
              {plant.scientificName}
            </p>
          )}
          {plant.healthBenefit && (
            <p className="text-sm text-green-700 mb-2">
              🌿 Benefit: {plant.healthBenefit}
            </p>
          )}
          {plant.foundInNature && (
            <p className="text-sm text-gray-600">
              🌍 Found in: {plant.foundInNature}
            </p>
          )}

          {/* Footer: Price and optional "Remove from favorites" button */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-lg font-semibold text-green-900">
              ${plant.cost} USD
            </p>
            {onUnfavorite && (
              <button
                onClick={() => onUnfavorite(plant.id)} // Calls the parent function to unfavorite
                className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
              >
                <FaHeart className="text-red-500" />
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
