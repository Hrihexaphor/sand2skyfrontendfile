import React, { useState, useRef, useEffect } from "react";
import NewNav from "../header/NewNav";
import Footer from "../footer/Footer";
import { FaSearch, FaMapMarkerAlt, FaRupeeSign, FaBath, FaHome, FaTimes } from "react-icons/fa";
import { FaArrowsLeftRightToLine, FaBuildingCircleExclamation } from "react-icons/fa6";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { GiSofa } from "react-icons/gi";
import { IoBed } from "react-icons/io5";
import { MdBalcony } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import AdCards from "../advertisement/AdvertiseCard";
import FilterBar from "../homepage/FilterBar";
import axios from 'axios';


const AdComponent = () => (
    <div className="w-full bg-yellow-100 text-center p-4 my-4 rounded">
        📢 This is an Ad Banner
    </div>
);

const FeaturedProperty = () => {

    const navigate = useNavigate();

    // Convert price to Lac or Cr format
    function formatPrice(price) {
        const num = parseInt(price, 10);
        if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `${(num / 100000).toFixed(2)} Lac`;
        return num.toLocaleString(); // fallback
    }

    // Format date string to "DD MMM YYYY"
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }
    // --------------- API INTEGRATION --------->
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalImages, setModalImages] = useState([]);
    const [pname, setPname] = useState("");

    const [selectedFilters, setSelectedFilters] = useState({ type: "Buy" });
    const [localities, setLocalities] = useState([]);
    // const [propertyTypes, setPropertyTypes] = useState([]);
    const [cities, setCities] = useState([]);
    const [search, setSearch] = useState("");

    const filterSelectType = selectedFilters.selectType;
    const filterStatus = selectedFilters.status;

    const [city, setCity] = useState("");
    
    // Detect city on mount
    useEffect(() => {
      const getCity = async () => {
        try {
          const res = await axios.get("https://ipapi.co/json/");
          setCity(res.data.city || "Bhubaneswar"); // fallback if empty
        } catch (error) {
          console.error("Failed to detect city, using fallback:", error);
          setCity("Bhubaneswar");
        }
      };
    
      getCity();
    }, []);
    
    useEffect(() => {
      if (!city) return; // wait for city detection
    
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/featured-properties-lite`, {
          withCredentials: true,
        })
        .then((res) => {
          const now = new Date();
          
          const filteredProperties = res.data.filter((property) => {
            // Check if the property is currently featured (active)
            const start = new Date(property.featured_from);
            const end = new Date(property.featured_to);
            const isActive = now >= start && now <= end;
            
            // Check if the detected city matches any city in city_names array
            const cityMatch = property.city_names?.some(
              (cityName) => cityName.trim().toLowerCase() === city.trim().toLowerCase()
            );
            
            // If user's city matches, show the property
            // If user's city doesn't match, only show if it's a Bhubaneswar property
            const shouldShow = cityMatch || property.city_names?.some(
              (cityName) => cityName.trim().toLowerCase() === "bhubaneswar"
            );
            
            return isActive && shouldShow;
          });
    
           setProperties(filteredProperties);
                console.log(setProperties)
                setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }, [city]); // Add city as dependency

    // useEffect(() => {
    //     axios.get(`${process.env.REACT_APP_BASE_URL}/featured-properties-lite`, {
    //         withCredentials: true, // replaces fetch's `credentials: 'include'`
    //     })
    //         .then((res) => {
    //             setProperties(res.data);
    //             console.log(setProperties)
    //             setLoading(false);
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching data:', error);
    //             setLoading(false);
    //         });
    // }, []);
    // --------------- API INTEGRATION END -------> 

    useEffect(() => {
        if (properties.length > 0) {
            setLocalities([...new Set(properties.map((p) => p.locality).filter(Boolean))]);
            // setPropertyTypes([...new Set(properties.map((p) => p.subcategory_name).filter(Boolean))]);
            setCities([...new Set(properties.map((p) => p.city).filter(Boolean))]);
        }
    }, [properties]);

    const handleImageClick = async (property) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/${property.id}/images`, {
                withCredentials: true,
            });
            setModalImages(res.data.images);
            setPname(property.project_name || "Property Name");
            setShowModal(true);
        } catch (error) {
            console.error("Error fetching image data:", error);
        }
    };

    const [page, setPage] = useState(1);
    const listRef = useRef();
    useEffect(() => {
        listRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [page]);
    // ======================== main filter ===================>
    const budgetRange = {
        "< 1 Cr": { min: 0, max: 10000000 },
        "1Cr-2Cr": { min: 10000000, max: 20000000 },
        "2Cr-3Cr": { min: 20000000, max: 30000000 },
        "3Cr-4Cr": { min: 30000000, max: 40000000 },
        "> 4Cr": { min: 40000000, max: Infinity },
    };

    const filteredProperties = properties.filter((property) => {
        const expectedPrice = Number(property.expected_price);

        if (
            selectedFilters.cities &&
            property.city &&
            property.city.toLowerCase() !== selectedFilters.cities.toLowerCase()
        ) return false;

        if (
            selectedFilters.localities &&
            property.locality &&
            property.locality.toLowerCase() !== selectedFilters.localities.toLowerCase()
        ) return false;

        if (
            selectedFilters.propertyType &&
            property.subcategory_name &&
            property.subcategory_name.toLowerCase() !== selectedFilters.propertyType.toLowerCase()
        ) return false;

        if (selectedFilters.bhk) {
            const propBhk = Number(property.bedrooms);
            if (selectedFilters.bhk === "4+ BHK") {
                if (propBhk < 4) return false;
            } else {
                const filterBhk = Number(selectedFilters.bhk.split(" ")[0]);
                if (propBhk !== filterBhk) return false;
            }
        }

        if (selectedFilters.budget) {
            const budgetInfo = budgetRange[selectedFilters.budget];
            if (!budgetInfo || expectedPrice < budgetInfo.min || expectedPrice > budgetInfo.max)
                return false;
        }

        // 9. Select Type
        if (filterSelectType && property.transaction_types?.toLowerCase().trim() !== filterSelectType.toLowerCase().trim()) {
            return false;
        }

        // 10. Status
        if (filterStatus && property.possession_status?.toLowerCase().trim() !== filterStatus.toLowerCase().trim()) {
            return false;
        }

        return true;
    });

     // ------- Search Filter ------>
  const searchFilter = filteredProperties.filter((property) =>
    property.project_name.toLowerCase().includes(search.toLowerCase())
  );


    const handleDetailsClick = (id) => {
        window.open(`/details/${id}`, '_blank');
    }

    return (
        <>
            <NewNav />
            <section className="bg-[#F4EFE5] pb-5 pt-10 md:pt-8 lg:pt-16" ref={listRef}>
                <div className="container">
                    <FilterBar
                        selected={selectedFilters}
                        setSelected={setSelectedFilters}
                        dynamicLocalities={
                            selectedFilters.cities
                                ? localities.filter(
                                    (loc) =>
                                        properties.find(
                                            (p) =>
                                                p.locality === loc &&
                                                p.city.toLowerCase() === selectedFilters.cities.toLowerCase()
                                        )
                                )
                                : localities
                        }
                        // dynamicPropertyTypes={propertyTypes}
                        dynamicCities={cities}
                    />
                    <div className="pl-heading1">
                        <h2 className="mb-2 text-2xl text-[#3C4142] font-bold font-geometric-regular">
                            Featured Property
                        </h2>
                        <div className="w-12 h-1 bg-yellow-500"></div>
                    </div>

                    <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                        {/* ------------ Left box ------------> */}
                        <div className="lg:col-span-2">
                            <div className="flex gap-2 items-center mt-4 mb-4">
                                <div className="flex items-center bg-[#fff] w-full py-[5px] px-[10px] rounded-[20px]">
                                    <FaSearch className="text-gray-500 mr-2" />
                                    <input
                                        type="text"
                                        placeholder="Search Project"
                                        className="search outline-none w-full bg-transparent"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* ======== Project Card ==========> */}
                            {loading ? (
                                <p className="text-center text-gray-600 text-lg py-6">Loading properties...</p>
                            ) : searchFilter.length === 0 ? (
                                <div className="text-center text-gray-600 text-lg py-6">
                                    No properties match your criteria.
                                </div>
                            ) : (
                                [...searchFilter]
                                    .sort((a, b) => (b.is_featured === true) - (a.is_featured === true)) // Featured first
                                    .map((property, index) => (
                                        <>
                                            <div key={index} className="bg-[#fff] rounded-lg mb-4 flex md:flex-row flex-col shadow-[0_4px_20px_rgba(0,95,107,0.2)]">
                                                <div onClick={() => handleImageClick(property)} className="md:w-[40%] relative list-imgbox cursor-pointer">
                                                    <img
                                                        src={property.primary_image}
                                                        alt={property.project_name}
                                                        className="w-[100%] h-[100%] rounded-tl-md md:rounded-bl-md object-cover"
                                                    />
                                                    {property.is_featured === true && (
                                                        <p className="text-white flex gap-1 items-center font-bold mt-2 absolute top-[1px] left-[3%] bg-yellow-500 py-[5px] px-[10px] rounded-[5px]">
                                                            Featured
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex-1 p-4 md:w-[60%]">
                                                    <h3 className="text-sm text-gray-500 semibold mb-0">{property.title}</h3>
                                                    <h3 className="text-lg text-[#3C4142] bold mb-3">{property.project_name}</h3>
                                                    <div className="flex gap-2 items-center mb-2">
                                                        <FaMapMarkerAlt className="text-[17px] text-[#367588]" />
                                                        <p className="text-gray-600 mb-0">
                                                            {property.locality}, {property.city}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-wrap justify-between items-center bg-[#F4EFE5] p-2 mb-2">
                                                        {/* Price */}
                                                        <div className="flex gap-2 items-center w-[50%] md:w-[33%] mb-2">
                                                            <FaRupeeSign className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                                                            <div>
                                                                <p className="text-[#3C4142] text-[13px] font-bold mb-0">Price</p>
                                                                <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">
                                                                    {formatPrice(property.expected_price)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {/* SBA */}
                                                        <div className="flex gap-2 items-center w-[50%] md:w-[33%] mb-2">
                                                            <FaArrowsLeftRightToLine className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                                                            <div>
                                                                <p className="text-[#3C4142] text-[13px] font-bold mb-0">SBA</p>
                                                                <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">
                                                                    {(property.category_name === "Project House/Villa" || property.category_name === "Project Apartment")
                                                                        ? property.configurations?.[0]?.super_built_up_area
                                                                        : property.super_built_up_area
                                                                    }
                                                                    sq.ft.
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {/* Furnishing */}
                                                        <div className="flex gap-2 items-center w-[50%] md:w-[33%]">
                                                            <GiSofa className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                                                            <div>
                                                                <p className="text-[#3C4142] text-[13px] font-bold mb-0">Furnishing</p>
                                                                <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.furnished_status}</p>
                                                            </div>
                                                        </div>
                                                        {/* Bedroom */}
                                                        <div className="flex gap-2 items-center w-[50%] md:w-[33%] mb-2">
                                                            <IoBed className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                                                            <div>
                                                                <p className="text-[#3C4142] text-[13px] font-bold mb-0">Bedroom</p>
                                                                <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">
                                                                    {(property.category_name === "Project House/Villa" || property.category_name === "Project Apartment")
                                                                        ? property.configurations?.[0]?.bedrooms
                                                                        : property.bedrooms
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {/* Bathroom */}
                                                        <div className="flex gap-2 items-center w-[50%] md:w-[33%]">
                                                            <FaBath className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                                                            <div>
                                                                <p className="text-[#3C4142] text-[13px] font-bold mb-0">Bathroom</p>
                                                                <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">
                                                                    {(property.category_name === "Project House/Villa" || property.category_name === "Project Apartment")
                                                                        ? property.configurations?.[0]?.bathrooms
                                                                        : property.bathrooms
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {/* Balcony */}
                                                        <div className="flex gap-2 items-center w-[50%] md:w-[33%]">
                                                            <MdBalcony className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                                                            <div>
                                                                <p className="text-[#3C4142] text-[13px] font-bold mb-0">Balcony</p>
                                                                <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">
                                                                    {(property.category_name === "Project House/Villa" || property.category_name === "Project Apartment")
                                                                        ? property.configurations?.[0]?.balconies
                                                                        : property.balconies
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Possession */}
                                                    <div className="flex lastbtn gap-2 justify-between">
                                                        <div className="flex gap-2 items-center">
                                                            <FaBuildingCircleExclamation className="text-[17px] text-[#367588]" />
                                                            <p className="text-[#3C4142] text-[13px] font-bold mb-0">
                                                                Possessioned By: <span className="text-gray-600 text-sm font-semibold">{formatDate(property.available_from)}</span>
                                                            </p>
                                                        </div>
                                                        <button
                                                            className="px-4 py-2 bg-[#367588] text-white rounded-md hover:bg-[#1386a8]"
                                                            onClick={() => handleDetailsClick(property.id)}
                                                        >
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            {index === 1 && <AdComponent />}
                                        </>
                                    ))
                            )}
                        </div>

                        {/* ------- right box ------- */}
                        <div className="block lg:flex flex-col gap-4 p-4">
                            <AdCards location="home" />
                        </div>
                    </div>

                </div>
            </section>
            {/* ----------- Modal ------------- */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-full mx-2 md:mx-5 max-w-4xl rounded shadow-lg p-6 relative">
                        <div className="flex items-center justify-between mb-2">
                            <h1 className="text-xl font-semibold">{pname}</h1>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setShowModal(false)}
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <div className="flex flex-wrap -mx-1 max-h-[80vh] overflow-y-auto">
                            {modalImages.map((img) => (
                                <div key={img.image_id} className="w-full sm:w-1/2 px-1 mb-2">
                                    <img
                                        src={img.image_url}
                                        alt=""
                                        className="md:h-[300px] lg:h-[300px] w-full object-cover rounded"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            )}
            <Footer />
        </>
    );
};

export default FeaturedProperty;
