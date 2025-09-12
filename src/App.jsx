import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './App.css'
import NavBar from './components/nav_bar/nav_bar'
import PlantsSlider from './components/plants_slider'
import FilterModal from './components/nav_bar/filter/filter_modal'
import {plants} from "./components/test_data/plants"
import PlantProfileCard from './components/plant_profile'
import PlantProfileCardAnimated from './components/plant_profile_motion_version'


function App() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    Organ: "",
    Disease: "",
    Name: "",
    Location: "",
    Cost: 0
  });

  // Two Versions
  /*
  return (
    <> <PlantProfileCard/></>
  );
  return (
    <> <PlantProfileCardAnimated/></>
  );
  */

  return (
   <>
      {/* Page content */}
      <NavBar isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} />
      <div className={isFilterOpen ? "blur-sm pointer-events-none" : ""}>
        <PlantsSlider plants={plants} />
       
        
      </div>

      {/* Modal Overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <FilterModal
            initialFilters={appliedFilters}
            onApply={(filters) => { setAppliedFilters(filters), setIsFilterOpen(false); }}
            onClose={() => setIsFilterOpen(false)}
          />
        </div>
      )}
    </>

  ); 
}

export default App
