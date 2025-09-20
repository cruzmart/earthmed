import { useState, useEffect } from "react";
import "./App.css";
import NavBar from "./components/nav_bar/nav_bar";
import PlantsSlider from "./components/plants_slider";
import FilterModal from "./components/nav_bar/filter_modal";
import AuthPage from "./components/auth_page";
import FavoritesPage from "./components/favourites/favourites_page";

function App() {
  const [view, setView] = useState("home"); // 'home', 'favorites', etc.
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [plants, setPlants] = useState([]);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState({
    Name: "",
    Benefit: "",
    Description: "",
    Location: "",
    Cost: 0,
  });

  function Footer() {
  return (
    <footer className="bg-green-50 text-green-900 text-center py-4 mt-12 shadow-inner">
      <p className="text-sm">
        🌿 EarthMed &copy; {new Date().getFullYear()} – Promoting sustainable plant knowledge.
      </p>
    </footer>
  );
}

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

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

  const renderMainContent = () => {
    switch (view) {
      case "home":
        return (
          <>
            <PlantsSlider plants={plants} user={user} />
            {plants.length === 0 && !isFilterOpen && (
              <div className="text-center text-gray-600 mt-10 text-lg">
                No plants match your search or filters.
              </div>
            )}
          </>
        );
      case "favorites":
        return <FavoritesPage user={user} />;
      default:
        return null;
    }
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
            onNavigate={setView}
          />

          <main className={isFilterOpen ? "blur-sm pointer-events-none" : ""}>
            {renderMainContent()}
          </main>

          {isFilterOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <FilterModal
                initialFilters={appliedFilters}
                onApply={handleApplyFilters}
                onClose={() => setIsFilterOpen(false)}
              />
            </div>
          )}

          <Footer />
        </>
      )}
    </>
  );
}

export default App;