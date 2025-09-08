import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

 // Helper to create invisible filler slides
  const createEmptySlides = (count, side) =>
    Array(count)
      .fill(0)
      .map((_, i) => (
        <SwiperSlide
          key={`${side}-filler-${i}`}
          className="w-64 flex-shrink-0 p-4 opacity-0 pointer-events-none"
        />
      ));

export default function PlantsSlider({ plants }) {

  const desiredSlides = 3; // how many slides you want visible
  const fillerCount = Math.max(desiredSlides - plants.length, 0);

  return (
    <div className="w-full max-w-6xl mx-auto py-6 overflow-visible">
      <Swiper
        slidesPerView={desiredSlides}       // use natural slide width
        spaceBetween={10}
        centeredSlides={true}
        loop={false}
        grabCursor={true}
      >
        {/* Left filler slides */}
        {createEmptySlides(Math.floor(fillerCount / 2), "left")}

        {/* Real slides */}
        {plants.map((plant, index) => (
          <SwiperSlide
            key={index}
            className="w-64 flex-shrink-0 p-4  rounded-lg shadow-md cursor-pointer transform transition-transform duration-300 hover:scale-105"
          >
            <div onClick={() => console.log(`You clicked plant ${plant.name}`)}>
              <img
                src={plant.image}
                alt={plant.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h2 className="text-lg font-bold">{plant.name}</h2>
              <p className="text-sm text-gray-600">{plant.purpose}</p>
              <p className="text-sm text-gray-600">Price: {plant.price}</p>
              <p className="text-sm text-gray-600">Location: {plant.location}</p>
              <p className="text-xs text-gray-400 mt-2">{plant.citation}</p>
            </div>
          </SwiperSlide>
        ))}

        {/* Right filler slides */}
        {createEmptySlides(Math.ceil(fillerCount / 2), "right")}
      </Swiper>
    </div>
  );
}



/*
export default function Plants() {
  const maxSlides = 3;
  const slidesToShow = Math.min(plants.length, maxSlides);
  return (
    <div className="w-full max-w-6xl mx-auto py-6 overflow-x-auto">
  <div className="flex gap-6 snap-x snap-mandatory">
    {plants.map((plant, index) => (
      <div
        key={index}
        className="flex-shrink-0 w-64 bg-green-50 rounded-lg shadow-md p-4 snap-start cursor-pointer"
      >
        <img
          src={plant.image}
          alt={plant.name}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <h2 className="text-lg font-bold">{plant.name}</h2>
        <p className="text-sm text-gray-600">{plant.purpose}</p>
        <p className="text-sm text-gray-600">Price: {plant.price}</p>
        <p className="text-sm text-gray-600">Location: {plant.location}</p>
        <p className="text-xs text-gray-400 mt-2">{plant.citation}</p>
      </div>
    ))}
  </div>
</div>
  );
}
  */