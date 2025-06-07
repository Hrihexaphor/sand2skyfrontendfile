import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {FaTimes} from "react-icons/fa";
import axios from "axios";
import PropertyCard from "./PropertyCard";
// ------- slider -----------
import "swiper/css";
import "swiper/css/navigation";
import 'swiper/css/autoplay';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
// ------- slider end -----

const BudgetRange = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [showModal, setShowModal] = useState(false);
    const [modalImages, setModalImages] = useState([]);
    const [pname, setPname] = useState("");

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
    { title: "Properties Between ₹2 Cr – ₹4 Cr", range: [20000000, 40000000] },
    { title: "Properties Above ₹4 Cr", range: [40000000, Infinity] },
  ];

  const handleRange = (title) => {
   navigate(
        `/budgetrangeproperties?title=${encodeURIComponent(title)}`
      );
  };

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
    <div className="container">
      <div className="text-center mx-auto mt-2 one">
        <h1 className="text-yellow-700 text-lg font-semibold uppercase tracking-wide mb-2">
          Budget Range.
        </h1>
      </div>

      {priceCategories.map((category, index) => {
        const filtered = properties.filter((property) => {
          const price = parsePrice(property.expected_price);
          return price >= category.range[0] && price < category.range[1];
        });

        if (filtered.length === 0) return null;

        return (
          <div key={index} className="mb-0 pb-1 mt-2">
            <h1 className="mt-2 font-bold text-[#3C4142] text-2xl font-geometric-regular text-center">
              {category.title}
            </h1>
            <p className="text-gray-500 mt-2 mb-8 max-w-xl mx-auto font-sans text-center">
              Browse premium apartments, villas, and independent homes that suit your dream lifestyle.
            </p>
            <p
               onClick={() => handleRange(category.title)}
              className="text-[#367588] cursor-pointer text-right block -mt-[30px] mb-[27px] font-bold items-center no-underline"
            >
              See all Properties <span className="ml-1">→</span>
            </p>

            <Swiper
              spaceBetween={24}
              loop={true}
              autoplay={{ delay: 2000 }}
              modules={[Autoplay]}
              breakpoints={{
                320: { slidesPerView: 1 },
                425: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1440: { slidesPerView: 4 },
              }}
              className="mb-5"
            >
              {filtered.map((property, index) => (
                <SwiperSlide>
                  <PropertyCard
                    key={index}
                    property={property}
                    onViewDetails={(id) => window.open(`/details/${id}`, '_blank')}
                 onImgClick={() => handleImageClick(property)}
                  />
                </SwiperSlide>

              ))}
            </Swiper>
          </div>
        );
      })}
        {/* ----------- Modal ----------- */}
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

export default BudgetRange;
