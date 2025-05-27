import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaHome, FaRupeeSign, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function RealEstateTabs() {
  const [activeTab, setActiveTab] = useState("buy");

  return (
    <div className="flex flex-col items-center py-6">
      {/* Tabs */}
      <div className="flex flex-col md:flex-row items-center space-x-6 mb-6">
        {["buy", "new", "project"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-white font-bold px-2 py-2 border-b-2 ${activeTab === tab ? "border-[#FFD700]" : "border-transparent"
              }`}
          >
            {tab === "buy" ? "Buy" : tab === "new" ? "New Project" : "Project"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
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
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [locationData, setLocationData] = useState([]);
  const [localityData, setLocalityData] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [titleData, setTitleData] = useState([]);
  const [builderData, setBuilderData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const [selectedLocalities, setSelectedLocalities] = useState([]);
  const [selectedProjectNames, setSelectedProjectNames] = useState([]);
  const [selectedBuilders, setSelectedBuilders] = useState([]);

  // Reset all selections on tab change
  useEffect(() => {
    setSelectedLocation(null);
    setPropertyType("");
    setPriceRange("");
    setSelectedLocalities([]);
    setSelectedProjectNames([]);
    setSelectedBuilders([]);
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

  
  const filteredLocality = selectedLocation
    ? [
      ...new Set(
        fullData
          .filter((item) => item.city === selectedLocation && item.locality)
          .map((item) => item.locality)
      ),
    ]
    : localityData;

  const otherSelectionsCount =
    selectedLocalities.length + selectedProjectNames.length + selectedBuilders.length;

    const navigate = useNavigate();

  // Submit handlers for each tab
 const handleBuySubmit = (e) => {
  e.preventDefault();

  const isAnyFieldFilled =
    selectedLocation ||
    propertyType ||
    priceRange ||
    selectedLocalities.length > 0 ||
    selectedProjectNames.length > 0 ||
    selectedBuilders.length > 0;

  if (isAnyFieldFilled) {
    const filterData = {
      location: selectedLocation,
      locality: selectedLocalities,     // array
      projectNames: selectedProjectNames, // array
      builders: selectedBuilders,       // array
      propertyType,
      priceRange,
    };

    navigate("/listing", { state: filterData });

    // Optional reset here
    setSelectedLocation(null);
    setPropertyType("");
    setPriceRange("");
    setSelectedLocalities([]);
    setSelectedProjectNames([]);
    setSelectedBuilders([]);
  } else {
    alert("Please fill at least one field to continue.");
  }
};

  const handleNewProjectSubmit = (e) => {
   e.preventDefault();

  const isAnyFieldFilled =
    selectedLocation ||
    propertyType ||
    priceRange ||
    selectedLocalities.length > 0 ||
    selectedProjectNames.length > 0 ||
    selectedBuilders.length > 0;

  if (isAnyFieldFilled) {
    const filterData = {
      location: selectedLocation,
      locality: selectedLocalities,     // array
      projectNames: selectedProjectNames, // array
      builders: selectedBuilders,       // array
      propertyType,
      priceRange,
    };

    navigate("/newprojects", { state: filterData });

    // Optional reset here
    setSelectedLocation(null);
    setPropertyType("");
    setPriceRange("");
    setSelectedLocalities([]);
    setSelectedProjectNames([]);
    setSelectedBuilders([]);
  } else {
    alert("Please fill at least one field to continue.");
  }
  };

  const handleProjectSubmit = (e) => {
    e.preventDefault();

  const isAnyFieldFilled =
    selectedLocation ||
    propertyType ||
    priceRange ||
    selectedLocalities.length > 0 ||
    selectedProjectNames.length > 0 ||
    selectedBuilders.length > 0;

  if (isAnyFieldFilled) {
    const filterData = {
      location: selectedLocation,
      locality: selectedLocalities,     // array
      projectNames: selectedProjectNames, // array
      builders: selectedBuilders,       // array
      propertyType,
      priceRange,
    };

    navigate("/projects", { state: filterData });

    // Optional reset here
    setSelectedLocation(null);
    setPropertyType("");
    setPriceRange("");
    setSelectedLocalities([]);
    setSelectedProjectNames([]);
    setSelectedBuilders([]);
  } else {
    alert("Please fill at least one field to continue.");
  }
  };

  const getSubmitHandler = () => {
    if (activeTab === "buy") return handleBuySubmit;
    if (activeTab === "new") return handleNewProjectSubmit;
    return handleProjectSubmit;
  };

  return (
    <form
      onSubmit={getSubmitHandler()}
      className="search-box bg-white rounded-full shadow-sm px-4 py-2 mx-2 w-full max-w-[802px] relative"
    >
      <div className="flex flex-col md:flex-row items-center gap-2">
        {/* Input Field */}
        <div className="flex items-center gap-2 relative w-full">
          <FaMapMarkerAlt className="text-[#FFD700]" />
          <div
            onClick={() => setDropdownVisible(true)}
            onBlur={() => setTimeout(() => setDropdownVisible(false), 200)}
            tabIndex={0}
            className="py-2 px-2 outline-0 rounded-full w-[200px] min-h-[42px] bg-white cursor-pointer flex items-center gap-2 flex-wrap"
          >
            {selectedLocation ? (
              <div className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full flex items-center text-sm">
                {selectedLocation}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLocation(null);
                  }}
                  className="ml-2 text-gray-500 hover:text-red-600 focus:outline-none"
                >
                  &times;
                </button>
              </div>
            ) : (
              <span className="text-gray-400">Search by...</span>
            )}

            {otherSelectionsCount > 0 && (
              <span className="text-gray-500 text-sm ml-2">+{otherSelectionsCount} more</span>
            )}
          </div>

          {/* Dropdown */}
          {dropdownVisible && (
            <div className="absolute top-12 left-0 bg-white shadow-md rounded-md w-full z-50 max-h-[240px] overflow-y-auto p-4">
              <div>
                <h4 className="text-gray-700 text-base font-semibold mb-1">Location</h4>
                <ul className="mb-2">
                  {locationData.map((location, i) => (
                    <li
                      key={i}
                      className="text-gray-800 text-sm py-1 cursor-pointer hover:text-[#FFD700]"
                      onClick={() => {
                        setSelectedLocation(location);
                      }}
                    >
                      {location}
                    </li>
                  ))}
                </ul>

                <h4 className="text-gray-700 text-base font-semibold mb-1">Locality</h4>
                <ul>
                  {filteredLocality.map((locality, i) => (
                    <li
                      key={i}
                      className="text-gray-800 text-sm py-1 cursor-pointer hover:text-[#FFD700]"
                      onClick={() => {
                        if (!selectedLocalities.includes(locality)) {
                          setSelectedLocalities((prev) => [...prev, locality]);
                        }
                      }}
                    >
                      {locality}
                    </li>
                  ))}
                </ul>

                <h4 className="text-gray-700 text-base font-semibold mb-1">Project Name</h4>
                <ul>
                  {titleData.map((title, i) => (
                    <li
                      key={i}
                      className="text-gray-800 text-sm py-1 cursor-pointer hover:text-[#FFD700]"
                      onClick={() => {
                        if (!selectedProjectNames.includes(title)) {
                          setSelectedProjectNames((prev) => [...prev, title]);
                        }
                      }}
                    >
                      {title}
                    </li>
                  ))}
                </ul>

                <h4 className="text-gray-700 text-base font-semibold mb-1">Builder</h4>
                <ul>
                  {builderData.map((builder, i) => (
                    <li
                      key={i}
                      className="text-gray-800 text-sm py-1 cursor-pointer hover:text-[#FFD700]"
                      onClick={() => {
                        if (!selectedBuilders.includes(builder)) {
                          setSelectedBuilders((prev) => [...prev, builder]);
                        }
                      }}
                    >
                      {builder}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <span className="mx-2 text-gray-800 md:block hidden lg:block">|</span>
        </div>

        {/* Property Type Dropdown */}
        <div className="flex items-center gap-2 mt-[13px] md:mt-[0]">
          <FaHome className="text-[#FFD700] text-[1.4rem]" />
          <select
            className="py-2 rounded-lg outline-none text-gray-700 cursor-pointer w-[130px]"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="">Select Property</option>
            {categoryData.map((category, i) => (
              <option value={category} key={i}>
                {category}
              </option>
            ))}
          </select>
          <span className="mx-2 text-gray-800 md:block hidden lg:block">|</span>
        </div>

        {/* Price Dropdown */}
        <div className="flex items-center gap-2">
          <FaRupeeSign className="text-[#FFD700] text-[1.4rem]" />
          <select
            className="py-2 rounded-lg outline-none text-gray-700 cursor-pointer lg:w-[130px]"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="">Price Range</option>
            <option value="bellow1cr">Below 1 CR</option>
            <option value="1CR-2CR">1 CR - 2 CR</option>
            <option value="2CR-3CR">2 CR - 3 CR</option>
            <option value="3CR-4CR">3 CR - 4 CR</option>
            <option value="4CR-5CR">4 CR - 5 CR</option>
          </select>
          <span className="mx-2 text-gray-800 md:block hidden lg:block">|</span>
        </div>

        {/* Search Button */}
        <div className="mt-[-8px] md:mt-[0]">
          <button
            type="submit"
            className="ml-auto bg-[#FFD700] hover:bg-yellow-500 text-white px-3 lg:px-6 py-2 rounded-full flex items-center space-x-2 w-full"
          >
            <FaSearch className="me-2" />
            <span>Search</span>
          </button>
        </div>
      </div>
    </form>
  );
}
