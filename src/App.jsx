/**
 * @file App.jsx
 * @description Main application component. Handles user authentication, page navigation, plant data fetching,
 *              filtering, and rendering of main pages including home (PlantsSlider) and favorites (FavoritesPage).
 */

import "./App.css";
import { useState, useEffect } from "react";
import PlantsSlider from "./components/plants_slider";
import FilterModal from "./components/nav_bar/filter_modal";
import AuthPage from "./components/auth_page";
import FavoritesPage from "./components/favourites/favourites_page";
import NavBar from "./components/nav_bar/nav_bar";

/**
 * @component Footer
 * @description Simple footer displayed at the bottom of the page.
 */
function Footer() {
  return (
   <footer className="bg-green-50 w-full text-green-900 text-center py-4 mt-12">
  <div className="max-w-6xl mx-auto px-6">
    <p className="text-sm">🌿 EarthMed &copy; {new Date().getFullYear()} – Promoting sustainable plant knowledge.</p>
  </div>
</footer>

  );
}

/**
 * @component App
 * @description Root component of the application. Manages global state including user info,
 *              current page, applied filters, and modal states.
 */
function App() {
  /** @type {[string, Function]} current page: "home" | "favorites" */
  const [currentPage, setCurrentPage] = useState("home");

  /** @type {[boolean, Function]} whether the filter modal is open */
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  /** @type {[Array, Function]} list of plant objects fetched from server */
  const [plants, setPlants] = useState([]);

  /** @type {[Object|null, Function]} user info, null if guest */
  const [user, setUser] = useState(null);

  /** @type {[boolean, Function]} whether authentication modal/page is showing */
  const [showAuth, setShowAuth] = useState(false);

  /** @type {[Object, Function]} current applied filters for plant search */
  const [appliedFilters, setAppliedFilters] = useState({
    Name: "",
    Benefit: "",
    Description: "",
    Location: "",
    Cost: 0,
  });

  /**
   * @effect Load user from localStorage on component mount
   * @description If a user object exists in localStorage, parse and set it to state.
   *              Removes corrupted data if JSON parsing fails.
   */
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

  /**
   * @effect Fetch all plants from the backend server on mount
   * @description Populates the `plants` state with all available plants.
   *              Errors are logged to console.
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
   * @function handleApplyFilters
   * @description Sends filter criteria to the backend and updates the plants list.
   * @param {Object} filters - Filters to apply (Name, Benefit, Description, Location, Cost)
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
   * @function handleAuthSuccess
   * @description Updates user state and localStorage after login/signup/logout
   * @param {Object|null} userData - User object from backend, null if logging out
   */
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
      {/** Authentication page modal */}
      {showAuth ? (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      ) : (
         <NavBar
            isOpen={isFilterOpen}
            setIsOpen={setIsFilterOpen}
            user={user}
            onLoginClick={() => setShowAuth(true)}
            onSignOut={() => handleAuthSuccess(null)}
            onNavigate={setCurrentPage}
          />
        <main>
          {/** Navigation bar with filter toggle and page navigation */}
         

          {/** Main content area */}
          <div className={isFilterOpen ? "blur-sm pointer-events-none" : ""}>
            {/** Home page: Plants slider */}
            {currentPage === "home" && (
              <main className="pt-20">
                {/* pt-20 to offset fixed navbar height */}
                <PlantsSlider plants={plants} user={user} />
              </main>
            )}

            {/** Favorites page: User's favorite plants */}
            {currentPage === "favorites" && (
              <main className="pt-20">
                <FavoritesPage user={user} />
              </main>
            )}
          </div>

          {/** Message for empty plant results */}
          {currentPage === "home" && plants.length === 0 && !isFilterOpen && (
            <div className="text-center text-gray-600 mt-10 text-lg">
              No plants match your search or filters.
            </div>
          )}

          {/** Filter modal overlay */}
          {isFilterOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <FilterModal
                initialFilters={appliedFilters}
                onApply={handleApplyFilters}
                onClose={() => setIsFilterOpen(false)}
              />
            </div>
          )}
         
        </main>
      )}
      
       {/** Footer displayed at the bottom of the page */}
          <Footer />
    </>
  );
}

export default App;
