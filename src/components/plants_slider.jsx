import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard } from "swiper/modules"; // Import keyboard module
import "swiper/css";
import PlantProfileCard from "./plant_profile";

// Helper to create invisible filler slides
const createEmptySlides = (count, side) => {
  if (count <= 0) return [];
  return Array.from({ length: count }).map((_, i) => (
    <SwiperSlide
      key={`${side}-filler-${i}`}
      className="w-64 flex-shrink-0 p-4 opacity-0 pointer-events-none"
    />
  ));
};

export default function PlantsSlider({ plants }) {
  const [selectedPlant, setSelectedPlant] = useState(null);

  const plantList = Array.isArray(plants) ? plants : [];
  const desiredSlides = 3;
  const fillerCount = Math.max(desiredSlides - plantList.length, 0);

  return (
    <div className="w-full max-w-6xl mx-auto overflow-visible relative">
      <Swiper
        slidesPerView={desiredSlides}
        spaceBetween={10}
        centeredSlides={true}
        loop={false}
        grabCursor={true}
        
        modules={[Keyboard]}
        keyboard={{ enabled: true}} // keyboard control
        speed={500} // smooth slide animation (0.5s)
        className="transition-transform ease-in-out"
      >
        {/* Left filler slides */}
        {createEmptySlides(Math.floor(fillerCount / 2), "left")}

        {/* Real slides */}
        {plantList.map((plant, index) => (
          <SwiperSlide
            key={index}
            className="w-64 flex-shrink-0 p-4 rounded-lg shadow-md cursor-pointer transform transition-transform duration-300 active:scale-95"
          >
            <div onClick={() => setSelectedPlant(plant)}>
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
            {/* Close button */}
            <button
              onClick={() => setSelectedPlant(null)}
              className="absolute -top-4 -right-4 z-50 bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-gray-300"
            >
              ✕
            </button>

            {/* Plant profile card */}
            <PlantProfileCard plant={selectedPlant} />
          </div>
        </div>
      )}
    </div>
  );
}
