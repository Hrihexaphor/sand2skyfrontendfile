import React, { useState, useEffect, useRef } from "react";
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
   const scrollRefs = useRef([]);

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


   const scroll = (index, direction) => {
    const container = scrollRefs.current[index];
    if (!container) return;
    const scrollAmount = container.offsetWidth / 4;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

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

      {priceCategories.map((category, idx) => {
        const filtered = properties.filter((p) => {
          const price = parsePrice(p.expected_price);
          return price >= category.range[0] && price < category.range[1];
        });

        if (filtered.length === 0) return null;

        return (
          <div key={idx} className="mb-16">
            <h3 className="text-2xl font-bold text-center text-[#3C4142]">
              {category.title}
            </h3>
            <p className="text-center text-gray-500 mb-6">
              Browse premium apartments, villas, and independent homes that suit your dream lifestyle.
            </p>

            <div className="relative">
              <button
                onClick={() => scroll(idx, "left")}
                className="absolute z-10 left-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full hidden sm:block"
              >
                ◀
              </button>

              <div
                ref={(el) => (scrollRefs.current[idx] = el)}
                className="flex overflow-x-auto no-scrollbar space-x-4 scroll-smooth"
              >
                {filtered.map((property) => (
                  <div
                    key={property.id}
                    className="flex-none w-[250px] sm:w-[300px] bg-white rounded-lg shadow-md"
                  >
                    <div className="h-[180px] w-full overflow-hidden rounded-t-lg">
                      <img
                        src={property.primary_image}
                        alt={property.project_name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-3 space-y-2">
                      <h3 className="text-lg font-semibold text-[#3C4142]">
                        {property.project_name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-700">
                        <FaRupeeSign className="mr-2" />
                        {formatPrice(property.expected_price)}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <IoHome className="mr-2" />
                        {property.subcategory_name}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <FaArrowsLeftRightToLine className="mr-2" />
                        {property.built_up_area} sq.ft.
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <FaBuildingUser className="mr-2" />
                        <span
                          onClick={() => handleDeveloper(property.developer_name)}
                          className="cursor-pointer hover:underline"
                        >
                          {property.developer_name}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <FaMapMarkerAlt className="mr-2" />
                        {property.locality}, {property.city}
                      </div>
                      <button
                        className="mt-2 w-full bg-[#367588] text-white py-1 px-3 rounded hover:bg-[#1386a8]"
                        onClick={() => handleDetailsClick(property.id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => scroll(idx, "right")}
                className="absolute z-10 right-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full hidden sm:block"
              >
                ▶
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BudgetRange;
