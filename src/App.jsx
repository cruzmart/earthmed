import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FilterBox from './components/nav_bar/filter/filter_box'
import NavBar from './components/nav_bar/nav_bar'

import "swiper/css"; // basic styles
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import PlantCarousel from "./components/plant_carousel";


function App() {

  return (
    <>
     <NavBar />
     <PlantCarousel />
    </>

  )
}

export default App
