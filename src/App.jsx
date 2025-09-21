import { useState, useEffect } from "react";
import "./App.css";
import NavBar from "./components/nav_bar/nav_bar";
import PlantsSlider from "./components/plants_slider";
import FilterModal from "./components/nav_bar/filter_modal";
import AuthPage from "./components/auth_page";
import FavoritesPage from "./components/favourites/favourites_page";
import { AnimatePresence, motion } from "framer-motion";

/**
 * @typedef {Object} Filters
 * @property {string} Name - Filter by plant name
 * @property {string} Benefit - Filter by health benefit
 * @property {string} Description - Filter by description
 * @property {string} Location - Filter by natural location
 * @property {number} Cost - Maximum cost
 */

/**
 * Main App component for EarthMed
 *
 * Manages authentication, plant fetching, filtering, favorites, and view navigation.
 *
 * @component
 * @example
 * return <App />
 */
function App() {
  /** @type {[string, Function]} Current view ('home', 'favorites', etc.) */
  const [view, setView] = useState("home");

  /** @type {[boolean, Function]} Filter modal open state */
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  /** @type {[Object[], Function]} List of all plants */
  const [plants, setPlants] = useState([]);

  /** @type {[Object|null, Function]} Authenticated user data */
  const [user, setUser] = useState(null);

  /** @type {[boolean, Function]} Auth page visibility state */
  const [showAuth, setShowAuth] = useState(false);

  /** @type {[Filters, Function]} Currently applied filters */
  const [appliedFilters, setAppliedFilters] = useState({
    Name: "",
    Benefit: "",
    Description: "",
    Location: "",
    Cost: 0,
  });

  /**
   * Footer component displaying copyright
   * @returns {JSX.Element}
   */
  function Footer() {
    return (
      <footer className="w-full bg-green-50 text-green-900 text-center py-4 shadow-inner">
        <p className="text-sm">
          🌿 EarthMed &copy; {new Date().getFullYear()} – Promoting sustainable
          plant knowledge.
        </p>
      </footer>
    );
  }

  /**
   * Load user from localStorage on mount
   */
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

  /**
   * Fetch all plants from backend
   */
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

  /**
   * Apply filters and fetch filtered plants
   * @param {Filters} filters
   */
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

  /**
   * Handle authentication success or logout
   * @param {Object|null} userData - User object or null for logout
   */
  const handleAuthSuccess = (userData) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } else {
      localStorage.removeItem("user");
      setUser(null);
      if (view === "favorites") {
        setView("home");
      }
    }
    setShowAuth(false);
  };

  /**
   * Render the main content based on current view
   * @returns {JSX.Element|null}
   */
  const renderMainContent = () => {
    switch (view) {
      case "home":
        return (
          <div className="mt-10">
            <PlantsSlider plants={plants} user={user} />
            {plants.length === 0 && !isFilterOpen && (
              <div className="text-center text-gray-600 mt-10 text-lg">
                No plants match your search or filters.
              </div>
            )}
          </div>
        );
      case "favorites":
        return <FavoritesPage user={user} />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {showAuth ? (
        <motion.div
          key="auth"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full h-full"
        >
          <AuthPage onAuthSuccess={handleAuthSuccess} />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex flex-col min-h-screen"
        >
          {/* Navbar */}
          <NavBar
            isOpen={isFilterOpen}
            setIsOpen={setIsFilterOpen}
            user={user}
            view={view}
            onLoginClick={() => setShowAuth(true)}
            onSignOut={() => handleAuthSuccess(null)}
            onNavigate={setView}
          />

          {/* Main content */}
          <main className="flex-1">
            <div className="pl-40 mt-25 flex justify-center">
              {renderMainContent()}
            </div>
          </main>

          {/* Filter Modal */}
          {isFilterOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <FilterModal
                initialFilters={appliedFilters}
                onApply={handleApplyFilters}
                onClose={() => setIsFilterOpen(false)}
              />
            </div>
          )}

          {/* Footer */}
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
