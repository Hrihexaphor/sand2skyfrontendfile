import React, { useState, useEffect } from "react";
import {
    FaTimes, FaMapMarkerAlt, FaRupeeSign, FaHome, FaBath
} from "react-icons/fa";
import {
    FaArrowsLeftRightToLine,
    FaBuildingCircleExclamation
} from "react-icons/fa6";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { GiSofa } from "react-icons/gi";
import NewNav from "../header/NewNav";
import Footer from "../footer/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import AdCards from "../advertisement/AdvertiseCard";
import axios from "axios";
import FilterBar from "./FilterBar";

const AdComponent = () => (
    <div className="w-full bg-yellow-100 text-center p-4 my-4 rounded">
        📢 This is an Ad Banner
    </div>
);

const formatPrice = (price) => {
    const num = Number(price);
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)} Lac`;
    return num.toLocaleString();
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "-";
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const Filtertest = () => {
    const navigate = useNavigate();
    
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalImages, setModalImages] = useState([]);
    const [pname, setPname] = useState("");
    
    const [selectedFilters, setSelectedFilters] = useState({ type: "Buy" });
    const [localities, setLocalities] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/getminimumproperty`, {
            withCredentials: true,
        })
            .then((res) => {
                setProperties(res.data);
                setLocalities([...new Set(res.data.map(p => p.locality).filter(Boolean))]);
                setPropertyTypes([...new Set(res.data.map(p => p.subcategory_name).filter(Boolean))]);
                setCities([...new Set(res.data.map(p => p.city).filter(Boolean))]);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching properties:", err);
                setLoading(false);
            });
    }, []);

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

        return true;
    });

    const handleDetailsClick = (id) => {
        navigate(`/details/${id}`);
    };

    const handleImageClick = async (property) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/${property.id}/images`, {
                withCredentials: true,
            });
            setModalImages(res.data.images || []);
            setPname(property.project_name || "Property Name");
            setShowModal(true);
        } catch (err) {
            console.error("Error fetching images:", err);
        }
    };

    return (
        <div>
            <NewNav />
            <div className="bg-[#F4EFE5] pt-[10%]">
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
                        dynamicPropertyTypes={propertyTypes}
                        dynamicCities={cities}
                    />
                    <div className="pl-heading">
                        <h2 className="mb-2 text-2xl text-[#3C4142] font-bold">
                            Filter test
                        </h2>
                        <div className="w-12 h-1 bg-yellow-500"></div>
                    </div>
                </div>
            </div>

            <div className="bg-[#F4EFE5] pt-[10%] min-h-screen p-4">
                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                    <div className="lg:col-span-2">
                        {loading ? (
                            <p className="text-center text-gray-600 text-lg py-6">Loading properties...</p>
                        ) : filteredProperties.length === 0 ? (
                            <p className="text-center text-gray-600 text-lg py-6">No properties match your criteria.</p>
                        ) : (
                            filteredProperties.map((property, idx) => (
                                <React.Fragment key={property.id || idx}>
                                    <div className="bg-[#fff] rounded-lg mb-4 flex md:flex-row flex-col shadow-[0_4px_20px_rgba(0,95,107,0.2)]">
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
                                                            {property.built_up_area} sq.ft.
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* Per sq.ft. */}
                                                <div className="flex gap-2 items-center w-[50%] md:w-[33%] mb-2">
                                                    <RiMoneyRupeeCircleLine className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                                                    <div>
                                                        <p className="text-[#3C4142] text-[13px] font-bold mb-0">Per sq.ft.</p>
                                                        <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">
                                                            {property.price_per_sqft}
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* Carpet Area */}
                                                <div className="flex gap-2 items-center w-[50%] md:w-[33%]">
                                                    <FaHome className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                                                    <div>
                                                        <p className="text-[#3C4142] text-[13px] font-bold mb-0">Carpet Area</p>
                                                        <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.carpet_area} sq.ft.</p>
                                                    </div>
                                                </div>
                                                {/* Bathroom */}
                                                <div className="flex gap-2 items-center w-[50%] md:w-[33%]">
                                                    <FaBath className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                                                    <div>
                                                        <p className="text-[#3C4142] text-[13px] font-bold mb-0">Bathroom</p>
                                                        <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.bathrooms}</p>
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
                                            </div>
                                            {/* Possession */}
                                            <div className="flex gap-4 items-center mb-2">
                                                <div className="flex gap-2 items-center">
                                                    <FaBuildingCircleExclamation className="text-[17px] text-[#367588]" />
                                                    <p className="text-gray-600 mb-0">
                                                        Possessioned By: {formatDate(property.available_from)}
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Developer */}
                                            <div className="flex bg-[#f4efe5] py-[2px] px-[13px]">
                                                <small className="text-[12px] font-bold">Property Listed By:</small>
                                                <p className="text-gray-600 mb-0 mt-[-4px]">{property.developer_name}</p>
                                            </div>
                                            {/* CTA */}
                                            <div className="flex float-right mt-2">
                                                <button
                                                    className="px-4 py-2 bg-[#367588] text-white rounded-md hover:bg-[#1386a8]"
                                                    onClick={() => handleDetailsClick(property.id)}
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {idx === 1 && <AdComponent />}
                                </React.Fragment>
                            ))
                        )}
                    </div>
                    <div className="flex flex-col gap-4 p-4">
                        <AdCards />
                    </div>
                </div>
            </div>

            <Footer />

            {/* Image Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white w-full max-w-4xl rounded shadow-lg p-6 relative max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-xl font-semibold">{pname}</h1>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setShowModal(false)}
                                aria-label="Close modal"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <div className="flex flex-wrap -mx-1">
                            {modalImages.map((img) => (
                                <div key={img.image_id} className="w-full sm:w-1/2 px-1 mb-2">
                                    <img
                                        src={img.image_url}
                                        alt="Property"
                                        className="w-full rounded object-cover h-[300px]"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Filtertest;
