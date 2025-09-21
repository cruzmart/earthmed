import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import FavoritesModal from "./favourites_modal";

/**
 * FavoritesPage component
 *
 * Displays a user's favorited plants, allows unfavoriting, and shows a cost summary.
 * Each plant can be clicked to open a modal with detailed information.
 *
 * @param {Object} props - Component props
 * @param {Object} props.user - The currently logged-in user object
 * @param {number} props.user.id - The user's unique ID
 *
 * @returns {JSX.Element} The FavoritesPage UI
 */
export default function FavoritesPage({ user }) {
  // State for the list of favorited plants
  const [favorites, setFavorites] = useState([]);
  // State to track loading while fetching favorites from server
  const [loading, setLoading] = useState(true);
  // State for currently selected plant to show in the modal
  const [selectedPlant, setSelectedPlant] = useState(null);

  const TAX_RATE = 0.07; // 7% tax rate for cost calculation

  /**
   * Fetch favorites from the server when the component mounts or when the user changes.
   * Populates the `favorites` state with plant data.
   */
  useEffect(() => {
    if (!user) return; // Do nothing if not logged in
    const fetchFavorites = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/favorites/${user.id}`,
        );
        const data = await res.json();
        setFavorites(data);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user]);

  /**
   * Toggle favorite status for a plant.
   * Sends a request to the server to remove/add favorite.
   * Updates the `favorites` state locally.
   *
   * @param {number} plantId - The ID of the plant to toggle
   */
  const toggleFavorite = async (plantId) => {
    try {
      const res = await fetch("http://localhost:3001/api/favorite/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, plantId }),
      });
      const data = await res.json();

      // If removed, update state and close modal if that plant was open
      if (!data.favorite) {
        setFavorites((prev) => prev.filter((p) => p.id !== plantId));
        if (selectedPlant?.id === plantId) setSelectedPlant(null);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  // Calculate cost summary
  const subtotal = favorites.reduce(
    (sum, plant) => sum + (Number(plant.cost) || 0),
    0,
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  // Show loading message while fetching data
  if (loading) return <p className="text-center p-6">Loading favorites...</p>;

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col md:flex-row gap-8 p-20 w-full max-w-6xl">
        {/* Favorites List */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">🌿 Your Favorite Plants</h2>

          {favorites.length === 0 ? (
            <p className="text-gray-600">
              No favorites yet. Go add some plants!
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((plant) => (
                <div
                  key={plant.id}
                  className="relative bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer"
                  onClick={() => setSelectedPlant(plant)}
                >
                  <img
                    src={plant.imageUrl}
                    alt={plant.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <h3 className="text-lg font-semibold">{plant.name}</h3>
                  <p className="text-sm text-gray-600">{plant.description}</p>
                  <p className="text-green-700 font-medium mt-2">
                    ${plant.cost} USD
                  </p>

                  {/* Unfavorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(plant.id);
                    }}
                    className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:scale-110 transition"
                  >
                    <FaHeart className="text-red-500 w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cost Summary */}
        <aside className="w-full md:w-72 bg-gray-50 p-6 rounded-lg shadow-md h-fit self-start">
          <h2 className="text-xl font-bold mb-4">🧾 Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax (7%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Favorites Modal */}
      {selectedPlant && (
        <FavoritesModal
          plant={selectedPlant}
          onClose={() => setSelectedPlant(null)}
          onUnfavorite={toggleFavorite}
        />
      )}
    </div>
  );
}
