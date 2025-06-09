import React, { useState, useEffect } from "react";
import AdCards from "../advertisement/AdvertiseCard";
import { FaMapMarkerAlt, FaRupeeSign, FaBath, FaHome, FaTimes } from "react-icons/fa";
import { FaBuildingCircleExclamation, FaArrowsLeftRightToLine } from "react-icons/fa6";
import { GiSofa } from "react-icons/gi";
import { IoBed } from "react-icons/io5";
import { MdBalcony } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';



const ReadyToMove = () => {

  const [search, setSearch] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [pname, setPname] = useState("");


  // --------------- API INTEGRATION START -------> 
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/getreadytomoveproperty`, {
      withCredentials: true, // replaces fetch's `credentials: 'include'`
    })
      .then((res) => {
        setProperties(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);
  // --------------- API INTEGRATION END -------> 

  const handleDetailsClick = (id) => {
    window.open(`/details/${id}`, '_blank');
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

  // ------- Search Filter ------>
  const filteredProperties = properties.filter((property) =>
    property.project_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleNavigate = () => {
    window.open("/postreq?tab=Sell", "_blank");
  };

  return (
    <>
      <div className="bg-[#F4EFE5]" id="ready-to-move-section">
        <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 pt-20">
          {/* Left - Property Listings */}
          <div className="lg:col-span-2">
            <div className="mb-3">
              <h2 className="mb-2 text-2xl font-bold  font-geometric-regular text-[#3C4142] ">
                Ready to Move-In Properties
              </h2>
              <div className="w-12 h-1 bg-yellow-500"></div>
            </div>
            <input
              type="text"
              placeholder="Search properties..."
              className="w-full p-3 border outline-[#F5F5DC] border-gray-300 rounded-lg mb-6 font-sans"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="space-y-6 h-[800px] overflow-y-auto p-2">
              {loading ? (
                <p className="text-center text-gray-600 text-lg py-6">Loading properties...</p>
              ) : (
                [...filteredProperties]
                  .sort((a, b) => (b.is_featured === true) - (a.is_featured === true)) // Featured first
                  .map((property, index) => (
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
                                {formatPrice(property.price)}
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
                  ))
              )}
            </div>
          </div>
          {/* Right - Ads & Promotions */}
          <div className="block lg:flex flex-col gap-4 p-4">
            <AdCards location="home" />

            <div className="bg-white shadow-lg p-4 rounded-lg">
              <p className="text-sm font-bold font-sans">
                Property Owner or Developer ? Sell your property fast with us!
              </p>
              <button onClick={handleNavigate} className="bg-purple-500 text-white px-4 py-2 rounded mt-2 w-full font-sans">
                Post your property for FREE
              </button>
            </div>
          </div>
        </div>
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
    </>
  );
};

export default ReadyToMove;
