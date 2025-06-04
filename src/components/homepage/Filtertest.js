import React, { useState, useRef, useEffect } from "react";
import { FaAngleDown, FaTimes, FaSearch, FaMapMarkerAlt, FaRupeeSign, FaHome, FaBath, FaUserTie } from "react-icons/fa";
import { FaArrowsLeftRightToLine, FaBuildingCircleExclamation } from "react-icons/fa6";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { GiSofa } from "react-icons/gi";
import { FaFilter } from "react-icons/fa";
import { ChevronRightIcon, ChevronLeftIcon } from 'lucide-react';
import NewNav from "../header/NewNav";
import Footer from "../footer/Footer";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AdCards from "../advertisement/AdvertiseCard";
import { IoIosArrowDown } from "react-icons/io";
import axios from 'axios';
import FilterBar from "./FilterBar";

const AdComponent = () => (
    <div className="w-full bg-yellow-100 text-center p-4 my-4 rounded">
        📢 This is an Ad Banner
    </div>
);

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

const Filtertest = () => {

    const location = useLocation();
    const navigate = useNavigate();

    // Filter data passed via navigate state (from previous page)
    const passedFilter = location.state || {};

    // API data
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalImages, setModalImages] = useState([]);
    const [pname, setPname] = useState("");

    // UI states
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const listRef = useRef();

    // Scroll on page change (pagination)
    useEffect(() => {
        listRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [page]);

    // Fetch properties from API once
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_BASE_URL}/getminimumproperty`, {
                withCredentials: true,
            })
            .then((res) => {
                setProperties(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    // Helpers to parse budgets/prices from strings
    const parseBudget = (val) => {
        if (!val) return null;
        const num = parseFloat(val.replace(/[^0-9.]/g, ""));
        return val.toLowerCase().includes("cr") ? num * 10000000 : num;
    };


    const handleDetailsClick = (id) => {
        navigate(`/details/${id}`);
    }
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


    return (

        <div>
            <NewNav />
            <div className="bg-[#F4EFE5] pt-[10%]" ref={listRef}>
                <div className="container">
                    <FilterBar/>
                    {/* --------- Filter Bar ----------> */}
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
                    {/* ------------ left box ---------- */}
                    <div className="lg:col-span-2">
                        {loading ? (
                            <p className="text-center text-gray-600 text-lg py-6">Loading properties...</p>
                        ) : properties.length === 0 ? (
                            <div className="text-center text-gray-600 text-lg py-6">
                                No properties match your criteria.
                            </div>
                        ) : (
                            [...properties]
                                .sort((a, b) => (b.is_featured === true) - (a.is_featured === true)) // Featured first
                                .map((property, index) => (
                                    <React.Fragment key={index}>
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
                                        {index === 1 && <AdComponent />}
                                    </React.Fragment>
                                ))
                        )}
                    </div>

                    {/* ------- right box ------- */}
                    <div className="block lg:flex flex-col gap-4 p-4">
                        <AdCards />
                    </div>
                </div>
            </div>
            <Footer />
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
        </div>
    );
};

export default Filtertest;
