import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaSearch, FaTimes } from "react-icons/fa";
// import axios from "axios";

const FilterBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdown, setDropdown] = useState(null);
  const [selected, setSelected] = useState({ type: "Buy" });

  const localities = [{ name: "Rasulgarh" }, { name: "Ghatikia" }];
  const propertyTypes = [{ name: "Apartment" }, { name: "Villa" }];

  const options = {
    localities: localities.map((l) => l.name),
    budget: ["< 1 Cr", "1Cr-2Cr", "2Cr-3Cr", "3Cr-4Cr", "> 4Cr"],
    propertyType: propertyTypes.map((p) => p.name),
    bhk: ["1 BHK", "2 BHK", "3 BHK", "4+ BHK"],
    possession: ["Ready to Move", "Under Construction"],
  };

  const handleSelect = (category, value) => {
    setSelected((prev) => ({ ...prev, [category]: value }));
    setDropdown(null);
    alert(`${category} Selected: ${value}`);
  };

  const handleClear = (category) => {
    const copy = { ...selected };
    delete copy[category];
    setSelected(copy);
  };

  const renderDropdown = (category, label, width = "w-[250px]") => (
    dropdown === category && (
      <div
        className={`absolute top-[48px] left-0 w-[345px] bg-white border border-gray-200 rounded-lg shadow-md z-20 p-3`}
      >
        <div className="text-sm font-semibold text-gray-800 mb-3">{label}</div>
        <div className="flex flex-wrap gap-2">
          {options[category]?.map((opt) => (
            <div
              key={opt}
              onClick={() => handleSelect(category, opt)}
              className="px-4 py-1 bg-white border border-gray-500 rounded-full cursor-pointer text-sm"
            >
              {opt}
            </div>
          ))}
        </div>
      </div>
    )
  );

  const FilterChip = ({ category, label, width = "w-[160px]" }) => {
    if (selected[category]) {
      return (
        <div
          className={`flex items-center justify-between bg-[#64B1C9] text-white px-3 py-2 rounded-full h-[40px] ${width}`}
        >
          <span className="text-sm font-semibold truncate">{selected[category]}</span>
          <FaTimes
            className="cursor-pointer ml-2"
            onClick={() => handleClear(category)}
          />
        </div>
      );
    }

    return (
      <div className={`relative bg-white text-gray-700 px-2 py-1 rounded-full h-[40px] ${width}`}>
        <div
          className="flex items-center justify-between cursor-pointer mt-[4px] w-full"
          onClick={() => setDropdown(dropdown === category ? null : category)}
        >
          <p className="text-base font-semibold mb-0 truncate">{label}</p>
          <IoIosArrowDown className="text-[20px] text-[#367588]" />
        </div>
        {renderDropdown(category, label, width)}
      </div>
    );
  };

  return (
    <div className="bg-[#367588] main-banner text-white px-4 py-3 shadow-md w-full left-0 fixed md:top-[57px] lg:top-[70px] z-[1]">
      <div className="btn-badge flex flex-wrap gap-2 items-center ms-[40px]">

        {/* Buy & Search with vertical line in between */}
        <div className="relative bg-white text-gray-700 px-2 py-1 rounded-full flex items-center h-[40px]">
          {/* Buy dropdown */}
          <select
            value={selected.type}
            onChange={(e) => handleSelect("type", e.target.value)}
            className="bg-transparent outline-none w-[80px] text-sm font-semibold"
          >
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
          </select>

          {/* Divider */}
          <span className="text-gray-400 mx-2">|</span>

          {/* Search input */}
          <div className="flex items-center w-[250px]">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search outline-none w-full bg-transparent text-sm"
            />
          </div>
        </div>

        {/* Other Filters */}
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
