import FilterBox from "./filter/filter_box"; // adjust path if needed
import LeafImg from "../../assets/leaflog.svg"; // notice the ./ for same folder
export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-md z-40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-3 items-center h-20">
          {/* Left (spacer or future links) */}
          <div className="justify-self-start" />

          {/* Center: leaf + title, truly centered */}
          <div className="justify-self-center">
            <div className="flex items-center gap-2">
              <img src={LeafImg} alt="Leaf" className="w-6 h-6 object-contain" />
              <span className="text-xl font-bold text-gray-800">EarthMed</span>
            </div>
          </div>

          {/* Right: Filter button */}
          <div className="justify-self-end">
            <FilterBox />
          </div>
        </div>
      </div>
    </nav>
  );
}