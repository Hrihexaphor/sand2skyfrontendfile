import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaSearch, FaTimes } from "react-icons/fa";

const FilterBar = ({
  selected,
  setSelected,
  dynamicLocalities = [],
  dynamicPropertyTypes = [],
  dynamicCities = [],
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdown, setDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const [citySuggestions, setCitySuggestions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  const options = {
    localities: [...new Set(dynamicLocalities)],
    budget: ["< 1 Cr", "1Cr-2Cr", "2Cr-3Cr", "3Cr-4Cr", "> 4Cr"],
    propertyType: [...new Set(dynamicPropertyTypes)],
    bhk: ["1 BHK", "2 BHK", "3 BHK", "4+ BHK"],
    // possession: ["Ready to Move", "Under Construction"],
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(null);
        setCitySuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery && dynamicCities?.length > 0) {
      const filtered = dynamicCities.filter((city) =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setCitySuggestions(filtered);
    } else {
      setCitySuggestions([]);
    }
  }, [searchQuery, dynamicCities]);

  const handleSelect = (category, value) => {
    setSelected((prev) => ({ ...prev, [category]: value }));
    setDropdown(null);
  };

  const handleClear = (category) => {
    const copy = { ...selected };
    delete copy[category];
    setSelected(copy);
  };
  const handleClearCity = (category) => {
    const copy = { ...selected };
    delete copy[category];
    if (category === "cities") {
      delete copy["localities"];
      setSelectedCity(null);
    }
    setSelected(copy);
  };

  const highlightMatch = (text, query) => {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    return (
      <>
        {text.substring(0, index)}
        <span className="text-[#367588] font-semibold">
          {text.substring(index, index + query.length)}
        </span>
        {text.substring(index + query.length)}
      </>
    );
  };

  const renderDropdown = (category, label, alignRight = false) =>
    dropdown === category && (
      <div
        className={`absolute top-[48px] ${alignRight ? "right-0" : "left-[-10px]"} bg-white border border-gray-200 rounded-lg shadow-md z-20 p-3 w-[225px] xl:w-[300px]`}
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

  const FilterChip = ({ category, label, width, alignRight = false }) => {
    if (selected[category]) {
      return (
        <div
          className={`flex items-center justify-between bg-[#64B1C9] text-white px-2 py-1 lg:px-3 lg:py-2 rounded-full h-[30px] lg:h-[40px] ${width} max-w-full`}
        >
          <span className="text-[12px] lg:text-sm font-semibold truncate">
            {selected[category]}
          </span>
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
        className={`relative bg-white text-gray-700 px-2 py-1 lg:px-3 lg:py-2 rounded-full h-[30px] lg:h-[40px] ${width} cursor-pointer select-none`}
        onClick={() => setDropdown(dropdown === category ? null : category)}
      >
        <div className="flex items-center justify-between">
          <p className="lg:text-base text-[12px] font-semibold lg:mt-[4px] mb-0 truncate">
            {label}
          </p>
          <IoIosArrowDown className="text-[20px] text-[#367588]" />
        </div>
        {renderDropdown(category, label, alignRight)}
      </div>
    );
  };

  return (
    <div
      ref={dropdownRef}
      className="bg-[#367588] text-white px-4 py-3 shadow-md w-full fixed top-[57px] lg:top-[70px] z-[1] left-0"
    >
      <div className="flex flex-wrap gap-2 items-center lg:ms-[40px] relative">
        {/* Buy selector + Search input */}
        <div className="relative bg-white text-gray-700 px-2 py-1 lg:px-3 lg:py-2 rounded-full flex items-center h-[30px] lg:h-[40px] w-[255px] md:w-[237px] lg:w-[350px] max-w-full">
          <select
            value={selected.type || "Buy"}
            onChange={(e) => handleSelect("type", e.target.value)}
            className="bg-transparent outline-none text-[12px] md:w-[60px] lg:w-[80px] text-base font-semibold cursor-pointer"
          >
            <option value="Buy">Buy</option>
          </select>
          <span className="text-gray-400 mx-2 select-none">|</span>
          <div className="flex items-center flex-grow relative">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search city"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (onSearch) onSearch(e.target.value);
              }}
              className="outline-none bg-transparent text-sm w-full"
            />
            {selected?.cities && (
              <div className="absolute -top-[3px] lg:-top-[8px] left-4 bg-[#64B1C9] text-white px-2 py-1 lg:px-3 lg:py-2 rounded-full h-[25px] lg:h-[35px] text-[12px] lg:text-base flex items-center z-20">
                {selected.cities}
                <FaTimes
                  className="ml-2 cursor-pointer"
                  onClick={() => handleClearCity("cities")}
                />
              </div>
            )}
          </div>

          {citySuggestions.length > 0 && !selectedCity && (
            <ul className="absolute top-[40px] left-[95px] min-w-[240px] w-auto px-4 py-2 bg-white border border-gray-300 rounded-md shadow-md z-20 max-h-48 overflow-auto">
              {citySuggestions.map((city, index) => (
                <li
                  key={index}
                  className="mb-1 cursor-pointer text-black text-sm"
                  onClick={() => {
                    setSelectedCity(city);
                    setSearchQuery("");
                    setSelected((prev) => ({ ...prev, cities: city }));
                    setCitySuggestions([]);
                  }}
                >
                  {highlightMatch(city, searchQuery)}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Filter chips */}
        <FilterChip category="localities" label="Top Localities" width="md:w-[135px] lg:w-[170px]" />
        <FilterChip category="budget" label="Budget" width="md:w-[100px] lg:w-[120px]" />
        <FilterChip category="propertyType" label="Property Type" width="md:w-[135px] lg:w-[160px]" />
        <FilterChip category="bhk" label="BHK" width="md:w-[80px] lg:w-[100px]" alignRight={true} />
        {/* <FilterChip category="possession" label="Possession Status" width="w-[200px]" /> */}
      </div>
    </div>
  );
};

export default FilterBar;
