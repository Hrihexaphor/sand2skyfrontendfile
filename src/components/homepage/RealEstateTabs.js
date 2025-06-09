import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaHome, FaRupeeSign, FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function RealEstateTabs() {
  const [activeTab, setActiveTab] = useState("buy");

  return (
    <div className="flex flex-col items-center py-6 w-[100%]">
      <div className="flex flex-row items-center space-x-6 mb-6">
        {"buy new project".split(" ").map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-white font-bold px-2 py-2 border-b-2 ${
              activeTab === tab ? "border-[#E4BA46]" : "border-transparent"
            }`}
          >
            {tab === "buy" ? "Buy" : tab === "new" ? "New Project" : "Project"}
          </button>
        ))}
      </div>
      <TabSection tab={activeTab} />
    </div>
  );
}

function TabSection({ tab }) {
  return (
    <div className="w-full flex flex-col items-center">
      <SearchBox activeTab={tab} />
    </div>
  );
}

function SearchBox({ activeTab }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [locationData, setLocationData] = useState([]);
  const [localityData, setLocalityData] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [titleData, setTitleData] = useState([]);
  const [builderData, setBuilderData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const [selectedTags, setSelectedTags] = useState([]);
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setSelectedTags([]);
    setPropertyType("");
    setPriceRange("");
  }, [activeTab]);

  useEffect(() => {
    const fetchData = async () => {
      const apiUrl =
        activeTab === "new"
          ? "https://realestatesand2sky.onrender.com/api/getnewproperty"
          : "https://realestatesand2sky.onrender.com/api/getminimumproperty";
      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        setFullData(data);

        const locations = [...new Set(data.map((item) => item.city))];
        const localities = [...new Set(data.map((item) => item.locality))];
        const title = [...new Set(data.map((item) => item.title))];
        const builder = [...new Set(data.map((item) => item.developer_name))];
        const category = [...new Set(data.map((item) => item.subcategory_name))];

        setLocationData(locations);
        setLocalityData(localities);
        setTitleData(title);
        setBuilderData(builder);
        setCategoryData(category);
      } catch (error) {
        console.error("Error fetching location data", error);
      }
    };

    fetchData();
  }, [activeTab]);

  const filteredLocality = (() => {
    const selectedLocation = selectedTags.find((tag) => tag.type === "location")?.label;
    return selectedLocation
      ? [...new Set(fullData.filter((item) => item.city === selectedLocation && item.locality).map((item) => item.locality))]
      : localityData;
  })();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTags.length && !propertyType && !priceRange) {
      alert("Please fill at least one field to continue.");
      return;
    }

    const filterData = {
      location: selectedTags.find((tag) => tag.type === "location")?.label || null,
      locality: selectedTags.filter((tag) => tag.type === "locality").map((tag) => tag.label),
      projectNames: selectedTags.filter((tag) => tag.type === "project").map((tag) => tag.label),
      builders: selectedTags.filter((tag) => tag.type === "builder").map((tag) => tag.label),
      propertyType,
      priceRange,
    };

    const route =
      activeTab === "buy" ? "/listing" : activeTab === "new" ? "/newprojects" : "/projects";
    navigate(route, { state: filterData });
  };

  const combinedOptions = [
    ...locationData.map((item) => ({ label: item, type: "location" })),
    ...filteredLocality.map((item) => ({ label: item, type: "locality" })),
    ...titleData.map((item) => ({ label: item, type: "project" })),
    ...builderData.map((item) => ({ label: item, type: "builder" })),
  ];

  const filteredOptions = combinedOptions.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const highlightMatch = (label) => {
    const parts = label.split(new RegExp(`(${searchQuery})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <span key={i} className="text-[#E4BA46] font-medium">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  const renderSelectedTags = () => {
    const [primaryTag, ...otherTags] = selectedTags;
    return (
      <div className="flex flex-wrap gap-1 items-center">
        {primaryTag && (
          <span
            key={primaryTag.label}
            className="bg-[#E4BA46] text-white px-2 py-1 rounded-full text-sm flex items-center gap-1"
          >
            <span className="w-[125px] truncate block">{primaryTag.label}</span>
            <FaTimes
              className="cursor-pointer"
              onClick={() => setSelectedTags(otherTags)}
            />
          </span>
        )}
        {otherTags.length > 0 && (
          <span className="text-sm text-white bg-yellow-400 rounded-2xl px-2 py-1">+{otherTags.length}</span>
        )}
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg md:rounded-full shadow-sm px-3 py-2 mx-2 w-full max-w-[850px] relative"
    >
      <div className="flex flex-col md:flex-row items-center gap-2">
        <div className="flex flex-col gap-1 border-b border-gray-300 md:border-0 w-full">
          <div className="flex items-center gap-2 relative">
            <FaMapMarkerAlt className="text-[#E4BA46]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setDropdownVisible(true);
              }}
              onFocus={() => setDropdownVisible(true)}
              onBlur={() => setTimeout(() => setDropdownVisible(false), 200)}
              placeholder="Search by location, locality, builder, project..."
              className="py-2 px-2 outline-0 rounded-full w-full md:w-[208px] lg:w-[270px] bg-white"
            />
            {dropdownVisible && searchQuery && (
              <div className="absolute top-12 left-0 bg-white shadow-md rounded-md w-[300px] z-50 max-h-[240px] overflow-y-auto py-2 px-0">
                <ul>
                  {/* {filteredOptions.map((item, i) => (
                    <>
                      <p className="text-gray-500 text-sm mb-1">{item.type}</p>
                    <li
                      key={i}
                      className="text-gray-800 text-sm py-1 cursor-pointer hover:text-[#FFD700]"
                      onClick={() => {
                        if (!selectedTags.find((tag) => tag.label === item.label && tag.type === item.type)) {
                          setSelectedTags([...selectedTags, item]);
                        }
                        setSearchQuery("");
                      }}
                    >
                      {highlightMatch(item.label)} <span className="text-gray-400 text-xs">({item.type})</span>
                    </li>
                    </>
                  ))} */}
                  {["location", "locality", "project", "builder"].map((type) => {
  const itemsOfType = filteredOptions.filter((item) => item.type === type);
  if (itemsOfType.length === 0) return null;
  return (
    <div key={type} className="px-0 py-1">
      <p className="text-gray-600 font-bold text-sm mb-1 capitalize">{type}</p>
      <ul>
        {itemsOfType.map((item, i) => (
          <li
            key={`${type}-${i}`}
            className="text-gray-800 text-sm py-1 cursor-pointer hover:text-[#FFD700]"
            onClick={() => {
              if (!selectedTags.find((tag) => tag.label === item.label && tag.type === item.type)) {
                setSelectedTags([...selectedTags, item]);
              }
              setSearchQuery("");
            }}
          >
            {highlightMatch(item.label)}
          </li>
        ))}
      </ul>
    </div>
  );
})}
                </ul>
              </div>
            )}
          </div>
          {renderSelectedTags()}
        </div>
        <span className="hidden md:block text-gray-600 font-bold mx-1">|</span>
        <div className="flex items-center gap-2 border-b border-gray-300 md:border-0 w-full">
          <FaHome className="text-[#E4BA46] text-[1.4rem]" />
          <select
            className="py-2 rounded-lg outline-none text-gray-700 cursor-pointer w-full md:w-[130px]"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="">Select Property</option>
            {categoryData.map((category, i) => (
              <option value={category} key={i}>{category}</option>
            ))}
          </select>
        </div>
        <span className="hidden md:block text-gray-600 font-bold mx-1">|</span>
        <div className="flex items-center gap-2 border-b border-gray-300 md:border-0 w-full">
          <FaRupeeSign className="text-[#E4BA46] text-[1.4rem]" />
          <select
            className="py-2 rounded-lg outline-none text-gray-700 cursor-pointer w-full lg:w-[130px]"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="">Price Range</option>
            <option value="1CR-2CR">1 CR - 2 CR</option>
            <option value="2CR-3CR">2 CR - 3 CR</option>
            <option value="3CR-4CR">3 CR - 4 CR</option>
            <option value="morethan4CR">4 CR +</option>
          </select>
        </div>
        <span className="hidden md:block text-gray-600 font-bold mx-1">|</span>
        <div className="mt-[7px] w-full md:w-[200px] lg:w-full md:mt-0">
          <button
            type="submit"
            className="ml-auto bg-[#E4BA46] hover:bg-[#D59F24] text-white lg:px-2 px-2 md:ps-3 lg:px-6 py-2 rounded-full flex items-center space-x-2 w-full md:w-[45px] lg:w-[110px]"
          >
            <FaSearch className="me-2" />
            <span className="block md:hidden lg:block">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
}
