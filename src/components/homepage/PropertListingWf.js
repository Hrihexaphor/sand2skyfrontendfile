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
import PropertyCard from "./PropertyCard";
// ------- slider -----------
import "swiper/css";
import "swiper/css/navigation";
import 'swiper/css/autoplay';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
// ------- slider end -----

const PropertyListing = () => {

  const navigate = useNavigate();

  const amenities = [
    { icon: <FaSwimmingPool />, label: "House" },
    { icon: <FaCar />, label: "PG" },
    { icon: <FaCar />, label: "Plots" },
    { icon: <FaDumbbell />, label: "Apartments" },
    // { icon: <FaUtensils />, label: "Restaurant" },
  ];

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
    // function formatPrice(price) {
    //   const num = parseInt(price, 10);
    //   if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    //   if (num >= 100000) return `${(num / 100000).toFixed(2)} Lac`;
    //   return num.toLocaleString(); // fallback
    // }

  //   const handleDetailsClick = (id) => {
  //   navigate(`/details/${id}`);
  // };

  // const handleDeveloper = (developer_name) => {
  //   if (developer_name) {
  //     navigate(
  //       `/builderProject?developer_name=${encodeURIComponent(developer_name)}`
  //     );
  //   } else {
  //     console.warn("Developer Name is undefined");
  //   }
  // };

  return (
    <>
      <div className="bg-[#F4EFE5]" id="project-section">
        <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 ">
          {/* Left Side - Property Listings */}
          <div className="lg:col-span-3 space-y-6 pt-5">
            {/* Featured Property Carousel */}
            <div>
              <div className="mb-5">
                <h2 className="mb-2 text-2xl text-[#3C4142] font-bold font-geometric-regular">Listing project</h2>
                <div className="w-12 h-1 bg-yellow-500"></div>
              </div>
              <Swiper
            spaceBetween={24}
            loop={true}
            autoplay={{ delay: 2000 }}
            modules={[Autoplay]}
            breakpoints={{
              320: { slidesPerView: 1 },
              425: { slidesPerView: 1 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 2 },
              1440: { slidesPerView: 3 },
            }}
          >
            {properties.map((property, index) => (
              <SwiperSlide>
                <PropertyCard
                  key={index}
                  property={property}
                  onViewDetails={(id) => navigate(`/details/${id}`)}
                  onImgClick={(id) => navigate(`/imgsec/${id}`)}
                />
              </SwiperSlide>

            ))}
          </Swiper>
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
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg sticky top-10 h-fit mt-5">
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