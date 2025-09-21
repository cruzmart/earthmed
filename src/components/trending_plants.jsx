import { useEffect, useState } from "react";
import { FaCrown } from "react-icons/fa";
import PlantProfileCard from "./plant_profile";
import LeafImg from "../assets/leaflog.svg";

/**
 * TrendingPlants component displays the top favorited plants
 * in a small podium layout with gold, silver, and bronze placements.
 *
 * The component fetches trending plants from the backend and shows
 * a clickable image with name for each plant. Clicking opens a modal
 * with more details.
 *
 * @param {Object} props
 * @param {number} [props.limit=3] - Number of trending plants to fetch (max 3)
 * @returns {JSX.Element} The rendered trending plants component
 */
export default function TrendingPlants({ limit = 3 }) {
  /** @type {[Array<Object>, Function]} State for trending plants */
  const [trending, setTrending] = useState([]);

  /** @type {[Object|null, Function]} State for currently selected plant (for modal) */
  const [selectedPlant, setSelectedPlant] = useState(null);

  useEffect(() => {
    /**
     * Fetch trending plants from the backend API.
     * Updates the trending state with the fetched array.
     */
    const fetchTrending = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/plants/trending?limit=${limit}`,
        );
        const data = await res.json();
        setTrending(data);
      } catch (err) {
        console.error("Failed to fetch trending plants:", err);
      }
    };
    fetchTrending();
  }, [limit]);

  /** Array of crown color classes corresponding to placement */
  const crownColors = ["text-yellow-400", "text-gray-400", "text-orange-400"];

  return (
    <div className="mt-6 w-full max-w-xs mx-auto">
      {/* Title */}
      <h2 className="flex items-center justify-center gap-1 text-lg font-semibold text-emerald-900 mb-10">
        <img
          src={LeafImg}
          alt="Leaf"
          className="w-8 h-8 filter brightness-110 sepia hue-rotate-[10deg] contrast-110"
        />
      </h2>

      {/* Podium layout */}
      <div className="flex justify-center items-end gap-3">
        {/* Silver - 2nd place */}
        {trending[1] && (
          <div
            onClick={() => setSelectedPlant(trending[1])}
            className="relative flex flex-col items-center cursor-pointer"
          >
            <FaCrown className={`absolute -top-4 ${crownColors[1]} w-4 h-4`} />
            <div className="bg-white rounded-xl shadow p-2 w-20">
              <img
                src={trending[1].imageUrl}
                alt={trending[1].name}
                className="w-12 h-12 object-cover mx-auto rounded-full"
              />
              <h3 className="text-center text-xs font-medium text-emerald-900 mt-1">
                {trending[1].name}
              </h3>
            </div>
            <div className="bg-gray-300 w-full h-6 mt-1 rounded-t-md"></div>
          </div>
        )}

        {/* Gold - 1st place */}
        {trending[0] && (
          <div
            onClick={() => setSelectedPlant(trending[0])}
            className="relative flex flex-col items-center cursor-pointer scale-110"
          >
            <FaCrown className={`absolute -top-5 ${crownColors[0]} w-5 h-5`} />
            <div className="bg-white rounded-xl shadow p-3 w-24">
              <img
                src={trending[0].imageUrl}
                alt={trending[0].name}
                className="w-14 h-14 object-cover mx-auto rounded-full"
              />
              <h3 className="text-center text-sm font-semibold text-emerald-900 mt-1">
                {trending[0].name}
              </h3>
            </div>
            <div className="bg-yellow-300 w-full h-8 mt-1 rounded-t-md"></div>
          </div>
        )}

        {/* Bronze - 3rd place */}
        {trending[2] && (
          <div
            onClick={() => setSelectedPlant(trending[2])}
            className="relative flex flex-col items-center cursor-pointer"
          >
            <FaCrown className={`absolute -top-4 ${crownColors[2]} w-4 h-4`} />
            <div className="bg-white rounded-xl shadow p-2 w-18">
              <img
                src={trending[2].imageUrl}
                alt={trending[2].name}
                className="w-10 h-10 object-cover mx-auto rounded-full"
              />
              <h3 className="text-center text-xs font-medium text-emerald-900 mt-1">
                {trending[2].name}
              </h3>
            </div>
            <div className="bg-orange-300 w-full h-5 mt-1 rounded-t-md"></div>
          </div>
        )}
      </div>

      {/* Modal for selected plant */}
      {selectedPlant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative max-w-md w-full">
            <button
              onClick={() => setSelectedPlant(null)}
              className="absolute -top-4 -right-4 z-50 bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-gray-300 transition"
            >
              ✕
            </button>
            <PlantProfileCard plant={selectedPlant} />
          </div>
        </div>
      )}
    </div>
  );
}
