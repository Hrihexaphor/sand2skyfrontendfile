import React, {useState, useEffect} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBuildingUser, FaArrowsLeftRightToLine } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import {
  FaSwimmingPool,
  FaRupeeSign,
  FaCar,
  FaDumbbell,
  FaMapMarkerAlt
} from "react-icons/fa";

const PropertyListing = () => {

  const navigate = useNavigate();

  const amenities = [
    { icon: <FaSwimmingPool />, label: "House" },
    { icon: <FaCar />, label: "PG" },
    { icon: <FaCar />, label: "Plots" },
    { icon: <FaDumbbell />, label: "Apartments" },
    // { icon: <FaUtensils />, label: "Restaurant" },
  ];
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // --------------- API INTEGRATION --------->
      const [properties, setProperties] = useState([]);
      const [loading, setLoading] = useState(true);
    
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
      // --------------- API INTEGRATION END ------->
  
      // Convert price to Lac or Cr format
    function formatPrice(price) {
      const num = parseInt(price, 10);
      if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
      if (num >= 100000) return `${(num / 100000).toFixed(2)} Lac`;
      return num.toLocaleString(); // fallback
    }

    const handleDetailsClick = (id) => {
    navigate(`/details/${id}`);
  };

  const handleDeveloper = (developer_name) => {
    if (developer_name) {
      navigate(
        `/builderProject?developer_name=${encodeURIComponent(developer_name)}`
      );
    } else {
      console.warn("Developer Name is undefined");
    }
  };

  return (
    <>
      <div className="bg-[#F4EFE5]" id="project-section">
        <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 ">
          {/* Left Side - Property Listings */}
          <div className="lg:col-span-3 space-y-6 pt-20">
            {/* Featured Property Carousel */}
            <div>
              <div className="mb-3">
                <h2 className="mb-2 text-2xl text-[#3C4142] font-bold font-geometric-regular">Listing project</h2>
                <div className="w-12 h-1 bg-yellow-500"></div>
              </div>
              <Slider {...settings}>
                {properties.slice(0, 5).map((property, index) => (
                <div
                  key={index}
                  className="px-2"
                >
                  <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative">
                      <img
                        src={property.primary_image}
                        alt="Property"
                        className="w-full h-48 object-cover"
                      />
                      {property.is_featured === true && (
                      <p className="text-white flex gap-1 items-center font-bold mt-2 absolute top-[1px] left-[3%] bg-yellow-500 text-[#fff] py-[5px] px-[10px] rounded-[5px]">
                        Featured
                      </p>
                    )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-lg text-[#3C4142] bold mb-1 mt-[-2px]">
                        {property.project_name}
                      </h3>
                      <div className="flex flex-wrap justify-between items-center">
                        <div className="flex gap-2 items-center w-[50%] mb-2">
                          <FaRupeeSign className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                          <div>
                            <p className="text-[#3C4142] text-[13px] font-bold mb-0">Price</p>
                            <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{formatPrice(property.expected_price)}</p>
                          </div>

                        </div>
                        <div className="flex gap-2 items-center w-[50%]  mb-2">
                          <IoHome className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                          <div>
                            <p className="text-[#3C4142] text-[13px] font-bold mb-0">Type</p>
                            <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.subcategory_name}</p>
                          </div>

                        </div>
                        <div className="flex gap-2 items-center w-[50%] mb-2">
                          <FaArrowsLeftRightToLine className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                          <div>
                            <p className="text-[#3C4142] text-[13px] font-bold mb-0">SBA</p>
                            <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.built_up_area} sq.ft</p>
                          </div>
                        </div>
                        <div className="flex gap-2 items-center w-[50%]">
                          <FaBuildingUser className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                          <div>
                            <p className="text-[#3C4142] text-[13px] font-bold mb-0">Builder</p>
                            <p className="text-gray-600 text-[13px] mb-0 mt-[0px] cursor-pointer w-[102px] overflow-hidden text-ellipsis whitespace-nowrap" onClick={() => handleDeveloper(property.developer_name)}>{property.developer_name}</p>
                          </div>

                        </div>
                      </div>
                      <div className="flex gap-2 items-center mb-2">
                        <FaMapMarkerAlt className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                        <div>
                          <p className="text-[#3C4142] text-[13px] font-bold mb-0">Location</p>
                          <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.locality}, {property.city}</p>
                        </div>
                      </div>
                      <button
                        className="px-3 py-1 bg-[#367588] w-full text-white text-base rounded-md hover:bg-[#1386a8]"
                        onClick={() => handleDetailsClick(property.id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              </Slider>
            </div>

            {/* Property Categories */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <img
                src={property.img}
                alt={property.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{property.name}</h3>
                <p className="text-gray-600">{property.price}</p>
                <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  Contact Agent
                </button>
              </div>
            </div>
          ))}
        </div> */}
          </div>

          {/* Right Sidebar - Special Offers */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg sticky top-10 h-fit mt-20">
            <h2 className="text-xl font-bold mb-4">Special Offers</h2>
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
              <h3 className="text-lg font-semibold">Limited-Time Discount</h3>
              <p className="text-gray-600">
                Get up to 10% off on select properties.
              </p>
              <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Claim Offer
              </button>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Zero Brokerage</h3>
              <p className="text-gray-600">
                Exclusive properties with no agent fee.
              </p>
              <button className="mt-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
                View Deals
              </button>
            </div>
          </div>
        </div>
        {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4  container mx-auto">
          {amenities.map((amenity, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 bg-gray-800 text-white p-3 rounded-lg"
            >
              <span className="text-2xl text-red-500">{amenity.icon}</span>
              <span className="text-lg">{amenity.label}</span>
            </div>
          ))}
        </div> */}
      </div>
    </>
  );
};

export default PropertyListing;