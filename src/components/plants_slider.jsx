import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard } from "swiper/modules";
import "swiper/css";
import { FaHeart } from "react-icons/fa";
import PlantProfileCard from "./plant_profile";

// Helper for invisible filler slides
const createEmptySlides = (count, side) => {
  if (count <= 0) return [];
  return Array.from({ length: count }).map((_, i) => (
    <SwiperSlide
      key={`${side}-filler-${i}`}
      className="w-64 flex-shrink-0 p-4 opacity-0 pointer-events-none"
    />
  ));
};

export default function PlantsSlider({ plants, user }) {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const plantList = Array.isArray(plants) ? plants : [];
  const desiredSlides = 3;
  const fillerCount = Math.max(desiredSlides - plantList.length, 0);

  // Fetch user favorites if logged in
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

  // Toggle favorite
  const toggleFavorite = async (plantId) => {
    if (!user) return; // guests cannot favorite
    try {
      const res = await fetch("http://localhost:3001/api/favorite/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, plantId }), // ✅ fixed key
      });
      const data = await res.json();

      if (data.favorite) {
        setFavorites((prev) => [...prev, plantId]);
      } else {
        setFavorites((prev) => prev.filter((id) => id !== plantId));
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto overflow-visible relative">
      <Swiper
        slidesPerView={desiredSlides}
        spaceBetween={10}
        centeredSlides={true}
        loop={false}
        grabCursor={true}
        modules={[Keyboard]}
        keyboard={{ enabled: true }}
        speed={500}
        className="transition-transform ease-in-out"
      >
        {/* Left filler slides */}
        {createEmptySlides(Math.floor(fillerCount / 2), "left")}

        {/* Plant slides */}
        {plantList.map((plant) => (
          <SwiperSlide
            key={plant.id}
            className="w-64 flex-shrink-0 p-4 rounded-lg shadow-md relative"
          >
            {/* Heart button */}
            {user && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(plant.id);
                }}
                className="absolute top-4 right-4 p-2 rounded-full bg-white shadow hover:scale-110 transition z-20"
              >
                <FaHeart
                  className={`w-6 h-6 ${
                    favorites.includes(plant.id)
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                />
              </button>
            )}

            {/* Plant content */}
            <div
              onClick={() => setSelectedPlant(plant)}
              className="cursor-pointer"
            >
              <img
                src={plant.imageUrl}
                alt={plant.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h2 className="text-lg font-bold">{plant.name}</h2>
              <p className="text-sm text-gray-600">{plant.description}</p>
              <p className="text-xs text-gray-400 mt-2">{plant.citation}</p>
              <p className="text-sm text-green-600"> ~ ${plant.cost} USD</p>
            </div>
          </SwiperSlide>
        ))}

        {/* Right filler slides */}
        {createEmptySlides(Math.ceil(fillerCount / 2), "right")}
      </Swiper>

      {/* Plant profile modal */}
      {selectedPlant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative">
            <button
              onClick={() => setSelectedPlant(null)}
              className="absolute -top-4 -right-4 z-50 bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-gray-300"
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
