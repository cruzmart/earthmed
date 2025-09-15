import { useState, useEffect } from "react";
import "./App.css";
import NavBar from "./components/nav_bar/nav_bar";
import PlantsSlider from "./components/plants_slider";
import FilterModal from "./components/nav_bar/filter/filter_modal";

function App() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    Name: "",
    Benefit: "",
    Description: "",
    Location: "",
    Cost: 0
  });
  const [plants, setPlants] = useState([]);

  // Fetch all plants at initial load
  useEffect(() => {
    const fetchAllPlants = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/plants");
        const data = await res.json();
        setPlants(data);
      } catch (err) {
        console.error("Failed to fetch plants:", err);
      }
    };
    fetchAllPlants();
  }, []);

  // Called when user clicks "Apply" in filter modal
  const handleApplyFilters = async (filters) => {
    setAppliedFilters(filters);
    setIsFilterOpen(false);

    try {
      const res = await fetch("http://localhost:3001/api/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });
      const data = await res.json();
      setPlants(data);
    } catch (err) {
      console.error("Failed to fetch filtered plants:", err);
    }
  };

  // In App.jsx
return (
  <>
    <NavBar isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} />
    <div className={isFilterOpen ? "blur-sm pointer-events-none" : ""}>
      {plants.length > 0 ? (
        <PlantsSlider plants={plants} />
      ) : (
        <div className="text-center text-gray-600 mt-10 text-lg">
          No plants match your filters.
        </div>
      )}
    </div>

    {isFilterOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <FilterModal
          initialFilters={appliedFilters}
          onApply={(filters) => { setAppliedFilters(filters); setIsFilterOpen(false); }}
          onClose={() => setIsFilterOpen(false)}
        />
      </div>
    )}
  </>
);
  
  // return (
  //   <>
  //     {/* Navbar */}
  //     <NavBar isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} />

  //     {/* Main content */}
  //     <div className={isFilterOpen ? "blur-sm pointer-events-none" : ""}>
  //       <PlantsSlider plants={plants} />
  //     </div>

  //     {/* Filter modal overlay */}
  //     {isFilterOpen && (
  //       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
  //         <FilterModal
  //           initialFilters={appliedFilters}
  //           onApply={handleApplyFilters}  // <-- uses backend filter API
  //           onClose={() => setIsFilterOpen(false)}
  //         />
  //       </div>
  //     )}
  //   </>
  // );
}

export default App;
