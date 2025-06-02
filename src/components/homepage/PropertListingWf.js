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
  FaMapMarkerAlt,
  FaTimes
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
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            setLoading(false);
          });
      }, []);
      // --------------- API INTEGRATION END ------->
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
                  onViewDetails={(id) => window.open(`/details/${id}`, '_blank')}
                  onImgClick={() => handleImageClick(property)}
                />
              </SwiperSlide>

            ))}
          </Swiper>
            </div>
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
       {/* ----------- Modal ----------- */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white w-full mx-5 max-w-4xl rounded shadow-lg p-6 relative">
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

export default PropertyListing;