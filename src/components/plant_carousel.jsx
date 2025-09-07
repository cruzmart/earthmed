import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";

// These are made for TESTING ONLY, real stuff will be added
const plants = [
  {
    name: "Aloe Vera",
    purpose: "Healing and skincare uses",
    image: "https://botanix.com/cdn/shop/files/Aloes-vera_Nouvelle-feuille_d1877dd8-ff5a-42b5-b67c-87c4969ddf03.jpg?v=1711979505&width=1946",
    price: "$10",
    location: "Garden",
    citation: "Source A",
  },
  {
    name: "Basil",
    purpose: "Used in cooking and medicine",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR__C_hZ9Q6gzxBhKezWXycALWa9ICETNwqAg&",
    price: "$5",
    location: "Kitchen",
    citation: "Source B",
  },
  {
    name: "Mint",
    purpose: "Refreshing flavor",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRreads9c1_tqNkPyISruNTcAzDm-Lwn0e4ow&s",
    price: "$6",
    location: "Herb Garden",
    citation: "Source C",
  },
  // Add more plant objects here
];

export default function PlantCarousel() {
  return (
    <div className="w-full flex justify-center mt-24 overflow-visible">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={3}           // show 3 slides at a time
        spaceBetween={50}           // space between slides
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 150,
          modifier: 1,
          slideShadows: false,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination]}
        className="w-[1200px] max-w-full py-10" // fixed container width
      >
        {plants.map((plant, index) => (
          <SwiperSlide
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 w-64 h-[400px] flex-shrink-0 transform scale-90 transition-transform duration-300"
          >
            <img
              src={plant.image}
              alt={plant.name}
              className="rounded-md mb-4 w-full h-48 object-cover"
            />
            <h2 className="text-lg font-bold">{plant.name}</h2>
            <p className="text-sm text-gray-600 mb-1">{plant.purpose}</p>
            <p className="text-sm text-gray-600">Price: {plant.price}</p>
            <p className="text-sm text-gray-600">Location: {plant.location}</p>
            <p className="text-xs text-gray-400 mt-2">Citation: {plant.citation}</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}