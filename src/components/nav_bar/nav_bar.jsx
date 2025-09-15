import LeafImg from "../../assets/leaflog.svg"; // notice the ./ for same folder
import { FaFilter } from "react-icons/fa";

export default function NavBar({ isOpen, setIsOpen }) {
  const navClasses = `${isOpen ? "blur-sm pointer-events-none" : ""} fixed top-0 left-0 right-0 z-40 bg-lime-100`;

  return (
    <nav className={navClasses}>
      <div className="relative h-20 flex items-center justify-center">
        {/* Center: Logo & Title */}
        <div className="flex items-center gap-2">
          <img src={LeafImg} alt="Leaf" className="w-6 h-6 object-contain" />
          <span className="text-xl font-bold text-gray-800">EarthMed</span>
        </div>

        {/* Right: FilterBox Position */}
        <div className="absolute right-0 flex items-center p-10">
          {/* Filter Button */}
          <FaFilter
            className="w-6 h-6 text-black hover:text-green-600  transition-colors"
            onClick={() => setIsOpen(true)}
          />
        </div>
      </div>
    </nav>
  );
}
