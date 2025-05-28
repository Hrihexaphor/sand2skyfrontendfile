import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { FaBuildingUser, FaArrowsLeftRightToLine } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import { FaRupeeSign, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";

const BudgetRange = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/getminimumproperty`, {
        withCredentials: true,
      })
      .then((res) => {
        setProperties(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);


  // Convert price to Lac or Cr format
  function formatPrice(price) {
    const num = parseInt(price, 10);
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)} Lac`;
    return num.toLocaleString(); // fallback
  }

  // Parse price as float number from string like "5000000"
  const parsePrice = (price) => parseFloat(price);

  const priceCategories = [
    { title: "Properties Below ₹1 Cr", range: [0, 10000000] },
    { title: "Properties Between ₹1 Cr – ₹2 Cr", range: [10000000, 20000000] },
    { title: "Properties Between ₹2 Cr – ₹3 Cr", range: [20000000, 30000000] },
    { title: "Properties Above ₹3 Cr", range: [30000000, Infinity] },
  ];


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
    <div className="container">
      <div className="text-center mx-auto mt-5">
        <h2 className="text-yellow-700 text-lg font-semibold uppercase tracking-wide mb-10">
          Budget Range
        </h2>
      </div>

      {priceCategories.map((category, index) => {
        const filtered = properties.filter((property) => {
          const price = parsePrice(property.expected_price);
          return price >= category.range[0] && price < category.range[1];
        });

        if (filtered.length === 0) return null;


        const settings = {
          dots: false,
          infinite: false,
          autoplay: true,
          speed: 500,
          slidesToShow: filtered.length === 1 ? 1 : 3,
          slidesToScroll: 1,
          centerMode: filtered.length === 1,
          centerPadding:
            filtered.length === 1
              ? window.innerWidth < 768
                ? '0px' // Full width on mobile
                : '30%' // Center on larger screens
              : '0px',
          responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                centerPadding:
                  filtered.length === 1
                    ? '20%' // Optional adjust
                    : '0px',
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1,
                centerMode: false,
                centerPadding: '0px',
              },
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                centerMode: false,
                centerPadding: '0px',
              },
            },
          ],
        };


        return (
          <div key={index} className="mb-0 pb-1">
            <h1 className="mt-2 font-bold text-[#3C4142] text-2xl font-geometric-regular text-center">
              {category.title}
            </h1>
            <p className="text-gray-500 mt-2 mb-8 max-w-xl mx-auto font-sans text-center">
              Browse premium apartments, villas, and independent homes that suit your dream lifestyle.
            </p>
            <Slider {...settings}>
              {filtered.map((property) => (
                <div key={property.id} className="p-2">
                  <div className="w-full bg-white rounded-lg cursor-pointer tranding-card">
                    <div className="h-[200px] w-full img-box relative">
                      <img
                        src={property.primary_image}
                        className="h-full w-full object-cover"
                        alt={property.project_name}
                      />
                      {property.is_featured && (
                        <p className="absolute top-1 left-[3%] bg-yellow-500 text-white py-1 px-2 rounded font-bold text-sm">
                          Featured
                        </p>
                      )}
                    </div>

                    <div className="p-3">
                      <h3 className="text-base text-[#3C4142] font-semibold mb-2">
                        {property.project_name}
                      </h3>

                      <div className="card-body flex flex-wrap justify-between items-center">
                        <div className="flex gap-2 items-center w-[50%] mb-2">
                          <FaRupeeSign className="text-[17px] bg-[#367588] text-white h-[26px] w-[26px] rounded-full p-1" />
                          <div>
                            <p className="text-[13px] text-[#3C4142] font-bold mb-0">
                              Price
                            </p>
                            <p className="text-[13px] text-gray-600 mt-0 mb-0">
                              {formatPrice(property.expected_price)}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 items-center w-[50%] mb-2">
                          <IoHome className="text-[17px] bg-[#367588] text-white h-[26px] w-[26px] rounded-full p-1" />
                          <div>
                            <p className="text-[13px] text-[#3C4142] font-bold mb-0">
                              Type
                            </p>
                            <p className="text-[13px] text-gray-600 mt-0 w-[90px] overflow-hidden text-ellipsis whitespace-nowrap mb-0">
                              {property.subcategory_name}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 items-center w-[100%] lg:w-[50%] mb-2">
                          <FaArrowsLeftRightToLine className="text-[17px] bg-[#367588] text-white h-[26px] w-[26px] rounded-full p-1" />
                          <div>
                            <p className="text-[13px] text-[#3C4142] font-bold mb-0">
                              SBA
                            </p>
                            <p className="text-[13px] text-gray-600 mt-0 mb-0">
                              {property.built_up_area} sq.ft.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 items-center w-[50%] mb-2">
                          <FaBuildingUser className="text-[17px] bg-[#367588] text-white h-[26px] w-[26px] rounded-full p-1" />
                          <div>
                            <p className="text-[13px] text-[#3C4142] font-bold mb-0">
                              Builder
                            </p>
                            <p
                              className="text-[13px] text-gray-600 mt-0 w-[90px] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer mb-0"
                              onClick={() =>
                                handleDeveloper(property.developer_name)
                              }
                            >
                              {property.developer_name}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 items-center mb-3">
                        <FaMapMarkerAlt className="text-[17px] bg-[#367588] text-white h-[26px] w-[26px] rounded-full p-1" />
                        <div>
                          <p className="text-[13px] text-[#3C4142] font-bold mb-0">
                            Location
                          </p>
                          <p className="text-[13px] text-gray-600 mt-0 mb-0">
                            {property.locality}, {property.city}
                          </p>
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
        );
      })}
    </div>
  );
};

export default BudgetRange;
