import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard } from "swiper/modules";
import "swiper/css";
import { FaHeart } from "react-icons/fa";
import PlantProfileCard from "./plant_profile";

/**
 * Helper to create invisible filler slides to maintain carousel alignment
 * when there are fewer slides than the desired visible count.
 *
 * @param {number} count - Number of filler slides to create
 * @param {string} side - 'left' or 'right', used for unique key generation
 * @returns {JSX.Element[]} Array of SwiperSlide components that are invisible
 */
const createEmptySlides = (count, side) => {
  if (count <= 0) return [];
  return Array.from({ length: count }).map((_, i) => (
    <SwiperSlide
      key={`${side}-filler-${i}`}
      className="w-64 flex-shrink-0 p-4 opacity-0 pointer-events-none"
    />
  ));
};

/**
 * PlantsSlider component renders a horizontal carousel of plants.
 * Each plant can be favorited (if user is logged in) and clicked
 * to display a modal with detailed plant information.
 *
 * @param {Object} props
 * @param {Object[]} props.plants - Array of plant objects to display
 * @param {Object|null} props.user - Current logged-in user, or null for guest
 * @returns {JSX.Element} The rendered PlantsSlider component
 */
export default function PlantsSlider({ plants, user }) {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const plantList = Array.isArray(plants) ? plants : [];
  const desiredSlides = 3;
  const fillerCount = Math.max(desiredSlides - plantList.length, 0);

  /**
   * Fetch the current user's favorite plants from the server
   */
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      try {
        const res = await fetch(
          `http://localhost:3001/api/favorites/${user.id}`,
        );
        const data = await res.json();
        setFavorites(data.map((p) => p.id));
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      }
    };
    fetchFavorites();
  }, [user]);

  /**
   * Toggle a plant as favorite or remove it from favorites.
   *
   * @param {string|number} plantId - The ID of the plant to toggle
   */
  const toggleFavorite = async (plantId) => {
    if (!user) return;
    try {
      const res = await fetch("http://localhost:3001/api/favorite/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, plantId }),
      });
      const data = await res.json();

      setFavorites((prev) =>
        data.favorite
          ? [...prev, plantId]
          : prev.filter((id) => id !== plantId),
      );
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  return (
    <div className="w-full flex justify-center mt-8">
      <div className="w-full max-w-6xl mx-auto overflow-visible relative">
        <Swiper
          slidesPerView={desiredSlides}
          spaceBetween={20}
          centeredSlides={true}
          loop={false}
          grabCursor={true}
          modules={[Keyboard]}
          keyboard={{ enabled: true }}
          speed={500}
          className="transition-transform ease-in-out"
        >
          {createEmptySlides(Math.floor(fillerCount / 2), "left")}

          {plantList.map((plant) => (
            <SwiperSlide key={plant.id} className="w-64 flex-shrink-0 p-4">
              <div
                className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer overflow-hidden"
                onClick={() => setSelectedPlant(plant)}
              >
                {/* Heart Button */}
                {user && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(plant.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white shadow hover:scale-110 transition-transform z-10"
                  >
                    <FaHeart
                      className={`w-6 h-6 ${
                        favorites.includes(plant.id)
                          ? "text-red-500"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                )}

                {/* Plant Image */}
                <img
                  src={plant.imageUrl}
                  alt={plant.name}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />

                {/* Plant Info */}
                <div className="p-4">
                  <h2 className="text-lg font-bold text-emerald-900">
                    {plant.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                    {plant.description}
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-gray-400">{plant.citation}</p>
                    <p className="text-sm font-semibold text-green-600">
                      ~${plant.cost} USD
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {createEmptySlides(Math.ceil(fillerCount / 2), "right")}
        </Swiper>

        {/* Modal for selected plant */}
        {selectedPlant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative max-w-3xl w-full">
              <button
                onClick={() => setSelectedPlant(null)}
                className="absolute -top-4 -right-4 z-50 bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-gray-300 transition"
              >
                ✕
              </button>
              <PlantProfileCard plant={selectedPlant} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
