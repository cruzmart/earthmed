import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FilterBox from './components/nav_bar/filter/filter_box'
import NavBar from './components/nav_bar/nav_bar'
import PlantsSlider from './components/plants_slider'


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
    {
    name: "Mint",
    purpose: "Refreshing flavor",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRreads9c1_tqNkPyISruNTcAzDm-Lwn0e4ow&s",
    price: "$6",
    location: "Herb Garden",
    citation: "Source C",
  },
  
];



function App() {

  return (
    <>

     <NavBar />
     <PlantsSlider plants = {plants}/>

     
    </>

  )
}

export default App
