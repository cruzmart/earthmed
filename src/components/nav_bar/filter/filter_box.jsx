import { useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterModal from "./filter_modal";


export default function FilterBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    Organ: "",
    Disease: "",
    Name: "",
    Location: "",
    Cost: 0
  });

  return (
    <div className="relative">
       {/* Filter Icon Button */}
      {/* Filter Button */}

      <FaFilter onClick={() => setIsOpen(true)} className="w-7 h-7 text-green-500 hover:text-green-600  transition-colors" />
   
      {/* Only show blur + modal if open */}
      {isOpen && (
        <>
          {/* Blur overlay behind modal */}
          <div
            className="fixed inset-0 z-40 bg-opacity-20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)} // optional: click outside to close
          />

          {/* Modal itself */}
          <div className="fixed z-50 top-6 right-5 lg:right-40">
            <FilterModal
              initialFilters={appliedFilters}
              onApply={(newFilters) => setAppliedFilters(newFilters)}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  );
}