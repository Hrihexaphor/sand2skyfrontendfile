import React, { useState, useRef, useEffect } from "react";
import {
    FaTimes,
    FaMapMarkerAlt,
    FaRupeeSign,
    FaHome,
    FaBath,
} from "react-icons/fa";
import { FaArrowsLeftRightToLine, FaBuildingCircleExclamation } from "react-icons/fa6";
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

// Format price (Lac, Cr)
function formatPrice(price) {
    const num = Number(price);
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)} Lac`;
    return num.toLocaleString();
}

// Format date to DD MMM YYYY
function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) return "-";
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

const Filtertest = () => {
    const navigate = useNavigate();
    const [selectedFilters, setSelectedFilters] = useState({ type: "Buy" });
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalImages, setModalImages] = useState([]);
    const [pname, setPname] = useState("");
    const [localities, setLocalities] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState([]);

    // Fetch properties once on mount
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_BASE_URL}/getminimumproperty`, {
                withCredentials: true,
            })
            .then((res) => {
                setProperties(res.data);

                // Extract unique localities and property types
                const uniqueLocalities = [
                    ...new Set(res.data.map((p) => p.locality).filter(Boolean)),
                ];
                const uniqueTypes = [
                    ...new Set(res.data.map((p) => p.subcategory_name).filter(Boolean)),
                ];

                setLocalities(uniqueLocalities);
                setPropertyTypes(uniqueTypes);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching properties:", err);
                setLoading(false);
            });
    }, []);

    // Filter properties based on selected filters
    const filteredProperties = properties.filter((property) => {
        // Filter by locality
        if (
            selectedFilters.locality &&
            property.locality?.toLowerCase() !== selectedFilters.locality.toLowerCase()
        )
            return false;

        // Filter by property type
        if (
            selectedFilters.propertyType &&
            property.subcategory_name?.toLowerCase() !== selectedFilters.propertyType.toLowerCase()
        )
            return false;

        // Filter by BHK (bedrooms)
        if (selectedFilters.bhk) {
            const propBhk = Number(property.bedrooms);

            if (selectedFilters.bhk === "4+ BHK") {
                if (propBhk < 4) return false;
            } else {
                const filterBhk = Number(selectedFilters.bhk.split(" ")[0]);
                if (propBhk !== filterBhk) return false;
            }
        }

        // Filter by budget
        if (selectedFilters.minBudget) {
            if (Number(property.expected_price) < Number(selectedFilters.minBudget))
                return false;
        }
        if (selectedFilters.maxBudget) {
            if (Number(property.expected_price) > Number(selectedFilters.maxBudget))
                return false;
        }

        return true;
    });

    // Navigate to details page
    const handleDetailsClick = (id) => {
        navigate(`/details/${id}`);
    };

    // Fetch images for modal
    const handleImageClick = async (property) => {
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/${property.id}/images`,
                { withCredentials: true }
            );
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
                        dynamicLocalities={localities}
                        dynamicPropertyTypes={propertyTypes}
                    />
                    <div className="pl-heading">
                        <h2 className="mb-2 text-2xl text-[#3C4142] font-bold font-geometric-regular">
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
                            <p className="text-center text-gray-600 text-lg py-6">
                                Loading properties...
                            </p>
                        ) : filteredProperties.length === 0 ? (
                            <p className="text-center text-gray-600 text-lg py-6">
                                No properties match your criteria.
                            </p>
                        ) : (
                            filteredProperties
                                .sort(
                                    (a, b) => (b.is_featured === true) - (a.is_featured === true)
                                ) // featured first
                                .map((property, idx) => (
                                    <React.Fragment key={property.id || idx}>
                                        <div className="bg-white rounded-lg mb-4 flex flex-col md:flex-row shadow-[0_4px_20px_rgba(0,95,107,0.2)]">
                                            <div
                                                onClick={() => handleImageClick(property)}
                                                className="md:w-[40%] relative cursor-pointer"
                                            >
                                                <img
                                                    src={property.primary_image}
                                                    alt={property.project_name}
                                                    className="w-full h-full rounded-tl-md md:rounded-bl-md object-cover"
                                                />
                                                {property.is_featured && (
                                                    <p className="absolute top-1 left-3 bg-yellow-500 text-white font-bold py-1 px-3 rounded">
                                                        Featured
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex-1 p-4 md:w-[60%]">
                                                <h3 className="text-sm text-gray-500 font-semibold mb-0">
                                                    {property.title}
                                                </h3>
                                                <h3 className="text-lg text-[#3C4142] font-bold mb-3">
                                                    {property.project_name}
                                                </h3>
                                                <div className="flex gap-2 items-center mb-2">
                                                    <FaMapMarkerAlt className="text-[17px] text-[#367588]" />
                                                    <p className="text-gray-600 mb-0">
                                                        {property.locality}, {property.city}
                                                    </p>
                                                </div>
                                                <div className="flex flex-wrap justify-between items-center bg-[#F4EFE5] p-2 mb-2">
                                                    <div className="flex gap-2 items-center w-1/2 md:w-1/3 mb-2">
                                                        <FaRupeeSign className="text-[17px] bg-[#367588] text-white h-6 w-6 rounded-full p-1" />
                                                        <div>
                                                            <p className="text-[#3C4142] text-[13px] font-bold mb-0">
                                                                Price
                                                            </p>
                                                            <p className="text-gray-600 text-[13px] mb-0 mt-0">
                                                                {formatPrice(property.expected_price)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 items-center w-1/2 md:w-1/3 mb-2">
                                                        <FaArrowsLeftRightToLine className="text-[17px] bg-[#367588] text-white h-6 w-6 rounded-full p-1" />
                                                        <div>
                                                            <p className="text-[#3C4142] text-[13px] font-bold mb-0">
                                                                SBA
                                                            </p>
                                                            <p className="text-gray-600 text-[13px] mb-0 mt-0">
                                                                {property.built_up_area} sq.ft.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 items-center w-1/2 md:w-1/3 mb-2">
                                                        <RiMoneyRupeeCircleLine className="text-[17px] bg-[#367588] text-white h-6 w-6 rounded-full p-1" />
                                                        <div>
                                                            <p className="text-[#3C4142] text-[13px] font-bold mb-0">
                                                                Per sq.ft.
                                                            </p>
                                                            <p className="text-gray-600 text-[13px] mb-0 mt-0">
                                                                {property.price_per_sqft}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 items-center w-1/2 md:w-1/3">
                                                        <FaHome className="text-[17px] bg-[#367588] text-white h-6 w-6 rounded-full p-1" />
                                                        <div>
                                                            <p className="text-[#3C4142] text-[13px] font-bold mb-0">
                                                                Carpet Area
                                                            </p>
                                                            <p className="text-gray-600 text-[13px] mb-0 mt-0">
                                                                {property.carpet_area} sq.ft.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 items-center w-1/2 md:w-1/3">
                                                        <FaBath className="text-[17px] bg-[#367588] text-white h-6 w-6 rounded-full p-1" />
                                                        <div>
                                                            <p className="text-[#3C4142] text-[13px] font-bold mb-0">
                                                                Bathroom
                                                            </p>
                                                            <p className="text-gray-600 text-[13px] mb-0 mt-0">
                                                                {property.bathrooms}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 items-center w-1/2 md:w-1/3">
                                                        <GiSofa className="text-[17px] bg-[#367588] text-white h-6 w-6 rounded-full p-1" />
                                                        <div>
                                                            <p className="text-[#3C4142] text-[13px] font-bold mb-0">
                                                                Furnishing
                                                            </p>
                                                            <p className="text-gray-600 text-[13px] mb-0 mt-0">
                                                                {property.furnished_status || "-"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4 items-center mb-2">
                                                    <FaBuildingCircleExclamation className="text-[17px] text-[#367588]" />
                                                    <p className="text-gray-600 mb-0">
                                                        Possessioned By: {formatDate(property.available_from)}
                                                    </p>
                                                </div>
                                                <div className="flex bg-[#f4efe5] py-1 px-3 mb-2">
                                                    <small className="text-[12px] font-bold mr-1">
                                                        Property Listed By:
                                                    </small>
                                                    <p className="text-gray-600 mb-0">{property.developer_name}</p>
                                                </div>
                                                <div className="flex justify-end mt-2">
                                                    <button
                                                        className="px-4 py-2 bg-[#367588] text-white rounded-md hover:bg-[#1386a8]"
                                                        onClick={() => handleDetailsClick(property.id)}
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Show ad after second item */}
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
                                        alt={`Property image`}
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
