import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaSearch, FaTimes } from "react-icons/fa";

const FilterBar = ({
  selected,
  setSelected,
  dynamicLocalities = [],
  dynamicPropertyTypes = [],
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdown, setDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Define filter options
  const options = {
    localities: [...new Set(dynamicLocalities)],
    budget: ["< 1 Cr", "1Cr-2Cr", "2Cr-3Cr", "3Cr-4Cr", "> 4Cr"],
    propertyType: [...new Set(dynamicPropertyTypes)],
    bhk: ["1 BHK", "2 BHK", "3 BHK", "4+ BHK"],
    possession: ["Ready to Move", "Under Construction"],
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle filter selection
  const handleSelect = (category, value) => {
    setSelected((prev) => ({ ...prev, [category]: value }));
    setDropdown(null);
  };

  // Clear a selected filter
  const handleClear = (category) => {
    const copy = { ...selected };
    delete copy[category];
    setSelected(copy);
  };

  // Render dropdown menu for each filter category
  const renderDropdown = (category, label, width) =>
    dropdown === category && (
      <div
        className={`absolute top-[48px] left-0 bg-white border border-gray-200 rounded-lg shadow-md z-20 p-3 ${width}`}
      >
        <div className="text-sm font-semibold text-gray-800 mb-3">{label}</div>
        <div className="flex flex-wrap gap-2 max-h-48 overflow-auto">
          {options[category]?.map((opt) => (
            <div
              key={opt}
              onClick={() => handleSelect(category, opt)}
              className="px-3 py-1 bg-white border border-gray-500 rounded-full cursor-pointer text-sm hover:bg-gray-100"
            >
              {opt}
            </div>
          ))}
        </div>
      </div>
    );

  // Filter chip UI: shows selected value or dropdown trigger
  const FilterChip = ({ category, label, width }) => {
    if (selected[category]) {
      return (
        <div
          className={`flex items-center justify-between bg-[#64B1C9] text-white px-3 py-2 rounded-full h-[40px] ${width} max-w-full`}
        >
          <span className="text-sm font-semibold truncate">{selected[category]}</span>
          <FaTimes
            className="cursor-pointer ml-2"
            onClick={() => handleClear(category)}
            title={`Clear ${label}`}
          />
        </div>
      );
    }

    return (
      <div
        className={`relative bg-white text-gray-700 px-3 py-2 rounded-full h-[40px] ${width} cursor-pointer select-none`}
        onClick={() => setDropdown(dropdown === category ? null : category)}
      >
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold mb-0 truncate">{label}</p>
          <IoIosArrowDown className="text-[20px] text-[#367588]" />
        </div>
        {renderDropdown(category, label, width)}
      </div>
    );
  };

  return (
    <div
      ref={dropdownRef}
      className="bg-[#367588] text-white px-4 py-3 shadow-md w-full fixed md:top-[57px] lg:top-[70px] z-[1]"
    >
      <div className="flex flex-wrap gap-2 items-center ms-[40px]">
        {/* Buy selector + Search input */}
        <div className="relative bg-white text-gray-700 px-3 py-2 rounded-full flex items-center h-[40px] w-[350px] max-w-full">
          <select
            value={selected.type || "Buy"}
            onChange={(e) => handleSelect("type", e.target.value)}
            className="bg-transparent outline-none w-[80px] text-sm font-semibold cursor-pointer"
          >
            <option value="Buy">Buy</option>
            {/* Add more options if needed */}
          </select>
          <span className="text-gray-400 mx-2 select-none">|</span>
          <div className="flex items-center flex-grow">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (onSearch) onSearch(e.target.value);
              }}
              className="outline-none bg-transparent text-sm w-full"
            />
          </div>
        </div>

        {/* Filter chips */}
        <FilterChip category="localities" label="Top Localities" width="w-[170px]" />
        <FilterChip category="budget" label="Budget" width="w-[100px]" />
        <FilterChip category="propertyType" label="Property Type" width="w-[160px]" />
        <FilterChip category="bhk" label="BHK" width="w-[100px]" />
        <FilterChip category="possession" label="Possession Status" width="w-[200px]" />
      </div>
    </div>
  );
};

export default FilterBar;
