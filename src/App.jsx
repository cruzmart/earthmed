// App.jsx
import { useState, useEffect } from "react";
import "./App.css";
import NavBar from "./components/nav_bar/nav_bar";
import PlantsSlider from "./components/plants_slider";
import FilterModal from "./components/nav_bar/filter/filter_modal";
import AuthPage from "./components/auth_page";

function App() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    Name: "",
    Benefit: "",
    Description: "",
    Location: "",
    Cost: 0,
  });
  const [plants, setPlants] = useState([]);
  const [user, setUser] = useState(null); // null = guest, object = logged in
  const [showAuth, setShowAuth] = useState(false);

  // Load user from localStorage on launch if there is any user data in the local storage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("user"); // corrupted storage
      }
    }
  }, []);

  // Fetch all plants
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

  // Apply filters
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

  // Handle login/signup success
  const handleAuthSuccess = (userData) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } else {
      localStorage.removeItem("user");
      setUser(null);
    }

    setShowAuth(false);
  };

  return (
    <>
      {showAuth ? (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      ) : (
        <>
          <NavBar
            isOpen={isFilterOpen}
            setIsOpen={setIsFilterOpen}
            user={user}
            onLoginClick={() => setShowAuth(true)}
            onSignOut={() => handleAuthSuccess(null)}
          />

          <div className={isFilterOpen ? "blur-sm pointer-events-none" : ""}>
            <PlantsSlider plants={plants} user={user} />
          </div>

          {plants.length === 0 && !isFilterOpen && (
            <div className="text-center text-gray-600 mt-10 text-lg">
              No plants match your search or filters.
            </div>
          )}

          {isFilterOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <FilterModal
                initialFilters={appliedFilters}
                onApply={handleApplyFilters}
                onClose={() => setIsFilterOpen(false)}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}

export default App;
