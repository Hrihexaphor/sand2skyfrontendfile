import Slider from "react-slick";
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaRupeeSign, FaTimes } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
// ------- slider -----------
import "swiper/css";
import "swiper/css/navigation";
import 'swiper/css/autoplay';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
// ------- slider end -----

const BASE_URL = process.env.REACT_APP_BASE_URL
const FeatureProject = () => {
  
const [featureProperty, setFeatureProperty] = useState([]);
const [showModal, setShowModal] = useState(false);
const [modalImages, setModalImages] = useState([]);
const [pname, setPname] = useState("");
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
    .get(`${BASE_URL}/featured-properties-lite`, {
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

      setFeatureProperty(filteredProperties);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}, [city]); // Add city as dependency

  const handleDetailsClick = (id) => {
    window.open(`/details/${id}`, '_blank');
  };

 const handleImageClick = async (property) => {
    try {
      const res = await axios.get(`${BASE_URL}/${property.id}/images`, {
        withCredentials: true,
      });
      setModalImages(res.data.images);
      setPname(property.project_name || "Property Name");
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching image data:", error);
    }
  };

  const formatPrice = (price) => {
    const num = parseInt(price, 10);
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)} Lac`;
    return num.toLocaleString();
  };

  return (
    <div className="bg-[#F4EFE5]">
      <div className="container pt-44">
        <div className="flex items-center justify-between mb-4">
          <div className="mb-3">
            <h2 className="mb-2 text-[#3C4142] text-2xl font-bold font-geometric-regular">
              Featured Property
            </h2>
            <div className="w-12 h-1 bg-yellow-500"></div>
          </div>

          <Link
            to={"/featuredproperty"}
            className="text-[#367588] text-sm sm:text-base font-small font-bold flex items-center no-underline font-roboto-light"
          >
            See all Property <span className="ml-1">→</span>
          </Link>
        </div>
        <Swiper
            spaceBetween={24}
            loop={true}
            autoplay={{ delay: 2000 }}
            modules={[Autoplay]}
            breakpoints={{
              320: { slidesPerView: 1 },
              425: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 2 },
              1440: { slidesPerView: 2 },
            }}
          >
            {featureProperty.map((property, index) => (
              <SwiperSlide>
                <div key={index} className="p-2">
              <div className="card border rounded font-geometric-regular mb-3 cursor-pointer">
                <img
                  src={property.primary_image}
                  className="card-img-top"
                  alt={property.project_name}
                  style={{ height: "300px", objectFit: "cover" }}
                   onClick={() => handleImageClick(property)}
                />
                <div onClick={() => handleDetailsClick(property.id)}>
                   <div className="card-body font-roboto-light justify-between flex lg:items-center flex-col lg:flex-row px-4 pb-0">
                  <h5 className="card-title font-bold text-[#3C4142] md:text-md sm:text-md mb-2 lg:mb-0">
                    {property.project_name}
                  </h5>
                  <button
                    className="px-4 py-1 bg-[#367588] text-white text-base rounded-md hover:bg-[#1386a8]"
                  >
                    View Details
                  </button>
                </div>
                <div className="card-body flex flex-wrap justify-between items-center bg-[#F4EFE5] p-2 m-4">
                  <div className="flex gap-2 items-center w-[100%] lg:w-[50%] mb-2">
                    <FaRupeeSign className="text-[17px] bg-[#367588] text-white h-[26px] w-[26px] rounded-full p-[5px]" />
                    <div>
                      <p className="text-[#3C4142] text-[13px] font-bold mb-0">
                        Price
                      </p>
                      <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">
                        {formatPrice(property.price)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center w-[100%] lg:w-[50%] mb-2">
                    <IoHome className="text-[17px] bg-[#367588] text-white h-[26px] w-[26px] rounded-full p-[5px]" />
                    <div>
                      <p className="text-[#3C4142] text-[13px] font-bold mb-0">
                        Type
                      </p>
                      <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">
                        {property.subcategory_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center w-[100%] lg:w-[50%] mb-2">
                    <FaMapMarkerAlt className="text-[17px] bg-[#367588] text-white h-[26px] w-[26px] rounded-full p-[5px]" />
                    <div>
                      <p className="text-[#3C4142] text-[13px] font-bold mb-0">
                        Location
                      </p>
                      <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">
                        {property.locality}, {property.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center w-[100%] lg:w-[50%] mb-2">
                    <HiMiniBuildingOffice2 className="text-[17px] bg-[#367588] text-white h-[26px] w-[26px] rounded-full p-[5px]" />
                    <div>
                      <p className="text-[#3C4142] text-[13px] font-bold mb-0">
                        Builder
                      </p>
                      <p
                        className="text-gray-600 text-[13px] mb-0 mt-[0px] cursor-pointer"
                      >
                        {property.developer_name}
                      </p>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
              </SwiperSlide>

            ))}
          </Swiper>
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
  );
};

export default FeatureProject;
