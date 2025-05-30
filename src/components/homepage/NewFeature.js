import * as framerMotion from "framer-motion";
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PropertyCard from "./PropertyCard";
// ------- slider -----------
import "swiper/css";
import "swiper/css/navigation";
import 'swiper/css/autoplay';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
// ------- slider end -----

const { motion } = framerMotion;

const NewFeature = () => {

  const navigate = useNavigate();

  // https://realestatesand2sky.onrender.com/api/getresaleproperty
  // --------------- API INTEGRATION --------->
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/getresaleproperty`, {
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
  }
  const handleDeveloper = (developer_name) => {
  if (developer_name) {
    navigate(`/builderProject?developer_name=${encodeURIComponent(developer_name)}`);
  } else {
    console.warn("Developer Name is undefined");
  }
};

  return (
    <div className="bg-[#F4EFE5]" id="resale-property-section">
      <div className="flex flex-col md:flex-col lg:flex-row items-center justify-center px-4 md:px-10 pt-[6rem] pb-[2rem] container mx-auto popular">
        {/* Left Side - Image with Overlay */}
        <motion.div
          className="relative w-full max-w-md md:max-w-2xl lg:w-1/2 hidden lg:block mx-auto"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            // src="http://hompark.themezinho.net/wp-content/uploads/2020/03/gallery-thumb03.jpg"
            src="https://res.cloudinary.com/djqpz99jb/image/upload/v1748413014/sale2_ncmz6x.jpg"
            alt="Family"
            className="rounded-lg shadow-lg h-auto relative small-img"
          />
          <img
            // src="http://hompark.themezinho.net/wp-content/uploads/2020/03/side-image02.jpg"
            src="https://res.cloudinary.com/djqpz99jb/image/upload/v1748412981/saleimg1_uzedc8.jpg"
            alt="Overlay"
            className="absolute left-36 bottom-16 h-[100%] rounded-lg opacity-80 small-img hidden md:block"
          />
          <div className="absolute -left-6 top-12 h-20 border-l-4 border-black hidden md:block"></div>
        </motion.div>

        {/* Right Side - Text Content & Slider */}
        <motion.div
          className="w-full max-w-md md:max-w-2xl lg:w-1/2 lg:pl-10 mx-auto"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-between flex-col md:flex-row lg:flex-row">
            <h2 className="text-xl font-semibold">
              <span className="text-[#367588]">Popular Resale</span> Properties
            </h2>
            <Link
              to="/resaleproperty"
              className="text-[#367588] font-bold flex items-center no-underline"
            >
              See all Resale Property <span className="ml-1">→</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold mt-2">
            Where Demand Meets Opportunity
          </h1>
          <p className="text-gray-600 mt-3">
            Resale Excellence: Proven Properties, Instant Possessions
          </p>

          {/* Property Slider */}
          <div className="mt-5">
            <Swiper
            spaceBetween={24}
            loop={true}
            autoplay={{ delay: 2000 }}
            modules={[Autoplay]}
            breakpoints={{
              320: { slidesPerView: 1 },
              425: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 1 },
              1440: { slidesPerView: 2 },
            }}
          >
             {properties.map((property, index) => (
              <SwiperSlide>
                <PropertyCard
                  key={index}
                  property={property}
                  onViewDetails={(id) => window.open(`/details/${id}`, '_blank')}
                  onImgClick={(id) => window.open(`/imgsec/${id}`, '_blank')}
                />
              </SwiperSlide>

            ))}
          </Swiper>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default NewFeature;